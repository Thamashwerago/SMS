import React, { useState, useEffect, useCallback, useMemo, ChangeEvent } from "react";
import Sidebar from "../../components/common/Sidebar";
import Navbar from "../../components/common/Navbar";
import Card from "../../components/common/Card";
import Chart from "../../components/common/Chart";
import CommonTable, { Column } from "../../components/common/Table";
import CommonButton from "../../components/common/Button";
import courseService from "../../services/courseService";
import attendanceService from "../../services/attendanceService";
import timetableService from "../../services/timetableService";
import { TEACHER_DASHBOARD_STRINGS as STR } from "../../constants/teacher/dashboardConsts";
import { X } from "react-feather"; // Import X icon from react-feather

interface TimetableRow { id: number; courseName: string; time: string; room: string; }
interface AttendanceTotal { id: number; courseName: string; attended: number; total: number; }
interface CourseAssignment { userId: number; courseId: number; id: number; }

const TeacherDashboard: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [coursesTaught, setCoursesTaught] = useState(0);
  const [totalStudents, setTotalStudents] = useState(0);
  const [todayClasses, setTodayClasses] = useState<TimetableRow[]>([]);
  const [attendanceTotals, setAttendanceTotals] = useState<AttendanceTotal[]>([]);

  const [trendLabels, setTrendLabels] = useState<string[]>([]);
  const [trendData, setTrendData] = useState<number[]>([]);

  const [filterTimetable, setFilterTimetable] = useState<string>("");
  const [filterAttendance, setFilterAttendance] = useState<string>("");
  const [collapseTimetable, setCollapseTimetable] = useState(false);
  const [collapseTotals, setCollapseTotals] = useState(false);

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const tidStr = sessionStorage.getItem("userId");
      if (!tidStr) throw new Error(STR.ERROR_NO_TEACHER_ID);
      const tid = Number(tidStr);

      // assignments
      const assignsAll: CourseAssignment[] = await courseService.getAllCourseAssigns();
      const assigns: CourseAssignment[] = assignsAll.filter(a => a.userId === tid);
      setCoursesTaught(assigns.length);
      const courseIds = assigns.map(a => a.courseId);

      // attendance
      const allAttendance = await attendanceService.getAll();
      const recs = allAttendance.filter(r => courseIds.includes(r.courseId));
      setTotalStudents(new Set(recs.map(r => r.userId)).size);

      const weekMap = new Map<number, { present:number; total:number }>();
      recs.forEach(r => {
        const d = new Date(r.date);
        const w = Math.ceil((((d.getTime() - new Date(d.getFullYear(),0,1).getTime())/86400000)+1)/7);
        const agg = weekMap.get(w) || { present:0, total:0 };
        agg.total++;
        if (r.status.toLowerCase()==="present") agg.present++;
        weekMap.set(w, agg);
      });
      const weeks = Array.from(weekMap.keys()).sort((a,b)=>a-b).slice(-4);
      setTrendLabels(weeks.map(w=>`W${w}`));
      setTrendData(weeks.map(w=>{
        const { present,total } = weekMap.get(w)!;
        return total?Math.round((present/total)*100):0;
      }));

      const totals = courseIds.map(cid=>{
        const recsFor = recs.filter(r=>r.courseId===cid);
        const presentCount = recsFor.filter(r=>r.status.toLowerCase()==="present").length;
        return { id: cid, courseName: `Course ${cid}`, attended: presentCount, total: recsFor.length };
      });
      setAttendanceTotals(totals);

      // timetable
      const allSched = await timetableService.getAll();
      const today = new Date().toISOString().slice(0,10);
      const todays = allSched.filter(e=>e.teacherId===tid && e.date===today);
      const enriched = await Promise.all(todays.map(async e=>{
        let name = `Course ${e.courseId}`;
        try { name = (await courseService.getById(e.courseId)).name; } catch (error) {
          console.error(`Failed to get course name for ID ${e.courseId}:`, error);
        };
        return { id: e.id, courseName: name, time: `${e.startTime} - ${e.endTime}`, room: e.classroom };
      }));
      setTodayClasses(enriched);
    } catch (e: unknown) {
      console.error(e);
      setError(e instanceof Error ? e.message : String(e) || STR.ERROR_FETCH_ATTENDANCE);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(()=>{ fetchData(); },[fetchData]);

  // filtered views
  const displayedTimetable = useMemo(()=>
    todayClasses.filter(r=>
      `${r.courseName} ${r.time} ${r.room}`.toLowerCase().includes(filterTimetable.toLowerCase())
    ), [todayClasses, filterTimetable]);

  const displayedTotals = useMemo(()=>
    attendanceTotals.filter(r=>
      r.courseName.toLowerCase().includes(filterAttendance.toLowerCase())
    ), [attendanceTotals, filterAttendance]);

  const lineData = useMemo(()=>({ labels:trendLabels, datasets:[{ label:STR.CHART_LABEL, data:trendData }] }),[trendLabels,trendData]);
  const lineOpts = useMemo(()=>({ responsive:true, plugins:{ legend:{ labels:{ color:"white" } }, title:{ display:true,text:STR.CHART_TITLE,color:"white" } }, scales:{ x:{ ticks:{ color:"white" } }, y:{ ticks:{ color:"white" } } } }),[]);

  const ttCols: Column<TimetableRow>[] = useMemo(()=>[
    { header:STR.SECTION_TIMETABLE, accessor:"courseName" },
    { header:"Time", accessor:"time" },
    { header:"Room", accessor:"room" },
  ],[]);

  const atCols: Column<AttendanceTotal>[] = useMemo(()=>[
    { header:STR.COL_COURSE, accessor:"courseName" },
    { header:STR.COL_ATTENDED, accessor:r=>r.attended },
    { header:STR.COL_TOTAL, accessor:r=>r.total },
    { header:STR.COL_PERCENTAGE, accessor:r=>r.total?`${((r.attended/r.total)*100).toFixed(1)}%`:'0%' },
  ],[]);

  return (
    <div className="min-h-screen flex bg-gray-900 text-white">
      <Sidebar />
      <div className="ml-64 flex-1 flex flex-col">
        <Navbar />
        <main className="p-6 overflow-auto">

          {/* Header */}
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-3xl font-bold">{STR.PAGE_TITLE}</h1>
            <CommonButton size="md" variant="primary" label={STR.BTN_REFRESH} onClick={fetchData} isLoading={loading} />
          </div>

          {error && <div className="mb-4 p-4 bg-red-600 rounded">{error}</div>}

          {/* Metrics */}
          <section className="flex space-x-4 overflow-x-auto mb-8">
            {[
              { title:STR.CARD_COURSES, value:coursesTaught, icon:'📚' },
              { title:STR.CARD_STUDENTS, value:totalStudents, icon:'👨‍🎓' },
              { title:STR.CARD_UPCOMING, value:todayClasses.length, icon:'🗓️' },
              { title:STR.CARD_AVG_ATTENDANCE, value:trendData.slice(-1)[0]||0, icon:'✅', suffix:'%' }
            ].map((c)=>(
              <Card key={c.title} title={c.title} value={c.value + (c.suffix??'')} icon={c.icon} className="flex-shrink-0 w-48" />
            ))}
          </section>

          {/* Trend Chart */}
          <section className="mb-8 bg-gray-800 p-4 rounded-lg">
            <Chart type="line" data={lineData} options={lineOpts} loading={loading} />
          </section>

          {/* Timetable Section */}
          <section className="mb-8">
            <div className="flex justify-between items-center mb-2">
              <h2 className="text-2xl font-semibold">{STR.SECTION_TIMETABLE}</h2>
              <div className="flex items-center">
                <input placeholder="Filter..." value={filterTimetable} onChange={(e:ChangeEvent<HTMLInputElement>)=>setFilterTimetable(e.target.value)} className="px-3 py-1 bg-gray-800 border border-indigo-500 rounded-l focus:outline-none" />
                <CommonButton variant="secondary" size="sm" icon={<X />} onClick={()=>setFilterTimetable('')} label="Clear" />
                <CommonButton variant="secondary" size="sm" icon={<X />} onClick={()=>setCollapseTimetable(!collapseTimetable)} label={collapseTimetable ? "Expand" : "Collapse"} />
              </div>
            </div>
            {!collapseTimetable && (
              <CommonTable columns={ttCols} data={displayedTimetable} loading={loading} noDataMessage={STR.NO_TIMETABLE} />
            )}
          </section>

          {/* Attendance Totals Section */}
          <section>
            <div className="flex justify-between items-center mb-2">
              <h2 className="text-2xl font-semibold">{STR.SECTION_ATTENDANCE_TOTALS}</h2>
              <div className="flex items-center">
                <input placeholder="Filter..." value={filterAttendance} onChange={(e:ChangeEvent<HTMLInputElement>)=>setFilterAttendance(e.target.value)} className="px-3 py-1 bg-gray-800 border border-indigo-500 rounded-l focus:outline-none" />
                <CommonButton variant="secondary" size="sm" icon={<X />} onClick={()=>setFilterAttendance('')} label="Clear" />
                <CommonButton variant="secondary" size="sm" icon={<X />} onClick={()=>setCollapseTotals(!collapseTotals)} label={collapseTotals ? "Expand" : "Collapse"} />
              </div>
            </div>
            {!collapseTotals && (
              <CommonTable columns={atCols} data={displayedTotals} loading={loading} noDataMessage="No attendance data available" />
            )}
          </section>

        </main>
      </div>
    </div>
  );
};

export default React.memo(TeacherDashboard);
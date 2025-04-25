// src/pages/Student/StudentDashboard.tsx
import React, { useState, useEffect, useCallback, useMemo } from "react";
import Sidebar from "../../components/common/Sidebar";
import Navbar from "../../components/common/Navbar";
import Card from "../../components/common/Card";
import Chart from "../../components/common/Chart";
import CommonTable, { Column } from "../../components/common/Table";
import CommonButton from "../../components/common/Button";

import courseService from "../../services/courseService";
import attendanceService from "../../services/attendanceService";
import timetableService from "../../services/timetableService";
import teacherService from "../../services/teacherService";

import { STUDENT_DASHBOARD_STRINGS as STR } from "../../constants/student/dashboardConsts";

interface TimetableRow {
  id: number;
  courseName: string;
  time: string;
  teacherName: string;
}

interface AttendanceTotal {
  id: number;
  courseName: string;
  attended: number;
  total: number;
}

const StudentDashboard: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [enrolledCount, setEnrolledCount] = useState(0);
  const [avgAttendance, setAvgAttendance] = useState(0);
  const [todayClasses, setTodayClasses] = useState<TimetableRow[]>([]);
  const [attendanceTotals, setAttendanceTotals] = useState<AttendanceTotal[]>([]);

  const [trendLabels, setTrendLabels] = useState<string[]>([]);
  const [trendData, setTrendData] = useState<number[]>([]);

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);

    const sid = Number(sessionStorage.getItem("userId") ?? 0);
    if (!sid) {
      setError(STR.ERROR_NO_USER_ID);
      setLoading(false);
      return;
    }

    // Enrolled courses
    let assigns = await courseService.getAllCourseAssigns().catch((e) => {
      console.error(e);
      setError(STR.ERROR_FETCH_ASSIGNMENTS);
      return [];
    });
    assigns = assigns.filter((a) => a.userId === sid);
    setEnrolledCount(assigns.length);
    const courseIds = assigns.map((a) => a.courseId);

    // Attendance records
    const records = await attendanceService.getAttendanceByStudent(sid).catch((e) => {
      console.error(e);
      setError(STR.ERROR_FETCH_ATTENDANCE);
      return [];
    });
    const presents = records.filter((r) => r.status.toLowerCase() === "present").length;
    setAvgAttendance(records.length > 0 ? Math.round((presents / records.length) * 100) : 0);

    // Trend (last 4 weeks)
    const getWeek = (d: Date) => {
      const dt = new Date(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()));
      const day = dt.getUTCDay() || 7;
      dt.setUTCDate(dt.getUTCDate() + 4 - day);
      const yearStart = new Date(Date.UTC(dt.getUTCFullYear(), 0, 1));
      return Math.ceil(((dt.valueOf() - yearStart.valueOf()) / 86400000 + 1) / 7);
    };
    const weekMap = new Map<number, { present: number; total: number }>();
    records.forEach((r) => {
      const wk = getWeek(new Date(r.date));
      const agg = weekMap.get(wk) || { present: 0, total: 0 };
      agg.total++;
      if (r.status.toLowerCase() === "present") agg.present++;
      weekMap.set(wk, agg);
    });
    const weeks = Array.from(weekMap.keys()).sort((a, b) => a - b).slice(-4);
    setTrendLabels(weeks.map((w) => `W${w}`));
    setTrendData(weeks.map((w) => {
      const agg = weekMap.get(w)!;
      return agg.total > 0 ? Math.round((agg.present / agg.total) * 100) : 0;
    }));

    // Attendance totals per course
    const totals: AttendanceTotal[] = [];
    for (const cid of courseIds) {
      const recs = records.filter((r) => r.courseId === cid);
      const presentCount = recs.filter((r) => r.status.toLowerCase() === "present").length;
      let cname = `Course ${cid}`;
      await courseService.getById(cid)
        .then((c) => (cname = c.name))
        .catch(() => {});
      totals.push({ id: cid, courseName: cname, attended: presentCount, total: recs.length });
    }
    setAttendanceTotals(totals);

    // Today's timetable
    const today = new Date().toISOString().slice(0, 10);
    const timetable = await timetableService.getAll().catch((e) => {
      console.error(e);
      setError(STR.ERROR_FETCH_TIMETABLE);
      return [];
    });
    const todays = timetable.filter((e) => e.date === today && courseIds.includes(e.courseId));
    const enriched = await Promise.all(
      todays.map(async (e) => {
        let cname = `Course ${e.courseId}`, tname = `Teacher ${e.teacherId}`;
        await courseService.getById(e.courseId).then((c) => (cname = c.name)).catch(() => {});
        await teacherService.getById(e.teacherId).then((t) => (tname = t.name)).catch(() => {});
        return { id: e.id, courseName: cname, time: `${e.startTime} - ${e.endTime}`, teacherName: tname };
      })
    );
    setTodayClasses(enriched);

    setLoading(false);
  }, []);

  useEffect(() => { fetchData(); }, [fetchData]);

  // Chart config
  const lineData = useMemo(() => ({
    labels: trendLabels,
    datasets: [{ label: STR.CHART_LABEL, data: trendData }],
  }), [trendLabels, trendData]);

  const lineOptions = useMemo(() => ({
    responsive: true,
    plugins: {
      legend: { labels: { color: "white" } },
      title: { display: true, text: STR.CHART_TITLE, color: "white" },
    },
    scales: { x: { ticks: { color: "white" } }, y: { ticks: { color: "white" } } },
  }), []);

  // Table columns
  const ttCols: Column<TimetableRow>[] = useMemo(() => [
    { header: STR.COL_COURSE, accessor: "courseName" },
    { header: "Time", accessor: "time" },
    { header: "Teacher Name", accessor: "teacherName" },
  ], []);

  const atCols: Column<AttendanceTotal>[] = useMemo(() => [
    { header: STR.COL_COURSE, accessor: "courseName" },
    {
      header: STR.COL_ATTENDANCE,
      accessor: (r) =>
        `${r.attended}/${r.total} (${r.total > 0 ? ((r.attended / r.total) * 100).toFixed(1) : 0}%)`,
    },
  ], []);

  return (
    <div className="min-h-screen flex bg-gray-900 text-white">
      <Sidebar />
      <div className="ml-64 flex-1 flex flex-col">
        <Navbar />

        <main className="p-6 space-y-8 overflow-x-auto">
          {/* Header */}
          <div className="flex items-center justify-between">
            <h1 className="text-3xl font-bold">{STR.PAGE_TITLE}</h1>
            <CommonButton
              size="md"
              variant="primary"
              label={STR.BTN_REFRESH}
              onClick={fetchData}
              isLoading={loading}
            />
          </div>

          {/* Error */}
          {error && (
            <div className="p-4 bg-red-600 rounded text-white">{error}</div>
          )}

          {/* Metrics */}
          <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card title={STR.CARD_ENROLLED} value={enrolledCount} icon="📚" loading={loading} />
            <Card title={STR.CARD_AVG_ATTENDANCE} value={`${avgAttendance}%`} icon="✅" loading={loading} />
            <Card title={STR.CARD_UPCOMING} value={todayClasses.length} icon="🗓️" loading={loading} />
            <Card title={STR.CARD_PENDING} value={0} icon="✏️" loading={loading} />
          </section>

          {/* Attendance Trend */}
          <section className="bg-gray-800 bg-opacity-50 border border-indigo-500 rounded-xl shadow-xl p-6">
            <Chart type="line" data={lineData} options={lineOptions} />
          </section>

          {/* Today's Timetable */}
          <section>
            <h2 className="text-2xl font-semibold mb-4">{STR.SECTION_TIMETABLE}</h2>
            <CommonTable
              columns={ttCols}
              data={todayClasses}
              loading={loading}
              noDataMessage={STR.NO_TIMETABLE}
            />
          </section>

          {/* Attendance Totals */}
          <section>
            <h2 className="text-2xl font-semibold mb-4">{STR.SECTION_ATTENDANCE_TOTALS}</h2>
            <CommonTable
              columns={atCols}
              data={attendanceTotals}
              loading={loading}
              noDataMessage={STR.NO_ATTENDANCE}
            />
          </section>
        </main>
      </div>
    </div>
  );
};

export default React.memo(StudentDashboard);

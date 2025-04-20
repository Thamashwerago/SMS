// src/pages/Student/StudentDashboard.tsx
import React, { useState, useEffect, useCallback, useMemo } from "react";

// Common UI components
import Sidebar from "../../components/common/Sidebar";
import Navbar from "../../components/common/Navbar";
import Card from "../../components/common/Card";
import Chart from "../../components/common/Chart";
import CommonTable, { Column } from "../../components/common/Table";
import Button from "../../components/common/Button";

// Services
import courseService from "../../services/courseService";
import attendanceService from "../../services/attendanceService";
import timetableService from "../../services/timetableService";
import teacherService from "../../services/teacherService";

// Strings
import { STUDENT_DASHBOARD_STRINGS } from "../../constants/student/dashboardConsts";

/**
 * TimetableRow
 * ------------
 * Enriched timetable entry for display.
 */
interface TimetableRow {
  id: number;
  courseName: string;
  time: string;
  teacherName: string;
}

/**
 * AttendanceTotal
 * ---------------
 * Aggregated attendance stats per course.
 */
interface AttendanceTotal {
  id: number;
  courseName: string;
  attended: number;
  total: number;
}

const StudentDashboard: React.FC = () => {
  // Loading & errors
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Core metrics
  const [enrolledCount, setEnrolledCount] = useState(0);
  const [avgAttendance, setAvgAttendance] = useState(0);
  const [todayClasses, setTodayClasses] = useState<TimetableRow[]>([]);
  const [attendanceTotals, setAttendanceTotals] = useState<AttendanceTotal[]>(
    []
  );

  // Trend data
  const [trendLabels, setTrendLabels] = useState<string[]>([]);
  const [trendData, setTrendData] = useState<number[]>([]);

  /**
   * CourseAssignment
   * ---------------
   * Represents a course assignment for a student.
   */
  interface CourseAssignment {
    userId: number;
    courseId: number;
  }

  /**
   * fetchData
   * ---------
   * 1. Retrieve studentId
   * 2. Fetch course assignments
   * 3. Fetch attendance records and compute metrics
   * 4. Fetch timetable entries and enrich
   */
  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);

    let assignments: CourseAssignment[] = [];
    const studentId = sessionStorage.getItem("userId");
    if (!studentId) {
      setError(STUDENT_DASHBOARD_STRINGS.ERROR_NO_USER_ID);
      setLoading(false);
      return;
    }
    const sid = Number(studentId);

    // 2. assignments -> enrolledCount
    try {
      assignments = await courseService.getAllCourseAssigns();
      assignments = assignments.filter((a) => a.userId === sid);
      setEnrolledCount(assignments.length);
    } catch (e) {
      console.error(e);
      setError(STUDENT_DASHBOARD_STRINGS.ERROR_FETCH_ASSIGNMENTS);
    }
    const courseIds = assignments.map((a) => a.courseId);

    // 3. attendance
    let records;
    try {
      records = await attendanceService.getAttendanceByStudent(sid);
      // overall avg
      const present = records.filter(
        (r) => r.status.toLowerCase() === "present"
      ).length;
      const total = records.length;
      setAvgAttendance(total > 0 ? Math.round((present / total) * 100) : 0);

      // trend: last 4 weeks
      const getWeek = (d: Date) => {
        const dt = new Date(
          Date.UTC(d.getFullYear(), d.getMonth(), d.getDate())
        );
        const dayNum = dt.getUTCDay() || 7;
        dt.setUTCDate(dt.getUTCDate() + 4 - dayNum);
        const yearStart = new Date(Date.UTC(dt.getUTCFullYear(), 0, 1));
        return Math.ceil(
          ((dt.valueOf() - yearStart.valueOf()) / 86400000 + 1) / 7
        );
      };
      const weekMap = new Map<number, { present: number; total: number }>();
      records.forEach((r) => {
        const wk = getWeek(new Date(r.date));
        const agg = weekMap.get(wk) || { present: 0, total: 0 };
        agg.total++;
        if (r.status.toLowerCase() === "present") agg.present++;
        weekMap.set(wk, agg);
      });
      const weeks = Array.from(weekMap.keys())
        .sort((a, b) => a - b)
        .slice(-4);
      setTrendLabels(weeks.map((w) => `W${w}`));
      setTrendData(
        weeks.map((w) => {
          const agg = weekMap.get(w)!;
          return agg.total > 0
            ? Math.round((agg.present / agg.total) * 100)
            : 0;
        })
      );
      // attendanceTotals
      const totals: AttendanceTotal[] = [];
      for (const cid of courseIds) {
        const recs = records.filter((r) => r.courseId === cid);
        const presentCount = recs.filter(
          (r) => r.status.toLowerCase() === "present"
        ).length;
        let cname = `Course ${cid}`;
        try {
          const c = await courseService.getById(cid);
          cname = c.name;
        } catch {
          /* Continue with default course name */
        }
        totals.push({
          id: cid,
          courseName: cname,
          attended: presentCount,
          total: recs.length,
        });
      }
      setAttendanceTotals(totals);
      setAttendanceTotals(totals);
    } catch (e) {
      console.error(e);
      setError(STUDENT_DASHBOARD_STRINGS.ERROR_FETCH_ATTENDANCE);
    }

    // 4. timetable today
    try {
      const timetable = await timetableService.getAll();
      const today = new Date().toISOString().slice(0, 10);
      const todays = timetable.filter(
        (e) => e.date === today && courseIds.includes(e.courseId)
      );
      const enriched = await Promise.all(
        todays.map(async (e) => {
          let cname = `Course ${e.courseId}`,
            tname = `Teacher ${e.teacherId}`;
          try {
            const c = await courseService.getById(e.courseId);
            cname = c.name;
          } catch {
            /* Continue with default course name */
          }
          try {
            const t = await teacherService.getById(e.teacherId);
            tname = t.name;
          } catch {
            /* Continue with default teacher name */
          }
          return {
            id: e.id,
            courseName: cname,
            time: `${e.startTime}-${e.endTime}`,
            teacherName: tname,
          };
        })
      );
      setTodayClasses(enriched);
    } catch (e) {
      console.error(e);
      setError(STUDENT_DASHBOARD_STRINGS.ERROR_FETCH_TIMETABLE);
    }

    setLoading(false);
  }, []);

  // initial load
  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // chart config
  const lineData = useMemo(
    () => ({
      labels: trendLabels,
      datasets: [
        { label: STUDENT_DASHBOARD_STRINGS.CHART_LABEL, data: trendData },
      ],
    }),
    [trendLabels, trendData]
  );
  const lineOpts = useMemo(
    () => ({
      responsive: true,
      plugins: {
        legend: { labels: { color: "white" } },
        title: {
          display: true,
          text: STUDENT_DASHBOARD_STRINGS.CHART_TITLE,
          color: "white",
        },
      },
      scales: {
        x: { ticks: { color: "white" } },
        y: { ticks: { color: "white" } },
      },
    }),
    []
  );

  // timetable table columns
  const ttCols: Column<TimetableRow>[] = useMemo(
    () => [
      { header: STUDENT_DASHBOARD_STRINGS.COL_COURSE, accessor: "courseName" },
      { header: "Time", accessor: "time" },
      { header: "Teacher", accessor: "teacherName" },
    ],
    []
  );

  // attendance totals columns
  const atCols: Column<AttendanceTotal>[] = useMemo(
    () => [
      { header: STUDENT_DASHBOARD_STRINGS.COL_COURSE, accessor: "courseName" },
      {
        header: STUDENT_DASHBOARD_STRINGS.COL_ATTENDANCE,
        accessor: (r) =>
          `${r.attended}/${r.total} (${r.total > 0 ? ((r.attended / r.total) * 100).toFixed(1) : 0}%)`,
      },
    ],
    []
  );

  return (
    <div className="min-h-screen flex font-roboto bg-gradient-to-br from-gray-900 to-black">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <Navbar />
        <main className="p-8">
          {/* Refresh Button & Title */}
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500">
              {STUDENT_DASHBOARD_STRINGS.PAGE_TITLE}
            </h1>
            <Button
              label={STUDENT_DASHBOARD_STRINGS.BTN_REFRESH}
              onClick={fetchData}
              isLoading={loading}
              variant="primary"
            />
          </div>

          {/* Error Message */}
          {error && <p className="text-red-500 mb-4">{error}</p>}

          {/* Metrics Cards */}
          <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <Card
              title={STUDENT_DASHBOARD_STRINGS.CARD_ENROLLED}
              value={enrolledCount}
              icon="📚"
            />
            <Card
              title={STUDENT_DASHBOARD_STRINGS.CARD_AVG_ATTENDANCE}
              value={`${avgAttendance}%`}
              icon="✅"
            />
            <Card
              title={STUDENT_DASHBOARD_STRINGS.CARD_UPCOMING}
              value={todayClasses.length}
              icon="🗓️"
            />
            <Card
              title={STUDENT_DASHBOARD_STRINGS.CARD_PENDING}
              value={0}
              icon="✏️"
            />
          </section>

          {/* Attendance Trend Chart */}
          <section className="mb-8">
            <div className="bg-black bg-opacity-50 border border-indigo-500 p-6 rounded-xl shadow-xl">
              <Chart type="line" data={lineData} options={lineOpts} />
            </div>
          </section>

          {/* Today's Timetable */}
          <section className="mb-8">
            <h2 className="text-3xl font-bold text-white mb-4">
              {STUDENT_DASHBOARD_STRINGS.SECTION_TIMETABLE}
            </h2>
            {todayClasses.length > 0 ? (
              <CommonTable columns={ttCols} data={todayClasses} />
            ) : (
              <p className="text-white">
                {STUDENT_DASHBOARD_STRINGS.NO_TIMETABLE}
              </p>
            )}
          </section>

          {/* Course Attendance Totals */}
          <section>
            <h2 className="text-3xl font-bold text-white mb-4">
              {STUDENT_DASHBOARD_STRINGS.SECTION_ATTENDANCE_TOTALS}
            </h2>
            {attendanceTotals.length > 0 ? (
              <CommonTable columns={atCols} data={attendanceTotals} />
            ) : (
              <p className="text-white">
                {STUDENT_DASHBOARD_STRINGS.NO_ATTENDANCE}
              </p>
            )}
          </section>
        </main>
      </div>
    </div>
  );
};

export default StudentDashboard;

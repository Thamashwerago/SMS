// -----------------------------
// src/pages/Teacher/TeacherDashboard.tsx
// -----------------------------
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

// Strings
import { TEACHER_DASHBOARD_STRINGS as STR } from "../../constants/teacher/dashboardConsts";

/**
 * TimetableRow
 * ------------
 * Represents an enriched timetable entry for display.
 */
interface TimetableRow {
  id: number;
  courseName: string;
  time: string;
  room: string;
}

/**
 * AttendanceTotal
 * ---------------
 * Represents aggregated attendance per course.
 */
interface AttendanceTotal {
  id: number;
  courseName: string;
  attended: number;
  total: number;
}

/**
 * CourseAssignment
 * ---------------
 * Represents a course assigned to a teacher.
 */
interface CourseAssignment {
  userId: number;
  courseId: number;
  id: number;
}

const TeacherDashboard: React.FC = () => {
  // Loading and error states
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Metrics
  const [coursesTaught, setCoursesTaught] = useState(0);
  const [totalStudents, setTotalStudents] = useState(0);
  const [todayClasses, setTodayClasses] = useState<TimetableRow[]>([]);
  const [attendanceTotals, setAttendanceTotals] = useState<AttendanceTotal[]>(
    []
  );

  // Trend data
  const [trendLabels, setTrendLabels] = useState<string[]>([]);
  const [trendData, setTrendData] = useState<number[]>([]);

  /**
   * fetchData
   * ---------
   * Fetches assignments, attendance, and timetable entries for the logged-in teacher.
   * Each API fetch has separate exception handling.
   */
  const fetchData = useCallback(async () => {
    setLoading(true);
    // 1. Get teacher ID
    const teacherId = sessionStorage.getItem("userId");
    if (!teacherId) {
      setError(STR.ERROR_NO_TEACHER_ID);
      setLoading(false);
      return;
    }
    const tid = Number(teacherId);

    // 2. Fetch course assignments
    let assigns: CourseAssignment[] = [];
    try {
      assigns = await courseService.getAllCourseAssigns();
      assigns = assigns.filter((a) => a.userId === tid);
      setCoursesTaught(assigns.length);
    } catch (e) {
      console.error(e);
      setError(STR.ERROR_FETCH_ASSIGNMENTS);
    }
    const courseIds = assigns.map((a: CourseAssignment) => a.courseId);

    // 3. Fetch attendance records
    try {
      const records = await attendanceService.getAll();
      const teacherRecords = records.filter((r) =>
        courseIds.includes(r.courseId)
      );
      // Compute unique students
      const studentSet = new Set(teacherRecords.map((r) => r.userId));
      setTotalStudents(studentSet.size);

      // Weekly trend
      const getWeekNumber = (d: Date) => {
        const date = new Date(
          Date.UTC(d.getFullYear(), d.getMonth(), d.getDate())
        );
        const dayNum = date.getUTCDay() || 7;
        date.setUTCDate(date.getUTCDate() + 4 - dayNum);
        const yearStart = new Date(Date.UTC(date.getUTCFullYear(), 0, 1));
        return Math.ceil(
          ((date.getTime() - yearStart.getTime()) / 86400000 + 1) / 7
        );
      };
      const weekMap = new Map<number, { present: number; total: number }>();
      teacherRecords.forEach((r) => {
        const week = getWeekNumber(new Date(r.date));
        const agg = weekMap.get(week) || { present: 0, total: 0 };
        agg.total++;
        if (r.status.toLowerCase() === "present") agg.present++;
        weekMap.set(week, agg);
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

      // Attendance totals by course
      const totals: AttendanceTotal[] = [];
      for (const cid of courseIds) {
        const recs = teacherRecords.filter((r) => r.courseId === cid);
        const presentCount = recs.filter(
          (r) => r.status.toLowerCase() === "present"
        ).length;
        const courseName = `Course ${cid}`;
        totals.push({
          id: cid,
          courseName,
          attended: presentCount,
          total: recs.length,
        });
      }
      setAttendanceTotals(totals);
    } catch (e) {
      console.error(e);
      setError(STR.ERROR_FETCH_ATTENDANCE);
    }

    // 4. Fetch today's timetable
    try {
      const allSchedule = await timetableService.getAll();
      const today = new Date().toISOString().slice(0, 10);
      const todays = allSchedule.filter(
        (e) => e.teacherId === tid && e.date === today
      );
      const enriched: TimetableRow[] = await Promise.all(
        todays.map(async (e) => {
          let courseName = `Course ${e.courseId}`;
          try {
            const c = await courseService.getById(e.courseId);
            courseName = c.name;
          } catch (error) {
            console.error(
              `Failed to fetch course name for ID ${e.courseId}:`,
              error
            );
          }
          return {
            id: e.id,
            courseName,
            time: `${e.startTime} - ${e.endTime}`,
            room: e.classroom,
          };
        })
      );
      setTodayClasses(enriched);
    } catch (e) {
      console.error(e);
      setError(STR.ERROR_FETCH_TIMETABLE);
    }

    setLoading(false);
  }, []);

  // Initial data load
  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Chart configuration
  const lineData = useMemo(
    () => ({
      labels: trendLabels,
      datasets: [{ label: STR.CHART_LABEL, data: trendData }],
    }),
    [trendLabels, trendData]
  );

  const lineOpts = useMemo(
    () => ({
      responsive: true,
      plugins: {
        legend: { labels: { color: "white" } },
        title: { display: true, text: STR.CHART_TITLE, color: "white" },
      },
      scales: {
        x: { ticks: { color: "white" } },
        y: { ticks: { color: "white" } },
      },
    }),
    []
  );

  // Table columns
  const ttCols: Column<TimetableRow>[] = useMemo(
    () => [
      { header: STR.SECTION_TIMETABLE, accessor: "courseName" },
      { header: "Time", accessor: "time" },
      { header: "Room", accessor: "room" },
    ],
    []
  );

  const atCols: Column<AttendanceTotal>[] = useMemo(
    () => [
      { header: STR.COL_COURSE, accessor: "courseName" },
      { header: STR.COL_ATTENDED, accessor: (r) => r.attended },
      { header: STR.COL_TOTAL, accessor: (r) => r.total },
      {
        header: STR.COL_PERCENTAGE,
        accessor: (r) =>
          r.total > 0 ? `${((r.attended / r.total) * 100).toFixed(1)}%` : "0%",
      },
    ],
    []
  );

  return (
    <div className="min-h-screen flex font-roboto bg-gradient-to-br from-gray-900 to-black">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <Navbar />
        <main className="p-8 space-y-8">
          {/* Heading & Refresh */}
          <div className="flex justify-between items-center">
            <h1 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500">
              {STR.PAGE_TITLE}
            </h1>
            <Button
              label={STR.BTN_REFRESH}
              onClick={fetchData}
              isLoading={loading}
              variant="primary"
            />
          </div>

          {/* Error Message */}
          {error && <p className="text-red-500">{error}</p>}

          {/* Metrics Cards */}
          <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card title={STR.CARD_COURSES} value={coursesTaught} icon="📚" />
            <Card title={STR.CARD_STUDENTS} value={totalStudents} icon="👨‍🎓" />
            <Card
              title={STR.CARD_UPCOMING}
              value={todayClasses.length}
              icon="🗓️"
            />
            <Card
              title={STR.CARD_AVG_ATTENDANCE}
              value={`${trendData.length ? trendData[trendData.length - 1] : 0}%`}
              icon="✅"
            />
          </section>

          {/* Attendance Trend Chart */}
          <section className="bg-black bg-opacity-50 border border-indigo-500 rounded-xl shadow-xl p-6">
            <Chart type="line" data={lineData} options={lineOpts} />
          </section>

          {/* Today's Timetable */}
          <section>
            <h2 className="text-2xl font-bold text-white mb-4">
              {STR.SECTION_TIMETABLE}
            </h2>
            {todayClasses.length > 0 ? (
              <CommonTable columns={ttCols} data={todayClasses} />
            ) : (
              <p className="text-white">{STR.NO_TIMETABLE}</p>
            )}
          </section>

          {/* Course Attendance Totals */}
          <section>
            <h2 className="text-2xl font-bold text-white mb-4">
              {STR.SECTION_ATTENDANCE_TOTALS}
            </h2>
            {attendanceTotals.length > 0 ? (
              <CommonTable columns={atCols} data={attendanceTotals} />
            ) : (
              <p className="text-white">{STR.NO_TIMETABLE}</p>
            )}
          </section>
        </main>
      </div>
    </div>
  );
};

export default TeacherDashboard;

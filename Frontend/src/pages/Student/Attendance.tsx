// src/pages/Student/Attendance.tsx
import React, { useState, useEffect, useMemo, useCallback } from "react";
import Sidebar from "../../components/common/Sidebar";
import Navbar from "../../components/common/Navbar";
import CommonTable, { Column } from "../../components/common/Table";
import Chart from "../../components/common/Chart";
import CommonButton from "../../components/common/Button";

import attendanceService from "../../services/attendanceService";
import courseService from "../../services/courseService";

import { ATTENDANCE_STRINGS as STR } from "../../constants/student/attendanceConsts";

interface CourseStat {
  courseId: number;
  courseName: string;
  totalClasses: number;
  attendedClasses: number;
  percentage: string;
}

const Attendance: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [courseStats, setCourseStats] = useState<CourseStat[]>([]);
  const [overall, setOverall] = useState({
    total: 0,
    attended: 0,
    percentage: "0",
  });

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);

    const studentId = Number(sessionStorage.getItem("userId") ?? 0);
    if (!studentId) {
      setError(STR.ERROR_NO_USER_ID);
      setLoading(false);
      return;
    }

    try {
      // 1) Fetch attendance
      const records = await attendanceService.getAttendanceByStudent(studentId);

      // 2) Aggregate per-course
      const stats = new Map<number, { attended: number; total: number }>();
      records.forEach(({ courseId, status }) => {
        const entry = stats.get(courseId) || { attended: 0, total: 0 };
        entry.total++;
        if (status.toLowerCase() === "present") entry.attended++;
        stats.set(courseId, entry);
      });

      // 3) Build CourseStat array
      const arr: CourseStat[] = [];
      for (const [courseId, { attended, total }] of stats.entries()) {
        let name = `Course ${courseId}`;
        await courseService.getById(courseId)
          .then(c => { name = c.name; })
          .catch(() => {});
        const pct = total > 0 ? ((attended / total) * 100).toFixed(1) : "0";
        arr.push({ courseId, courseName: name, totalClasses: total, attendedClasses: attended, percentage: pct });
      }
      setCourseStats(arr);

      // 4) Overall stats
      const totalClasses = arr.reduce((s, c) => s + c.totalClasses, 0);
      const totalAttended = arr.reduce((s, c) => s + c.attendedClasses, 0);
      const perc = totalClasses > 0
        ? ((totalAttended / totalClasses) * 100).toFixed(1)
        : "0";
      setOverall({ total: totalClasses, attended: totalAttended, percentage: perc });
    } catch (e) {
      console.error(e);
      setError(STR.ERROR_FETCH_ATTENDANCE);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Table columns
  const columns: Column<CourseStat>[] = useMemo(() => [
    { header: STR.COL_COURSE, accessor: "courseName" },
    { header: STR.COL_ATTENDED, accessor: "attendedClasses" },
    { header: STR.COL_TOTAL, accessor: "totalClasses" },
    { header: STR.COL_PERCENT, accessor: r => `${r.percentage}%` },
  ], []);

  // Chart data
  const chartData = useMemo(() => ({
    labels: [STR.LABEL_OVERALL_PERCENT],
    datasets: [{
      label: STR.LABEL_OVERALL_PERCENT,
      data: [Number(overall.percentage)],
    }],
  }), [overall]);

  return (
    <div className="min-h-screen flex bg-gray-900 text-white">
      <Sidebar />
      <div className="ml-64 flex-1 flex flex-col overflow-x-auto">
        <Navbar />

        <main className="p-6 space-y-8">
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
            <div className="p-4 bg-red-600 rounded text-white">
              {error}
            </div>
          )}

          {/* Overall Summary */}
          <section className="bg-gray-800 bg-opacity-50 border border-indigo-500 rounded-xl shadow-xl p-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
              <div>
                <p className="text-gray-400">{STR.LABEL_TOTAL_CLASSES}</p>
                <p className="text-2xl font-bold">{overall.total}</p>
              </div>
              <div>
                <p className="text-gray-400">{STR.LABEL_ATTENDED_CLASSES}</p>
                <p className="text-2xl font-bold">{overall.attended}</p>
              </div>
              <div>
                <p className="text-gray-400">{STR.LABEL_OVERALL_PERCENT}</p>
                <p className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-blue-500">
                  {overall.percentage}%
                </p>
              </div>
            </div>
            <div className="mt-6 h-56">
              <Chart data={chartData} type="bar" options={{}} />
            </div>
          </section>

          {/* Detailed Table */}
          <section>
            <h2 className="text-2xl font-semibold mb-4">{STR.DETAILS_TITLE}</h2>
            <CommonTable
              columns={columns}
              data={courseStats.map(s => ({ ...s, id: s.courseId }))}
              loading={loading}
              noDataMessage={STR.NO_DATA}
            />
          </section>
        </main>
      </div>
    </div>
  );
};

export default React.memo(Attendance);

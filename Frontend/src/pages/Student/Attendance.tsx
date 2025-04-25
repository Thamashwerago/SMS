// src/pages/Student/Attendance.tsx
import React, { useState, useEffect, useMemo, useCallback } from "react";

// Common UI components
import Sidebar from "../../components/common/Sidebar";
import Navbar from "../../components/common/Navbar";
import CommonTable, { Column } from "../../components/common/Table";
import Chart from "../../components/common/Chart";
import Button from "../../components/common/Button";

// Services
import attendanceService from "../../services/attendanceService";
import courseService from "../../services/courseService";

// Extracted strings
import { ATTENDANCE_STRINGS } from "../../constants/student/attendanceConsts";

/**
 * CourseStat
 * ----------
 * Represents aggregated attendance stats per course.
 */
interface CourseStat {
  courseId: number;
  courseName: string;
  totalClasses: number;
  attendedClasses: number;
  percentage: string;
}

const Attendance: React.FC = () => {
  /** Loading & error states */
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  /** Aggregated data */
  const [courseStats, setCourseStats] = useState<CourseStat[]>([]);
  const [overall, setOverall] = useState({
    total: 0,
    attended: 0,
    percentage: "0",
  });

  /**
   * fetchData
   * ---------
   * Retrieves student attendance and course info,
   * computes per-course and overall stats.
   * Manages separate exceptions for each API call.
   */
  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);

    // 1. Get student ID from sessionStorage
    const studentId = sessionStorage.getItem("userId");
    if (!studentId) {
      setError(ATTENDANCE_STRINGS.ERROR_NO_USER_ID);
      setLoading(false);
      return;
    }

    try {
      // 2. Fetch attendance records for this student
      const records = await attendanceService.getAttendanceByStudent(
        Number(studentId)
      );

      // 3. Aggregate by courseId
      const statsMap = new Map<number, { attended: number; total: number }>();
      records.forEach((rec) => {
        const { courseId, status } = rec;
        const entry = statsMap.get(courseId) || { attended: 0, total: 0 };
        entry.total += 1;
        if (status.toLowerCase() === "present") entry.attended += 1;
        statsMap.set(courseId, entry);
      });

      // 4. Fetch course names for each courseId
      const courseStatsArray: CourseStat[] = [];
      for (const [courseId, { attended, total }] of statsMap.entries()) {
        try {
          const course = await courseService.getById(courseId);
          const perc = total > 0 ? ((attended / total) * 100).toFixed(1) : "0";
          courseStatsArray.push({
            courseId,
            courseName: course.name,
            totalClasses: total,
            attendedClasses: attended,
            percentage: perc,
          });
        } catch (courseErr) {
          console.error(ATTENDANCE_STRINGS.ERROR_FETCH_COURSES, courseErr);
          // still push entry without name
          const perc = total > 0 ? ((attended / total) * 100).toFixed(1) : "0";
          courseStatsArray.push({
            courseId,
            courseName: `Course ${courseId}`,
            totalClasses: total,
            attendedClasses: attended,
            percentage: perc,
          });
        }
      }

      // 5. Compute overall stats
      const totalClasses = courseStatsArray.reduce(
        (sum, c) => sum + c.totalClasses,
        0
      );
      const totalAttended = courseStatsArray.reduce(
        (sum, c) => sum + c.attendedClasses,
        0
      );
      const overallPerc =
        totalClasses > 0
          ? ((totalAttended / totalClasses) * 100).toFixed(1)
          : "0";

      // Update state
      setCourseStats(courseStatsArray);
      setOverall({
        total: totalClasses,
        attended: totalAttended,
        percentage: overallPerc,
      });
    } catch (attErr) {
      console.error(ATTENDANCE_STRINGS.ERROR_FETCH_ATTENDANCE, attErr);
      setError(ATTENDANCE_STRINGS.ERROR_FETCH_ATTENDANCE);
    } finally {
      setLoading(false);
    }
  }, []);

  // Fetch on mount
  useEffect(() => {
    fetchData();
  }, [fetchData]);

  /** Columns for attendance table */
  const columns: Column<CourseStat>[] = useMemo(
    () => [
      { header: ATTENDANCE_STRINGS.COL_COURSE, accessor: "courseName" },
      { header: ATTENDANCE_STRINGS.COL_ATTENDED, accessor: "attendedClasses" },
      { header: ATTENDANCE_STRINGS.COL_TOTAL, accessor: "totalClasses" },
      {
        header: ATTENDANCE_STRINGS.COL_PERCENT,
        accessor: (r) => `${r.percentage}%`,
      },
    ],
    []
  );

  /** Chart data: overall attendance */
  const chartData = useMemo(
    () => ({
      labels: [ATTENDANCE_STRINGS.LABEL_OVERALL_PERCENT],
      datasets: [
        {
          label: ATTENDANCE_STRINGS.LABEL_OVERALL_PERCENT,
          data: [Number(overall.percentage)],
        },
      ],
    }),
    [overall]
  );

  return (
    <div className="min-h-screen flex font-roboto bg-gradient-to-br from-gray-900 to-black">
      {/* Sidebar Navigation */}
      <Sidebar />
      <div className="ml-64 flex-1 flex flex-col overflow-x-hidden">
        {/* Top Navbar */}
        <Navbar />
        <main className="p-8 overflow-x-auto">
          {/* Page Heading */}
          <h1 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500 mb-8">
            {ATTENDANCE_STRINGS.PAGE_TITLE}
          </h1>

          {/* Refresh Button */}
          <div className="flex justify-end mb-4">
            <Button
              label={ATTENDANCE_STRINGS.BTN_REFRESH}
              onClick={fetchData}
              isLoading={loading}
              variant="primary"
            />
          </div>

          {/* Error Message */}
          {error && <p className="text-red-500 mb-4">{error}</p>}

          {/* Overall Attendance Summary */}
          <section className="mb-8">
            <div className="bg-black bg-opacity-50 border border-indigo-500 p-8 rounded-xl shadow-xl flex flex-col md:flex-row justify-around">
              <div className="text-center">
                <p className="text-xl text-gray-300">
                  {ATTENDANCE_STRINGS.LABEL_TOTAL_CLASSES}
                </p>
                <p className="text-3xl font-bold text-white">{overall.total}</p>
              </div>
              <div className="text-center">
                <p className="text-xl text-gray-300">
                  {ATTENDANCE_STRINGS.LABEL_ATTENDED_CLASSES}
                </p>
                <p className="text-3xl font-bold text-white">
                  {overall.attended}
                </p>
              </div>
              <div className="text-center">
                <p className="text-xl text-gray-300">
                  {ATTENDANCE_STRINGS.LABEL_OVERALL_PERCENT}
                </p>
                <p className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-blue-500">
                  {overall.percentage}%
                </p>
              </div>
            </div>
            <div className="mt-6 h-64">
              <Chart data={chartData} type="bar" />
            </div>
          </section>

          {/* Course-wise Attendance Table */}
          <section>
            <h2 className="text-3xl font-bold text-white mb-4">
              {ATTENDANCE_STRINGS.DETAILS_TITLE}
            </h2>
            {courseStats.length > 0 ? (
              <CommonTable
                columns={columns}
                data={courseStats.map((stat) => ({
                  ...stat,
                  id: stat.courseId,
                }))}
              />
            ) : (
              <p className="text-white">{ATTENDANCE_STRINGS.NO_DATA}</p>
            )}
          </section>
        </main>
      </div>
    </div>
  );
};

export default Attendance;

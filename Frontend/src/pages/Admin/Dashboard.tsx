// src/pages/Admin/Dashboard.tsx

import React, { useMemo, useState, useEffect, useCallback } from "react";
import Sidebar from "../../components/common/Sidebar";
import Navbar from "../../components/common/Navbar";
import Card from "../../components/common/Card";
import Chart from "../../components/common/Chart";
import CommonTable, { Column } from "../../components/common/Table";
import Button from "../../components/common/Button";
import CourseCard, {
  AggregatedCourseAttendance,
} from "../../components/common/CourseCard";

// Service modules
import teacherService from "../../services/teacherService";
import studentService from "../../services/studentService";
import courseService from "../../services/courseService";
import timetableService from "../../services/timetableService";
import attendanceService from "../../services/attendanceService";

// String constants
const STRINGS = {
  DASHBOARD_TITLE: "Admin Dashboard",
  TOTAL_STUDENTS: "Total Students",
  TOTAL_TEACHERS: "Total Teachers",
  TOTAL_COURSES: "Total Courses",
  TODAYS_CLASSES: "Today's Classes",
  AVG_ATTENDANCE: "Avg. Attendance",
  INSTITUTION_OVERVIEW: "Institution Overview",
  ATTENDANCE_DISTRIBUTION: "Attendance Distribution",
  REFRESH_DATA: "Refresh Data",
  UPCOMING_CLASSES: "Upcoming Classes",
  FEATURED_COURSES: "Featured Courses",
  NO_DATA: "No data available.",

  ERROR_FETCHING_STUDENTS: "Error fetching students data",
  ERROR_FETCHING_TEACHERS: "Error fetching teachers data",
  ERROR_FETCHING_COURSES: "Error fetching courses data",
  ERROR_FETCHING_TIMETABLE: "Error fetching timetable data",
  ERROR_FETCHING_ATTENDANCE: "Error fetching attendance data",
};

interface TimetableEntry {
  id: number;
  date: string;
  startTime: string;
  endTime: string;
  teacherId: number;
  courseId: number;
  classroom: string;
}

interface Course {
  id: number;
  name: string;
}

/** Columns for Upcoming Classes table */
const timetableColumns: Column<TimetableEntry>[] = [
  { header: "Start Time", accessor: "startTime" },
  { header: "End Time", accessor: "endTime" },
  { header: "Course ID", accessor: "courseId" },
  { header: "Classroom", accessor: "classroom" },
];

/** Transforms a Course into the shape CourseCard expects */
const transformCourseToCourseCardData = (
  course: Course
): AggregatedCourseAttendance => ({
  courseId: course.id,
  courseName: course.name,
  teacher: "Not Assigned",
  totalStudents: 0,
  present: 0,
  updatedAt: "N/A",
  records: [],
});

const Dashboard: React.FC = () => {
  // Loading & error state
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Core metrics
  const [totalStudents, setTotalStudents] = useState(0);
  const [totalTeachers, setTotalTeachers] = useState(0);
  const [totalCourses, setTotalCourses] = useState(0);
  const [todaysClasses, setTodaysClasses] = useState(0);
  const [averageAttendance, setAverageAttendance] = useState(0);
  const [attendanceCounts, setAttendanceCounts] = useState({ present: 0, absent: 0 });

  // Detailed data
  const [timetableEntries, setTimetableEntries] = useState<TimetableEntry[]>([]);
  const [coursesList, setCoursesList] = useState<Course[]>([]);

  /**
   * refreshData
   * Fetch all dashboard data, each in its own try/catch for granular error handling.
   */
  const refreshData = useCallback(async () => {
    setLoading(true);
    setError(null);

    // Students
    try {
      const studentCount = await studentService.count();
      setTotalStudents(studentCount);
    } catch (e) {
      console.error(e);
      setError(STRINGS.ERROR_FETCHING_STUDENTS);
    }

    // Teachers
    try {
      const teacherCount = await teacherService.count();
      setTotalTeachers(teacherCount);
    } catch (e) {
      console.error(e);
      setError(STRINGS.ERROR_FETCHING_TEACHERS);
    }

    // Courses
    try {
      const courseCount = await courseService.count();
      const courses = await courseService.getAll();
      setTotalCourses(courseCount);
      setCoursesList(courses);
    } catch (e) {
      console.error(e);
      setError(STRINGS.ERROR_FETCHING_COURSES);
    }

    // Today's timetable
    try {
      const todayCourse = await timetableService.Count();
      const all = await timetableService.getAll();
      const today = new Date().toISOString().slice(0, 10);
      const todays = all.filter((e) => e.date === today);
      setTodaysClasses(todayCourse);
      setTimetableEntries(todays);
    } catch (e) {
      console.error(e);
      setError(STRINGS.ERROR_FETCHING_TIMETABLE);
    }

    // Attendance
    try {
      const records = await attendanceService.getAttendanceSummary();
      setAttendanceCounts({
        present: records.reduce((sum, record) => sum + (record.presentCount || 0), 0),
        absent: records.reduce((sum, record) => sum + (record.absentCount || 0), 0),
      });
      setAverageAttendance(records.reduce((sum, record) => sum + (record.attendancePercentage || 0), 0) / records.length);
    } catch (e) {
      console.error(e);
      setError(STRINGS.ERROR_FETCHING_ATTENDANCE);
    }

    setLoading(false);
  }, []);

  // Load once
  useEffect(() => {
    refreshData();
  }, []);

  const metrics = {
    totalStudents,
    totalTeachers,
    totalCourses,
    todaysClasses,
    averageAttendance,
  };

  // Bar chart config
  const barChartData = useMemo(
    () => ({
      labels: ["Students", "Teachers", "Courses"],
      datasets: [
        {
          label: "Count",
          data: [totalStudents, totalTeachers, totalCourses],
        },
      ],
    }),
    [totalStudents, totalTeachers, totalCourses]
  );
  const barChartOptions = useMemo(
    () => ({
      responsive: true,
      plugins: {
        legend: { labels: { color: "white" } },
        title: { display: true, text: STRINGS.INSTITUTION_OVERVIEW, color: "white" },
      },
      scales: {
        x: { ticks: { color: "white" } },
        y: { ticks: { color: "white" } },
      },
    }),
    []
  );

  // Pie chart config
  const pieChartData = useMemo(
    () => ({
      labels: ["Present", "Absent"],
      datasets: [
        {
          label: STRINGS.ATTENDANCE_DISTRIBUTION,
          data: [attendanceCounts.present, attendanceCounts.absent],
        },
      ],
    }),
    [attendanceCounts]
  );
  const pieChartOptions = useMemo(
    () => ({
      responsive: true,
      plugins: {
        legend: { labels: { color: "white" } },
        title: { display: true, text: STRINGS.ATTENDANCE_DISTRIBUTION, color: "white" },
      },
    }),
    []
  );

  // Featured courses (top 3)
  const featuredCourses = useMemo(
    () => coursesList.slice(0, 3).map(transformCourseToCourseCardData),
    [coursesList]
  );

  return ( 
    <div className="min-h-screen flex font-roboto bg-gradient-to-br from-gray-900 to-black">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <Navbar />
        <main className="p-8">

          {/* Error Banner */}
          {error && (
            <div className="mb-4 p-4 bg-red-600 text-white rounded">
              {error}
            </div>
          )}

          {/* Loading State */}
          {loading ? (
            <div className="flex h-64 items-center justify-center text-white">
              Loading dashboard data...
            </div>
          ) : (
            <>
              {/* Overview Cards */}
              <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-8">
                <Card title={STRINGS.TOTAL_STUDENTS} value={metrics.totalStudents} icon="👨‍🎓" />
                <Card title={STRINGS.TOTAL_TEACHERS} value={metrics.totalTeachers} icon="👩‍🏫" />
                <Card title={STRINGS.TOTAL_COURSES} value={metrics.totalCourses} icon="📚" />
                <Card title={STRINGS.TODAYS_CLASSES} value={metrics.todaysClasses} icon="🗓️" />
                <Card title={STRINGS.AVG_ATTENDANCE} value={`${metrics.averageAttendance}%`} icon="✅" />
              </section>

              {/* Refresh Button */}
              <div className="flex justify-end mb-6">
                <Button
                  label={STRINGS.REFRESH_DATA}
                  onClick={refreshData}
                  isLoading={loading}
                />
              </div>

              {/* Charts */}
              <section className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
                <div className="bg-black bg-opacity-50 border border-indigo-500 p-6 rounded shadow">
                  <Chart type="bar" data={barChartData} options={barChartOptions} />
                </div>
                <div className="bg-black bg-opacity-50 border border-indigo-500 p-6 rounded shadow">
                  <Chart type="pie" data={pieChartData} options={pieChartOptions} />
                </div>
              </section>

              {/* Upcoming Classes */}
              <section className="mb-8">
                <h2 className="text-2xl font-bold text-white mb-4">{STRINGS.UPCOMING_CLASSES}</h2>
                {timetableEntries.length > 0 ? (
                  <CommonTable columns={timetableColumns} data={timetableEntries} />
                ) : (
                  <p className="text-white">{STRINGS.NO_DATA}</p>
                )}
              </section>

              {/* Featured Courses */}
              <section className="mb-8">
                <h2 className="text-2xl font-bold text-white mb-4">{STRINGS.FEATURED_COURSES}</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {featuredCourses.length > 0 ? (
                    featuredCourses.map((c) => (
                      <CourseCard key={c.courseId} course={c} onClick={() => {}} />
                    ))
                  ) : (
                    <p className="text-white">{STRINGS.NO_DATA}</p>
                  )}
                </div>
              </section>
            </>
          )}
        </main>
      </div>
    </div>
  );
};

export default Dashboard;

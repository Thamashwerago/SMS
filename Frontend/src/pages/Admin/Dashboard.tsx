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

// Import service modules
import teacherService from "../../components/services/teacherService";
import studentService from "../../components/services/studentService";
import courseService from "../../components/services/courseService";
import timetableService from "../../components/services/timetableService";
import attendanceService from "../../components/services/attendanceService";

// Extracted string constants for easy maintenance
const STRINGS = {
  // Section Titles & Labels
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

  // Error messages
  ERROR_FETCHING_STUDENTS: "Error fetching students data",
  ERROR_FETCHING_TEACHERS: "Error fetching teachers data",
  ERROR_FETCHING_COURSES: "Error fetching courses data",
  ERROR_FETCHING_TIMETABLE: "Error fetching timetable data",
  ERROR_FETCHING_ATTENDANCE: "Error fetching attendance data",
};

// Define TypeScript interfaces if needed
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
  // Add other properties as needed
}

// Define columns for the CommonTable component (Upcoming Classes)
const timetableColumns: Column<TimetableEntry>[] = [
  {
    header: "Start Time",
    accessor: "startTime",
  },
  {
    header: "End Time",
    accessor: "endTime",
  },
  {
    header: "Course ID",
    accessor: "courseId",
  },
  {
    header: "Classroom",
    accessor: "classroom",
  },
];

// Helper function to transform course data to the format expected by CourseCard
const transformCourseToCourseCardData = (
  course: Course
): AggregatedCourseAttendance => {
  return {
    courseId: course.id,
    courseName: course.name,
    teacher: "Not Assigned", // Placeholder value
    totalStudents: 0, // Placeholder value
    present: 0, // Placeholder value
    updatedAt: "N/A", // Placeholder value
    records: [], // No attendance records available here
  };
};

const Dashboard: React.FC = () => {
  // Loading state to control UI feedback during data fetches
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // States for core metrics
  const [totalStudents, setTotalStudents] = useState<number>(0);
  const [totalTeachers, setTotalTeachers] = useState<number>(0);
  const [totalCourses, setTotalCourses] = useState<number>(0);
  const [todaysClasses, setTodaysClasses] = useState<number>(0);
  const [averageAttendance, setAverageAttendance] = useState<number>(0);
  const [attendanceCounts, setAttendanceCounts] = useState({
    present: 0,
    absent: 0,
  });

  // Additional states for detailed data display
  const [timetableEntries, setTimetableEntries] = useState<TimetableEntry[]>(
    []
  );
  const [coursesList, setCoursesList] = useState<Course[]>([]);

  /**
   * refreshData
   * -----------
   * Fetches data from the backend services. Each service call is wrapped in its own try–catch block to manage exceptions separately.
   */
  const refreshData = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      // Fetch student data
      const students = await studentService.getAll();
      setTotalStudents(students.length);
    } catch (error) {
      console.error(STRINGS.ERROR_FETCHING_STUDENTS, error);
      setError(STRINGS.ERROR_FETCHING_STUDENTS);
    }

    try {
      // Fetch teacher data
      const teachers = await teacherService.getAll();
      setTotalTeachers(teachers.length);
    } catch (error) {
      console.error(STRINGS.ERROR_FETCHING_TEACHERS, error);
      setError(STRINGS.ERROR_FETCHING_TEACHERS);
    }

    try {
      // Fetch courses data
      const courses = await courseService.getAll();
      setTotalCourses(courses.length);
      setCoursesList(courses);
    } catch (error) {
      console.error(STRINGS.ERROR_FETCHING_COURSES, error);
      setError(STRINGS.ERROR_FETCHING_COURSES);
    }

    try {
      // Fetch timetable data
      const timetables = await timetableService.getAll();
      const today = new Date().toISOString().slice(0, 10);
      const todaysEntries = timetables.filter(
        (entry: TimetableEntry) => entry.date === today
      );
      setTodaysClasses(todaysEntries.length);
      setTimetableEntries(todaysEntries);
    } catch (error) {
      console.error(STRINGS.ERROR_FETCHING_TIMETABLE, error);
      setError(STRINGS.ERROR_FETCHING_TIMETABLE);
    }

    try {
      // Fetch attendance data
      const attendances = await attendanceService.getAll();
      const totalAttendance = attendances.length;
      const presentCount = attendances.filter(
        (a: { status: string }) => a.status.toLowerCase() === "present"
      ).length;
      const absentCount = totalAttendance - presentCount;
      const avgAttendance =
        totalAttendance > 0
          ? Math.round((presentCount / totalAttendance) * 100)
          : 0;
      setAverageAttendance(avgAttendance);
      setAttendanceCounts({ present: presentCount, absent: absentCount });
    } catch (error) {
      console.error(STRINGS.ERROR_FETCHING_ATTENDANCE, error);
      setError(STRINGS.ERROR_FETCHING_ATTENDANCE);
    }

    setLoading(false);
  }, []);

  // Fetch data once when the component mounts
  useEffect(() => {
    refreshData();
  }, [refreshData]);

  // Consolidate core metrics for display in cards
  const metrics = {
    totalStudents,
    totalTeachers,
    totalCourses,
    todaysClasses,
    averageAttendance,
  };

  // Bar Chart Data & Options for the Institution Overview
  const barChartData = useMemo(
    () => ({
      labels: ["Students", "Teachers", "Courses"],
      datasets: [
        {
          label: "Count",
          data: [totalStudents, totalTeachers, totalCourses],
          backgroundColor: [
            "rgba(75,192,192,0.6)",
            "rgba(153,102,255,0.6)",
            "rgba(255,159,64,0.6)",
          ],
        },
      ],
    }),
    [totalStudents, totalTeachers, totalCourses]
  );

  const barChartOptions = useMemo(
    () => ({
      responsive: true,
      plugins: {
        legend: { position: "top" as const, labels: { color: "white" } },
        title: {
          display: true,
          text: STRINGS.INSTITUTION_OVERVIEW,
          color: "white",
        },
      },
      scales: {
        x: {
          ticks: { color: "white" },
          grid: { color: "rgba(255,255,255,0.1)" },
        },
        y: {
          ticks: { color: "white" },
          grid: { color: "rgba(255,255,255,0.1)" },
        },
      },
    }),
    []
  );

  // Pie Chart Data & Options for Attendance Distribution
  const pieChartData = useMemo(
    () => ({
      labels: ["Present", "Absent"],
      datasets: [
        {
          label: STRINGS.ATTENDANCE_DISTRIBUTION,
          data: [attendanceCounts.present, attendanceCounts.absent],
          backgroundColor: ["rgba(40,167,69,0.8)", "rgba(255,193,7,0.8)"],
          hoverBackgroundColor: ["rgba(40,167,69,1)", "rgba(255,193,7,1)"],
        },
      ],
    }),
    [attendanceCounts]
  );

  const pieChartOptions = useMemo(
    () => ({
      responsive: true,
      plugins: {
        legend: { position: "top" as const, labels: { color: "white" } },
        title: {
          display: true,
          text: STRINGS.ATTENDANCE_DISTRIBUTION,
          color: "white",
        },
      },
    }),
    []
  );

  // Transform the courses list for the featured courses section (limit to 3)
  const featuredCourses = useMemo(() => {
    return coursesList.slice(0, 3).map(transformCourseToCourseCardData);
  }, [coursesList]);

  return (
    <div className="min-h-screen flex font-roboto bg-gradient-to-br from-gray-900 to-black">
      {/* Sidebar Navigation */}
      <Sidebar />
      <div className="flex-1 flex flex-col">
        {/* Top Navbar */}
        <Navbar />
        <main className="p-4 sm:p-8">
          {error && (
            <div className="mb-4 p-4 bg-red-500 text-white rounded-lg">
              {error}
            </div>
          )}
          {loading ? (
            <div className="flex items-center justify-center h-64">
              <div className="text-white">Loading dashboard data...</div>
            </div>
          ) : (
            <>
              {/* Overview Cards Section */}
              <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-8">
                <div className="hover:scale-105 transition-transform duration-300">
                  <Card
                    title={STRINGS.TOTAL_STUDENTS}
                    value={metrics.totalStudents}
                    icon="👨‍🎓"
                  />
                </div>
                <div className="hover:scale-105 transition-transform duration-300">
                  <Card
                    title={STRINGS.TOTAL_TEACHERS}
                    value={metrics.totalTeachers}
                    icon="👩‍🏫"
                  />
                </div>
                <div className="hover:scale-105 transition-transform duration-300">
                  <Card
                    title={STRINGS.TOTAL_COURSES}
                    value={metrics.totalCourses}
                    icon="📚"
                  />
                </div>
                <div className="hover:scale-105 transition-transform duration-300">
                  <Card
                    title={STRINGS.TODAYS_CLASSES}
                    value={metrics.todaysClasses}
                    icon="🗓️"
                  />
                </div>
                <div className="hover:scale-105 transition-transform duration-300">
                  <Card
                    title={STRINGS.AVG_ATTENDANCE}
                    value={`${metrics.averageAttendance}%`}
                    icon="✅"
                  />
                </div>
              </section>

              {/* Refresh Data Button */}
              <div className="flex justify-end mb-4">
                <Button
                  label={STRINGS.REFRESH_DATA}
                  onClick={refreshData}
                  isLoading={loading}
                  variant="primary"
                />
              </div>

              {/* Charts Section */}
              <section className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
                {/* Institution Overview Bar Chart */}
                <div className="bg-black bg-opacity-50 border border-indigo-500 p-6 sm:p-8 rounded-xl shadow-xl">
                  <Chart
                    type="bar"
                    data={barChartData}
                    options={barChartOptions}
                  />
                </div>
                {/* Attendance Distribution Pie Chart */}
                <div className="bg-black bg-opacity-50 border border-indigo-500 p-6 sm:p-8 rounded-xl shadow-xl">
                  <Chart
                    type="pie"
                    data={pieChartData}
                    options={pieChartOptions}
                  />
                </div>
              </section>

              {/* Upcoming Classes Section using CommonTable */}
              <section className="mb-8">
                <h2 className="text-2xl font-bold text-white mb-4">
                  {STRINGS.UPCOMING_CLASSES}
                </h2>
                {timetableEntries.length > 0 ? (
                  <CommonTable
                    columns={timetableColumns}
                    data={timetableEntries}
                    onRowClick={(row) =>
                      console.log("Timetable row clicked", row)
                    }
                  />
                ) : (
                  <p className="text-white">{STRINGS.NO_DATA}</p>
                )}
              </section>

              {/* Featured Courses Section using CourseCard */}
              <section className="mb-8">
                <h2 className="text-2xl font-bold text-white mb-4">
                  {STRINGS.FEATURED_COURSES}
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {featuredCourses.length > 0 ? (
                    featuredCourses.map((course) => (
                      <CourseCard
                        key={course.courseId}
                        course={course}
                        onClick={(courseData) =>
                          console.log("Course clicked", courseData)
                        }
                      />
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

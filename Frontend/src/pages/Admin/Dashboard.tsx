// src/pages/Admin/Dashboard.tsx
import React, {
  useMemo,
  useState,
  useEffect,
  useCallback,
} from "react";
import Sidebar from "../../components/common/Sidebar";
import Navbar from "../../components/common/Navbar";
import Card from "../../components/common/Card";
import Chart from "../../components/common/Chart";
import CommonTable, { Column } from "../../components/common/Table";
import CommonButton from "../../components/common/Button";
import CourseCard, {
  AggregatedCourseAttendance,
} from "../../components/common/CourseCard";

// Service modules
import teacherService, { Teacher } from "../../services/teacherService";
import studentService from "../../services/studentService";
import courseService, {
  Course,
  CourseAssign,
} from "../../services/courseService";
import timetableService from "../../services/timetableService";
import attendanceService from "../../services/attendanceService";

// String constants
const STRINGS = {
  DASHBOARD_TITLE: "Admin Dashboard",
  TOTAL_STUDENTS: "Total Students",
  TOTAL_TEACHERS: "Total Teachers",
  TOTAL_COURSES: "Total Courses",
  TODAYS_CLASSES: "Today's Classes",
  INSTITUTION_OVERVIEW: "Institution Overview",
  ATTENDANCE_DISTRIBUTION: "Attendance Distribution",
  REFRESH_DATA: "Refresh Data",
  UPCOMING_CLASSES: "Upcoming Classes",
  FEATURED_COURSES: "Featured Courses",
  NO_DATA: "No data available.",
  ERROR_FETCHING: "Failed to load dashboard data.",
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

const timetableColumns: Column<TimetableEntry>[] = [
  { header: "Start Time", accessor: "startTime" },
  { header: "End Time", accessor: "endTime" },
  { header: "Course ID", accessor: "courseId" },
  { header: "Classroom", accessor: "classroom" },
];

const Dashboard: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [totalStudents, setTotalStudents] = useState(0);
  const [totalTeachers, setTotalTeachers] = useState(0);
  const [totalCourses, setTotalCourses] = useState(0);
  const [todaysClasses, setTodaysClasses] = useState(0);

  const [timetableEntries, setTimetableEntries] = useState<TimetableEntry[]>([]);
  const [coursesList, setCoursesList] = useState<Course[]>([]);
  const [assigns, setAssigns] = useState<CourseAssign[]>([]);
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [attendanceCounts, setAttendanceCounts] = useState({
    present: 0,
    absent: 0,
  });

  const refreshData = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const [
        studentCount,
        teacherCount,
        courseCount,
        courseData,
        assignData,
        teacherData,
        allEntries,
        attendanceSummary,
      ] = await Promise.all([
        studentService.count(),
        teacherService.count(),
        courseService.count(),
        courseService.getAll(),
        courseService.getAllCourseAssigns(),
        teacherService.getAll(),
        timetableService.getAll(),
        attendanceService.getAttendanceSummary(),
      ]);

      const today = new Date().toISOString().slice(0, 10);
      const todays = allEntries.filter((e) => e.date === today);

      setTotalStudents(studentCount);
      setTotalTeachers(teacherCount);
      setTotalCourses(courseCount);

      setCoursesList(courseData);
      setAssigns(assignData);
      setTeachers(teacherData);

      setTodaysClasses(todays.length);
      setTimetableEntries(todays);

      setAttendanceCounts({
        present: attendanceSummary.reduce(
          (sum, r) => sum + (r.presentCount || 0),
          0
        ),
        absent: attendanceSummary.reduce(
          (sum, r) => sum + (r.absentCount || 0),
          0
        ),
      });
    } catch (e) {
      console.error(e);
      setError(STRINGS.ERROR_FETCHING);
    }

    setLoading(false);
  }, []);

  useEffect(() => {
    refreshData();
  }, [refreshData]);

  const metrics = useMemo(
    () => [
      { title: STRINGS.TOTAL_STUDENTS, value: totalStudents, icon: "👨‍🎓" },
      { title: STRINGS.TOTAL_TEACHERS, value: totalTeachers, icon: "👩‍🏫" },
      { title: STRINGS.TOTAL_COURSES, value: totalCourses, icon: "📚" },
      { title: STRINGS.TODAYS_CLASSES, value: todaysClasses, icon: "🗓️" },
    ],
    [totalStudents, totalTeachers, totalCourses, todaysClasses]
  );

  const barColors = useMemo(() => ["#4F46E5", "#10B981", "#F59E0B"], []);
  const pieColors = useMemo(() => ["#3B82F6", "#EF4444"], []);

  const barChartData = useMemo(
    () => ({
      labels: ["Students", "Teachers", "Courses"],
      datasets: [
        {
          label: STRINGS.INSTITUTION_OVERVIEW,
          data: [totalStudents, totalTeachers, totalCourses],
          backgroundColor: barColors,
          borderColor: barColors,
          borderWidth: 1,
        },
      ],
    }),
    [totalStudents, totalTeachers, totalCourses, barColors]
  );

  const pieChartData = useMemo(
    () => ({
      labels: ["Present", "Absent"],
      datasets: [
        {
          data: [attendanceCounts.present, attendanceCounts.absent],
          backgroundColor: pieColors,
          hoverOffset: 4,
        },
      ],
    }),
    [attendanceCounts, pieColors]
  );

  const featuredCourses = useMemo<AggregatedCourseAttendance[]>(
    () =>
      coursesList.slice(0, 3).map((course) => {
        // find teacher assign
        const teacherAssign = assigns.find(
          (a) => a.courseId === course.id && a.role === "TEACHER"
        );
        const teacherName =
          teacherAssign
            ? teachers.find((t) => t.userId === teacherAssign.userId)
                ?.name ?? "-"
            : "-";

        // count students assigned
        const studentCount = assigns.filter(
          (a) => a.courseId === course.id && a.role === "STUDENT"
        ).length;

        return {
          courseId: course.id,
          courseName: course.name,
          teacher: teacherName,
          totalStudents: studentCount,
          present: 0,
          updatedAt: new Date().toISOString(),
          records: [],
        };
      }),
    [coursesList, assigns, teachers]
  );

  return (
    <div className="min-h-screen flex bg-gray-900 text-white">
      <Sidebar />
      <div className="ml-64 flex-1 flex flex-col">
        <Navbar />

        <main className="p-6 space-y-8">
          <header className="flex items-center justify-between">
            <h1 className="text-3xl font-bold">
              {STRINGS.DASHBOARD_TITLE}
            </h1>
            <CommonButton
              label={STRINGS.REFRESH_DATA}
              onClick={refreshData}
              isLoading={loading}
              variant="primary"
              size="md"
              leftIcon={
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 4v6h6M20 20v-6h-6"
                  />
                </svg>
              }
            />
          </header>

          {error && (
            <div className="p-4 bg-red-600 rounded text-white" role="alert">
              {error}
            </div>
          )}

          {/* Metrics */}
          <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {metrics.map((m) => (
              <Card
                key={m.title}
                title={m.title}
                value={m.value}
                icon={m.icon}
                loading={loading}
              />
            ))}
          </section>

          {/* Charts */}
          <section className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Chart
              type="bar"
              data={barChartData}
              options={{}}
              title={STRINGS.INSTITUTION_OVERVIEW}
              loading={loading}
              className="rounded-lg"
            />
            <Chart
              type="pie"
              data={pieChartData}
              options={{}}
              title={STRINGS.ATTENDANCE_DISTRIBUTION}
              loading={loading}
              className="rounded-lg"
            />
          </section>

          {/* Upcoming Classes */}
          <section>
            <h2 className="text-2xl font-semibold mb-4">
              {STRINGS.UPCOMING_CLASSES}
            </h2>
            <CommonTable
              columns={timetableColumns}
              data={timetableEntries}
              loading={loading}
              noDataMessage={STRINGS.NO_DATA}
            />
          </section>

          {/* Featured Courses */}
          <section>
            <h2 className="text-2xl font-semibold mb-4">
              {STRINGS.FEATURED_COURSES}
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {featuredCourses.length > 0 ? (
                featuredCourses.map((c) => (
                  <CourseCard
                    key={c.courseId}
                    course={c}
                    onClick={() => {}}
                  />
                ))
              ) : (
                <p>{STRINGS.NO_DATA}</p>
              )}
            </div>
          </section>
        </main>
      </div>
    </div>
  );
};

export default Dashboard;

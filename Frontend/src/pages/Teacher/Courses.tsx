// src/pages/Teacher/Courses.tsx
import React, {
  useState,
  useEffect,
  useCallback,
  useMemo,
  ChangeEvent,
} from "react";

// Common UI components
import Sidebar from "../../components/common/Sidebar";
import Navbar from "../../components/common/Navbar";
import Card from "../../components/common/Card";
import CommonTable, { Column } from "../../components/common/Table";
import Chart from "../../components/common/Chart";
import Button from "../../components/common/Button";

// Services
import courseService, {
  CourseAssign,
  Course,
} from "../../services/courseService";

// Strings
import { TEACHER_COURSES_STRINGS } from "../../constants/teacher/teacherCoursesConsts";

/**
 * Teacher Courses Page
 * ---------------------
 * Fetches and displays courses assigned to the logged-in teacher.
 * Includes a credits distribution chart, a table of courses, and refresh functionality.
 */
const Courses: React.FC = () => {
  // State for loading, errors, and data
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [courses, setCourses] = useState<Course[]>([]);

  /**
   * fetchCourses
   * ------------
   * 1. Get teacherId from sessionStorage
   * 2. Fetch course assignments and filter by teacherId
   * 3. Fetch each course detail
   */
  const fetchCourses = useCallback(async () => {
    setLoading(true);
    setError(null);

    // 1. teacherId
    const teacherId = sessionStorage.getItem("userId");
    if (!teacherId) {
      setError(TEACHER_COURSES_STRINGS.ERROR_NO_TEACHER_ID);
      setLoading(false);
      return;
    }
    const tid = Number(teacherId);

    // 2. assignments
    let assigns: CourseAssign[];
    try {
      assigns = await courseService.getAllCourseAssigns();
      assigns = assigns.filter((a) => a.userId === tid);
    } catch (e) {
      console.error(e);
      setError(TEACHER_COURSES_STRINGS.ERROR_FETCH_ASSIGNMENTS);
      setLoading(false);
      return;
    }

    // 3. course details
    const courseList: Course[] = [];
    for (const a of assigns) {
      try {
        const c = await courseService.getById(a.courseId);
        courseList.push(c);
      } catch (e) {
        console.error(e);
        // skip this course
      }
    }
    setCourses(courseList);
    setLoading(false);
  }, []);

  // Initial load
  useEffect(() => {
    fetchCourses();
  }, [fetchCourses]);

  // Filter by search
  const [search, setSearch] = useState("");
  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    return courses.filter(
      (c) =>
        c.name.toLowerCase().includes(q) || c.code.toLowerCase().includes(q)
    );
  }, [courses, search]);

  // Table columns
  const columns: Column<Course>[] = useMemo(
    () => [
      { header: TEACHER_COURSES_STRINGS.COL_CODE, accessor: "code" },
      { header: TEACHER_COURSES_STRINGS.COL_NAME, accessor: "name" },
      {
        header: TEACHER_COURSES_STRINGS.COL_CREDITS,
        accessor: (row) => String(row.credits),
      },
      {
        header: TEACHER_COURSES_STRINGS.COL_DURATION,
        accessor: (row) => String(row.duration),
      },
    ],
    []
  );

  // Chart for credits distribution
  const pieData = useMemo(
    () => ({
      labels: filtered.map((c) => c.name),
      datasets: [
        {
          label: TEACHER_COURSES_STRINGS.CHART_LABEL,
          data: filtered.map((c) => c.credits),
        },
      ],
    }),
    [filtered]
  );

  const pieOptions = useMemo(
    () => ({
      responsive: true,
      plugins: {
        legend: { position: "top" as const, labels: { color: "white" } },
        title: {
          display: true,
          text: TEACHER_COURSES_STRINGS.CHART_TITLE,
          color: "white",
        },
      },
    }),
    []
  );

  return (
    <div className="min-h-screen flex font-roboto bg-gradient-to-br from-gray-900 to-black">
      <Sidebar />
      <div className="ml-64 flex-1 flex flex-col overflow-x-hidden">
        <Navbar />
        <main className="p-8 space-y-8 overflow-x-auto">
          {/* Heading & Controls */}
          <div className="flex justify-between items-center">
            <h1 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500">
              {TEACHER_COURSES_STRINGS.PAGE_HEADING}
            </h1>
            <div className="flex space-x-4">
              <input
                type="text"
                placeholder="Search by code or name..."
                value={search}
                onChange={(e: ChangeEvent<HTMLInputElement>) =>
                  setSearch(e.target.value)
                }
                className="px-4 py-2 bg-black bg-opacity-50 border border-indigo-500 rounded focus:outline-none text-white"
              />
              <Button
                label={TEACHER_COURSES_STRINGS.BTN_REFRESH}
                onClick={fetchCourses}
                isLoading={loading}
                variant="primary"
              />
            </div>
          </div>

          {/* Error */}
          {error && <p className="text-red-500">{error}</p>}

          {/* Credits Distribution Chart */}
          <div className="bg-black bg-opacity-50 border border-indigo-500 rounded-xl shadow-xl p-6">
            <Chart type="pie" data={pieData} options={pieOptions} />
          </div>

          {/* Course Cards */}
          <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map((c) => (
              <Card
                key={c.id}
                title={c.name}
                value={`${c.credits} credits`}
                icon="📘"
              >
                <p className="text-gray-300 mt-2">{c.description}</p>
              </Card>
            ))}
            {filtered.length === 0 && (
              <p className="text-white col-span-full text-center">
                {TEACHER_COURSES_STRINGS.NO_COURSES}
              </p>
            )}
          </section>

          {/* Course Table */}
          <section>
            <h2 className="text-2xl font-bold text-white mb-4">
              {TEACHER_COURSES_STRINGS.TABLE_TITLE}
            </h2>
            {filtered.length > 0 ? (
              <CommonTable columns={columns} data={filtered} />
            ) : (
              <p className="text-white">{TEACHER_COURSES_STRINGS.NO_COURSES}</p>
            )}
          </section>
        </main>
      </div>
    </div>
  );
};

export default Courses;

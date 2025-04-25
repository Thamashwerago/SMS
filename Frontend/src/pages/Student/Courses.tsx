// -----------------------------
// src/pages/Student/MyCourses.tsx
// -----------------------------
import React, {
  useState,
  useEffect,
  useMemo,
  useCallback,
  ChangeEvent,
} from "react";
import Sidebar from "../../components/common/Sidebar";
import Navbar from "../../components/common/Navbar";
import CommonTable, { Column } from "../../components/common/Table";
import CourseCard, {
  AggregatedCourseAttendance,
} from "../../components/common/CourseCard";
import Button from "../../components/common/Button";

// Services
import courseService, {
  Course,
  CourseAssign,
} from "../../services/courseService";

// Strings
import { MYCOURSES_STRINGS } from "../../constants/student/myCoursesConsts";

/**
 * Helper to transform a Course into the shape expected by CourseCard.
 */
const toCourseCardData = (course: Course): AggregatedCourseAttendance => ({
  courseId: course.id,
  courseName: course.name,
  teacher: "TBD", // could be fetched separately
  totalStudents: 0, // optional: populate if known
  present: 0, // not applicable for this view
  updatedAt: "N/A", // placeholder
  records: [], // no attendance records here
});

const MyCourses: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [courses, setCourses] = useState<Course[]>([]);
  const [search, setSearch] = useState("");

  /**
   * Fetches all course assignments for this student,
   * then fetches each course's details.
   */
  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);

    // 1. Get student ID
    const studentId = sessionStorage.getItem("userId");
    if (!studentId) {
      setError(MYCOURSES_STRINGS.ERROR_NO_USER_ID);
      setLoading(false);
      return;
    }

    // 2. Fetch assignments
    let assigns: CourseAssign[] = [];
    try {
      assigns = await courseService.getAllCourseAssigns();
      // filter by this student
      assigns = assigns.filter((a) => a.userId === Number(studentId));
    } catch (e) {
      console.error(MYCOURSES_STRINGS.ERROR_FETCH_ASSIGNMENTS, e);
      setError(MYCOURSES_STRINGS.ERROR_FETCH_ASSIGNMENTS);
      setLoading(false);
      return;
    }

    // 3. Fetch course details
    const courseList: Course[] = [];
    for (const a of assigns) {
      try {
        const c = await courseService.getById(a.courseId);
        courseList.push(c);
      } catch (e) {
        console.error(MYCOURSES_STRINGS.ERROR_FETCH_COURSES, e);
        // continue without this course
      }
    }
    setCourses(courseList);
    setLoading(false);
  }, []);

  // on mount
  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Filtered view
  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    return courses.filter(
      (c) =>
        c.name.toLowerCase().includes(q) || c.code.toLowerCase().includes(q)
    );
  }, [courses, search]);

  // Table columns for detailed list
  const columns: Column<Course>[] = useMemo(
    () => [
      { header: "Code", accessor: "code" },
      { header: "Name", accessor: "name" },
      { header: "Credits", accessor: (row) => String(row.credits) },
      { header: "Duration", accessor: (row) => String(row.duration) },
    ],
    []
  );

  return (
    <div className="min-h-screen flex font-roboto bg-gradient-to-br from-gray-900 to-black">
      <Sidebar />
      <div className="ml-64 flex-1 flex flex-col overflow-x-hidden">
        <Navbar />
        <main className="p-8 overflow-x-auto">
          {/* Heading */}
          <h1 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500 mb-6">
            {MYCOURSES_STRINGS.PAGE_TITLE}
          </h1>

          {/* Search & Refresh */}
          <div className="flex flex-col sm:flex-row items-center justify-between mb-6 gap-4">
            <input
              type="text"
              placeholder={MYCOURSES_STRINGS.SEARCH_PLACEHOLDER}
              value={search}
              onChange={(e: ChangeEvent<HTMLInputElement>) =>
                setSearch(e.target.value)
              }
              className="flex-grow px-4 py-2 bg-black bg-opacity-50 border border-indigo-500 rounded-xl focus:outline-none text-white"
            />
            <Button
              label={MYCOURSES_STRINGS.BTN_REFRESH}
              onClick={fetchData}
              isLoading={loading}
              variant="primary"
            />
          </div>

          {/* Error */}
          {error && <p className="text-red-500 mb-4">{error}</p>}

          {/* CourseCard Grid */}
          <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {filtered.map((c) => (
              <CourseCard
                key={c.id}
                course={toCourseCardData(c)}
                onClick={() => {
                  /* optional details modal */
                }}
              />
            ))}
            {filtered.length === 0 && (
              <p className="text-white col-span-full text-center">
                {MYCOURSES_STRINGS.NO_DATA}
              </p>
            )}
          </section>

          {/* Table View */}
          <section>
            <h2 className="text-2xl font-bold text-white mb-4">
              {MYCOURSES_STRINGS.TABLE_TITLE}
            </h2>
            {filtered.length > 0 ? (
              <CommonTable columns={columns} data={filtered} />
            ) : (
              <p className="text-white">{MYCOURSES_STRINGS.NO_DATA}</p>
            )}
          </section>
        </main>
      </div>
    </div>
  );
};

export default MyCourses;

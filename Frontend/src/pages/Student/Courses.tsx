// src/pages/Student/MyCourses.tsx
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
import CourseCard, { AggregatedCourseAttendance } from "../../components/common/CourseCard";
import CommonButton from "../../components/common/Button";

import courseService, { Course } from "../../services/courseService";
import { MYCOURSES_STRINGS as STR } from "../../constants/student/myCoursesConsts";

const toCourseCardData = (course: Course): AggregatedCourseAttendance => ({
  courseId: course.id,
  courseName: course.name,
  teacher: "TBD",
  totalStudents: 0,
  present: 0,
  updatedAt: "N/A",
  records: [],
});

const MyCourses: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [courses, setCourses] = useState<Course[]>([]);
  const [search, setSearch] = useState("");

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);

    const sid = Number(sessionStorage.getItem("userId") ?? 0);
    if (!sid) {
      setError(STR.ERROR_NO_USER_ID);
      setLoading(false);
      return;
    }

    try {
      let assigns = await courseService.getAllCourseAssigns();
      assigns = assigns.filter(a => a.userId === sid);
      const list: Course[] = [];
      for (const a of assigns) {
        try {
          list.push(await courseService.getById(a.courseId));
        } catch {
          // skip
        }
      }
      setCourses(list);
    } catch (e) {
      console.error(e);
      setError(STR.ERROR_FETCH_ASSIGNMENTS);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    return courses.filter(c =>
      c.name.toLowerCase().includes(q) ||
      c.code.toLowerCase().includes(q)
    );
  }, [courses, search]);

  const columns: Column<Course>[] = useMemo(() => [
    { header: "Code", accessor: "code" },
    { header: "Name", accessor: "name" },
    { header: "Credits", accessor: r => String(r.credits) },
    { header: "Duration", accessor: r => String(r.duration) },
  ], []);

  return (
    <div className="min-h-screen flex bg-gray-900 text-white">
      <Sidebar />
      <div className="ml-64 flex-1 flex flex-col overflow-x-auto">
        <Navbar />
        <main className="p-6 space-y-8">
          {/* Page Title & Refresh */}
          <div className="flex items-center justify-between">
            <h1 className="text-3xl font-bold">
              {STR.PAGE_TITLE}
            </h1>
            <CommonButton
              size="md"
              variant="primary"
              label={STR.BTN_REFRESH}
              onClick={fetchData}
              isLoading={loading}
            />
          </div>

          {/* Search */}
          <div className="flex gap-4 mb-6">
            <input
              type="text"
              placeholder={STR.SEARCH_PLACEHOLDER}
              value={search}
              onChange={(e: ChangeEvent<HTMLInputElement>) => setSearch(e.target.value)}
              className="flex-grow px-4 py-2 bg-gray-800 border border-indigo-500 rounded-lg focus:outline-none text-white"
            />
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

          {/* Course Cards */}
          <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.length > 0 ? (
              filtered.map(c => (
                <CourseCard
                  key={c.id}
                  course={toCourseCardData(c)}
                  onClick={() => {}}
                />
              ))
            ) : (
              <p className="col-span-full text-center text-gray-400">
                {STR.NO_DATA}
              </p>
            )}
          </section>

          {/* Table View */}
          <section>
            <h2 className="text-2xl font-semibold mb-4">
              {STR.TABLE_TITLE}
            </h2>
            <CommonTable
              columns={columns}
              data={filtered.map(c => ({ ...c, id: c.id }))}
              loading={loading}
              noDataMessage={STR.NO_DATA}
            />
          </section>
        </main>
      </div>
    </div>
  );
};

export default React.memo(MyCourses);

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
import CommonButton from "../../components/common/Button";

// Services
import courseService, {
  CourseAssign,
  Course,
} from "../../services/courseService";

// Strings
import { TEACHER_COURSES_STRINGS as STR } from "../../constants/teacher/teacherCoursesConsts";

const Courses: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [courses, setCourses] = useState<Course[]>([]);

  const fetchCourses = useCallback(async () => {
    setLoading(true);
    setError(null);

    const tidStr = sessionStorage.getItem("userId");
    if (!tidStr) {
      setError(STR.ERROR_NO_TEACHER_ID);
      setLoading(false);
      return;
    }
    const tid = Number(tidStr);

    let assigns: CourseAssign[];
    try {
      assigns = await courseService.getAllCourseAssigns();
      assigns = assigns.filter((a) => a.userId === tid);
    } catch (e) {
      console.error(e);
      setError(STR.ERROR_FETCH_ASSIGNMENTS);
      setLoading(false);
      return;
    }

    const list: Course[] = [];
    for (const a of assigns) {
      try {
        const c = await courseService.getById(a.courseId);
        list.push(c);
      } catch {
        // skip on error
      }
    }
    setCourses(list);
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchCourses();
  }, [fetchCourses]);

  // search/filter
  const [search, setSearch] = useState("");
  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    return courses.filter(
      (c) =>
        c.name.toLowerCase().includes(q) ||
        c.code.toLowerCase().includes(q)
    );
  }, [courses, search]);

  // table columns
  const columns: Column<Course>[] = useMemo(
    () => [
      { header: STR.COL_CODE, accessor: "code" },
      { header: STR.COL_NAME, accessor: "name" },
      {
        header: STR.COL_CREDITS,
        accessor: (r) => String(r.credits),
      },
      {
        header: STR.COL_DURATION,
        accessor: (r) => String(r.duration),
      },
    ],
    []
  );

  // pie chart for credits
  const pieData = useMemo(
    () => ({
      labels: filtered.map((c) => c.name),
      datasets: [
        {
          label: STR.CHART_LABEL,
          data: filtered.map((c) => c.credits),
        },
      ],
    }),
    [filtered]
  );
  const pieOpts = useMemo(
    () => ({
      responsive: true,
      plugins: {
        legend: { position: "top" as const, labels: { color: "white" } },
        title: {
          display: true,
          text: STR.CHART_TITLE,
          color: "white",
        },
      },
    }),
    []
  );

  return (
    <div className="min-h-screen flex bg-gray-900 text-white">
      <Sidebar />
      <div className="ml-64 flex-1 flex flex-col">
        <Navbar />
        <main className="p-6 space-y-8 overflow-x-auto">

          {/* Header */}
          <div className="flex justify-between items-center">
            <h1 className="text-3xl font-bold">{STR.PAGE_HEADING}</h1>
            <div className="flex space-x-4">
              <input
                type="text"
                placeholder={STR.SEARCH_PLACEHOLDER}
                value={search}
                onChange={(e: ChangeEvent<HTMLInputElement>) =>
                  setSearch(e.target.value)
                }
                className="px-4 py-2 bg-gray-800 border border-indigo-500 rounded focus:outline-none text-white"
              />
              <CommonButton
                size="md"
                variant="primary"
                label={STR.BTN_REFRESH}
                onClick={fetchCourses}
                isLoading={loading}
              />
            </div>
          </div>

          {/* Error */}
          {error && (
            <div className="p-4 bg-red-600 rounded">{error}</div>
          )}

          {/* Credits Distribution */}
          <section className="bg-gray-800 p-4 rounded-lg shadow">
            <Chart type="pie" data={pieData} options={pieOpts} loading={loading} />
          </section>

          {/* Course Cards */}
          <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.length > 0 ? (
              filtered.map((c) => (
                <Card
                  key={c.id}
                  title={c.name}
                  value={`${c.credits} ${STR.CREDITS_LABEL}`}
                  icon="📘"
                  loading={loading}
                >
                  <p className="text-gray-300 mt-2">{c.description}</p>
                </Card>
              ))
            ) : (
              <p className="col-span-full text-center text-gray-400">
                {STR.NO_COURSES}
              </p>
            )}
          </section>

          {/* Course Table */}
          <section>
            <h2 className="text-2xl font-semibold mb-4">{STR.TABLE_TITLE}</h2>
            <div className="bg-gray-800 p-4 rounded-lg shadow">
              <CommonTable
                columns={columns}
                data={filtered}
                loading={loading}
                noDataMessage={STR.NO_COURSES}
              />
            </div>
          </section>

        </main>
      </div>
    </div>
  );
};

export default React.memo(Courses);

// src/pages/Admin/AttendanceManagement.tsx
import React, {
  useState,
  useEffect,
  useMemo,
  ChangeEvent,
  KeyboardEvent,
  FormEvent,
} from "react";
import { Search, X, Edit3, Trash2 } from "lucide-react";
import Sidebar from "../../components/common/Sidebar";
import Navbar from "../../components/common/Navbar";
import CommonButton from "../../components/common/Button";
import CourseCard, { AggregatedCourseAttendance } from "../../components/common/CourseCard";
import Chart from "../../components/common/Chart";
import attendanceService, { Attendance } from "../../services/attendanceService";
import {
  ATTENDANCE_HEADING,
  ATTENDANCE_SEARCH_PLACEHOLDER,
  ATTENDANCE_DELETE_BUTTON_LABEL,
  COURSE_CHART_TITLE,
  COURSE_POPUP_HEADING,
  COURSE_POPUP_CLOSE_BUTTON_LABEL,
} from "../../constants/admin/attendanceManagementStrings";
import {
  FETCH_ATTENDANCE_EXCEPTION,
  DELETE_ATTENDANCE_EXCEPTION,
  UPDATE_ATTENDANCE_EXCEPTION,
} from "../../constants/exceptionMessages";

const AttendanceManagement: React.FC = () => {
  // all raw attendance records
  const [records, setRecords] = useState<Attendance[]>([]);
  const [success, setSuccess] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState("");

  // which course we’re inspecting
  const [selectedCourse, setSelectedCourse] = useState<AggregatedCourseAttendance | null>(null);

  // which record is being edited (in slide-over)
  const [editingRecord, setEditingRecord] = useState<Attendance | null>(null);
  const [editStatus, setEditStatus] = useState<string>("");

  // load all records on mount / refresh
  const fetchAll = async () => {
    setError(null);
    try {
      const data = await attendanceService.getAll();
      setRecords(data);
    } catch (e) {
      console.error(e);
      setError(FETCH_ATTENDANCE_EXCEPTION);
    }
  };
  useEffect(() => {
    fetchAll();
  }, []);

  // search / filter
  const filtered = useMemo(
    () =>
      records.filter((r) =>
        `${r.date} ${r.status}`
          .toLowerCase()
          .includes(search.toLowerCase())
      ),
    [records, search]
  );

  const handleSearch = (e: ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
  };
  const clearSearch = () => setSearch("");

  // group by course
  const courses = useMemo(() => {
    const map = new Map<number, Attendance[]>();
    filtered.forEach((r) => {
      const arr = map.get(r.courseId) || [];
      arr.push(r);
      map.set(r.courseId, arr);
    });
    return Array.from(map.entries()).map(([courseId, recs]) => {
      const presentCount = recs.filter((r) => r.status === "Present").length;
      const studentCount = new Set(recs.map((r) => r.userId)).size;
      return {
        courseId,
        courseName: `Course ${courseId}`,
        teacher: "—",          // you can look up teacher later if you have that assign service
        totalStudents: studentCount,
        present: presentCount,
        updatedAt: new Date().toLocaleTimeString(),
        records: recs,
      } as AggregatedCourseAttendance;
    });
  }, [filtered]);

  // chart data
  const chartData = useMemo(
    () => ({
      labels: courses.map((c) => c.courseName),
      datasets: [
        {
          label: "Present",
          data: courses.map((c) => c.present),
        },
      ],
    }),
    [courses]
  );

  // remove one attendance
  const handleDeleteRecord = async (id: number) => {
    if (!confirm("Delete this record?")) return;
    try {
      await attendanceService.unMarkAttendance(id);
      setSuccess("Record deleted");
      fetchAll();
    } catch (e) {
      console.error(e);
      setError(DELETE_ATTENDANCE_EXCEPTION);
    }
  };

  // open slide-over on a particular record
  const openEdit = (rec: Attendance) => {
    setEditingRecord(rec);
    setEditStatus(rec.status);
    setError(null);
    setSuccess(null);
  };
  const closeEdit = () => {
    setEditingRecord(null);
  };

  // save updated status
  const saveEdit = async (e: FormEvent) => {
    e.preventDefault();
    if (!editingRecord) return;
    try {
      await attendanceService.updateAttendance(editingRecord.id, { status: editStatus });
      setSuccess("Updated successfully");
      closeEdit();
      fetchAll();
    } catch (e) {
      console.error(e);
      setError(UPDATE_ATTENDANCE_EXCEPTION);
    }
  };

  // escape closes slide-over
  const onKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    if (e.key === "Escape") closeEdit();
  };

  return (
    <div className="min-h-screen flex bg-gradient-to-br from-gray-900 to-black text-white">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <Navbar />

        <main className="p-8 space-y-6">
          {/* Header */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center">
            <h1 className="text-3xl font-bold">{ATTENDANCE_HEADING}</h1>
            <div className="flex items-center mt-4 sm:mt-0 space-x-2">
              <div className="relative">
                <Search className="absolute inset-y-0 left-0 pl-3 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  placeholder={ATTENDANCE_SEARCH_PLACEHOLDER}
                  value={search}
                  onChange={handleSearch}
                  className="pl-10 pr-3 py-2 bg-gray-800 border border-indigo-500 rounded-l-md focus:outline-none text-white"
                />
              </div>
              {search && (
                <CommonButton
                  size="sm"
                  variant="secondary"
                  leftIcon={<X />}
                  label="Clear"
                  onClick={clearSearch}
                />
              )}
            </div>
          </div>

          {/* Alerts */}
          {(error || success) && (
            <div
              className={`p-4 rounded text-white ${
                error ? "bg-red-600" : "bg-green-600"
              }`}
            >
              {error ?? success}
            </div>
          )}

          {/* Course Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {courses.length > 0 ? (
              courses.map((c) => (
                <CourseCard
                  key={c.courseId}
                  course={c}
                  onClick={() => setSelectedCourse(c)}
                />
              ))
            ) : (
              <p className="col-span-full text-center">No attendance records found</p>
            )}
          </div>

          {/* Bar Chart */}
          {courses.length > 0 && (
            <section>
              <h2 className="text-2xl font-semibold mb-4">{COURSE_CHART_TITLE}</h2>
              <div className="bg-gray-800 p-4 rounded-lg">
                <Chart type="bar" data={chartData} options={{}} />
              </div>
            </section>
          )}

          {/* Drill-in Slide-over for a course */}
          {selectedCourse && (
            <div
              className="fixed inset-0 flex z-50"
              onKeyDown={onKeyDown}
              tabIndex={0}
            >
              <button
                className="absolute inset-0 bg-black bg-opacity-70"
                onClick={() => setSelectedCourse(null)}
                aria-label="Close"
              />
              <aside className="relative ml-auto w-full max-w-md h-full bg-gray-800 p-6 shadow-xl overflow-auto">
                <h2 className="text-2xl font-semibold mb-4">
                  {COURSE_POPUP_HEADING}: {selectedCourse.courseName}
                </h2>
                <button
                  onClick={() => setSelectedCourse(null)}
                  aria-label="Close"
                  className="absolute top-4 right-4 p-2 bg-gray-700 rounded-full hover:bg-gray-600"
                >
                  <X className="h-5 w-5 text-gray-300" />
                </button>

                <div className="space-y-4">
                  {selectedCourse.records.map((r) => (
                    <div
                      key={r.id}
                      className="flex items-center justify-between bg-gray-700 p-2 rounded"
                    >
                      <span className="flex-1">
                        {r.date} — User {r.userId} ({r.status})
                      </span>
                      <CommonButton
                        size="sm"
                        variant="primary"
                        leftIcon={<Edit3 />}
                        label="Edit"
                        onClick={() => openEdit(r)}
                      />
                      <CommonButton
                        size="sm"
                        variant="danger"
                        leftIcon={<Trash2 />}
                        label={ATTENDANCE_DELETE_BUTTON_LABEL}
                        onClick={() => handleDeleteRecord(r.id)}
                      />
                    </div>
                  ))}
                </div>
                <CommonButton
                  size="sm"
                  variant="secondary"
                  label={COURSE_POPUP_CLOSE_BUTTON_LABEL}
                  onClick={() => setSelectedCourse(null)}
                  className="mt-4"
                />
              </aside>
            </div>
          )}

          {/* Slide-over for record edit */}
          {editingRecord && (
            <div
              className="fixed inset-0 flex z-60"
              onKeyDown={onKeyDown}
              tabIndex={0}
            >
              <button
                className="absolute inset-0 bg-black bg-opacity-70"
                onClick={closeEdit}
                aria-label="Close edit"
              />
              <aside className="relative ml-auto w-full max-w-md h-full bg-gray-800 p-6 shadow-xl">
                <h3 className="text-2xl font-semibold mb-4">
                  Edit Attendance
                </h3>
                <button
                  onClick={closeEdit}
                  aria-label="Close"
                  className="absolute top-4 right-4 p-2 bg-gray-700 rounded-full hover:bg-gray-600"
                >
                  <X className="h-5 w-5 text-gray-300" />
                </button>

                <form onSubmit={saveEdit} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-200 mb-1">
                      Date
                    </label>
                    <input
                      type="date"
                      value={editingRecord.date}
                      disabled
                      className="w-full px-3 py-2 bg-gray-700 border border-indigo-500 rounded text-gray-400"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-200 mb-1">
                      Course ID
                    </label>
                    <input
                      type="number"
                      value={editingRecord.courseId}
                      disabled
                      className="w-full px-3 py-2 bg-gray-700 border border-indigo-500 rounded text-gray-400"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-200 mb-1">
                      Status
                    </label>
                    <select
                      value={editStatus}
                      onChange={(e) => setEditStatus(e.target.value)}
                      className="w-full px-3 py-2 bg-gray-700 border border-indigo-500 rounded text-white"
                    >
                      <option value="Present">Present</option>
                      <option value="Absent">Absent</option>
                    </select>
                  </div>
                  <div className="flex justify-end space-x-2">
                    <CommonButton
                      size="sm"
                      label="Cancel"
                      onClick={closeEdit}
                    />
                      isLoading={saving}
                      variant="primary"
                    />
                  </div>
                </form>
              </aside>
            </div>
          )}
              </aside>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};
export default React.memo(AttendanceManagement);

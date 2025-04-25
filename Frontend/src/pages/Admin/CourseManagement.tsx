// src/pages/Admin/CourseManagement.tsx
import React, {
  useState,
  useEffect,
  useMemo,
  ChangeEvent,
  KeyboardEvent,
} from "react";
import { useNavigate } from "react-router-dom";
import { Plus, Search, X, Edit3, Trash2 } from "lucide-react";
import Sidebar from "../../components/common/Sidebar";
import Navbar from "../../components/common/Navbar";
import CommonTable, { Column } from "../../components/common/Table";
import CommonButton from "../../components/common/Button";
import courseService, { Course, CourseAssign } from "../../services/courseService";
import userService, { User } from "../../services/userService";
import {
  COURSE_MANAGEMENT_HEADING,
  COURSE_SEARCH_PLACEHOLDER,
  COURSE_ADD_BUTTON_LABEL,
  COURSE_SAVE_BUTTON_LABEL,
  COURSE_CANCEL_BUTTON_LABEL,
} from "../../constants/admin/courseManagementStrings";
import {
  FETCH_COURSES_EXCEPTION,
  UPDATE_COURSE_EXCEPTION,
  DELETE_COURSE_EXCEPTION,
} from "../../constants/exceptionMessages";

type CourseFormData = Omit<Course, "id"> & { teacherId: number };

const CourseManagement: React.FC = () => {
  const navigate = useNavigate();

  const [courses, setCourses] = useState<Course[]>([]);
  const [assigns, setAssigns] = useState<CourseAssign[]>([]);
  const [teachers, setTeachers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");

  const [modalOpen, setModalOpen] = useState(false);
  const [editId, setEditId] = useState<number | null>(null);
  const [form, setForm] = useState<CourseFormData>({
    code: "",
    name: "",
    credits: 0,
    duration: 0,
    description: "",
    teacherId: 0,
  });

  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // load courses, assigns, and teachers
  useEffect(() => {
    (async () => {
      setLoading(true);
      setError(null);
      try {
        const [courseData, assignData, userData] = await Promise.all([
          courseService.getAll(),
          courseService.getAllCourseAssigns(),
          userService.getAll(),
        ]);
        setCourses(courseData);
        setAssigns(assignData);
        setTeachers(userData.filter((u) => u.role === "TEACHER"));
      } catch (e) {
        console.error(e);
        setError(FETCH_COURSES_EXCEPTION);
      }
      setLoading(false);
    })();
  }, []);

  // search handlers
  const handleSearch = (e: ChangeEvent<HTMLInputElement>) =>
    setSearch(e.target.value);
  const clearSearch = () => setSearch("");

  // filtered list
  const filtered = useMemo(
    () =>
      courses.filter((c) =>
        [c.code, c.name, c.description]
          .some((f) => f.toLowerCase().includes(search.toLowerCase()))
      ),
    [courses, search]
  );

  // table columns
  const columns: Column<Course>[] = useMemo(
    () => [
      { header: "ID", accessor: "id" },
      { header: "Code", accessor: "code" },
      { header: "Name", accessor: "name" },
      { header: "Credits", accessor: "credits" },
      { header: "Duration", accessor: (r) => `${r.duration}h` },
      {
        header: "Teacher",
        accessor: (r) => {
          const a = assigns.find((as) => as.courseId === r.id);
          const t = teachers.find((u) => u.id === a?.userId);
          return t?.username ?? "-";
        },
      },
      {
        header: "Actions",
        accessor: (r) => (
          <div className="flex space-x-2">
            <CommonButton
              size="sm"
              variant="primary"
              leftIcon={<Edit3 />}
              label="Edit"
              onClick={() => openModal(r)}
            />
            <CommonButton
              size="sm"
              variant="danger"
              leftIcon={<Trash2 />}
              label="Delete"
              onClick={() => handleDelete(r.id)}
            />
          </div>
        ),
      },
    ],
    [assigns, teachers]
  );

  const openModal = (course: Course) => {
    // populate form + current teacher assignment
    const assign = assigns.find((as) => as.courseId === course.id);
    setForm({
      code: course.code,
      name: course.name,
      credits: course.credits,
      duration: course.duration,
      description: course.description,
      teacherId: assign?.userId ?? 0,
    });
    setEditId(course.id);
    setError(null);
    setSuccess(null);
    setModalOpen(true);
  };
  const closeModal = () => {
    setModalOpen(false);
    setEditId(null);
  };

  const handleFormChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]:
          name === "credits" || name === "duration" || name === "teacherId"
            ? Number(value)
            : value,
    }));
    setError(null);
    setSuccess(null);
  };

  const handleSave = async () => {
    if (editId == null) return;
    setError(null);
    try {
      // 1) update course fields
      await courseService.update(editId, {
        code: form.code,
        name: form.name,
        credits: form.credits,
        duration: form.duration,
        description: form.description,
      });

      // 2) update or create courseAssign for this course
      const existing = assigns.find((a) => a.courseId === editId);
      if (existing) {
        await courseService.updateCourseAssign(existing.id, {
          userId: form.teacherId,
        });
      } else {
        await courseService.createCourseAssign({
          courseId: editId,
          userId: form.teacherId,
          role: "Teacher",
        });
      }

      // refresh both lists
      const [newCourses, newAssigns] = await Promise.all([
        courseService.getAll(),
        courseService.getAllCourseAssigns(),
      ]);
      setCourses(newCourses);
      setAssigns(newAssigns);

      setSuccess("Updated successfully");
      closeModal();
    } catch (e) {
      console.error(e);
      setError(UPDATE_COURSE_EXCEPTION);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Delete this course?")) return;
    setError(null);
    try {
      await courseService.delete(id);
      setCourses((prev) => prev.filter((c) => c.id !== id));
      setSuccess("Deleted successfully");
    } catch {
      setError(DELETE_COURSE_EXCEPTION);
    }
  };

  const handleCancel = () => {
    if (editId != null) {
      const orig = courses.find((c) => c.id === editId)!;
      openModal(orig);
    }
  };

  const onKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    if (e.key === "Escape") closeModal();
  };

  return (
    <div className="min-h-screen flex bg-gray-900 text-white">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <Navbar />

        <main className="p-6 space-y-8">
          {/* Header */}
          <div className="flex flex-col sm:flex-row justify-between items-center">
            <h1 className="text-3xl font-bold">{COURSE_MANAGEMENT_HEADING}</h1>
            <div className="flex mt-4 sm:mt-0 space-x-2">
              <div className="relative">
                <Search className="absolute inset-y-0 left-0 pl-3 h-11 w-7 text-gray-400" />
                <input
                  type="text"
                  placeholder={COURSE_SEARCH_PLACEHOLDER}
                  value={search}
                  onChange={handleSearch}
                  className="pl-10 pr-3 py-2 bg-gray-800 border border-indigo-500 rounded-l-md focus:outline-none focus:ring focus:ring-indigo-500 text-white"
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
              <CommonButton
                size="md"
                variant="primary"
                leftIcon={<Plus />}
                label={COURSE_ADD_BUTTON_LABEL}
                onClick={() => navigate("/admin/add-course")}
              />
            </div>
          </div>

          {/* Alerts */}
          {(error || success) && (
            <div
              className={`p-4 rounded text-white ${
                error ? "bg-red-600" : "bg-green-600"
              }`}
              role="alert"
            >
              {error ?? success}
            </div>
          )}

          {/* Table */}
          <div className="bg-gray-800 rounded-lg shadow overflow-auto">
            <CommonTable
              columns={columns}
              data={filtered}
              loading={loading}
              initialSortColumn="name"
              initialSortDirection="asc"
            />
          </div>

          {/* Slide-over Modal */}
          {modalOpen && (
            <div className="fixed inset-0 flex z-50">
              <button
                className="absolute inset-0 bg-black bg-opacity-70"
                onClick={closeModal}
                aria-label="Close course details"
              />
              <aside
                className="relative ml-auto w-full max-w-md h-full bg-gray-800 p-6 shadow-xl transform transition-transform duration-300 ease-out"
                onKeyDown={onKeyDown}
                tabIndex={0}
              >
                <h2 className="text-2xl font-semibold mb-4">
                  {editId ? "Edit Course" : "Add Course"}
                </h2>
                <button
                  onClick={closeModal}
                  aria-label="Close"
                  className="absolute top-4 right-4 p-2 bg-gray-700 rounded-full hover:bg-gray-600 focus:outline-none focus:ring focus:ring-indigo-500"
                >
                  <X className="h-5 w-5 text-gray-300" />
                </button>

                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    handleSave();
                  }}
                  className="space-y-4"
                >
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {["code", "name"].map((f) => (
                      <div key={f}>
                        <label
                          htmlFor={f}
                          className="block text-sm font-medium text-gray-200 mb-1 capitalize"
                        >
                          {f}
                        </label>
                        <input
                          id={f}
                          name={f}
                          value={form[f as keyof CourseFormData]}
                          onChange={handleFormChange}
                          required
                          className="w-full px-3 py-2 bg-gray-700 border border-indigo-500 rounded focus:outline-none focus:ring focus:ring-indigo-500 text-white"
                        />
                      </div>
                    ))}
                    {["credits", "duration"].map((f) => (
                      <div key={f}>
                        <label
                          htmlFor={f}
                          className="block text-sm font-medium text-gray-200 mb-1 capitalize"
                        >
                          {f}
                        </label>
                        <input
                          id={f}
                          name={f}
                          type="number"
                          min={0}
                          value={form[f as 'credits' | 'duration']}
                          onChange={handleFormChange}
                          required
                          className="w-full px-3 py-2 bg-gray-700 border border-indigo-500 rounded focus:outline-none focus:ring focus:ring-indigo-500 text-white"
                        />
                      </div>
                    ))}
                  </div>

                  <div>
                    <label
                      htmlFor="description"
                      className="block text-sm font-medium text-gray-200 mb-1"
                    >
                      Description
                    </label>
                    <textarea
                      id="description"
                      name="description"
                      value={form.description}
                      onChange={handleFormChange}
                      required
                      className="w-full px-3 py-2 bg-gray-700 border border-indigo-500 rounded focus:outline-none focus:ring focus:ring-indigo-500 text-white"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="teacherId"
                      className="block text-sm font-medium text-gray-200 mb-1"
                    >
                      Assign Teacher
                    </label>
                    <select
                      id="teacherId"
                      name="teacherId"
                      value={form.teacherId}
                      onChange={handleFormChange}
                      required
                      className="w-full px-3 py-2 bg-gray-700 border border-indigo-500 rounded focus:outline-none focus:ring focus:ring-indigo-500 text-white"
                    >
                      <option value="">Select Teacher</option>
                      {teachers.map((t) => (
                        <option key={t.id} value={t.id}>
                          {t.username}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="flex justify-end space-x-3">
                    <CommonButton
                      size="sm"
                      variant="secondary"
                      label={COURSE_CANCEL_BUTTON_LABEL}
                      onClick={() => {
                        handleCancel();
                        closeModal();
                      }}
                    />
                    <CommonButton
                      size="sm"
                      variant="primary"
                      label={COURSE_SAVE_BUTTON_LABEL}
                      onClick={handleSave}
                    />
                  </div>
                </form>
              </aside>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default React.memo(CourseManagement);

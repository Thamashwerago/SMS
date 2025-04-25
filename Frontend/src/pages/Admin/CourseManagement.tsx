import React, { useState, useEffect, useMemo, ChangeEvent, KeyboardEvent } from "react";
import { useNavigate } from "react-router-dom";
import { Plus, Search, X, Edit3, Trash2 } from "lucide-react";
import Sidebar from "../../components/common/Sidebar";
import Navbar from "../../components/common/Navbar";
import CommonTable, { Column } from "../../components/common/Table";
import CommonButton from "../../components/common/Button";
import courseService, { Course } from "../../services/courseService";
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

/** Type for editable course form */
type CourseFormData = Omit<Course, 'id'>;

const CourseManagement: React.FC = () => {
  const navigate = useNavigate();
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [search, setSearch] = useState<string>("");
  const [modalOpen, setModalOpen] = useState<boolean>(false);
  const [editId, setEditId] = useState<number | null>(null);
  const [form, setForm] = useState<CourseFormData>({ code: '', name: '', credits: 0, duration: 0, description: '' });
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // load courses
  useEffect(() => {
    (async () => {
      setLoading(true); setError(null);
      try {
        const data = await courseService.getAll();
        setCourses(data);
      } catch (e) {
        console.error(e);
        setError(FETCH_COURSES_EXCEPTION);
      }
      setLoading(false);
    })();
  }, []);

  // search handling
  const handleSearch = (e: ChangeEvent<HTMLInputElement>) => setSearch(e.target.value);
  const clearSearch = () => setSearch("");

  // filter
  const filtered = useMemo(() => courses.filter(c =>
    [c.code, c.name, c.description]
      .some(f => f.toLowerCase().includes(search.toLowerCase()))
  ), [courses, search]);

  // table columns
  const columns: Column<Course>[] = useMemo(() => [
    { header: 'ID', accessor: 'id' },
    { header: 'Code', accessor: 'code' },
    { header: 'Name', accessor: 'name' },
    { header: 'Credits', accessor: 'credits' },
    { header: 'Duration', accessor: row => `${row.duration}h` },
    { header: 'Description', accessor: 'description' },
    {
      header: 'Actions', accessor: row => (
        <div className="flex space-x-2">
          <CommonButton size="sm" variant="primary" label="Edit" leftIcon={<Edit3 />} onClick={() => openModal(row)} />
          <CommonButton size="sm" variant="danger" label="Delete" leftIcon={<Trash2 />} onClick={() => handleDelete(row.id)} />
        </div>
      )
    }
  ], []);

  const openModal = (course: Course) => {
    setForm({ ...course }); setEditId(course.id); setModalOpen(true);
    setError(null); setSuccess(null);
  };
  const closeModal = () => { setModalOpen(false); setEditId(null); };

  const handleFormChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setForm(prev => ({
      ...prev,
      [name]: name === 'credits' || name === 'duration' ? Number(value) : value
    }));
    setError(null); setSuccess(null);
  };

  const handleSave = async () => {
    if (editId === null) return;
    setError(null);
    try {
      await courseService.update(editId, form);
      setSuccess('Updated successfully');
      const data = await courseService.getAll(); setCourses(data);
      closeModal();
    } catch (e) {
      console.error(e);
      setError(UPDATE_COURSE_EXCEPTION);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Delete this course?')) return;
    setError(null);
    try {
      await courseService.delete(id);
      setSuccess('Deleted successfully');
      setCourses(prev => prev.filter(c => c.id !== id));
    } catch (e) {
      console.error(e);
      setError(DELETE_COURSE_EXCEPTION);
    }
  };

  const handleCancel = () => {
    if (editId !== null) {
      const orig = courses.find(c => c.id === editId);
      if (orig) setForm({ ...orig });
    }
  };

  // keydown for modal
  const onKeyDown = (e: KeyboardEvent<HTMLDivElement>) => { if (e.key === 'Escape') closeModal(); };

  return (
    <div className="min-h-screen bg-gray-900 text-white flex">
      <Sidebar />
      <div className="ml-64 flex-1 flex flex-col">
        <Navbar />
        <main className="flex-1 p-6 space-y-8 overflow-hidden">
          {/* Header */}
          <div className="flex flex-col sm:flex-row justify-between items-center">
            <h1 className="text-4xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-blue-500">
              {COURSE_MANAGEMENT_HEADING}
            </h1>
            <div className="flex mt-4 sm:mt-0 space-x-2">
              <div className="relative">
                <Search className="absolute inset-y-0 left-0 pl-3 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  placeholder={COURSE_SEARCH_PLACEHOLDER}
                  value={search}
                  onChange={handleSearch}
                  className="pl-10 pr-3 py-2 bg-gray-800 border border-indigo-500 rounded-l-md focus:outline-none focus:ring-indigo-500 text-white"
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

          {(error ?? success) && (
            <div
              className={`p-3 rounded-md ${error ? "bg-red-600" : "bg-green-600"} text-white`}
            >
              {error ?? success}
            </div>
          )}

          <div className="w-full overflow-x-auto rounded-lg border border-indigo-500 bg-black bg-opacity-50">
            <CommonTable
              columns={columns}
              data={filtered}
              loading={loading}
              initialSortColumn="name"
              initialSortDirection="asc"
            />
          </div>

          {/* Modal */}
          {modalOpen && (
            <div
              className="fixed inset-0 flex z-50"
              onKeyDown={onKeyDown}
              tabIndex={-1}
            >
              <div
                className="absolute inset-0 bg-black bg-opacity-70"
                onClick={closeModal}
              />
              <aside
                className="relative ml-auto w-full max-w-lg h-full bg-gray-800 p-6 shadow-lg transform transition-transform duration-300 ease-out"
                role="dialog"
                aria-modal="true"
              >
                <button
                  onClick={closeModal}
                  aria-label="Close"
                  className="absolute top-4 right-4 p-2 bg-gray-700 rounded-full hover:bg-gray-600 focus:outline-none focus:ring focus:ring-indigo-500"
                >
                  <X className="h-5 w-5 text-gray-300" />
                </button>
                <h2 className="text-2xl font-bold mb-4">Edit Course</h2>
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    handleSave();
                  }}
                  className="space-y-4"
                >
                  {/* Code & Name */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {["code", "name"].map((field) => (
                      <div key={field}>
                        <label
                          htmlFor={field}
                          className="block mb-1 text-gray-200 capitalize"
                        >
                          {field}
                        </label>
                        <input
                          id={field}
                          name={field}
                          value={form[field as keyof CourseFormData]}
                          onChange={handleFormChange}
                          className="w-full px-3 py-2 bg-gray-700 border border-indigo-500 rounded focus:outline-none focus:ring focus:ring-indigo-500 text-white"
                          required
                        />
                      </div>
                    ))}
                    {["credits", "duration"].map((field) => (
                      <div key={field}>
                        <label
                          htmlFor={field}
                          className="block mb-1 text-gray-200 capitalize"
                        >
                          {field}
                        </label>
                        <input
                          id={field}
                          name={field}
                          type="number"
                          min="0"
                          value={form[field as "credits" | "duration"]}
                          onChange={handleFormChange}
                          className="w-full px-3 py-2 bg-gray-700 border border-indigo-500 rounded focus:outline-none focus:ring focus:ring-indigo-500 text-white"
                          required
                        />
                      </div>
                    ))}
                  </div>
                  {/* Description */}
                  <div>
                    <label
                      htmlFor="description"
                      className="block mb-1 text-gray-200"
                    >
                      Description
                    </label>
                    <textarea
                      id="description"
                      name="description"
                      value={form.description}
                      onChange={handleFormChange}
                      className="w-full px-3 py-2 bg-gray-700 border border-indigo-500 rounded focus:outline-none focus:ring focus:ring-indigo-500 text-white"
                      required
                    />
                  </div>
                  {/* Actions */}
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

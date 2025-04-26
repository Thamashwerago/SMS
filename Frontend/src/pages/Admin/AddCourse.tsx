// src/pages/Admin/AddCourse.tsx
import React, { useState, useEffect, ChangeEvent } from "react";
import { ArrowLeft, X } from "lucide-react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../../components/common/Sidebar";
import Navbar from "../../components/common/Navbar";
import CommonButton from "../../components/common/Button";
import courseService, { Course } from "../../services/courseService";
import userService, { User } from "../../services/userService";
import { COURSE_STRINGS } from "../../constants/admin/courseConsts";

interface CourseFormData {
  code: string;
  name: string;
  credits: string;
  duration: string;
  description: string;
  teacherId: number;
}

const initialForm: CourseFormData = {
  code: "",
  name: "",
  credits: "",
  duration: "",
  description: "",
  teacherId: 0,
};

const AddCourse: React.FC = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState<CourseFormData>(initialForm);
  const [lastUpdate, setLastUpdate] = useState<string>(() =>
    new Date().toISOString()
  );
  const [teachers, setTeachers] = useState<User[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const all = await userService.getAll();
        setTeachers(all.filter(u => u.role === "TEACHER"));
      } catch {
        // ignore
      }
    })();
  }, []);

  const handleBack = () => navigate(-1);
  const handleClear = () => {
    setFormData(initialForm);
    setError(null);
    setSuccess(null);
    setLastUpdate(new Date().toISOString());
  };

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === "teacherId" ? Number(value) : value
    }));
    setLastUpdate(new Date().toISOString());
    setError(null);
    setSuccess(null);
  };

  const validateForm = () => {
    const { code, name, credits, duration, description, teacherId } = formData;
    if (!code || !name || !credits || !duration || !description || !teacherId) {
      setError(COURSE_STRINGS.ERROR_VALIDATION);
      return false;
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setSubmitting(true);
    setError(null);
    setSuccess(null);

    try {
      // 1) create course
      const created: Course = await courseService.create({
        code: formData.code,
        name: formData.name,
        credits: Number(formData.credits),
        duration: Number(formData.duration),
        description: formData.description, 
      });
      // 2) assign teacher
      await courseService.createCourseAssign({
        courseId: created.id,
        userId: formData.teacherId,
        role: "TEACHER",
      });
      setSuccess(COURSE_STRINGS.SUCCESS_ADD);
      handleClear();
      setTimeout(() => navigate("/admin/course-management"), 1500);
    } catch {
      setError(COURSE_STRINGS.ERROR_ADD);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex bg-gray-900 text-white">
      <Sidebar />
      <div className="ml-64 flex-1 flex flex-col overflow-hidden">
        <Navbar />

        <main className="p-6 space-y-8">
          {/* Header */}
          <div className="flex items-center justify-between">
            <h1 className="text-3xl font-bold">{COURSE_STRINGS.PAGE_HEADING}</h1>
            <CommonButton
              size="md"
              variant="secondary"
              leftIcon={<ArrowLeft />}
              label="Back"
              onClick={handleBack}
            />
          </div>

          {/* Alerts */}
          {error && (
            <div className="p-4 bg-red-600 rounded text-white">
              {error}
            </div>
          )}
          {success && (
            <div className="p-4 bg-green-600 rounded text-white">
              {success}
            </div>
          )}

          {/* Form Card */}
          <div className="bg-gray-800 rounded-lg shadow p-6 max-w-xl mx-auto">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Code & Name */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block mb-1 font-semibold">
                    {COURSE_STRINGS.LABEL_CODE}
                  </label>
                  <input
                    name="code"
                    value={formData.code}
                    onChange={handleChange}
                    placeholder={COURSE_STRINGS.PLACEHOLDER_CODE}
                    required
                    className="w-full px-4 py-2 bg-gray-700 border border-indigo-500 rounded focus:outline-none focus:ring focus:ring-indigo-500"
                  />
                </div>
                <div>
                  <label className="block mb-1 font-semibold">
                    {COURSE_STRINGS.LABEL_NAME}
                  </label>
                  <input
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder={COURSE_STRINGS.PLACEHOLDER_NAME}
                    required
                    className="w-full px-4 py-2 bg-gray-700 border border-indigo-500 rounded focus:outline-none focus:ring focus:ring-indigo-500"
                  />
                </div>
              </div>

              {/* Credits & Duration */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block mb-1 font-semibold">
                    {COURSE_STRINGS.LABEL_CREDITS}
                  </label>
                  <input
                    name="credits"
                    type="number"
                    min="0"
                    value={formData.credits}
                    onChange={handleChange}
                    placeholder={COURSE_STRINGS.PLACEHOLDER_CREDITS}
                    required
                    className="w-full px-4 py-2 bg-gray-700 border border-indigo-500 rounded focus:outline-none focus:ring focus:ring-indigo-500"
                  />
                </div>
                <div>
                  <label className="block mb-1 font-semibold">
                    {COURSE_STRINGS.LABEL_DURATION}
                  </label>
                  <input
                    name="duration"
                    type="number"
                    min="0"
                    value={formData.duration}
                    onChange={handleChange}
                    placeholder={COURSE_STRINGS.PLACEHOLDER_DURATION}
                    required
                    className="w-full px-4 py-2 bg-gray-700 border border-indigo-500 rounded focus:outline-none focus:ring focus:ring-indigo-500"
                  />
                </div>
              </div>

              {/* Description */}
              <div>
                <label className="block mb-1 font-semibold">
                  {COURSE_STRINGS.LABEL_DESCRIPTION}
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  placeholder={COURSE_STRINGS.PLACEHOLDER_DESCRIPTION}
                  required
                  className="w-full px-4 py-2 bg-gray-700 border border-indigo-500 rounded focus:outline-none focus:ring focus:ring-indigo-500"
                />
              </div>

              {/* Teacher & Last Updated */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="teacherSelect" className="block mb-1 font-semibold">
                    Assign Teacher
                  </label>
                  <select
                    id="teacherSelect"
                    name="teacherId"
                    value={formData.teacherId}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-2 bg-gray-700 border border-indigo-500 rounded focus:outline-none focus:ring focus:ring-indigo-500"
                    aria-label="Select teacher"
                  >
                    <option value="">Select Teacher</option>
                    {teachers.map(t => (
                      <option key={t.id} value={t.id}>
                        {t.username}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label htmlFor="lastUpdated" className="block mb-1 font-semibold">
                    Last Updated
                  </label>
                  <input
                    id="lastUpdated"
                    type="text"
                    value={new Date(lastUpdate).toLocaleString()}
                    disabled
                    className="w-full px-4 py-2 bg-gray-700 border border-indigo-500 rounded text-gray-400"
                    title="Last updated timestamp"
                    aria-label="Last updated timestamp"
                  />
                </div>
              </div>

              {/* Actions */}
              <div className="flex justify-end space-x-4">
                <CommonButton
                  type="button"
                  variant="secondary"
                  size="md"
                  label="Clear"
                  icon={<X />}
                  onClick={handleClear}
                  disabled={submitting}
                />
                <CommonButton
                  type="submit"
                  variant="primary"
                  size="md"
                  label={COURSE_STRINGS.BUTTON_SUBMIT}
                  isLoading={submitting}
                />
              </div>
            </form>
          </div>
        </main>
      </div>
    </div>
  );
};

export default AddCourse;

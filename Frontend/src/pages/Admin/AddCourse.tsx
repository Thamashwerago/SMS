// src/pages/Admin/AddCourse.tsx
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

// Common UI components
import Sidebar from "../../components/common/Sidebar";
import Navbar from "../../components/common/Navbar";
import Card from "../../components/common/Card";
import CommonTable, { Column } from "../../components/common/Table";
import Button from "../../components/common/Button";

// Service for course operations
import courseService, { Course } from "../../services/courseService";

// Extracted string constants
import { COURSE_STRINGS } from "../../constants/admin/courseConsts";

// Form data shape
interface CourseFormData {
  code: string;
  name: string;
  credits: string;
  duration: string;
  description: string;
}

// Table columns for existing courses
const courseColumns: Column<Course>[] = [
  { header: "Code", accessor: "code" },
  { header: "Name", accessor: "name" },
  { header: "Credits", accessor: (row) => String(row.credits) },
  { header: "Duration", accessor: (row) => String(row.duration) },
  { header: "Description", accessor: "description" },
];

const AddCourse: React.FC = () => {
  const navigate = useNavigate();

  // Form state
  const [formData, setFormData] = useState<CourseFormData>({
    code: "",
    name: "",
    credits: "",
    duration: "",
    description: "",
  });

  // Messaging & loading
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // Existing courses list
  const [courses, setCourses] = useState<Course[]>([]);
  const [fetchError, setFetchError] = useState<string | null>(null);

  /**
   * handleChange
   * ------------
   * Updates form fields on input change.
   */
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  /**
   * validateForm
   * ------------
   * Ensures all required form fields are filled.
   */
  const validateForm = (): boolean => {
    const { code, name, credits, duration, description } = formData;
    if (!code || !name || !credits || !duration || !description) {
      setError(COURSE_STRINGS.ERROR_VALIDATION);
      return false;
    }
    return true;
  };

  /**
   * loadCourses
   * -----------
   * Fetches existing courses for display in a table.
   */
  const loadCourses = async () => {
    setFetchError(null);
    try {
      const list = await courseService.getAll();
      setCourses(list);
    } catch (e) {
      console.error(COURSE_STRINGS.ERROR_FETCH, e);
      setFetchError(COURSE_STRINGS.ERROR_FETCH);
    }
  };

  // Load courses on mount
  useEffect(() => {
    loadCourses();
  }, []);

  /**
   * handleSubmit
   * ------------
   * Validates and submits new course to the backend.
   * Clears form and refreshes course list on success.
   */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    // 1. Validation
    if (!validateForm()) return;

    // Prepare data payload
    const payload = {
      code: formData.code,
      name: formData.name,
      credits: Number(formData.credits),
      duration: Number(formData.duration),
      description: formData.description,
    };

    // 2. API call
    setLoading(true);
    try {
      await courseService.create(payload);
      setSuccess(COURSE_STRINGS.SUCCESS_ADD);

      // Clear form
      setFormData({
        code: "",
        name: "",
        credits: "",
        duration: "",
        description: "",
      });

      // Refresh table
      await loadCourses();

      // Navigate after a short delay
      setTimeout(() => navigate("/admin/course-management"), 1500);
    } catch (e) {
      console.error(COURSE_STRINGS.ERROR_ADD, e);
      setError(COURSE_STRINGS.ERROR_ADD);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex font-roboto bg-gradient-to-br from-gray-900 to-black">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <Navbar />
        <main className="p-8">
          {/* Page Heading */}
          <h1 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500 mb-8">
            {COURSE_STRINGS.PAGE_HEADING}
          </h1>

          {/* Form wrapped in Card for consistent styling */}
          <Card
            title={COURSE_STRINGS.PAGE_HEADING}
            value=""
            icon="➕"
            className="mb-8"
          >
            <form onSubmit={handleSubmit} className="space-y-6">
              {error && <p className="text-red-500">{error}</p>}
              {success && <p className="text-green-500">{success}</p>}

              {/* Course Code */}
              <div>
                <label htmlFor="code" className="block text-white mb-2">
                  {COURSE_STRINGS.LABEL_CODE}
                </label>
                <input
                  id="code"
                  name="code"
                  value={formData.code}
                  onChange={handleChange}
                  placeholder={COURSE_STRINGS.PLACEHOLDER_CODE}
                  className="w-full px-4 py-2 bg-gray-800 text-white rounded focus:outline-none"
                />
              </div>

              {/* Course Name */}
              <div>
                <label htmlFor="name" className="block text-white mb-2">
                  {COURSE_STRINGS.LABEL_NAME}
                </label>
                <input
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder={COURSE_STRINGS.PLACEHOLDER_NAME}
                  className="w-full px-4 py-2 bg-gray-800 text-white rounded focus:outline-none"
                />
              </div>

              {/* Credits & Duration in grid */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label htmlFor="credits" className="block text-white mb-2">
                    {COURSE_STRINGS.LABEL_CREDITS}
                  </label>
                  <input
                    id="credits"
                    name="credits"
                    type="number"
                    min="0"
                    value={formData.credits}
                    onChange={handleChange}
                    placeholder={COURSE_STRINGS.PLACEHOLDER_CREDITS}
                    className="w-full px-4 py-2 bg-gray-800 text-white rounded focus:outline-none"
                  />
                </div>
                <div>
                  <label htmlFor="duration" className="block text-white mb-2">
                    {COURSE_STRINGS.LABEL_DURATION}
                  </label>
                  <input
                    id="duration"
                    name="duration"
                    type="number"
                    min="0"
                    value={formData.duration}
                    onChange={handleChange}
                    placeholder={COURSE_STRINGS.PLACEHOLDER_DURATION}
                    className="w-full px-4 py-2 bg-gray-800 text-white rounded focus:outline-none"
                  />
                </div>
              </div>

              {/* Description */}
              <div>
                <label htmlFor="description" className="block text-white mb-2">
                  {COURSE_STRINGS.LABEL_DESCRIPTION}
                </label>
                <textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  placeholder={COURSE_STRINGS.PLACEHOLDER_DESCRIPTION}
                  className="w-full px-4 py-2 bg-gray-800 text-white rounded focus:outline-none"
                />
              </div>

              {/* Submit Button */}
              <div className="flex justify-end">
                <Button
                  label={COURSE_STRINGS.BUTTON_SUBMIT}
                  type="submit"
                  isLoading={loading}
                  variant="primary"
                />
              </div>
            </form>
          </Card>

          {/* Existing Courses Table */}
          <section>
            <h2 className="text-2xl font-bold text-white mb-4">
              {COURSE_STRINGS.TABLE_TITLE}
            </h2>
            {fetchError && <p className="text-red-500">{fetchError}</p>}
            {courses.length ? (
              <CommonTable columns={courseColumns} data={courses} />
            ) : (
              <p className="text-white">{COURSE_STRINGS.NO_DATA}</p>
            )}
          </section>
        </main>
      </div>
    </div>
  );
};

export default AddCourse;

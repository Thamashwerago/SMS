import React, { useState, useEffect, useMemo, ChangeEvent } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../../components/common/Sidebar";
import Navbar from "../../components/common/Navbar";
import CommonTable, { Column } from "../../components/common/Table";
import CommonButton from "../../components/common/Button";
import courseService, { Course } from "../../services/courseService";
import {
  COURSE_MANAGEMENT_HEADING,
  COURSE_SEARCH_PLACEHOLDER,
  COURSE_ADD_BUTTON_LABEL,
  COURSE_EDIT_BUTTON_LABEL,
  COURSE_DELETE_BUTTON_LABEL,
  COURSE_SAVE_BUTTON_LABEL,
  COURSE_CANCEL_BUTTON_LABEL,
} from "../../constants/admin/courseManagementStrings";
import {
  FETCH_COURSES_EXCEPTION,
  UPDATE_COURSE_EXCEPTION,
  DELETE_COURSE_EXCEPTION,
} from "../../constants/exceptionMessages";

/**
 * CourseFormData type represents the editable course fields.
 */
type CourseFormData = Omit<Course, "id">;

/**
 * CourseManagement Component
 * -----------------------------
 * Retrieves course data from the backend via courseService, displays the courses
 * in a searchable and sortable table (using the CommonTable component), and provides
 * functionality to update and delete course records using modals with a reusable form.
 *
 * Exception handling is applied to each backend operation, and literal strings are
 * extracted into separate constants files for maintainability.
 */
const CourseManagement: React.FC = () => {
  const navigate = useNavigate();

  // State for course data.
  const [courses, setCourses] = useState<Course[]>([]);
  // State for search query.
  const [searchQuery, setSearchQuery] = useState("");
  // Modal and editing states.
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCourseId, setEditingCourseId] = useState<number | null>(null);
  const [courseForm, setCourseForm] = useState<CourseFormData>({
    code: "",
    name: "",
    credits: 0,
    duration: 0,
    description: "",
  });
  // State for error and success messages.
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  /**
   * fetchCourses
   * --------------
   * Retrieves course data from the backend using courseService.getAll().
   * Handles exceptions by setting an error message.
   */
  const fetchCourses = async () => {
    try {
      const data = await courseService.getAll();
      setCourses(data);
    } catch (err) {
      console.error("Error fetching courses:", err);
      setError(FETCH_COURSES_EXCEPTION);
    }
  };

  // Fetch courses when the component mounts.
  useEffect(() => {
    fetchCourses();
  }, []);

  /**
   * handleSearchChange
   * ------------------
   * Updates the search query as the user types.
   * @param e - The input change event.
   */
  const handleSearchChange = (e: ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  /**
   * filteredCourses
   * ----------------
   * Filters the courses based on the search query.
   */
  const filteredCourses = useMemo(() => {
    return courses.filter(
      (course) =>
        course.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        course.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        course.code.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [courses, searchQuery]);

  /**
   * columns
   * -------
   * Defines the columns for the CommonTable component, including a custom cell for actions.
   */
  const columns: Column<Course>[] = useMemo(
    () => [
      { header: "ID", accessor: "id" },
      { header: "Code", accessor: "code" },
      { header: "Name", accessor: "name" },
      { header: "Credits", accessor: "credits" },
      {
        header: "Duration",
        accessor: (row: Course) => `${row.duration} hours`,
      },
      { header: "Description", accessor: "description" },
      {
        header: "Actions",
        accessor: (row: Course) => (
          <div className="flex space-x-2">
            <CommonButton
              label={COURSE_EDIT_BUTTON_LABEL}
              onClick={() => openEditModal(row)}
              className="bg-blue-600 hover:bg-blue-700"
            />
            <CommonButton
              label={COURSE_DELETE_BUTTON_LABEL}
              onClick={() => handleDelete(row.id)}
              className="bg-red-600 hover:bg-red-700"
            />
          </div>
        ),
      },
    ],
    []
  );

  /**
   * openEditModal
   * -------------
   * Opens the modal for editing a course and initializes the course form state.
   * @param course - The course to edit.
   */
  const openEditModal = (course: Course) => {
    setCourseForm({
      code: course.code,
      name: course.name,
      credits: course.credits,
      duration: course.duration,
      description: course.description,
    });
    setEditingCourseId(course.id);
    setIsModalOpen(true);
  };

  /**
   * closeModal
   * ----------
   * Closes the modal and resets the editing state.
   */
  const closeModal = () => {
    setIsModalOpen(false);
    setEditingCourseId(null);
  };

  /**
   * handleFormChange
   * ----------------
   * Updates the course form state as inputs change.
   * @param e - Input change event.
   */
  const handleFormChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    if (name === "credits" || name === "duration") {
      setCourseForm({ ...courseForm, [name]: Number(value) });
    } else {
      setCourseForm({ ...courseForm, [name]: value });
    }
  };

  /**
   * handleFormSubmit
   * ----------------
   * Submits the course update form.
   * Calls teacherService.update to update the course, refreshes the course list,
   * and handles exceptions.
   * @param e - Form submission event.
   */
  const handleFormSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      if (editingCourseId !== null) {
        await courseService.update(editingCourseId, courseForm);
        setSuccess(COURSE_SAVE_BUTTON_LABEL + " successful.");
        fetchCourses();
      }
      closeModal();
    } catch (err) {
      console.error("Error updating course:", err);
      setError(UPDATE_COURSE_EXCEPTION);
    }
  };

  /**
   * handleDelete
   * ------------
   * Deletes a course by its ID using courseService.delete.
   * Displays a success message and refreshes the course list.
   * @param id - The ID of the course to delete.
   */
  const handleDelete = async (id: number) => {
    if (window.confirm("Are you sure you want to delete this course?")) {
      try {
        await courseService.delete(id);
        setSuccess(COURSE_DELETE_BUTTON_LABEL + " successful.");
        fetchCourses();
      } catch (err) {
        console.error("Error deleting course:", err);
        setError(DELETE_COURSE_EXCEPTION);
      }
    }
  };

  return (
    <div className="min-h-screen flex font-roboto bg-gradient-to-br from-gray-900 to-black">
      {/* Sidebar Navigation */}
      <Sidebar />
      <div className="flex-1 flex flex-col">
        {/* Top Navbar */}
        <Navbar />
        <main className="p-6 md:p-8">
          {/* Header Section with Title, Search, and Add Course Button */}
          <div className="flex flex-col sm:flex-row items-center justify-between mb-8">
            <h1 className="text-4xl md:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500">
              {COURSE_MANAGEMENT_HEADING}
            </h1>
            <div className="flex items-center mt-4 sm:mt-0">
              <input
                type="text"
                placeholder={COURSE_SEARCH_PLACEHOLDER}
                value={searchQuery}
                onChange={handleSearchChange}
                className="px-4 py-2 bg-black bg-opacity-50 border border-indigo-500 rounded-l-xl focus:outline-none text-white placeholder-gray-400"
              />
              <CommonButton
                label={COURSE_ADD_BUTTON_LABEL}
                onClick={() => navigate("/admin/add-course")}
                className="rounded-r-xl bg-indigo-600 hover:bg-indigo-700"
              />
            </div>
          </div>

          {/* Display error message if exists */}
          {error && (
            <div className="mb-4 p-4 bg-red-500 bg-opacity-50 border border-red-700 rounded-xl text-white">
              {error}
            </div>
          )}

          {/* Display success message if exists */}
          {success && (
            <div className="mb-4 p-4 bg-green-500 bg-opacity-50 border border-green-700 rounded-xl text-white">
              {success}
            </div>
          )}

          {/* Courses Table using CommonTable component */}
          <CommonTable
            columns={columns}
            data={filteredCourses}
            initialSortColumn="name"
            initialSortDirection="asc"
            onRowClick={() => {}} // onRowClick is handled in the Actions column
          />

          {/* Course Edit Modal */}
          {isModalOpen && (
            <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-70 z-50">
              <div className="bg-gray-800 p-8 rounded-xl border border-indigo-500 shadow-xl w-full max-w-lg mx-4 animate-fadeIn max-h-[80vh] overflow-y-auto">
                <h2 className="text-2xl font-bold text-white mb-4">
                  Edit Course
                </h2>
                <form onSubmit={handleFormSubmit} className="space-y-4">
                  <div>
                    <label htmlFor="code" className="block text-white mb-1">
                      Course Code
                    </label>
                    <input
                      id="code"
                      name="code"
                      type="text"
                      value={courseForm.code}
                      onChange={handleFormChange}
                      required
                      className="w-full px-4 py-2 bg-black bg-opacity-50 border border-indigo-500 rounded-md focus:outline-none text-white"
                    />
                  </div>
                  <div>
                    <label htmlFor="name" className="block text-white mb-1">
                      Course Name
                    </label>
                    <input
                      id="name"
                      name="name"
                      type="text"
                      value={courseForm.name}
                      onChange={handleFormChange}
                      required
                      className="w-full px-4 py-2 bg-black bg-opacity-50 border border-indigo-500 rounded-md focus:outline-none text-white"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label
                        htmlFor="credits"
                        className="block text-white mb-1"
                      >
                        Credits
                      </label>
                      <input
                        id="credits"
                        name="credits"
                        type="number"
                        value={courseForm.credits}
                        onChange={handleFormChange}
                        required
                        min="0"
                        className="w-full px-4 py-2 bg-black bg-opacity-50 border border-indigo-500 rounded-md focus:outline-none text-white"
                      />
                    </div>
                    <div>
                      <label
                        htmlFor="duration"
                        className="block text-white mb-1"
                      >
                        Duration (hours)
                      </label>
                      <input
                        id="duration"
                        name="duration"
                        type="number"
                        value={courseForm.duration}
                        onChange={handleFormChange}
                        required
                        min="0"
                        className="w-full px-4 py-2 bg-black bg-opacity-50 border border-indigo-500 rounded-md focus:outline-none text-white"
                      />
                    </div>
                  </div>
                  <div>
                    <label
                      htmlFor="description"
                      className="block text-white mb-1"
                    >
                      Description
                    </label>
                    <textarea
                      id="description"
                      name="description"
                      value={courseForm.description}
                      onChange={handleFormChange}
                      required
                      className="w-full px-4 py-2 bg-black bg-opacity-50 border border-indigo-500 rounded-md focus:outline-none text-white"
                    />
                  </div>
                  <div className="flex justify-end space-x-4">
                    <CommonButton
                      label={COURSE_CANCEL_BUTTON_LABEL}
                      onClick={closeModal}
                      className="bg-gray-600 hover:bg-gray-700"
                    />
                    <CommonButton
                      label={COURSE_SAVE_BUTTON_LABEL}
                      type="submit"
                      className="bg-indigo-600 hover:bg-indigo-700 font-bold"
                    />
                  </div>
                </form>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default CourseManagement;

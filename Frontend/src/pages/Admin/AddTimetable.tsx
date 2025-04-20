import React, { useState, ChangeEvent } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../../components/common/Sidebar";
import Navbar from "../../components/common/Navbar";
import CommonButton from "../../components/common/Button";
import timetableService, {
  TimetableEntry,
} from "../../services/timetableService";
import {
  ADD_TIMETABLE_HEADING,
  LABEL_DATE,
  LABEL_START_TIME,
  LABEL_END_TIME,
  LABEL_TEACHER_ID,
  LABEL_COURSE_ID,
  LABEL_CLASSROOM,
  PLACEHOLDER_DATE,
  PLACEHOLDER_START_TIME,
  PLACEHOLDER_END_TIME,
  PLACEHOLDER_TEACHER_ID,
  PLACEHOLDER_COURSE_ID,
  PLACEHOLDER_CLASSROOM,
  BUTTON_SAVE,
  BUTTON_CANCEL,
  SUCCESS_MESSAGE_ADD,
  ERROR_MESSAGE_ADD,
} from "../../constants/admin/addTimetableStrings";

/**
 * AddTimetable Component
 * ------------------------
 * Provides a form for creating a new timetable entry.
 * On submission, it calls timetableService.create to store the new entry in the backend.
 * Exception handling is applied, and success/error messages are displayed.
 */
const AddTimetable: React.FC = () => {
  const navigate = useNavigate();

  // Local state to manage the form data.
  const [formData, setFormData] = useState<Omit<TimetableEntry, "id">>({
    date: "",
    startTime: "",
    endTime: "",
    teacherId: 0,
    courseId: 0,
    classroom: "",
  });

  // State for displaying error and success messages.
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  /**
   * handleChange
   * ------------
   * Updates the formData state as the user types.
   * @param e - Input change event.
   */
  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    // Convert numeric fields to numbers.
    if (name === "teacherId" || name === "courseId") {
      setFormData({ ...formData, [name]: Number(value) });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  /**
   * handleSubmit
   * ------------
   * Handles form submission by calling timetableService.create.
   * On success, displays a success message and navigates back to the Timetable Management page.
   * In case of error, sets an appropriate error message.
   * @param e - Form submission event.
   */
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    try {
      await timetableService.create(formData);
      setSuccess(SUCCESS_MESSAGE_ADD);
      // Optionally, wait for a short duration before navigating.
      setTimeout(() => {
        navigate("/admin/timetable");
      }, 1500);
    } catch (err) {
      console.error("Error creating timetable entry:", err);
      setError(ERROR_MESSAGE_ADD);
    }
  };

  /**
   * handleCancel
   * ------------
   * Cancels the form submission and navigates back to the Timetable Management page.
   */
  const handleCancel = () => {
    navigate("/admin/timetable-management");
  };

  return (
    <div className="min-h-screen flex font-roboto bg-gradient-to-br from-gray-900 to-black">
      {/* Sidebar Navigation */}
      <Sidebar />
      <div className="flex-1 flex flex-col">
        {/* Top Navbar */}
        <Navbar />
        <main className="p-6 md:p-8">
          {/* Page Heading */}
          <h1 className="text-4xl md:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500 mb-8">
            {ADD_TIMETABLE_HEADING}
          </h1>
          <div className="bg-black bg-opacity-50 border border-indigo-500 rounded-xl shadow-xl p-8 max-w-xl mx-auto">
            {/* Display success or error messages */}
            {error && (
              <div className="mb-4 p-4 bg-red-500 bg-opacity-50 border border-red-700 rounded-xl text-white">
                {error}
              </div>
            )}
            {success && (
              <div className="mb-4 p-4 bg-green-500 bg-opacity-50 border border-green-700 rounded-xl text-white">
                {success}
              </div>
            )}
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="mb-4">
                <label htmlFor="date" className="block text-white mb-1">
                  {LABEL_DATE}
                </label>
                <input
                  id="date"
                  name="date"
                  type="date"
                  placeholder={PLACEHOLDER_DATE}
                  value={formData.date}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 bg-black bg-opacity-50 border border-indigo-500 rounded-md focus:outline-none text-white"
                />
              </div>
              <div className="mb-4 grid grid-cols-2 gap-4">
                <div>
                  <label htmlFor="startTime" className="block text-white mb-1">
                    {LABEL_START_TIME}
                  </label>
                  <input
                    id="startTime"
                    name="startTime"
                    type="time"
                    placeholder={PLACEHOLDER_START_TIME}
                    value={formData.startTime}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-2 bg-black bg-opacity-50 border border-indigo-500 rounded-md focus:outline-none text-white"
                  />
                </div>
                <div>
                  <label htmlFor="endTime" className="block text-white mb-1">
                    {LABEL_END_TIME}
                  </label>
                  <input
                    id="endTime"
                    name="endTime"
                    type="time"
                    placeholder={PLACEHOLDER_END_TIME}
                    value={formData.endTime}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-2 bg-black bg-opacity-50 border border-indigo-500 rounded-md focus:outline-none text-white"
                  />
                </div>
              </div>
              <div className="mb-4 grid grid-cols-2 gap-4">
                <div>
                  <label htmlFor="teacherId" className="block text-white mb-1">
                    {LABEL_TEACHER_ID}
                  </label>
                  <input
                    id="teacherId"
                    name="teacherId"
                    type="number"
                    placeholder={PLACEHOLDER_TEACHER_ID}
                    value={formData.teacherId || ""}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-2 bg-black bg-opacity-50 border border-indigo-500 rounded-md focus:outline-none text-white"
                  />
                </div>
                <div>
                  <label htmlFor="courseId" className="block text-white mb-1">
                    {LABEL_COURSE_ID}
                  </label>
                  <input
                    id="courseId"
                    name="courseId"
                    type="number"
                    placeholder={PLACEHOLDER_COURSE_ID}
                    value={formData.courseId || ""}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-2 bg-black bg-opacity-50 border border-indigo-500 rounded-md focus:outline-none text-white"
                  />
                </div>
              </div>
              <div className="mb-4">
                <label htmlFor="classroom" className="block text-white mb-1">
                  {LABEL_CLASSROOM}
                </label>
                <input
                  id="classroom"
                  name="classroom"
                  type="text"
                  placeholder={PLACEHOLDER_CLASSROOM}
                  value={formData.classroom}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 bg-black bg-opacity-50 border border-indigo-500 rounded-md focus:outline-none text-white"
                />
              </div>
              <div className="flex justify-end space-x-4">
                <CommonButton
                  label={BUTTON_CANCEL}
                  onClick={handleCancel}
                  className="bg-gray-600 hover:bg-gray-700"
                />
                <CommonButton
                  label={BUTTON_SAVE}
                  type="submit"
                  className="bg-indigo-600 hover:bg-indigo-700 font-bold"
                />
              </div>
            </form>
          </div>
        </main>
      </div>
    </div>
  );
};

export default AddTimetable;

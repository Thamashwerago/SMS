// src/pages/Admin/AddTimetable.tsx
import React, { useState, ChangeEvent } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, X } from "lucide-react";
import Sidebar from "../../components/common/Sidebar";
import Navbar from "../../components/common/Navbar";
import CommonButton from "../../components/common/Button";
import timetableService, { TimetableEntry } from "../../services/timetableService";
import {
  ADD_TIMETABLE_HEADING,
  LABEL_DATE,
  LABEL_START_TIME,
  LABEL_END_TIME,
  LABEL_COURSE_ID,
  LABEL_CLASSROOM,
  PLACEHOLDER_DATE,
  PLACEHOLDER_START_TIME,
  PLACEHOLDER_END_TIME,
  PLACEHOLDER_COURSE_ID,
  PLACEHOLDER_CLASSROOM,
  BUTTON_SAVE,
  BUTTON_CANCEL,
  SUCCESS_MESSAGE_ADD,
  ERROR_MESSAGE_ADD,
} from "../../constants/admin/addTimetableStrings";

const initialForm: Omit<TimetableEntry, "id"> = {
  date: "",
  startTime: "",
  endTime: "",
  courseId: 0,
  classroom: "",
  teacherId: 0, // Added teacherId as required by timetableService.create
};

const AddTimetable: React.FC = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState(initialForm);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const handleBack = () => navigate(-1);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]:
        name === "courseId"
          ? Number(value)
          : value,
    }));
    setError(null);
    setSuccess(null);
  };

  const handleClear = () => {
    setFormData(initialForm);
    setError(null);
    setSuccess(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    setSubmitting(true);

    try {
      await timetableService.create(formData);
      setSuccess(SUCCESS_MESSAGE_ADD);
      handleClear();
      setTimeout(() => navigate("/admin/timetable"), 1500);
    } catch (err) {
      console.error(err);
      setError(ERROR_MESSAGE_ADD);
    }

    setSubmitting(false);
  };

  return (
    <div className="min-h-screen flex bg-gradient-to-br from-gray-900 to-black text-white">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <Navbar />
        <main className="p-8 relative">
          {/* Back Button */}
          <button
            onClick={handleBack}
            aria-label="Go back"
            className="absolute top-8 right-8 p-2 bg-gray-800 bg-opacity-50 hover:bg-opacity-75 rounded-full focus:outline-none focus:ring-2 focus:ring-indigo-400"
          >
            <ArrowLeft size={24} />
          </button>

          <h1 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500 mb-8">
            {ADD_TIMETABLE_HEADING}
          </h1>

          <div className="mx-auto w-full max-w-xl bg-black bg-opacity-50 border border-indigo-500 rounded-xl shadow-xl p-8">
            {error && <p className="mb-4 text-red-500">{error}</p>}
            {success && <p className="mb-4 text-green-500">{success}</p>}

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Date */}
              <div>
                <label htmlFor="date" className="block mb-2 font-semibold">
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
                  className="w-full px-4 py-2 bg-gray-800 border border-indigo-500 rounded-md focus:outline-none focus:ring-indigo-400"
                />
              </div>

              {/* Start / End Time */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="startTime" className="block mb-2 font-semibold">
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
                    className="w-full px-4 py-2 bg-gray-800 border border-indigo-500 rounded-md focus:outline-none focus:ring-indigo-400"
                  />
                </div>
                <div>
                  <label htmlFor="endTime" className="block mb-2 font-semibold">
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
                    className="w-full px-4 py-2 bg-gray-800 border border-indigo-500 rounded-md focus:outline-none focus:ring-indigo-400"
                  />
                </div>
              </div>

              {/* Course ID */}
              <div>
                <label htmlFor="courseId" className="block mb-2 font-semibold">
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
                  className="w-full px-4 py-2 bg-gray-800 border border-indigo-500 rounded-md focus:outline-none focus:ring-indigo-400"
                />
              </div>

              {/* Classroom */}
              <div>
                <label htmlFor="classroom" className="block mb-2 font-semibold">
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
                  className="w-full px-4 py-2 bg-gray-800 border border-indigo-500 rounded-md focus:outline-none focus:ring-indigo-400"
                />
              </div>

              {/* Actions */}
              <div className="flex justify-end space-x-4">
                <CommonButton
                  type="button"
                  variant="secondary"
                  size="md"
                  label={BUTTON_CANCEL}
                  icon={<X />}
                  onClick={handleClear}
                  disabled={submitting}
                />
                <CommonButton
                  type="submit"
                  variant="primary"
                  size="md"
                  label={BUTTON_SAVE}
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

export default AddTimetable;

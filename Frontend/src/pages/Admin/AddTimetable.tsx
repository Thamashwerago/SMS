// src/pages/Admin/AddTimetable.tsx
import React, { useState, ChangeEvent } from "react";
import { ArrowLeft, X } from "lucide-react";
import { useNavigate } from "react-router-dom";
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
  teacherId: 0,
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
    setFormData(prev => ({
      ...prev,
      [name]: name === "courseId" ? Number(value) : value,
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
    } catch {
      setError(ERROR_MESSAGE_ADD);
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
            <h1 className="text-3xl font-bold">{ADD_TIMETABLE_HEADING}</h1>
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
          <section className="bg-gray-800 rounded-lg shadow p-6 max-w-xl mx-auto">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Date */}
              <div>
                <label htmlFor="date" className="block mb-1 font-semibold">
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
                  className="w-full px-4 py-2 bg-gray-700 border border-indigo-500 rounded focus:outline-none focus:ring focus:ring-indigo-500"
                />
              </div>

              {/* Times */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="startTime" className="block mb-1 font-semibold">
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
                    className="w-full px-4 py-2 bg-gray-700 border border-indigo-500 rounded focus:outline-none focus:ring focus:ring-indigo-500"
                  />
                </div>
                <div>
                  <label htmlFor="endTime" className="block mb-1 font-semibold">
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
                    className="w-full px-4 py-2 bg-gray-700 border border-indigo-500 rounded focus:outline-none focus:ring focus:ring-indigo-500"
                  />
                </div>
              </div>

              {/* Course ID */}
              <div>
                <label htmlFor="courseId" className="block mb-1 font-semibold">
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
                  className="w-full px-4 py-2 bg-gray-700 border border-indigo-500 rounded focus:outline-none focus:ring focus:ring-indigo-500"
                />
              </div>

              {/* Classroom */}
              <div>
                <label htmlFor="classroom" className="block mb-1 font-semibold">
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
                  className="w-full px-4 py-2 bg-gray-700 border border-indigo-500 rounded focus:outline-none focus:ring focus:ring-indigo-500"
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
          </section>
        </main>
      </div>
    </div>
  );
};

export default AddTimetable;

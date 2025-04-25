// src/pages/Admin/AddTeacher.tsx
import React, { useState } from "react";
import { ArrowLeft, X } from "lucide-react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../../components/common/Sidebar";
import Navbar from "../../components/common/Navbar";
import CommonButton from "../../components/common/Button";
import userService from "../../services/userService";
import teacherService from "../../services/teacherService";
import { validateTeacherForm, TeacherFormData } from "../../utils/validation";
import {
  TEACHER_PAGE_TITLE,
  TEACHER_HEADING,
  TEACHER_LABEL_USERNAME,
  TEACHER_LABEL_EMAIL,
  TEACHER_LABEL_PASSWORD,
  TEACHER_LABEL_CONFIRM_PASSWORD,
  TEACHER_LABEL_NAME,
  TEACHER_LABEL_PHONE,
  TEACHER_LABEL_DOB,
  TEACHER_LABEL_GENDER,
  TEACHER_LABEL_ADDRESS,
  TEACHER_LABEL_JOINING_DATE,
  TEACHER_LABEL_STATUS,
  TEACHER_PLACEHOLDER_USERNAME,
  TEACHER_PLACEHOLDER_EMAIL,
  TEACHER_PLACEHOLDER_PASSWORD,
  TEACHER_PLACEHOLDER_CONFIRM_PASSWORD,
  TEACHER_PLACEHOLDER_NAME,
  TEACHER_PLACEHOLDER_PHONE,
  TEACHER_PLACEHOLDER_STATUS,
  TEACHER_SUCCESS_MESSAGE,
  TEACHER_ERROR_MESSAGE,
  TEACHER_NAVIGATION_DELAY_MS,
} from "../../constants/admin/teacherStrings";

const initialForm: TeacherFormData = {
  username: "",
  email: "",
  password: "",
  confirmPassword: "",
  name: "",
  phone: "",
  dob: "",
  gender: "",
  address: "",
  joiningDate: "",
  status: "",
  role: "TEACHER",
};

const AddTeacher: React.FC = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState<TeacherFormData>(initialForm);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    setError(null);
    setSuccess(null);
  };

  const handleClear = () => {
    setFormData(initialForm);
    setError(null);
    setSuccess(null);
  };

  const handleBack = () => navigate(-1);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    const errors = validateTeacherForm(formData);
    if (errors.length) {
      setError(errors.join(" "));
      return;
    }

    setSubmitting(true);
    try {
      // create user account
      const createdUser = await userService.create({
        username: formData.username,
        email: formData.email,
        password: formData.password,
        role: "TEACHER",
      });
      // create teacher profile
      await teacherService.create({
        userId: createdUser.id,
        name: formData.name,
        phone: formData.phone,
        dob: formData.dob,
        gender: formData.gender,
        address: formData.address,
        joiningDate: new Date(formData.joiningDate),
        status: formData.status,
        role: "TEACHER",
      });
      setSuccess(TEACHER_SUCCESS_MESSAGE);
      setFormData(initialForm);
      setTimeout(
        () => navigate("/admin/teacher-management"),
        TEACHER_NAVIGATION_DELAY_MS
      );
    } catch (err) {
      console.error(err);
      setError(TEACHER_ERROR_MESSAGE);
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
            <h1 className="text-3xl font-bold">{TEACHER_HEADING}</h1>
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
              {/* Username & Email */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block mb-1 font-semibold">
                    {TEACHER_LABEL_USERNAME}
                  </label>
                  <input
                    name="username"
                    placeholder={TEACHER_PLACEHOLDER_USERNAME}
                    value={formData.username}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-2 bg-gray-700 border border-indigo-500 rounded focus:outline-none focus:ring focus:ring-indigo-500"
                  />
                </div>
                <div>
                  <label className="block mb-1 font-semibold">
                    {TEACHER_LABEL_EMAIL}
                  </label>
                  <input
                    name="email"
                    type="email"
                    placeholder={TEACHER_PLACEHOLDER_EMAIL}
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-2 bg-gray-700 border border-indigo-500 rounded focus:outline-none focus:ring focus:ring-indigo-500"
                  />
                </div>
              </div>

              {/* Password */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block mb-1 font-semibold">
                    {TEACHER_LABEL_PASSWORD}
                  </label>
                  <input
                    name="password"
                    type="password"
                    placeholder={TEACHER_PLACEHOLDER_PASSWORD}
                    value={formData.password}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-2 bg-gray-700 border border-indigo-500 rounded focus:outline-none focus:ring focus:ring-indigo-500"
                  />
                </div>
                <div>
                  <label className="block mb-1 font-semibold">
                    {TEACHER_LABEL_CONFIRM_PASSWORD}
                  </label>
                  <input
                    name="confirmPassword"
                    type="password"
                    placeholder={TEACHER_PLACEHOLDER_CONFIRM_PASSWORD}
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-2 bg-gray-700 border border-indigo-500 rounded focus:outline-none focus:ring focus:ring-indigo-500"
                  />
                </div>
              </div>

              {/* Personal Details */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block mb-1 font-semibold">
                    {TEACHER_LABEL_NAME}
                  </label>
                  <input
                    name="name"
                    placeholder={TEACHER_PLACEHOLDER_NAME}
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-2 bg-gray-700 border border-indigo-500 rounded focus:outline-none focus:ring focus:ring-indigo-500"
                  />
                </div>
                <div>
                  <label className="block mb-1 font-semibold">
                    {TEACHER_LABEL_PHONE}
                  </label>
                  <input
                    name="phone"
                    placeholder={TEACHER_PLACEHOLDER_PHONE}
                    value={formData.phone}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-2 bg-gray-700 border border-indigo-500 rounded focus:outline-none focus:ring focus:ring-indigo-500"
                  />
                </div>
              </div>

              {/* DOB & Gender */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block mb-1 font-semibold">
                    {TEACHER_LABEL_DOB}
                  </label>
                  <input
                    name="dob"
                    type="date"
                    value={formData.dob}
                    onChange={handleChange}
                    required
                    placeholder="YYYY-MM-DD"
                    title={TEACHER_LABEL_DOB}
                    className="w-full px-4 py-2 bg-gray-700 border border-indigo-500 rounded focus:outline-none focus:ring focus:ring-indigo-500"
                  />
                </div>
                <div>
                  <label className="block mb-1 font-semibold">
                    {TEACHER_LABEL_GENDER}
                  </label>
                  <select
                    name="gender"
                    value={formData.gender}
                    onChange={handleChange}
                    required
                    title={TEACHER_LABEL_GENDER}
                    className="w-full px-4 py-2 bg-gray-700 border border-indigo-500 rounded focus:outline-none focus:ring focus:ring-indigo-500"
                  >
                    <option value="">Select Gender</option>
                    <option>Male</option>
                    <option>Female</option>
                    <option>Other</option>
                  </select>
                </div>
              </div>

              {/* Address & Joining Date */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block mb-1 font-semibold">
                    {TEACHER_LABEL_ADDRESS}
                  </label>
                  <input
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                    required
                    placeholder="Enter address"
                    title={TEACHER_LABEL_ADDRESS}
                    className="w-full px-4 py-2 bg-gray-700 border border-indigo-500 rounded focus:outline-none focus:ring focus:ring-indigo-500"
                  />
                </div>
                <div>
                  <input
                    name="joiningDate"
                    type="date"
                    value={formData.joiningDate}
                    onChange={handleChange}
                    required
                    placeholder="YYYY-MM-DD"
                    title={TEACHER_LABEL_JOINING_DATE}
                    className="w-full px-4 py-2 bg-gray-700 border border-indigo-500 rounded focus:outline-none focus:ring focus:ring-indigo-500"
                  />
                </div>
              </div>

              {/* Status */}
              <div>
                <label className="block mb-1 font-semibold">
                  {TEACHER_LABEL_STATUS}
                </label>
                <input
                  name="status"
                  placeholder={TEACHER_PLACEHOLDER_STATUS}
                  value={formData.status}
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
                  label="Clear"
                  icon={<X />}
                  onClick={handleClear}
                  disabled={submitting}
                />
                <CommonButton
                  type="submit"
                  variant="primary"
                  size="md"
                  label={TEACHER_PAGE_TITLE}
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

export default AddTeacher;

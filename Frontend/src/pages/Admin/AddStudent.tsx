// src/pages/Admin/AddStudent.tsx
import React, { useState } from "react";
import { ArrowLeft, X } from "lucide-react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../../components/common/Sidebar";
import Navbar from "../../components/common/Navbar";
import CommonButton from "../../components/common/Button";
import userService from "../../services/userService";
import studentService from "../../services/studentService";
import { validateStudentForm, StudentFormData } from "../../utils/validation";
import {
  STUDENT_PAGE_TITLE,
  STUDENT_HEADING,
  STUDENT_LABEL_USERNAME,
  STUDENT_LABEL_EMAIL,
  STUDENT_LABEL_PASSWORD,
  STUDENT_LABEL_CONFIRM_PASSWORD,
  STUDENT_LABEL_FIRST_NAME,
  STUDENT_LABEL_LAST_NAME,
  STUDENT_LABEL_DATE_OF_BIRTH,
  STUDENT_LABEL_GENDER,
  STUDENT_LABEL_ADDRESS,
  STUDENT_LABEL_CONTACT_NUMBER,
  STUDENT_LABEL_NATIONALITY,
  STUDENT_PLACEHOLDER_USERNAME,
  STUDENT_PLACEHOLDER_EMAIL,
  STUDENT_PLACEHOLDER_PASSWORD,
  STUDENT_PLACEHOLDER_CONFIRM_PASSWORD,
  STUDENT_PLACEHOLDER_FIRST_NAME,
  STUDENT_PLACEHOLDER_LAST_NAME,
  STUDENT_PLACEHOLDER_CONTACT_NUMBER,
  STUDENT_SUCCESS_MESSAGE,
  STUDENT_ERROR_MESSAGE,
  STUDENT_NAVIGATION_DELAY_MS,
} from "../../constants/admin/studentStrings";

const initialForm: StudentFormData = {
  username: "",
  email: "",
  password: "",
  confirmPassword: "",
  firstName: "",
  lastName: "",
  dateOfBirth: "",
  gender: "",
  address: "",
  contactNumber: "",
  nationality: "",
  role: "STUDENT",
};

const AddStudent: React.FC = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState<StudentFormData>(initialForm);
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

    const errors = validateStudentForm(formData);
    if (errors.length) {
      setError(errors.join(" "));
      return;
    }

    setSubmitting(true);
    try {
      // 1) create user account
      const createdUser = await userService.create({
        username: formData.username,
        email: formData.email,
        password: formData.password,
        role: "STUDENT",
      });
      // 2) create student profile
      await studentService.create({
        userId: createdUser.id,
        firstName: formData.firstName,
        lastName: formData.lastName,
        dateOfBirth: formData.dateOfBirth,
        gender: formData.gender,
        address: formData.address,
        contactNumber: formData.contactNumber,
        nationality: formData.nationality,
      });
      setSuccess(STUDENT_SUCCESS_MESSAGE);
      setFormData(initialForm);
      setTimeout(
        () => navigate("/admin/student-management"),
        STUDENT_NAVIGATION_DELAY_MS
      );
    } catch (err) {
      console.error(err);
      setError(STUDENT_ERROR_MESSAGE);
    }
    setSubmitting(false);
  };

  return (
    <div className="min-h-screen flex bg-gray-900 text-white">
      <Sidebar />
      <div className="ml-64 flex-1 flex flex-col overflow-hidden">
        <Navbar />
        <main className="p-6 space-y-8">
          {/* Header */}
          <div className="flex items-center justify-between">
            <h1 className="text-3xl font-bold">{STUDENT_HEADING}</h1>
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
                    {STUDENT_LABEL_USERNAME}
                  </label>
                  <input
                    name="username"
                    placeholder={STUDENT_PLACEHOLDER_USERNAME}
                    value={formData.username}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-2 bg-gray-700 border border-indigo-500 rounded focus:outline-none focus:ring focus:ring-indigo-500"
                  />
                </div>
                <div>
                  <label className="block mb-1 font-semibold">
                    {STUDENT_LABEL_EMAIL}
                  </label>
                  <input
                    name="email"
                    type="email"
                    placeholder={STUDENT_PLACEHOLDER_EMAIL}
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-2 bg-gray-700 border border-indigo-500 rounded focus:outline-none focus:ring focus:ring-indigo-500"
                  />
                </div>
              </div>

              {/* Password & Confirm */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block mb-1 font-semibold">
                    {STUDENT_LABEL_PASSWORD}
                  </label>
                  <input
                    name="password"
                    type="password"
                    placeholder={STUDENT_PLACEHOLDER_PASSWORD}
                    value={formData.password}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-2 bg-gray-700 border border-indigo-500 rounded focus:outline-none focus:ring focus:ring-indigo-500"
                  />
                </div>
                <div>
                  <label className="block mb-1 font-semibold">
                    {STUDENT_LABEL_CONFIRM_PASSWORD}
                  </label>
                  <input
                    name="confirmPassword"
                    type="password"
                    placeholder={STUDENT_PLACEHOLDER_CONFIRM_PASSWORD}
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-2 bg-gray-700 border border-indigo-500 rounded focus:outline-none focus:ring focus:ring-indigo-500"
                  />
                </div>
              </div>

              {/* Names */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block mb-1 font-semibold">
                    {STUDENT_LABEL_FIRST_NAME}
                  </label>
                  <input
                    name="firstName"
                    placeholder={STUDENT_PLACEHOLDER_FIRST_NAME}
                    value={formData.firstName}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-2 bg-gray-700 border border-indigo-500 rounded focus:outline-none focus:ring focus:ring-indigo-500"
                  />
                </div>
                <div>
                  <label className="block mb-1 font-semibold">
                    {STUDENT_LABEL_LAST_NAME}
                  </label>
                  <input
                    name="lastName"
                    placeholder={STUDENT_PLACEHOLDER_LAST_NAME}
                    value={formData.lastName}
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
                    {STUDENT_LABEL_DATE_OF_BIRTH}
                  </label>
                  <input
                    name="dateOfBirth"
                    type="date"
                    value={formData.dateOfBirth}
                    onChange={handleChange}
                    required
                    title="Student date of birth"
                    placeholder="YYYY-MM-DD"
                    className="w-full px-4 py-2 bg-gray-700 border border-indigo-500 rounded focus:outline-none focus:ring focus:ring-indigo-500"
                  />
                </div>
                <div>
                  <label className="block mb-1 font-semibold">
                    {STUDENT_LABEL_GENDER}
                  </label>
                  <select
                    name="gender"
                    value={formData.gender}
                    onChange={handleChange}
                    required
                    title="Student gender"
                    className="w-full px-4 py-2 bg-gray-700 border border-indigo-500 rounded focus:outline-none focus:ring focus:ring-indigo-500"
                  >
                    <option value="">Select Gender</option>
                    <option>Male</option>
                    <option>Female</option>
                    <option>Other</option>
                  </select>
                </div>
              </div>

              {/* Address, Contact, Nationality */}
              <div className="space-y-4">
                <div>
                  <label className="block mb-1 font-semibold">
                    {STUDENT_LABEL_ADDRESS}
                  </label>
                  <input
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                    required
                    placeholder="Enter full address"
                    title="Student address"
                    className="w-full px-4 py-2 bg-gray-700 border border-indigo-500 rounded focus:outline-none focus:ring focus:ring-indigo-500"
                  />
                </div>
                <div>
                  <label className="block mb-1 font-semibold">
                    {STUDENT_LABEL_CONTACT_NUMBER}
                  </label>
                  <input
                    name="contactNumber"
                    type="tel"
                    placeholder={STUDENT_PLACEHOLDER_CONTACT_NUMBER}
                    value={formData.contactNumber}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-2 bg-gray-700 border border-indigo-500 rounded focus:outline-none focus:ring focus:ring-indigo-500"
                  />
                </div>
                <div>
                  <label className="block mb-1 font-semibold">
                    {STUDENT_LABEL_NATIONALITY}
                  </label>
                  <input
                    name="nationality"
                    value={formData.nationality}
                    onChange={handleChange}
                    required
                    placeholder="Enter nationality"
                    title="Student nationality"
                    className="w-full px-4 py-2 bg-gray-700 border border-indigo-500 rounded focus:outline-none focus:ring focus:ring-indigo-500"
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
                  label={STUDENT_PAGE_TITLE}
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

export default AddStudent;

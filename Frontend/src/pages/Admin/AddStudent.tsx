import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, X } from "lucide-react";
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
  role: "Student",
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
    setFormData((prev) => ({ ...prev, [name]: value }));
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
      // 1) create user
      const createdUser = await userService.create({
        username: formData.username,
        email: formData.email,
        password: formData.password,
        role: "STUDENT"
      });
      // 2) create student
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
      setTimeout(() => navigate("/admin/student-management"), STUDENT_NAVIGATION_DELAY_MS);
    } catch (err) {
      console.error(err);
      setError(STUDENT_ERROR_MESSAGE);
    }
    setSubmitting(false);
  };

  return (
    <div className="min-h-screen flex bg-gradient-to-br from-gray-900 to-black text-white">
      <Sidebar />
      <div className="ml-64 flex-1 flex flex-col overflow-hidden">
        <Navbar />
        <main className="flex-1 p-8 relative overflow-x-auto">
          {/* Back Button */}
          <button
            onClick={handleBack}
            aria-label="Go back"
            className="absolute top-8 right-8 p-2 bg-gray-800 bg-opacity-50 hover:bg-opacity-75 rounded-full focus:outline-none focus:ring-2 focus:ring-indigo-400"
          >
            <ArrowLeft size={24} />
          </button>

          <h1 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500 mb-8">
            {STUDENT_HEADING}
          </h1>

          <div className="mx-auto w-full max-w-xl bg-black bg-opacity-50 border border-indigo-500 rounded-xl shadow-xl p-8">
            <form onSubmit={handleSubmit} className="space-y-6">
              {error && <p className="text-red-500">{error}</p>}
              {success && <p className="text-green-500">{success}</p>}

              {/* Username & Email */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label
                    htmlFor="username"
                    className="block mb-2 font-semibold"
                  >
                    {STUDENT_LABEL_USERNAME}
                  </label>
                  <input
                    id="username"
                    name="username"
                    placeholder={STUDENT_PLACEHOLDER_USERNAME}
                    value={formData.username}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-2 bg-gray-800 border border-indigo-500 rounded-md focus:ring-indigo-400"
                  />
                </div>
                <div>
                  <label htmlFor="email" className="block mb-2 font-semibold">
                    {STUDENT_LABEL_EMAIL}
                  </label>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    placeholder={STUDENT_PLACEHOLDER_EMAIL}
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-2 bg-gray-800 border border-indigo-500 rounded-md focus:ring-indigo-400"
                  />
                </div>
              </div>

              {/* Passwords */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label
                    htmlFor="password"
                    className="block mb-2 font-semibold"
                  >
                    {STUDENT_LABEL_PASSWORD}
                  </label>
                  <input
                    id="password"
                    name="password"
                    type="password"
                    placeholder={STUDENT_PLACEHOLDER_PASSWORD}
                    value={formData.password}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-2 bg-gray-800 border border-indigo-500 rounded-md focus:ring-indigo-400"
                  />
                </div>
                <div>
                  <label
                    htmlFor="confirmPassword"
                    className="block mb-2 font-semibold"
                  >
                    {STUDENT_LABEL_CONFIRM_PASSWORD}
                  </label>
                  <input
                    id="confirmPassword"
                    name="confirmPassword"
                    type="password"
                    placeholder={STUDENT_PLACEHOLDER_CONFIRM_PASSWORD}
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-2 bg-gray-800 border border-indigo-500 rounded-md focus:ring-indigo-400"
                  />
                </div>
              </div>

              {/* Personal Info */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label
                    htmlFor="firstName"
                    className="block mb-2 font-semibold"
                  >
                    {STUDENT_LABEL_FIRST_NAME}
                  </label>
                  <input
                    id="firstName"
                    name="firstName"
                    placeholder={STUDENT_PLACEHOLDER_FIRST_NAME}
                    value={formData.firstName}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-2 bg-gray-800 border border-indigo-500 rounded-md focus:ring-indigo-400"
                  />
                </div>
                <div>
                  <label
                    htmlFor="lastName"
                    className="block mb-2 font-semibold"
                  >
                    {STUDENT_LABEL_LAST_NAME}
                  </label>
                  <input
                    id="lastName"
                    name="lastName"
                    placeholder={STUDENT_PLACEHOLDER_LAST_NAME}
                    value={formData.lastName}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-2 bg-gray-800 border border-indigo-500 rounded-md focus:ring-indigo-400"
                  />
                </div>
              </div>

              {/* Date & Gender */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label
                    htmlFor="dateOfBirth"
                    className="block mb-2 font-semibold"
                  >
                    {STUDENT_LABEL_DATE_OF_BIRTH}
                  </label>
                  <input
                    id="dateOfBirth"
                    name="dateOfBirth"
                    type="date"
                    value={formData.dateOfBirth}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-2 bg-gray-800 border border-indigo-500 rounded-md focus:ring-indigo-400"
                  />
                </div>
                <div>
                  <label htmlFor="gender" className="block mb-2 font-semibold">
                    {STUDENT_LABEL_GENDER}
                  </label>
                  <select
                    id="gender"
                    name="gender"
                    value={formData.gender}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-2 bg-gray-800 border border-indigo-500 rounded-md focus:ring-indigo-400"
                  >
                    <option value="">Select Gender</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
              </div>

              {/* Address, Contact, Nationality */}
              <div className="space-y-4">
                <div>
                  <label htmlFor="address" className="block mb-2 font-semibold">
                    {STUDENT_LABEL_ADDRESS}
                  </label>
                  <input
                    id="address"
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-2 bg-gray-800 border border-indigo-500 rounded-md focus:ring-indigo-400"
                  />
                </div>
                <div>
                  <label
                    htmlFor="contactNumber"
                    className="block mb-2 font-semibold"
                  >
                    {STUDENT_LABEL_CONTACT_NUMBER}
                  </label>
                  <input
                    id="contactNumber"
                    name="contactNumber"
                    type="tel"
                    placeholder={STUDENT_PLACEHOLDER_CONTACT_NUMBER}
                    value={formData.contactNumber}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-2 bg-gray-800 border border-indigo-500 rounded-md focus:ring-indigo-400"
                  />
                </div>
                <div>
                  <label
                    htmlFor="nationality"
                    className="block mb-2 font-semibold"
                  >
                    {STUDENT_LABEL_NATIONALITY}
                  </label>
                  <input
                    id="nationality"
                    name="nationality"
                    value={formData.nationality}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-2 bg-gray-800 border border-indigo-500 rounded-md focus:ring-indigo-400"
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
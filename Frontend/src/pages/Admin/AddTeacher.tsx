import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../../components/common/Sidebar";
import Navbar from "../../components/common/Navbar";
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

/**
 * AddTeacher Component
 * ----------------------
 * Renders a futuristic form for adding a new teacher.
 * Handles both user creation (via userService) and teacher-specific details (via teacherService).
 * Validates form data and displays success or error messages.
 */
const AddTeacher: React.FC = () => {
  const navigate = useNavigate();

  // Initialize form data with role preset to "Teacher"
  const [formData, setFormData] = useState<TeacherFormData>({
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
    role: "Teacher",
  });

  // State for displaying error and success messages
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  /**
   * handleChange - Updates form data as the user types in input fields.
   * @param e - Change event from input or select element.
   */
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  /**
   * handleSubmit - Validates the form, creates a user, and then creates teacher details.
   * On success, shows a success message and navigates to the teacher management page.
   * @param e - Form submission event.
   */
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    // Validate form data using our external validation function.
    const errors = validateTeacherForm(formData);
    if (errors.length > 0) {
      setError(errors.join(" "));
      return;
    }

    try {
      // Create the user with role "Teacher"
      const userResponse = await userService.create({
        username: formData.username,
        email: formData.email,
        password: formData.password,
        role: "Teacher",
      });

      // Create teacher details linked with the newly created user's ID
      await teacherService.create({
        userId: userResponse.id,
        name: formData.name,
        phone: formData.phone,
        dob: formData.dob,
        gender: formData.gender,
        address: formData.address,
        joiningDate: new Date(formData.joiningDate), // Convert string to Date object
        status: formData.status,
        role: "Teacher",
      });

      // Display success message and clear the form.
      setSuccess(TEACHER_SUCCESS_MESSAGE);
      setFormData({
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
        role: "Teacher",
      });
      // Navigate to the Teacher Management page after a short delay.
      setTimeout(() => {
        navigate("/admin/teacher-management");
      }, TEACHER_NAVIGATION_DELAY_MS);
    } catch (err) {
      console.error("Error adding teacher:", err);
      setError(TEACHER_ERROR_MESSAGE);
    }
  };

  return (
    <div className="min-h-screen flex font-roboto bg-gradient-to-br from-gray-900 to-black">
      {/* Sidebar Navigation */}
      <Sidebar />
      <div className="flex-1 flex flex-col">
        {/* Top Navbar */}
        <Navbar />
        <main className="p-8">
          {/* Page Heading */}
          <h1 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500 mb-8">
            {TEACHER_HEADING}
          </h1>
          <div className="bg-black bg-opacity-50 border border-indigo-500 rounded-xl shadow-xl p-8 max-w-xl mx-auto">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Error or Success Message */}
              {error && <p className="text-red-500">{error}</p>}
              {success && <p className="text-green-500">{success}</p>}

              {/* Username Field */}
              <div>
                <label
                  htmlFor="username"
                  className="block text-white text-lg font-semibold mb-2"
                >
                  {TEACHER_LABEL_USERNAME}
                </label>
                <input
                  id="username"
                  name="username"
                  type="text"
                  placeholder={TEACHER_PLACEHOLDER_USERNAME}
                  value={formData.username}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 bg-black bg-opacity-50 border border-indigo-500 rounded-md focus:outline-none focus:ring focus:ring-indigo-500 text-white"
                />
              </div>

              {/* Email Field */}
              <div>
                <label
                  htmlFor="email"
                  className="block text-white text-lg font-semibold mb-2"
                >
                  {TEACHER_LABEL_EMAIL}
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  placeholder={TEACHER_PLACEHOLDER_EMAIL}
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 bg-black bg-opacity-50 border border-indigo-500 rounded-md focus:outline-none focus:ring focus:ring-indigo-500 text-white"
                />
              </div>

              {/* Password Field */}
              <div>
                <label
                  htmlFor="password"
                  className="block text-white text-lg font-semibold mb-2"
                >
                  {TEACHER_LABEL_PASSWORD}
                </label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  placeholder={TEACHER_PLACEHOLDER_PASSWORD}
                  value={formData.password}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 bg-black bg-opacity-50 border border-indigo-500 rounded-md focus:outline-none focus:ring focus:ring-indigo-500 text-white"
                />
              </div>

              {/* Confirm Password Field */}
              <div>
                <label
                  htmlFor="confirmPassword"
                  className="block text-white text-lg font-semibold mb-2"
                >
                  {TEACHER_LABEL_CONFIRM_PASSWORD}
                </label>
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  placeholder={TEACHER_PLACEHOLDER_CONFIRM_PASSWORD}
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 bg-black bg-opacity-50 border border-indigo-500 rounded-md focus:outline-none focus:ring focus:ring-indigo-500 text-white"
                />
              </div>

              {/* Teacher Specific Details */}
              <div>
                <label
                  htmlFor="name"
                  className="block text-white text-lg font-semibold mb-2"
                >
                  {TEACHER_LABEL_NAME}
                </label>
                <input
                  id="name"
                  name="name"
                  type="text"
                  placeholder={TEACHER_PLACEHOLDER_NAME}
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 bg-black bg-opacity-50 border border-indigo-500 rounded-md focus:outline-none focus:ring focus:ring-indigo-500 text-white"
                />
              </div>

              <div>
                <label
                  htmlFor="phone"
                  className="block text-white text-lg font-semibold mb-2"
                >
                  {TEACHER_LABEL_PHONE}
                </label>
                <input
                  id="phone"
                  name="phone"
                  type="text"
                  placeholder={TEACHER_PLACEHOLDER_PHONE}
                  value={formData.phone}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 bg-black bg-opacity-50 border border-indigo-500 rounded-md focus:outline-none focus:ring focus:ring-indigo-500 text-white"
                />
              </div>

              <div>
                <label
                  htmlFor="dob"
                  className="block text-white text-lg font-semibold mb-2"
                >
                  {TEACHER_LABEL_DOB}
                </label>
                <input
                  id="dob"
                  name="dob"
                  type="date"
                  value={formData.dob}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 bg-black bg-opacity-50 border border-indigo-500 rounded-md focus:outline-none focus:ring focus:ring-indigo-500 text-white"
                />
              </div>

              <div>
                <label
                  htmlFor="gender"
                  className="block text-white text-lg font-semibold mb-2"
                >
                  {TEACHER_LABEL_GENDER}
                </label>
                <select
                  id="gender"
                  name="gender"
                  value={formData.gender}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 bg-black bg-opacity-50 border border-indigo-500 rounded-md focus:outline-none focus:ring focus:ring-indigo-500 text-white"
                >
                  <option value="">Select Gender</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <div>
                <label
                  htmlFor="address"
                  className="block text-white text-lg font-semibold mb-2"
                >
                  {TEACHER_LABEL_ADDRESS}
                </label>
                <input
                  id="address"
                  name="address"
                  type="text"
                  value={formData.address}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 bg-black bg-opacity-50 border border-indigo-500 rounded-md focus:outline-none focus:ring focus:ring-indigo-500 text-white"
                />
              </div>

              <div>
                <label
                  htmlFor="joiningDate"
                  className="block text-white text-lg font-semibold mb-2"
                >
                  {TEACHER_LABEL_JOINING_DATE}
                </label>
                <input
                  id="joiningDate"
                  name="joiningDate"
                  type="date"
                  value={formData.joiningDate}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 bg-black bg-opacity-50 border border-indigo-500 rounded-md focus:outline-none focus:ring focus:ring-indigo-500 text-white"
                />
              </div>

              <div>
                <label
                  htmlFor="status"
                  className="block text-white text-lg font-semibold mb-2"
                >
                  {TEACHER_LABEL_STATUS}
                </label>
                <input
                  id="status"
                  name="status"
                  type="text"
                  placeholder={TEACHER_PLACEHOLDER_STATUS}
                  value={formData.status}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 bg-black bg-opacity-50 border border-indigo-500 rounded-md focus:outline-none focus:ring focus:ring-indigo-500 text-white"
                />
              </div>

              <div className="flex justify-end">
                <button
                  type="submit"
                  className="px-6 py-2 bg-indigo-600 hover:bg-indigo-700 rounded-md text-white font-bold transition duration-300"
                >
                  {TEACHER_PAGE_TITLE}
                </button>
              </div>
            </form>
          </div>
        </main>
      </div>
    </div>
  );
};

export default AddTeacher;

import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../../components/common/Sidebar";
import Navbar from "../../components/common/Navbar";
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

/**
 * AddStudent Component
 * ----------------------
 * Renders a futuristic form for adding a new student.
 * This component captures both user details and student-specific information.
 * It validates the data before submission and then calls userService and studentService.
 * Upon success, a success message is displayed and navigation occurs after a brief delay.
 */
const AddStudent: React.FC = () => {
  const navigate = useNavigate();

  // Initialize form data with role preset to "Student"
  const [formData, setFormData] = useState<StudentFormData>({
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
  });

  // State for error and success messages.
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  /**
   * handleChange
   * Updates the formData state as the user types in the input fields.
   * @param e - Input change event.
   */
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  /**
   * handleSubmit
   * Validates the form data and creates the student.
   * First creates a user via userService, then creates student details via studentService.
   * On success, displays a success message and navigates to the student management page.
   * @param e - Form submission event.
   */
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    // Validate the form data using external validation.
    const errors = validateStudentForm(formData);
    if (errors.length > 0) {
      setError(errors.join(" "));
      return;
    }

    try {
      // Create the user with role "Student"
      const userResponse = await userService.create({
        username: formData.username,
        email: formData.email,
        password: formData.password,
        role: "Student",
      });

      // Create student-specific details using the returned user ID.
      await studentService.create({
        userId: userResponse.id,
        firstName: formData.firstName,
        lastName: formData.lastName,
        dateOfBirth: formData.dateOfBirth,
        gender: formData.gender,
        address: formData.address,
        contactNumber: formData.contactNumber,
        nationality: formData.nationality,
      });

      setSuccess(STUDENT_SUCCESS_MESSAGE);
      // Reset form fields (role remains "Student")
      setFormData({
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
      });
      // Navigate to the Student Management page after a delay
      setTimeout(() => {
        navigate("/admin/student-management");
      }, STUDENT_NAVIGATION_DELAY_MS);
    } catch (err) {
      console.error("Error adding student:", err);
      setError(STUDENT_ERROR_MESSAGE);
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
            {STUDENT_HEADING}
          </h1>
          <div className="bg-black bg-opacity-50 border border-indigo-500 rounded-xl shadow-xl p-8 max-w-xl mx-auto">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Display Error and Success Messages */}
              {error && <p className="text-red-500">{error}</p>}
              {success && <p className="text-green-500">{success}</p>}

              {/* Username Field */}
              <div>
                <label
                  htmlFor="username"
                  className="block text-white text-lg font-semibold mb-2"
                >
                  {STUDENT_LABEL_USERNAME}
                </label>
                <input
                  id="username"
                  name="username"
                  type="text"
                  placeholder={STUDENT_PLACEHOLDER_USERNAME}
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
                  className="w-full px-4 py-2 bg-black bg-opacity-50 border border-indigo-500 rounded-md focus:outline-none focus:ring focus:ring-indigo-500 text-white"
                />
              </div>

              {/* Password Field */}
              <div>
                <label
                  htmlFor="password"
                  className="block text-white text-lg font-semibold mb-2"
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
                  className="w-full px-4 py-2 bg-black bg-opacity-50 border border-indigo-500 rounded-md focus:outline-none focus:ring focus:ring-indigo-500 text-white"
                />
              </div>

              {/* Confirm Password Field */}
              <div>
                <label
                  htmlFor="confirmPassword"
                  className="block text-white text-lg font-semibold mb-2"
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
                  className="w-full px-4 py-2 bg-black bg-opacity-50 border border-indigo-500 rounded-md focus:outline-none focus:ring focus:ring-indigo-500 text-white"
                />
              </div>

              {/* First Name Field */}
              <div>
                <label
                  htmlFor="firstName"
                  className="block text-white text-lg font-semibold mb-2"
                >
                  {STUDENT_LABEL_FIRST_NAME}
                </label>
                <input
                  id="firstName"
                  name="firstName"
                  type="text"
                  placeholder={STUDENT_PLACEHOLDER_FIRST_NAME}
                  value={formData.firstName}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 bg-black bg-opacity-50 border border-indigo-500 rounded-md focus:outline-none focus:ring focus:ring-indigo-500 text-white"
                />
              </div>

              {/* Last Name Field */}
              <div>
                <label
                  htmlFor="lastName"
                  className="block text-white text-lg font-semibold mb-2"
                >
                  {STUDENT_LABEL_LAST_NAME}
                </label>
                <input
                  id="lastName"
                  name="lastName"
                  type="text"
                  placeholder={STUDENT_PLACEHOLDER_LAST_NAME}
                  value={formData.lastName}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 bg-black bg-opacity-50 border border-indigo-500 rounded-md focus:outline-none focus:ring focus:ring-indigo-500 text-white"
                />
              </div>

              {/* Date of Birth Field */}
              <div>
                <label
                  htmlFor="dateOfBirth"
                  className="block text-white text-lg font-semibold mb-2"
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
                  className="w-full px-4 py-2 bg-black bg-opacity-50 border border-indigo-500 rounded-md focus:outline-none focus:ring focus:ring-indigo-500 text-white"
                />
              </div>

              {/* Gender Field */}
              <div>
                <label
                  htmlFor="gender"
                  className="block text-white text-lg font-semibold mb-2"
                >
                  {STUDENT_LABEL_GENDER}
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

              {/* Address Field */}
              <div>
                <label
                  htmlFor="address"
                  className="block text-white text-lg font-semibold mb-2"
                >
                  {STUDENT_LABEL_ADDRESS}
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

              {/* Contact Number Field */}
              <div>
                <label
                  htmlFor="contactNumber"
                  className="block text-white text-lg font-semibold mb-2"
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
                  className="w-full px-4 py-2 bg-black bg-opacity-50 border border-indigo-500 rounded-md focus:outline-none focus:ring focus:ring-indigo-500 text-white"
                />
              </div>

              {/* Nationality Field */}
              <div>
                <label
                  htmlFor="nationality"
                  className="block text-white text-lg font-semibold mb-2"
                >
                  {STUDENT_LABEL_NATIONALITY}
                </label>
                <input
                  id="nationality"
                  name="nationality"
                  type="text"
                  value={formData.nationality}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 bg-black bg-opacity-50 border border-indigo-500 rounded-md focus:outline-none focus:ring focus:ring-indigo-500 text-white"
                />
              </div>

              {/* Submit Button */}
              <div className="flex justify-end">
                <button
                  type="submit"
                  className="px-6 py-2 bg-indigo-600 hover:bg-indigo-700 rounded-md text-white font-bold transition duration-300"
                >
                  {STUDENT_PAGE_TITLE}
                </button>
              </div>
            </form>
          </div>
        </main>
      </div>
    </div>
  );
};

export default AddStudent;

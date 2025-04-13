import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../../components/common/Sidebar";
import Navbar from "../../components/common/Navbar";
import userService from "../../components/services/userService";
import { validateAdminForm, AdminFormData } from "../../utils/validation";
import {
  ADMIN_PAGE_TITLE,
  ADMIN_HEADING,
  ADMIN_LABEL_NAME,
  ADMIN_LABEL_EMAIL,
  ADMIN_LABEL_PASSWORD,
  ADMIN_LABEL_CONFIRM_PASSWORD,
  ADMIN_PLACEHOLDER_NAME,
  ADMIN_PLACEHOLDER_EMAIL,
  ADMIN_PLACEHOLDER_PASSWORD,
  ADMIN_PLACEHOLDER_CONFIRM_PASSWORD,
  ADMIN_SUCCESS_MESSAGE,
  ADMIN_ERROR_MESSAGE,
  ADMIN_NAVIGATE_DELAY_MS,
} from "../../constants/admin/adminStrings";

/**
 * AddAdmin Component
 * ------------------
 * Renders a futuristic form for adding a new admin.
 * Handles user creation via userService and validates the form data.
 * On successful submission, displays a success message and navigates to the user management page.
 */
const AddAdmin: React.FC = () => {
  const navigate = useNavigate();

  // Initialize admin form data with role pre-assigned as "Admin"
  const [formData, setFormData] = useState<AdminFormData>({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  // State for error and success messages
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  /**
   * handleChange - Updates form data state as the user types.
   * @param e - Change event from an input element.
   */
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  /**
   * handleSubmit - Validates the form data and, if valid, creates a new admin user.
   * On success, displays a message and navigates to the user management page.
   * @param e - Form submit event.
   */
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    // Validate form data using the external validation function.
    const errors = validateAdminForm(formData);
    if (errors.length > 0) {
      setError(errors.join(" "));
      return;
    }

    try {
      // Create the admin user with role "Admin"
      await userService.create({
        username: formData.name, // Using name as username; adjust if needed
        email: formData.email,
        password: formData.password,
        role: "Admin",
      });

      // On success, display a success message and reset the form.
      setSuccess(ADMIN_SUCCESS_MESSAGE);
      setFormData({
        name: "",
        email: "",
        password: "",
        confirmPassword: "",
      });
      setTimeout(() => {
        navigate("/admin/user-management");
      }, ADMIN_NAVIGATE_DELAY_MS);
    } catch (err) {
      console.error("Error adding admin:", err);
      setError(ADMIN_ERROR_MESSAGE);
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
            {ADMIN_HEADING}
          </h1>
          <div className="bg-black bg-opacity-50 border border-indigo-500 rounded-xl shadow-xl p-8 max-w-xl mx-auto">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Error and Success Messages */}
              {error && <p className="text-red-500">{error}</p>}
              {success && <p className="text-green-500">{success}</p>}

              {/* Name Input */}
              <div>
                <label
                  htmlFor="name"
                  className="block text-white text-lg font-semibold mb-2"
                >
                  {ADMIN_LABEL_NAME}
                </label>
                <input
                  id="name"
                  name="name"
                  type="text"
                  placeholder={ADMIN_PLACEHOLDER_NAME}
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 bg-black bg-opacity-50 border border-indigo-500 rounded-md focus:outline-none focus:ring focus:ring-indigo-500 text-white"
                />
              </div>

              {/* Email Input */}
              <div>
                <label
                  htmlFor="email"
                  className="block text-white text-lg font-semibold mb-2"
                >
                  {ADMIN_LABEL_EMAIL}
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  placeholder={ADMIN_PLACEHOLDER_EMAIL}
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 bg-black bg-opacity-50 border border-indigo-500 rounded-md focus:outline-none focus:ring focus:ring-indigo-500 text-white"
                />
              </div>

              {/* Password Input */}
              <div>
                <label
                  htmlFor="password"
                  className="block text-white text-lg font-semibold mb-2"
                >
                  {ADMIN_LABEL_PASSWORD}
                </label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  placeholder={ADMIN_PLACEHOLDER_PASSWORD}
                  value={formData.password}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 bg-black bg-opacity-50 border border-indigo-500 rounded-md focus:outline-none focus:ring focus:ring-indigo-500 text-white"
                />
              </div>

              {/* Confirm Password Input */}
              <div>
                <label
                  htmlFor="confirmPassword"
                  className="block text-white text-lg font-semibold mb-2"
                >
                  {ADMIN_LABEL_CONFIRM_PASSWORD}
                </label>
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  placeholder={ADMIN_PLACEHOLDER_CONFIRM_PASSWORD}
                  value={formData.confirmPassword}
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
                  {ADMIN_PAGE_TITLE}
                </button>
              </div>
            </form>
          </div>
        </main>
      </div>
    </div>
  );
};

export default AddAdmin;

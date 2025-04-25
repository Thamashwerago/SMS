import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, X } from "lucide-react";
import Sidebar from "../../components/common/Sidebar";
import Navbar from "../../components/common/Navbar";
import CommonButton from "../../components/common/Button";
import userService, { AddUser } from "../../services/userService";
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
 * Renders a form for creating a new admin user with clear and back controls.
 */
const AddAdmin: React.FC = () => {
  const navigate = useNavigate();

  const initialData: AdminFormData = {
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  };

  const [formData, setFormData] = useState<AdminFormData>(initialData);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleClear = () => {
    setFormData(initialData);
    setError(null);
    setSuccess(null);
  };

  const handleBack = () => navigate(-1);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    const errors = validateAdminForm(formData);
    if (errors.length) {
      setError(errors.join(" "));
      return;
    }

    setSubmitting(true);
    try {
      const newAdmin: Omit<AddUser, 'id'> = {
        username: formData.name,
        email: formData.email,
        password: formData.password,
        role: 'ADMIN'
      };
      await userService.create(newAdmin);

      setSuccess(ADMIN_SUCCESS_MESSAGE);
      setFormData(initialData);
      setTimeout(() => navigate("/admin/user-management"), ADMIN_NAVIGATE_DELAY_MS);
    } catch (err) {
      console.error(err);
      setError(ADMIN_ERROR_MESSAGE);
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

          {/* Heading */}
          <h1 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500 mb-8">
            {ADMIN_HEADING}
          </h1>

          {/* Form Card */}
          <div className="bg-black bg-opacity-50 border border-indigo-500 rounded-xl shadow-xl p-8 max-w-xl mx-auto">
            <form onSubmit={handleSubmit} className="space-y-6">
              {error && <p className="text-red-500">{error}</p>}
              {success && <p className="text-green-500">{success}</p>}

              {/* Name */}
              <div>
                <label
                  htmlFor="name"
                  className="block text-lg font-semibold mb-2"
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
                  className="w-full px-4 py-2 bg-gray-800 border border-indigo-500 rounded-md focus:outline-none focus:ring focus:ring-indigo-500 text-white"
                />
              </div>

              {/* Email */}
              <div>
                <label
                  htmlFor="email"
                  className="block text-lg font-semibold mb-2"
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
                  className="w-full px-4 py-2 bg-gray-800 border border-indigo-500 rounded-md focus:outline-none focus:ring focus:ring-indigo-500 text-white"
                />
              </div>

              {/* Password */}
              <div>
                <label
                  htmlFor="password"
                  className="block text-lg font-semibold mb-2"
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
                  className="w-full px-4 py-2 bg-gray-800 border border-indigo-500 rounded-md focus:outline-none focus:ring focus:ring-indigo-500 text-white"
                />
              </div>

              {/* Confirm Password */}
              <div>
                <label
                  htmlFor="confirmPassword"
                  className="block text-lg font-semibold mb-2"
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
                  className="w-full px-4 py-2 bg-gray-800 border border-indigo-500 rounded-md focus:outline-none focus:ring focus:ring-indigo-500 text-white"
                />
              </div>

              {/* Actions */}
              <div className="flex justify-end space-x-4">
                <CommonButton
                  type="button"
                  label="Clear"
                  variant="secondary"
                  size="md"
                  onClick={handleClear}
                  disabled={submitting}
                >
                  <X className="ml-2" />
                </CommonButton>
                <CommonButton
                  type="submit"
                  label={ADMIN_PAGE_TITLE}
                  variant="primary"
                  size="md"
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

export default AddAdmin;
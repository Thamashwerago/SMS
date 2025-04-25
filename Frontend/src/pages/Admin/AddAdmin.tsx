// src/pages/Admin/AddAdmin.tsx
import React, { useState } from "react";
import { ArrowLeft, X } from "lucide-react";
import { useNavigate } from "react-router-dom";
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
    setError(null);
    setSuccess(null);
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
      const newAdmin: Omit<AddUser, "id"> = {
        username: formData.name,
        email: formData.email,
        password: formData.password,
        role: "ADMIN",
      };
      await userService.create(newAdmin);

      setSuccess(ADMIN_SUCCESS_MESSAGE);
      setFormData(initialData);
      setTimeout(
        () => navigate("/admin/user-management"),
        ADMIN_NAVIGATE_DELAY_MS
      );
    } catch (err) {
      console.error(err);
      setError(ADMIN_ERROR_MESSAGE);
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
          <header className="flex items-center justify-between">
            <h1 className="text-3xl font-bold">{ADMIN_HEADING}</h1>
            <CommonButton
              size="md"
              variant="secondary"
              leftIcon={<ArrowLeft />}
              label="Back"
              onClick={handleBack}
            />
          </header>

          {/* Messages */}
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

          {/* Form */}
          <div className="bg-gray-800 rounded-lg shadow p-6 max-w-xl mx-auto">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Name */}
              <div>
                <label
                  htmlFor="name"
                  className="block mb-1 font-semibold"
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
                  className="w-full px-4 py-2 bg-gray-700 border border-indigo-500 rounded focus:outline-none focus:ring focus:ring-indigo-500"
                />
              </div>

              {/* Email */}
              <div>
                <label
                  htmlFor="email"
                  className="block mb-1 font-semibold"
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
                  className="w-full px-4 py-2 bg-gray-700 border border-indigo-500 rounded focus:outline-none focus:ring focus:ring-indigo-500"
                />
              </div>

              {/* Password */}
              <div>
                <label
                  htmlFor="password"
                  className="block mb-1 font-semibold"
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
                  className="w-full px-4 py-2 bg-gray-700 border border-indigo-500 rounded focus:outline-none focus:ring focus:ring-indigo-500"
                />
              </div>

              {/* Confirm Password */}
              <div>
                <label
                  htmlFor="confirmPassword"
                  className="block mb-1 font-semibold"
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
                  onClick={handleClear}
                  disabled={submitting}
                >
                  <X className="ml-2" />
                </CommonButton>
                <CommonButton
                  type="submit"
                  variant="primary"
                  size="md"
                  label={ADMIN_PAGE_TITLE}
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

// src/pages/Admin/AdminProfile.tsx
import React, { useState, useEffect, useCallback } from "react";
import { Eye, EyeOff } from "lucide-react";
import Sidebar from "../../components/common/Sidebar";
import Navbar from "../../components/common/Navbar";
import CommonButton from "../../components/common/Button";
import userService, { User } from "../../services/userService";
import { validateProfileForm } from "../../utils/validation";
import { PROFILE_STRINGS } from "../../constants/admin/profileConsts";

const AdminProfile: React.FC = () => {
  const [profile, setProfile] = useState<User | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const fetchProfile = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const user = localStorage.getItem("user") ?? sessionStorage.getItem("user") ?? "";
      const { userId } = JSON.parse(user);
      if (!userId) throw new Error("No user ID in session");
      const data = await userService.getById(userId);
      setProfile(data);
      setFormData({
        username: data.username,
        email: data.email,
        password: "",
        confirmPassword: "",
      });
    } catch (e) {
      console.error(e);
      setError(PROFILE_STRINGS.ERROR_FETCH);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setError(null);
    setSuccess(null);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    const errs = validateProfileForm(formData);
    if (errs.length) {
      setError(errs.join(" "));
      return;
    }
    if (!profile) return;
    setLoading(true);
    try {
      await userService.updatePassword(profile.id, {
        id: profile.id,
        username: formData.username,
        email: formData.email,
        role: profile.role,
        password: formData.password,
      });
      setSuccess(PROFILE_STRINGS.SUCCESS_UPDATE);
      // Re-fetch to clear password fields
      setTimeout(fetchProfile, PROFILE_STRINGS.NAVIGATE_DELAY_MS);
    } catch {
      setError(PROFILE_STRINGS.ERROR_UPDATE);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex bg-gray-900 text-white">
      <Sidebar />
      <div className="ml-64 flex-1 flex flex-col">
        <Navbar />

        <main className="p-6 space-y-8">
          {/* Page Title */}
          <header className="flex items-center justify-between">
            <h1 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500">
              {PROFILE_STRINGS.PAGE_HEADING}
            </h1>
          </header>

          {/* Loading, Error, Success */}
          {loading && <p className="text-gray-400">Loading...</p>}
          {error && (
            <div className="p-4 bg-red-600 rounded text-white">{error}</div>
          )}
          {success && (
            <div className="p-4 bg-green-600 rounded text-white">{success}</div>
          )}

          {/* Profile Form */}
          <div className="bg-gray-800 rounded-lg shadow overflow-hidden max-w-lg mx-auto">
            <form onSubmit={handleSave} className="p-6 space-y-6">
              {/* Username */}
              <div>
                <label htmlFor="username" className="block mb-1 font-medium">
                  {PROFILE_STRINGS.LABEL_USERNAME}
                </label>
                <input
                  id="username"
                  name="username"
                  value={formData.username}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 bg-gray-700 rounded focus:outline-none focus:ring focus:ring-indigo-500"
                />
              </div>

              {/* Email */}
              <div>
                <label htmlFor="email" className="block mb-1 font-medium">
                  {PROFILE_STRINGS.LABEL_EMAIL}
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 bg-gray-700 rounded focus:outline-none focus:ring focus:ring-indigo-500"
                />
              </div>

              {/* Password */}
              <div className="relative">
                <label htmlFor="password" className="block mb-1 font-medium">
                  {PROFILE_STRINGS.LABEL_PASSWORD}
                </label>
                <input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  value={formData.password}
                  onChange={handleChange}
                  className="w-full px-4 py-2 bg-gray-700 rounded focus:outline-none focus:ring focus:ring-indigo-500"
                />
                <button
                  type="button"
                  className="absolute inset-y-12 right-3 flex items-center"
                  onClick={() => setShowPassword((v) => !v)}
                  aria-label="Toggle password visibility"
                >
                  {showPassword ? <EyeOff /> : <Eye />}
                </button>
              </div>

              {/* Confirm Password */}
              <div className="relative">
                <label htmlFor="confirmPassword" className="block mb-1 font-medium">
                  {PROFILE_STRINGS.LABEL_CONFIRM_PASSWORD}
                </label>
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type={showPassword ? "text" : "password"}
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className="w-full px-4 py-2 bg-gray-700 rounded focus:outline-none focus:ring focus:ring-indigo-500"
                />
                <button
                  type="button"
                  className="absolute inset-y-12 right-3 flex items-center"
                  onClick={() => setShowPassword((v) => !v)}
                  aria-label="Toggle password visibility"
                >
                  {showPassword ? <EyeOff /> : <Eye />}
                </button>
              </div>

              {/* Save Button */}
              <div className="flex justify-end">
                <CommonButton
                  type="submit"
                  variant="primary"
                  label={PROFILE_STRINGS.BUTTON_SAVE}
                  isLoading={loading}
                />
              </div>
            </form>
          </div>
        </main>
      </div>
    </div>
  );
};

export default React.memo(AdminProfile);

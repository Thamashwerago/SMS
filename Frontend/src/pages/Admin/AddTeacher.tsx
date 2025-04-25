import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, X } from "lucide-react";
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
  role: "Teacher",
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
      const userResp = await userService.create({
        username: formData.username,
        email: formData.email,
        password: formData.password,
        role: "Teacher",
        token: "",
      });
      await teacherService.create({
        userId: userResp.id,
        name: formData.name,
        phone: formData.phone,
        dob: formData.dob,
        gender: formData.gender,
        address: formData.address,
        joiningDate: new Date(formData.joiningDate),
        status: formData.status,
        role: "Teacher",
      });
      setSuccess(TEACHER_SUCCESS_MESSAGE);
      setFormData(initialForm);
      setTimeout(() => navigate('/admin/teacher-management'), TEACHER_NAVIGATION_DELAY_MS);
    } catch (err) {
      console.error(err);
      setError(TEACHER_ERROR_MESSAGE);
    }
    setSubmitting(false);
  };

  return (
    <div className="min-h-screen flex bg-gradient-to-br from-gray-900 to-black text-white">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <Navbar />
        <main className="p-8 relative">
          {/* Back Button */}
          <button
            onClick={handleBack}
            aria-label="Go back"
            className="absolute top-8 right-8 p-2 bg-gray-800 bg-opacity-50 hover:bg-opacity-75 rounded-full focus:outline-none focus:ring-2 focus:ring-indigo-400"
          >
            <ArrowLeft size={24} />
          </button>

          <h1 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500 mb-8">
            {TEACHER_HEADING}
          </h1>

          <div className="mx-auto w-full max-w-xl bg-black bg-opacity-50 border border-indigo-500 rounded-xl shadow-xl p-8">
            <form onSubmit={handleSubmit} className="space-y-6">
              {error && <p className="text-red-500">{error}</p>}
              {success && <p className="text-green-500">{success}</p>}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Username */}
                <div>
                  <label htmlFor="username" className="block mb-2 font-semibold">
                    {TEACHER_LABEL_USERNAME}
                  </label>
                  <input
                    id="username" name="username"
                    placeholder={TEACHER_PLACEHOLDER_USERNAME}
                    value={formData.username} onChange={handleChange}
                    required
                    className="w-full px-4 py-2 bg-gray-800 border border-indigo-500 rounded-md focus:ring-indigo-400 text-white" />
                </div>
                {/* Email */}
                <div>
                  <label htmlFor="email" className="block mb-2 font-semibold">
                    {TEACHER_LABEL_EMAIL}
                  </label>
                  <input
                    id="email" name="email" type="email"
                    placeholder={TEACHER_PLACEHOLDER_EMAIL}
                    value={formData.email} onChange={handleChange}
                    required
                    className="w-full px-4 py-2 bg-gray-800 border border-indigo-500 rounded-md focus:ring-indigo-400 text-white" />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Password */}
                <div>
                  <label htmlFor="password" className="block mb-2 font-semibold">
                    {TEACHER_LABEL_PASSWORD}
                  </label>
                  <input
                    id="password" name="password" type="password"
                    placeholder={TEACHER_PLACEHOLDER_PASSWORD}
                    value={formData.password} onChange={handleChange}
                    required
                    className="w-full px-4 py-2 bg-gray-800 border border-indigo-500 rounded-md focus:ring-indigo-400 text-white" />
                </div>
                {/* Confirm Password */}
                <div>
                  <label htmlFor="confirmPassword" className="block mb-2 font-semibold">
                    {TEACHER_LABEL_CONFIRM_PASSWORD}
                  </label>
                  <input
                    id="confirmPassword" name="confirmPassword" type="password"
                    placeholder={TEACHER_PLACEHOLDER_CONFIRM_PASSWORD}
                    value={formData.confirmPassword} onChange={handleChange}
                    required
                    className="w-full px-4 py-2 bg-gray-800 border border-indigo-500 rounded-md focus:ring-indigo-400 text-white" />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Name */}
                <div>
                  <label htmlFor="name" className="block mb-2 font-semibold">
                    {TEACHER_LABEL_NAME}
                  </label>
                  <input
                    id="name" name="name"
                    placeholder={TEACHER_PLACEHOLDER_NAME}
                    value={formData.name} onChange={handleChange}
                    required
                    className="w-full px-4 py-2 bg-gray-800 border border-indigo-500 rounded-md focus:ring-indigo-400 text-white" />
                </div>
                {/* Phone */}
                <div>
                  <label htmlFor="phone" className="block mb-2 font-semibold">
                    {TEACHER_LABEL_PHONE}
                  </label>
                  <input
                    id="phone" name="phone"
                    placeholder={TEACHER_PLACEHOLDER_PHONE}
                    value={formData.phone} onChange={handleChange}
                    required
                    className="w-full px-4 py-2 bg-gray-800 border border-indigo-500 rounded-md focus:ring-indigo-400 text-white" />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* DOB */}
                <div>
                  <label htmlFor="dob" className="block mb-2 font-semibold">
                    {TEACHER_LABEL_DOB}
                  </label>
                  <input
                    id="dob" name="dob" type="date"
                    value={formData.dob} onChange={handleChange}
                    required
                    className="w-full px-4 py-2 bg-gray-800 border border-indigo-500 rounded-md focus:ring-indigo-400 text-white" />
                </div>
                {/* Gender */}
                <div>
                  <label htmlFor="gender" className="block mb-2 font-semibold">
                    {TEACHER_LABEL_GENDER}
                  </label>
                  <select
                    id="gender" name="gender" value={formData.gender} onChange={handleChange} required
                    className="w-full px-4 py-2 bg-gray-800 border border-indigo-500 rounded-md focus:ring-indigo-400 text-white" >
                    <option value="">Select Gender</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Address */}
                <div>
                  <label htmlFor="address" className="block mb-2 font-semibold">
                    {TEACHER_LABEL_ADDRESS}
                  </label>
                  <input
                    id="address" name="address"
                    value={formData.address} onChange={handleChange}
                    required
                    className="w-full px-4 py-2 bg-gray-800 border border-indigo-500 rounded-md focus:ring-indigo-400 text-white" />
                </div>
                {/* Joining Date */}
                <div>
                  <label htmlFor="joiningDate" className="block mb-2 font-semibold">
                    {TEACHER_LABEL_JOINING_DATE}
                  </label>
                  <input
                    id="joiningDate" name="joiningDate" type="date"
                    value={formData.joiningDate} onChange={handleChange}
                    required
                    className="w-full px-4 py-2 bg-gray-800 border border-indigo-500 rounded-md focus:ring-indigo-400 text-white" />
                </div>
              </div>

              <div>
                <label htmlFor="status" className="block mb-2 font-semibold">
                  {TEACHER_LABEL_STATUS}
                </label>
                <input
                  id="status" name="status" type="text"
                  placeholder={TEACHER_PLACEHOLDER_STATUS}
                  value={formData.status} onChange={handleChange}
                  required
                  className="w-full px-4 py-2 bg-gray-800 border border-indigo-500 rounded-md focus:ring-indigo-400 text-white" />
              </div>

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
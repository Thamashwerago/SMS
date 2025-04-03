// src/pages/Admin/AddTeacher.tsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../../components/common/Sidebar';
import Navbar from '../../components/common/Navbar';
import userService from '../../components/services/userService';
import teacherService from '../../components/services/teacherService';

interface TeacherFormData {
  username: string;
  email: string;
  password: string;
  name: string;
  phone: string;
  dob: string;
  gender: string;
  address: string;
  joiningDate: string;
  status: string;
  role: string;
}

const AddTeacher: React.FC = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState<TeacherFormData>({
    username: '',
    email: '',
    password: '',
    name: '',
    phone: '',
    dob: '',
    gender: '',
    address: '',
    joiningDate: '',
    status: '',
    role: '',
  });
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    try {
      // Create the user first using userService.
      const userResponse = await userService.create({
        username: formData.username,
        email: formData.email,
        password: formData.password,
        role: 'Teacher', // ensure role is set appropriately
      });
      
      // Create the teacher using teacherService and the returned user ID.
      await teacherService.create({
        userId: userResponse.id,
        name: formData.name,
        phone: formData.phone,
        dob: formData.dob,
        gender: formData.gender,
        address: formData.address,
        joiningDate: formData.joiningDate,
        status: formData.status,
        role: formData.role,
      });

      setSuccess('Teacher added successfully.');
      // Clear form fields
      setFormData({
        username: '',
        email: '',
        password: '',
        name: '',
        phone: '',
        dob: '',
        gender: '',
        address: '',
        joiningDate: '',
        status: '',
        role: '',
      });
      // Navigate to Teacher Management page after a short delay
      setTimeout(() => {
        navigate('/admin/teacher-management');
      }, 1500);
    } catch (err) {
      console.error('Error adding teacher:', err);
      setError('Error adding teacher. Please try again.');
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
          <h1 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500 mb-8">
            Add Teacher
          </h1>
          <div className="bg-black bg-opacity-50 border border-indigo-500 rounded-xl shadow-xl p-8 max-w-xl mx-auto">
            <form onSubmit={handleSubmit} className="space-y-6">
              {error && <p className="text-red-500">{error}</p>}
              {success && <p className="text-green-500">{success}</p>}

              {/* User Details */}
              <div>
                <label htmlFor="username" className="block text-white text-lg font-semibold mb-2">
                  Username
                </label>
                <input
                  id="username"
                  name="username"
                  type="text"
                  value={formData.username}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 bg-black bg-opacity-50 border border-indigo-500 rounded-md focus:outline-none text-white"
                />
              </div>

              <div>
                <label htmlFor="email" className="block text-white text-lg font-semibold mb-2">
                  Email
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 bg-black bg-opacity-50 border border-indigo-500 rounded-md focus:outline-none text-white"
                />
              </div>

              <div>
                <label htmlFor="password" className="block text-white text-lg font-semibold mb-2">
                  Password
                </label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 bg-black bg-opacity-50 border border-indigo-500 rounded-md focus:outline-none text-white"
                />
              </div>

              {/* Teacher Specific Details */}
              <div>
                <label htmlFor="name" className="block text-white text-lg font-semibold mb-2">
                  Name
                </label>
                <input
                  id="name"
                  name="name"
                  type="text"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 bg-black bg-opacity-50 border border-indigo-500 rounded-md focus:outline-none text-white"
                />
              </div>

              <div>
                <label htmlFor="phone" className="block text-white text-lg font-semibold mb-2">
                  Phone
                </label>
                <input
                  id="phone"
                  name="phone"
                  type="text"
                  value={formData.phone}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 bg-black bg-opacity-50 border border-indigo-500 rounded-md focus:outline-none text-white"
                />
              </div>

              <div>
                <label htmlFor="dob" className="block text-white text-lg font-semibold mb-2">
                  Date of Birth
                </label>
                <input
                  id="dob"
                  name="dob"
                  type="date"
                  value={formData.dob}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 bg-black bg-opacity-50 border border-indigo-500 rounded-md focus:outline-none text-white"
                />
              </div>

              <div>
                <label htmlFor="gender" className="block text-white text-lg font-semibold mb-2">
                  Gender
                </label>
                <select
                  id="gender"
                  name="gender"
                  value={formData.gender}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 bg-black bg-opacity-50 border border-indigo-500 rounded-md focus:outline-none text-white"
                >
                  <option value="">Select Gender</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <div>
                <label htmlFor="address" className="block text-white text-lg font-semibold mb-2">
                  Address
                </label>
                <input
                  id="address"
                  name="address"
                  type="text"
                  value={formData.address}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 bg-black bg-opacity-50 border border-indigo-500 rounded-md focus:outline-none text-white"
                />
              </div>

              <div>
                <label htmlFor="joiningDate" className="block text-white text-lg font-semibold mb-2">
                  Joining Date
                </label>
                <input
                  id="joiningDate"
                  name="joiningDate"
                  type="date"
                  value={formData.joiningDate}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 bg-black bg-opacity-50 border border-indigo-500 rounded-md focus:outline-none text-white"
                />
              </div>

              <div>
                <label htmlFor="status" className="block text-white text-lg font-semibold mb-2">
                  Status
                </label>
                <input
                  id="status"
                  name="status"
                  type="text"
                  value={formData.status}
                  onChange={handleChange}
                  required
                  placeholder="Active/Inactive"
                  className="w-full px-4 py-2 bg-black bg-opacity-50 border border-indigo-500 rounded-md focus:outline-none text-white"
                />
              </div>

              <div>
                <label htmlFor="role" className="block text-white text-lg font-semibold mb-2">
                  Role
                </label>
                <input
                  id="role"
                  name="role"
                  type="text"
                  value={formData.role}
                  onChange={handleChange}
                  required
                  placeholder="Subject or Designation"
                  className="w-full px-4 py-2 bg-black bg-opacity-50 border border-indigo-500 rounded-md focus:outline-none text-white"
                />
              </div>

              <div className="flex justify-end">
                <button
                  type="submit"
                  className="px-6 py-2 bg-indigo-600 hover:bg-indigo-700 rounded-md text-white font-bold transition duration-300"
                >
                  Add Teacher
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

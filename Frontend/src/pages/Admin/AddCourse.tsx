/**
 * AddCourse.tsx
 *
 * Futuristic Add Course Page
 * ---------------------------
 * - Provides a form for creating a new course.
 * - Includes fields: Course Code, Course Name, Credits, Duration, and Description.
 * - Validates that all required fields are provided.
 * - Uses a dark gradient background with neon accents.
 * - On successful submission, displays a success message and navigates to the Course Management page.
 */

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../../components/common/Sidebar';
import Navbar from '../../components/common/Navbar';

interface CourseFormData {
  code: string;
  name: string;
  credits: string;    // Stored as string to allow input handling; convert to number on submit.
  duration: string;   // Stored as string for the same reason.
  description: string;
}

const AddCourse: React.FC = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState<CourseFormData>({
    code: '',
    name: '',
    credits: '',
    duration: '',
    description: '',
  });
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);

    // Validate that all fields are filled
    if (
      !formData.code ||
      !formData.name ||
      !formData.credits ||
      !formData.duration ||
      !formData.description
    ) {
      setError('Please fill in all the required fields.');
      return;
    }

    // Prepare the course object matching the backend Course model.
    const courseData = {
      code: formData.code,
      name: formData.name,
      credits: Number(formData.credits),
      duration: Number(formData.duration),
      description: formData.description,
    };

    // Simulate an API call to add a course
    console.log('Course added:', courseData);
    setSuccess('Course added successfully.');

    // Clear form fields
    setFormData({
      code: '',
      name: '',
      credits: '',
      duration: '',
      description: '',
    });

    // Navigate to Course Management page after a short delay
    setTimeout(() => {
      navigate('/admin/course-management');
    }, 1500);
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
            Add Course
          </h1>
          <div className="bg-black bg-opacity-50 border border-indigo-500 rounded-xl shadow-xl p-8 max-w-xl mx-auto">
            <form onSubmit={handleSubmit} className="space-y-6">
              {error && <p className="text-red-500">{error}</p>}
              {success && <p className="text-green-500">{success}</p>}
              <div>
                <label htmlFor="code" className="block text-white text-lg font-semibold mb-2">
                  Course Code
                </label>
                <input
                  id="code"
                  name="code"
                  type="text"
                  value={formData.code}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 bg-black bg-opacity-50 border border-indigo-500 rounded-md focus:outline-none text-white"
                />
              </div>
              <div>
                <label htmlFor="name" className="block text-white text-lg font-semibold mb-2">
                  Course Name
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
                <label htmlFor="credits" className="block text-white text-lg font-semibold mb-2">
                  Credits
                </label>
                <input
                  id="credits"
                  name="credits"
                  type="number"
                  value={formData.credits}
                  onChange={handleChange}
                  required
                  min="0"
                  className="w-full px-4 py-2 bg-black bg-opacity-50 border border-indigo-500 rounded-md focus:outline-none text-white"
                />
              </div>
              <div>
                <label htmlFor="duration" className="block text-white text-lg font-semibold mb-2">
                  Duration (hours)
                </label>
                <input
                  id="duration"
                  name="duration"
                  type="number"
                  value={formData.duration}
                  onChange={handleChange}
                  required
                  min="0"
                  className="w-full px-4 py-2 bg-black bg-opacity-50 border border-indigo-500 rounded-md focus:outline-none text-white"
                />
              </div>
              <div>
                <label htmlFor="description" className="block text-white text-lg font-semibold mb-2">
                  Description
                </label>
                <textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 bg-black bg-opacity-50 border border-indigo-500 rounded-md focus:outline-none text-white"
                />
              </div>
              <div className="flex justify-end">
                <button
                  type="submit"
                  className="px-6 py-2 bg-indigo-600 hover:bg-indigo-700 rounded-md text-white font-bold transition duration-300"
                >
                  Add Course
                </button>
              </div>
            </form>
          </div>
        </main>
      </div>
    </div>
  );
};

export default AddCourse;

/**
 * TeacherManagement.tsx
 *
 * This component represents the Teacher Management page for the admin.
 * It displays a searchable, sortable list of teacher records in a table format.
 * When a teacher row is clicked, a modal popup displays detailed teacher information.
 * In a production application, teacher data would typically be fetched from a backend API.
 */

import React, { useState, useMemo } from 'react';
import Sidebar from '../../components/common/Sidebar';
import Navbar from '../../components/common/Navbar';

interface Teacher {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
}

// Dummy teacher data; replace with data fetched from a backend API.
const dummyTeachers: Teacher[] = [
  { id: 1, firstName: 'David', lastName: 'Lee', email: 'david@example.com' },
  { id: 2, firstName: 'Sophia', lastName: 'Williams', email: 'sophia@example.com' },
  { id: 3, firstName: 'Michael', lastName: 'Johnson', email: 'michael@example.com' },
];

const TeacherManagement: React.FC = () => {
  // State for search query, sorting option, and selected teacher for modal display.
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'id' | 'name' | 'email'>('id');
  const [selectedTeacher, setSelectedTeacher] = useState<Teacher | null>(null);

  /**
   * sortedFilteredTeachers
   *
   * Computes the filtered and sorted teacher list based on the search query and sort criteria.
   */
  const sortedFilteredTeachers = useMemo(() => {
    const filtered = dummyTeachers.filter((teacher) =>
      `${teacher.firstName} ${teacher.lastName}`.toLowerCase().includes(searchQuery.toLowerCase()) ||
      teacher.email.toLowerCase().includes(searchQuery.toLowerCase())
    );
    return [...filtered].sort((a, b) => {
      if (sortBy === 'id') {
        return a.id - b.id;
      }
      if (sortBy === 'name') {
        const nameA = `${a.firstName} ${a.lastName}`.toLowerCase();
        const nameB = `${b.firstName} ${b.lastName}`.toLowerCase();
        return nameA.localeCompare(nameB);
      }
      if (sortBy === 'email') {
        return a.email.localeCompare(b.email);
      }
      return 0;
    });
  }, [searchQuery, sortBy]);

  /**
   * closeModal
   *
   * Closes the teacher detail modal by resetting selectedTeacher.
   */
  const closeModal = () => setSelectedTeacher(null);

  return (
    <div className="min-h-screen flex bg-white text-gray-900 font-roboto">
      {/* Sidebar Navigation */}
      <Sidebar />
      {/* Main Content */}
      <div className="flex-1 p-6">
        {/* Top Navbar */}
        <Navbar />
        {/* Content Container */}
        <div className="mt-6">
          {/* Page Header */}
          <div className="mb-6">
            <h1 className="text-3xl font-bold mb-2">Teacher Management</h1>
            <p className="text-gray-600">Manage teacher records and details here.</p>
          </div>
          {/* Search, Sort Controls and "Add Teacher" Button */}
          <div className="mb-6 flex flex-col md:flex-row items-center justify-between">
            <input
              type="text"
              placeholder="Search teachers..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full md:w-1/3 p-2 mb-4 md:mb-0 rounded bg-white border border-gray-200 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <div className="flex items-center space-x-4 mb-4 md:mb-0">
              <label htmlFor="sortBy" className="text-gray-700">
                Sort by:
              </label>
              <select
                id="sortBy"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as 'id' | 'name' | 'email')}
                className="p-2 rounded bg-white border border-gray-200 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="id">ID</option>
                <option value="name">Name</option>
                <option value="email">Email</option>
              </select>
            </div>
            <button className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded transition-colors duration-200">
              Add Teacher
            </button>
          </div>
          {/* Teachers Table */}
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white rounded-lg border border-gray-200">
              <thead>
                <tr className="bg-gray-50">
                  <th className="py-3 px-4 border-b border-gray-200 text-left text-gray-700">ID</th>
                  <th className="py-3 px-4 border-b border-gray-200 text-left text-gray-700">Name</th>
                  <th className="py-3 px-4 border-b border-gray-200 text-left text-gray-700">Email</th>
                </tr>
              </thead>
              <tbody>
                {sortedFilteredTeachers.length > 0 ? (
                  sortedFilteredTeachers.map((teacher) => (
                    <tr
                      key={teacher.id}
                      className="hover:bg-gray-100 transition-colors cursor-pointer"
                      onClick={() => setSelectedTeacher(teacher)}
                    >
                      <td className="py-2 px-4 border-b border-gray-200">{teacher.id}</td>
                      <td className="py-2 px-4 border-b border-gray-200">
                        {teacher.firstName} {teacher.lastName}
                      </td>
                      <td className="py-2 px-4 border-b border-gray-200">{teacher.email}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={3} className="py-4 text-center text-gray-500">
                      No teachers found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Modal Popup for Teacher Details */}
      {selectedTeacher && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-sm w-full relative">
            {/* Close Button */}
            <button
              onClick={closeModal}
              className="absolute top-2 right-2 text-gray-500 hover:text-gray-700 text-2xl"
            >
              &times;
            </button>
            <h2 className="text-2xl font-bold mb-4">Teacher Details</h2>
            <p>
              <strong>ID:</strong> {selectedTeacher.id}
            </p>
            <p>
              <strong>Name:</strong> {selectedTeacher.firstName} {selectedTeacher.lastName}
            </p>
            <p>
              <strong>Email:</strong> {selectedTeacher.email}
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default TeacherManagement;

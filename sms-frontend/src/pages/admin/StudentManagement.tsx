/**
 * StudentManagement.tsx
 *
 * This component represents the Student Management page for the admin.
 * It displays a searchable, sortable list of students in a table.
 * When a student row is clicked, a modal pops up displaying the student's details.
 * In a production app, student data would be fetched from a backend API.
 */

import React, { useState, useMemo } from 'react';
import Sidebar from '../../components/common/Sidebar';
import Navbar from '../../components/common/Navbar';

interface Student {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
}

// Dummy student data; replace with your backend API data as needed.
const dummyStudents: Student[] = [
  { id: 1, firstName: 'Alice', lastName: 'Johnson', email: 'alice@example.com' },
  { id: 2, firstName: 'Bob', lastName: 'Smith', email: 'bob@example.com' },
  { id: 3, firstName: 'Charlie', lastName: 'Brown', email: 'charlie@example.com' },
];

const StudentManagement: React.FC = () => {
  // State for search query, sort option, and selected student for modal popup.
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'id' | 'name' | 'email'>('id');
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);

  /**
   * sortedFilteredStudents
   *
   * Filters and sorts the dummyStudents array based on the search query and sort criteria.
   */
  const sortedFilteredStudents = useMemo(() => {
    const filtered = dummyStudents.filter((student) =>
      `${student.firstName} ${student.lastName}`.toLowerCase().includes(searchQuery.toLowerCase())
    );
    const sorted = [...filtered].sort((a, b) => {
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
    return sorted;
  }, [searchQuery, sortBy]);

  /**
   * closeModal
   *
   * Closes the modal popup by resetting the selectedStudent.
   */
  const closeModal = () => {
    setSelectedStudent(null);
  };

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
            <h1 className="text-3xl font-bold mb-2">Student Management</h1>
            <p className="text-gray-600">Manage student records and details here.</p>
          </div>
          {/* Search and Sort Controls */}
          <div className="mb-6 flex flex-col md:flex-row items-center justify-between">
            <input
              type="text"
              placeholder="Search students..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full md:w-1/3 p-2 mb-4 md:mb-0 rounded bg-white border border-gray-200 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <div className="flex items-center space-x-4">
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
              Add Student
            </button>
          </div>
          {/* Students Table */}
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
                {sortedFilteredStudents.length > 0 ? (
                  sortedFilteredStudents.map((student) => (
                    <tr
                      key={student.id}
                      className="hover:bg-gray-100 transition-colors cursor-pointer"
                      onClick={() => setSelectedStudent(student)}
                    >
                      <td className="py-2 px-4 border-b border-gray-200">{student.id}</td>
                      <td className="py-2 px-4 border-b border-gray-200">
                        {student.firstName} {student.lastName}
                      </td>
                      <td className="py-2 px-4 border-b border-gray-200">{student.email}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={3} className="py-4 text-center text-gray-500">
                      No students found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Modal for Student Details */}
      {selectedStudent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-sm w-full relative">
            <button
              onClick={closeModal}
              className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
            >
              &times;
            </button>
            <h2 className="text-2xl font-bold mb-4">Student Details</h2>
            <p>
              <strong>ID:</strong> {selectedStudent.id}
            </p>
            <p>
              <strong>Name:</strong> {selectedStudent.firstName} {selectedStudent.lastName}
            </p>
            <p>
              <strong>Email:</strong> {selectedStudent.email}
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default StudentManagement;

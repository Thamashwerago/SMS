// src/pages/Admin/StudentManagement.tsx
import React, { useState, useMemo, ChangeEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../../components/common/Sidebar';
import Navbar from '../../components/common/Navbar';

interface Student {
  id: number;             // studentId from backend
  userId: number;
  firstName: string;
  lastName: string;
  dateOfBirth: string;    // ISO date string (e.g., "2000-01-01")
  gender: string;
  address: string;
  contactNumber: string;
  nationality: string;
}

// Dummy student data (to be replaced with API data)
const initialStudents: Student[] = [
  {
    id: 1,
    userId: 101,
    firstName: 'Alice',
    lastName: 'Johnson',
    dateOfBirth: '2000-01-01',
    gender: 'Female',
    address: '123 Main St, Cityville',
    contactNumber: '555-1234',
    nationality: 'American'
  },
  {
    id: 2,
    userId: 102,
    firstName: 'Bob',
    lastName: 'Smith',
    dateOfBirth: '1999-05-15',
    gender: 'Male',
    address: '456 Oak Ave, Townsville',
    contactNumber: '555-5678',
    nationality: 'American'
  },
  {
    id: 3,
    userId: 103,
    firstName: 'Charlie',
    lastName: 'Davis',
    dateOfBirth: '2001-08-20',
    gender: 'Male',
    address: '789 Pine Rd, Villageville',
    contactNumber: '555-9012',
    nationality: 'Canadian'
  }
];

const StudentManagement: React.FC = () => {
  const [students] = useState<Student[]>(initialStudents);
  const [searchQuery, setSearchQuery] = useState('');
  // Default sort column set to "firstName" (for full name sorting)
  const [sortColumn, setSortColumn] = useState<keyof Student>('firstName');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  // For editing basic fields (first name, last name, contact number)
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [editData, setEditData] = useState<{ firstName: string; lastName: string; contactNumber: string }>({
    firstName: '',
    lastName: '',
    contactNumber: ''
  });

  const navigate = useNavigate();

  // Handler for search input changes.
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  // Handler for sorting by column.
  const handleSort = (column: keyof Student) => {
    if (sortColumn === column) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortColumn(column);
      setSortDirection('asc');
    }
  };

  // Memoized filtering and sorting of students.
  const filteredAndSortedStudents = useMemo(() => {
    const filtered = students.filter((student) =>
      student.firstName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      student.lastName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      student.gender.toLowerCase().includes(searchQuery.toLowerCase()) ||
      student.nationality.toLowerCase().includes(searchQuery.toLowerCase())
    );
    filtered.sort((a, b) => {
      let valA: string | number;
      let valB: string | number;
      if (sortColumn === 'firstName') {
        // For full name, concatenate first and last names.
        valA = (a.firstName + ' ' + a.lastName).toLowerCase();
        valB = (b.firstName + ' ' + b.lastName).toLowerCase();
      } else {
        valA = a[sortColumn];
        valB = b[sortColumn];
        if (typeof valA === 'string') valA = valA.toLowerCase();
        if (typeof valB === 'string') valB = valB.toLowerCase();
      }
      if (valA < valB) return sortDirection === 'asc' ? -1 : 1;
      if (valA > valB) return sortDirection === 'asc' ? 1 : -1;
      return 0;
    });
    return filtered;
  }, [students, searchQuery, sortColumn, sortDirection]);

  // Handler when a student row is clicked.
  const handleRowClick = (student: Student) => {
    setSelectedStudent(student);
    setEditData({
      firstName: student.firstName,
      lastName: student.lastName,
      contactNumber: student.contactNumber
    });
    setIsEditing(false);
  };

  // Handle changes in edit fields.
  const handleEditChange = (e: ChangeEvent<HTMLInputElement>) => {
    setEditData({ ...editData, [e.target.name]: e.target.value });
  };

  // Toggle edit mode.
  const handleEditClick = () => {
    setIsEditing(true);
  };

  // Save edited data.
  const handleSave = () => {
    if (selectedStudent) {
      // In a real app, you would update via an API call.
      setSelectedStudent({
        ...selectedStudent,
        firstName: editData.firstName,
        lastName: editData.lastName,
        contactNumber: editData.contactNumber
      });
      setIsEditing(false);
    }
  };

  // Cancel editing.
  const handleCancelEdit = () => {
    setIsEditing(false);
    if (selectedStudent) {
      setEditData({
        firstName: selectedStudent.firstName,
        lastName: selectedStudent.lastName,
        contactNumber: selectedStudent.contactNumber
      });
    }
  };

  // Close the student details modal and navigate back.
  const closeModal = () => {
    setSelectedStudent(null);
    navigate('/admin/student-management');
  };

  return (
    <div className="min-h-screen flex font-roboto bg-gradient-to-br from-gray-900 to-black">
      {/* Sidebar Navigation */}
      <Sidebar />
      <div className="flex-1 flex flex-col">
        {/* Top Navbar */}
        <Navbar />
        <main className="p-8">
          <div className="flex flex-col sm:flex-row items-center justify-between mb-8">
            <h1 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500">
              Student Management
            </h1>
            <div className="flex items-center mt-4 sm:mt-0">
              <input
                type="text"
                placeholder="Search students..."
                value={searchQuery}
                onChange={handleSearchChange}
                className="px-4 py-2 bg-black bg-opacity-50 border border-indigo-500 rounded-l-xl focus:outline-none text-white placeholder-gray-400"
              />
              <button
                onClick={() => navigate('/admin/add-student')}
                className="px-6 py-2 bg-indigo-600 hover:bg-indigo-700 border border-indigo-500 rounded-r-xl text-white font-bold transition duration-300"
              >
                Add Student
              </button>
            </div>
          </div>

          {/* Student Table with advanced UI */}
          <div className="overflow-auto max-h-[500px] bg-black bg-opacity-50 border border-indigo-500 rounded-xl shadow-xl">
            <table className="min-w-full text-white">
              <thead className="bg-gray-800 sticky top-0 z-10">
                <tr>
                  <th
                    onClick={() => handleSort('id')}
                    className="cursor-pointer px-6 py-3 text-left text-sm font-medium uppercase tracking-wider"
                  >
                    Student ID {sortColumn === 'id' && (sortDirection === 'asc' ? '▲' : '▼')}
                  </th>
                  <th
                    onClick={() => handleSort('firstName')}
                    className="cursor-pointer px-6 py-3 text-left text-sm font-medium uppercase tracking-wider"
                  >
                    Full Name {sortColumn === 'firstName' && (sortDirection === 'asc' ? '▲' : '▼')}
                  </th>
                  <th
                    onClick={() => handleSort('gender')}
                    className="cursor-pointer px-6 py-3 text-left text-sm font-medium uppercase tracking-wider"
                  >
                    Gender {sortColumn === 'gender' && (sortDirection === 'asc' ? '▲' : '▼')}
                  </th>
                  <th
                    onClick={() => handleSort('nationality')}
                    className="cursor-pointer px-6 py-3 text-left text-sm font-medium uppercase tracking-wider"
                  >
                    Nationality {sortColumn === 'nationality' && (sortDirection === 'asc' ? '▲' : '▼')}
                  </th>
                </tr>
              </thead>
              <tbody className="bg-black divide-y divide-gray-800">
                {filteredAndSortedStudents.map((student) => (
                  <tr
                    key={student.id}
                    className="hover:bg-gray-700 transition-colors cursor-pointer"
                    onClick={() => handleRowClick(student)}
                  >
                    <td className="px-6 py-4">{student.id}</td>
                    <td className="px-6 py-4">
                      {student.firstName} {student.lastName}
                    </td>
                    <td className="px-6 py-4">{student.gender}</td>
                    <td className="px-6 py-4">{student.nationality}</td>
                  </tr>
                ))}
                {filteredAndSortedStudents.length === 0 && (
                  <tr>
                    <td colSpan={4} className="px-6 py-4 text-center">
                      No students found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Modal for Student Details */}
          {selectedStudent && (
            <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-70 z-50">
              <div className="bg-gray-800 p-8 rounded-xl border border-indigo-500 shadow-xl max-w-lg w-full mx-4 animate-fadeIn max-h-[80vh] overflow-y-auto">
                <h2 className="text-2xl font-bold text-white mb-4">Student Details</h2>
                <div className="space-y-4">
                  <div>
                    <span className="block text-white text-lg font-semibold">Student ID:</span>
                    <p className="text-gray-300">{selectedStudent.id}</p>
                  </div>
                  <div>
                    <span className="block text-white text-lg font-semibold">User ID:</span>
                    <p className="text-gray-300">{selectedStudent.userId}</p>
                  </div>
                  <div>
                    <span className="block text-white text-lg font-semibold">First Name:</span>
                    {isEditing ? (
                      <input
                        type="text"
                        name="firstName"
                        value={editData.firstName}
                        onChange={handleEditChange}
                        aria-label="First Name"
                        placeholder="Enter first name"
                        className="w-full px-4 py-2 bg-black bg-opacity-50 border border-indigo-500 rounded-md focus:outline-none text-white"
                      />
                    ) : (
                      <p className="text-gray-300">{selectedStudent.firstName}</p>
                    )}
                  </div>
                  <div>
                    <span className="block text-white text-lg font-semibold">Last Name:</span>
                    {isEditing ? (
                      <input
                        type="text"
                        name="lastName"
                        value={editData.lastName}
                        onChange={handleEditChange}
                        aria-label="Last Name"
                        placeholder="Enter last name"
                        className="w-full px-4 py-2 bg-black bg-opacity-50 border border-indigo-500 rounded-md focus:outline-none text-white"
                      />
                    ) : (
                      <p className="text-gray-300">{selectedStudent.lastName}</p>
                    )}
                  </div>
                  <div>
                    <span className="block text-white text-lg font-semibold">Date of Birth:</span>
                    <p className="text-gray-300">{selectedStudent.dateOfBirth}</p>
                  </div>
                  <div>
                    <span className="block text-white text-lg font-semibold">Gender:</span>
                    <p className="text-gray-300">{selectedStudent.gender}</p>
                  </div>
                  <div>
                    <span className="block text-white text-lg font-semibold">Address:</span>
                    <p className="text-gray-300">{selectedStudent.address}</p>
                  </div>
                  <div>
                    <span className="block text-white text-lg font-semibold">Contact Number:</span>
                    {isEditing ? (
                      <input
                        type="text"
                        name="contactNumber"
                        value={editData.contactNumber}
                        onChange={handleEditChange}
                        aria-label="Contact Number"
                        placeholder="Enter contact number"
                        className="w-full px-4 py-2 bg-black bg-opacity-50 border border-indigo-500 rounded-md focus:outline-none text-white"
                      />
                    ) : (
                      <p className="text-gray-300">{selectedStudent.contactNumber}</p>
                    )}
                  </div>
                  <div>
                    <span className="block text-white text-lg font-semibold">Nationality:</span>
                    <p className="text-gray-300">{selectedStudent.nationality}</p>
                  </div>
                </div>
                <div className="mt-6 flex justify-end space-x-4">
                  {isEditing ? (
                    <>
                      <button
                        onClick={handleSave}
                        className="px-4 py-2 bg-green-600 hover:bg-green-700 rounded-md text-white font-bold transition duration-300"
                      >
                        Save
                      </button>
                      <button
                        onClick={handleCancelEdit}
                        className="px-4 py-2 bg-yellow-600 hover:bg-yellow-700 rounded-md text-white font-bold transition duration-300"
                      >
                        Cancel
                      </button>
                    </>
                  ) : (
                    <button
                      onClick={handleEditClick}
                      className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-md text-white font-bold transition duration-300"
                    >
                      Edit
                    </button>
                  )}
                  <button
                    onClick={closeModal}
                    className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 rounded-md text-white font-bold transition duration-300"
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default StudentManagement;

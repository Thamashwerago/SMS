// src/pages/Admin/TeacherManagement.tsx
import React, { useState, useMemo, ChangeEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../../components/common/Sidebar';
import Navbar from '../../components/common/Navbar';

interface Teacher {
  id: number;
  userId: number;
  name: string;
  phone: string;
  dob: string;           // Date of birth (e.g., "1980-11-20")
  gender: string;
  address: string;
  joiningDate: string;   // Joining date (e.g., "2012-01-15")
  role: string;
}

// Dummy teacher data (to be replaced with API data)
const initialTeachers: Teacher[] = [
  {
    id: 1,
    userId: 201,
    name: 'Dr. Emily Carter',
    phone: '555-1234',
    dob: '1975-06-15',
    gender: 'Female',
    address: '123 Physics Road, Science City',
    joiningDate: '2010-09-01',
    role: 'Professor'
  },
  {
    id: 2,
    userId: 202,
    name: 'Mr. John Doe',
    phone: '555-5678',
    dob: '1980-11-20',
    gender: 'Male',
    address: '456 Math Ave, Number Town',
    joiningDate: '2012-01-15',
    role: 'Lecturer'
  },
  {
    id: 3,
    userId: 203,
    name: 'Ms. Sarah Lee',
    phone: '555-9012',
    dob: '1985-03-10',
    gender: 'Female',
    address: '789 Chemistry Blvd, Lab City',
    joiningDate: '2015-05-30',
    role: 'Assistant Professor'
  }
];

const TeacherManagement: React.FC = () => {
  const [teachers] = useState<Teacher[]>(initialTeachers);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortColumn, setSortColumn] = useState<keyof Teacher>('name');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  const [selectedTeacher, setSelectedTeacher] = useState<Teacher | null>(null);
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [editData, setEditData] = useState<{ name: string; phone: string; address: string }>({
    name: '',
    phone: '',
    address: ''
  });

  const navigate = useNavigate();

  // Handle search input changes.
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  // Toggle sorting for a given column.
  const handleSort = (column: keyof Teacher) => {
    if (sortColumn === column) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortColumn(column);
      setSortDirection('asc');
    }
  };

  // Filter and sort the teachers list.
  const filteredAndSortedTeachers = useMemo(() => {
    const filtered = teachers.filter((teacher) =>
      teacher.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      teacher.phone.toLowerCase().includes(searchQuery.toLowerCase()) ||
      teacher.role.toLowerCase().includes(searchQuery.toLowerCase())
    );
    filtered.sort((a, b) => {
      const valA = a[sortColumn].toString().toLowerCase();
      const valB = b[sortColumn].toString().toLowerCase();
      if (valA < valB) return sortDirection === 'asc' ? -1 : 1;
      if (valA > valB) return sortDirection === 'asc' ? 1 : -1;
      return 0;
    });
    return filtered;
  }, [teachers, searchQuery, sortColumn, sortDirection]);

  // Handle clicking a teacher row.
  const handleRowClick = (teacher: Teacher) => {
    setSelectedTeacher(teacher);
    setEditData({ name: teacher.name, phone: teacher.phone, address: teacher.address });
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
    if (selectedTeacher) {
      setSelectedTeacher({
        ...selectedTeacher,
        name: editData.name,
        phone: editData.phone,
        address: editData.address
      });
      setIsEditing(false);
      // In a real app, you would also update the backend here.
    }
  };

  // Cancel editing.
  const handleCancelEdit = () => {
    if (selectedTeacher) {
      setEditData({
        name: selectedTeacher.name,
        phone: selectedTeacher.phone,
        address: selectedTeacher.address
      });
    }
    setIsEditing(false);
  };

  // Close the teacher details modal and navigate back.
  const closeModal = () => {
    setSelectedTeacher(null);
    navigate('/admin/teacher-management');
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
              Teacher Management
            </h1>
            <div className="flex items-center mt-4 sm:mt-0">
              <input
                type="text"
                placeholder="Search teachers..."
                value={searchQuery}
                onChange={handleSearchChange}
                className="px-4 py-2 bg-black bg-opacity-50 border border-indigo-500 rounded-l-xl focus:outline-none text-white placeholder-gray-400"
              />
              <button
                onClick={() => navigate('/admin/add-teacher')}
                className="px-6 py-2 bg-indigo-600 hover:bg-indigo-700 border border-indigo-500 rounded-r-xl text-white font-bold transition duration-300"
              >
                Add Teacher
              </button>
            </div>
          </div>

          {/* Teacher Data Table with advanced UI */}
          <div className="overflow-auto max-h-[500px] bg-black bg-opacity-50 border border-indigo-500 rounded-xl shadow-xl">
            <table className="min-w-full text-white">
              <thead className="bg-gray-800 sticky top-0 z-10">
                <tr>
                  <th
                    onClick={() => handleSort('id')}
                    className="cursor-pointer px-6 py-3 text-left text-sm font-medium uppercase tracking-wider"
                  >
                    Teacher ID {sortColumn === 'id' && (sortDirection === 'asc' ? '▲' : '▼')}
                  </th>
                  <th
                    onClick={() => handleSort('name')}
                    className="cursor-pointer px-6 py-3 text-left text-sm font-medium uppercase tracking-wider"
                  >
                    Name {sortColumn === 'name' && (sortDirection === 'asc' ? '▲' : '▼')}
                  </th>
                  <th
                    onClick={() => handleSort('phone')}
                    className="cursor-pointer px-6 py-3 text-left text-sm font-medium uppercase tracking-wider"
                  >
                    Phone {sortColumn === 'phone' && (sortDirection === 'asc' ? '▲' : '▼')}
                  </th>
                  <th
                    onClick={() => handleSort('role')}
                    className="cursor-pointer px-6 py-3 text-left text-sm font-medium uppercase tracking-wider"
                  >
                    Role {sortColumn === 'role' && (sortDirection === 'asc' ? '▲' : '▼')}
                  </th>
                </tr>
              </thead>
              <tbody className="bg-black divide-y divide-gray-800">
                {filteredAndSortedTeachers.map((teacher) => (
                  <tr
                    key={teacher.id}
                    className="hover:bg-gray-700 transition-colors cursor-pointer"
                    onClick={() => handleRowClick(teacher)}
                  >
                    <td className="px-6 py-4">{teacher.id}</td>
                    <td className="px-6 py-4">{teacher.name}</td>
                    <td className="px-6 py-4">{teacher.phone}</td>
                    <td className="px-6 py-4">{teacher.role}</td>
                  </tr>
                ))}
                {filteredAndSortedTeachers.length === 0 && (
                  <tr>
                    <td colSpan={4} className="px-6 py-4 text-center">
                      No teachers found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Modal for Teacher Details with scrolling popup */}
          {selectedTeacher && (
            <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-70 z-50">
              <div className="bg-gray-800 p-8 rounded-xl border border-indigo-500 shadow-xl max-w-lg w-full mx-4 animate-fadeIn max-h-[80vh] overflow-y-auto">
                <h2 className="text-2xl font-bold text-white mb-4">Teacher Details</h2>
                <div className="space-y-4">
                  <div>
                    <span className="block text-white text-lg font-semibold">Teacher ID:</span>
                    <p className="text-gray-300">{selectedTeacher.id}</p>
                  </div>
                  <div>
                    <span className="block text-white text-lg font-semibold">User ID:</span>
                    <p className="text-gray-300">{selectedTeacher.userId}</p>
                  </div>
                  <div>
                    <span className="block text-white text-lg font-semibold">Name:</span>
                    {isEditing ? (
                      <input
                        type="text"
                        name="name"
                        value={editData.name}
                        onChange={handleEditChange}
                        className="w-full px-4 py-2 bg-black bg-opacity-50 border border-indigo-500 rounded-md focus:outline-none text-white"
                        aria-label="Teacher Name"
                        placeholder="Enter teacher name"
                      />
                    ) : (
                      <p className="text-gray-300">{selectedTeacher.name}</p>
                    )}
                  </div>
                  <div>
                    <span className="block text-white text-lg font-semibold">Phone:</span>
                    {isEditing ? (
                      <input
                        type="text"
                        name="phone"
                        value={editData.phone}
                        onChange={handleEditChange}
                        className="w-full px-4 py-2 bg-black bg-opacity-50 border border-indigo-500 rounded-md focus:outline-none text-white"
                        aria-label="Phone Number"
                        placeholder="Enter phone number"
                      />
                    ) : (
                      <p className="text-gray-300">{selectedTeacher.phone}</p>
                    )}
                  </div>
                  <div>
                    <span className="block text-white text-lg font-semibold">DOB:</span>
                    <p className="text-gray-300">{selectedTeacher.dob}</p>
                  </div>
                  <div>
                    <span className="block text-white text-lg font-semibold">Gender:</span>
                    <p className="text-gray-300">{selectedTeacher.gender}</p>
                  </div>
                  <div>
                    <span className="block text-white text-lg font-semibold">Address:</span>
                    {isEditing ? (
                      <input
                        type="text"
                        name="address"
                        value={editData.address}
                        onChange={handleEditChange}
                        className="w-full px-4 py-2 bg-black bg-opacity-50 border border-indigo-500 rounded-md focus:outline-none text-white"
                        aria-label="Address"
                        placeholder="Enter address"
                      />
                    ) : (
                      <p className="text-gray-300">{selectedTeacher.address}</p>
                    )}
                  </div>
                  <div>
                    <span className="block text-white text-lg font-semibold">Joining Date:</span>
                    <p className="text-gray-300">{selectedTeacher.joiningDate}</p>
                  </div>
                  <div>
                    <span className="block text-white text-lg font-semibold">Role:</span>
                    <p className="text-gray-300">{selectedTeacher.role}</p>
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

export default TeacherManagement;

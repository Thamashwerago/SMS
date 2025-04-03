// src/pages/Admin/UserManagement.tsx
import React, { useState, useMemo, ChangeEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../../components/common/Sidebar';
import Navbar from '../../components/common/Navbar';

interface User {
  id: number;
  username: string;
  email: string;
  password: string;
  role: string;
  status: string;
}

// Dummy user data (to be replaced with API data)
const initialUsers: User[] = [
  { id: 1, username: 'alice', email: 'alice@example.com', password: 'pass123', role: 'Admin', status: 'Active' },
  { id: 2, username: 'bob', email: 'bob@example.com', password: 'pass456', role: 'Student', status: 'Active' },
  { id: 3, username: 'charlie', email: 'charlie@example.com', password: 'pass789', role: 'Teacher', status: 'Inactive' },
  { id: 4, username: 'diana', email: 'diana@example.com', password: 'pass321', role: 'Admin', status: 'Active' },
  // More dummy data can be added here...
];

const UserManagement: React.FC = () => {
  const [users] = useState<User[]>(initialUsers);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortColumn, setSortColumn] = useState<keyof User>('username');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [editData, setEditData] = useState<{ username: string; email: string; password: string }>({
    username: '',
    email: '',
    password: '',
  });

  const navigate = useNavigate();

  // Handler for search input changes.
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  // Handler for sorting by column.
  const handleSort = (column: keyof User) => {
    if (sortColumn === column) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortColumn(column);
      setSortDirection('asc');
    }
  };

  // Memoized filtering and sorting of users.
  const filteredAndSortedUsers = useMemo(() => {
    const filtered = users.filter((user) =>
      user.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.role.toLowerCase().includes(searchQuery.toLowerCase())
    );
    filtered.sort((a, b) => {
      let valA: string | number = a[sortColumn];
      let valB: string | number = b[sortColumn];
      // For numeric sort on id
      if (typeof valA === 'number' && typeof valB === 'number') {
        return sortDirection === 'asc' ? valA - valB : valB - valA;
      }
      // Otherwise string comparison
      valA = valA.toString().toLowerCase();
      valB = valB.toString().toLowerCase();
      if (valA < valB) return sortDirection === 'asc' ? -1 : 1;
      if (valA > valB) return sortDirection === 'asc' ? 1 : -1;
      return 0;
    });
    return filtered;
  }, [users, searchQuery, sortColumn, sortDirection]);

  // Handler when a user row is clicked.
  const handleRowClick = (user: User) => {
    setSelectedUser(user);
    // Initialize edit data from selected user.
    setEditData({ username: user.username, email: user.email, password: user.password });
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
    if (selectedUser) {
      // In a real app, an API call to update the user would go here.
      setSelectedUser({
        ...selectedUser,
        username: editData.username,
        email: editData.email,
        password: editData.password,
      });
      setIsEditing(false);
    }
  };

  // Cancel editing.
  const handleCancelEdit = () => {
    setIsEditing(false);
    if (selectedUser) {
      setEditData({ username: selectedUser.username, email: selectedUser.email, password: selectedUser.password });
    }
  };

  // Close the user details modal and navigate back to the management page.
  const handleClose = () => {
    setSelectedUser(null);
    navigate('/admin/user-management');
  };

  return (
    <div className="min-h-screen flex font-roboto bg-gradient-to-br from-gray-900 to-black">
      {/* Sidebar Navigation */}
      <Sidebar />
      <div className="flex-1 flex flex-col">
        {/* Top Navbar */}
        <Navbar />
        <main className="p-8">
          {/* Header Section */}
          <div className="flex flex-col sm:flex-row items-center justify-between mb-8">
            <h1 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500">
              User Management
            </h1>
            <div className="flex items-center mt-4 sm:mt-0">
              <input
                type="text"
                placeholder="Search users..."
                value={searchQuery}
                onChange={handleSearchChange}
                className="px-4 py-2 bg-black bg-opacity-50 border border-indigo-500 rounded-l-xl focus:outline-none text-white placeholder-gray-400"
              />
              <button
                onClick={() => navigate('/admin/add-admin')}
                className="px-6 py-2 bg-indigo-600 hover:bg-indigo-700 border border-indigo-500 rounded-r-xl text-white font-bold transition duration-300"
              >
                Add Admin
              </button>
            </div>
          </div>

          {/* Users Table with advanced UI */}
          <div className="overflow-auto max-h-[500px] bg-black bg-opacity-50 border border-indigo-500 rounded-xl shadow-xl">
            <table className="min-w-full text-white">
              <thead className="bg-gray-800 sticky top-0 z-10">
                <tr>
                  <th
                    onClick={() => handleSort('id')}
                    className="cursor-pointer px-6 py-3 text-left text-sm font-medium uppercase tracking-wider"
                  >
                    User ID {sortColumn === 'id' && (sortDirection === 'asc' ? '▲' : '▼')}
                  </th>
                  <th
                    onClick={() => handleSort('username')}
                    className="cursor-pointer px-6 py-3 text-left text-sm font-medium uppercase tracking-wider"
                  >
                    Username {sortColumn === 'username' && (sortDirection === 'asc' ? '▲' : '▼')}
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
                {filteredAndSortedUsers.map((user) => (
                  <tr
                    key={user.id}
                    className="hover:bg-gray-700 transition-colors cursor-pointer"
                    onClick={() => handleRowClick(user)}
                  >
                    <td className="px-6 py-4">{user.id}</td>
                    <td className="px-6 py-4">{user.username}</td>
                    <td className="px-6 py-4">{user.role}</td>
                  </tr>
                ))}
                {filteredAndSortedUsers.length === 0 && (
                  <tr>
                    <td colSpan={3} className="px-6 py-4 text-center">
                      No users found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Modal for Full User Details */}
          {selectedUser && (
            <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-70 z-50">
              <div className="bg-gray-800 p-8 rounded-xl border border-indigo-500 shadow-xl max-w-lg w-full mx-4 animate-fadeIn">
                <h2 className="text-2xl font-bold text-white mb-4">User Details</h2>
                <div className="space-y-4">
                  <div>
                    <span className="block text-white text-lg font-semibold">User ID:</span>
                    <p className="text-gray-300">{selectedUser.id}</p>
                  </div>
                  <div>
                    <span className="block text-white text-lg font-semibold">Username:</span>
                    {isEditing ? (
                      <input
                        type="text"
                        name="username"
                        value={editData.username}
                        onChange={handleEditChange}
                        title="Username"
                        placeholder="Username"
                        className="w-full px-4 py-2 bg-black bg-opacity-50 border border-indigo-500 rounded-md focus:outline-none text-white"
                      />
                    ) : (
                      <p className="text-gray-300">{selectedUser.username}</p>
                    )}
                  </div>
                  <div>
                    <span className="block text-white text-lg font-semibold">Email:</span>
                    {isEditing ? (
                      <input
                        type="email"
                        name="email"
                        value={editData.email}
                        onChange={handleEditChange}
                        title="Email"
                        placeholder="Email"
                        className="w-full px-4 py-2 bg-black bg-opacity-50 border border-indigo-500 rounded-md focus:outline-none text-white"
                      />
                    ) : (
                      <p className="text-gray-300">{selectedUser.email}</p>
                    )}
                  </div>
                  <div>
                    <span className="block text-white text-lg font-semibold">Password:</span>
                    {isEditing ? (
                      <input
                        type="text"
                        name="password"
                        value={editData.password}
                        onChange={handleEditChange}
                        title="Password"
                        placeholder="Password"
                        className="w-full px-4 py-2 bg-black bg-opacity-50 border border-indigo-500 rounded-md focus:outline-none text-white"
                      />
                    ) : (
                      <p className="text-gray-300">{selectedUser.password}</p>
                    )}
                  </div>
                  <div>
                    <span className="block text-white text-lg font-semibold">Role:</span>
                    <p className="text-gray-300">{selectedUser.role}</p>
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
                    onClick={handleClose}
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

export default UserManagement;

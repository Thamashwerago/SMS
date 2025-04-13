import React from 'react';
import Sidebar from '../../components/common/Sidebar';
import Navbar from '../../components/common/Navbar';

/**
 * AdminProfile Component
 * ------------------------
 * Displays the admin's profile information.
 * In a real application, data would be fetched from an API or context.
 */
const AdminProfile: React.FC = () => {
  // Sample admin data; replace with actual API data as needed.
  const admin = {
    id: 1,
    name: 'Admin User',
    email: 'admin@example.com',
    role: 'Admin',
  };

  return (
    <div className="min-h-screen flex font-roboto bg-gradient-to-br from-gray-900 to-black">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <Navbar />
        <main className="p-8">
          {/* Page Heading */}
          <h1 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500 mb-8">
            Admin Profile
          </h1>
          <div className="bg-black bg-opacity-50 border border-indigo-500 rounded-xl shadow-xl p-8 max-w-2xl mx-auto">
            <div className="space-y-4">
              <div>
                <span className="block text-gray-300 font-semibold">ID:</span>
                <p className="text-white">{admin.id}</p>
              </div>
              <div>
                <span className="block text-gray-300 font-semibold">Name:</span>
                <p className="text-white">{admin.name}</p>
              </div>
              <div>
                <span className="block text-gray-300 font-semibold">Email:</span>
                <p className="text-white">{admin.email}</p>
              </div>
              <div>
                <span className="block text-gray-300 font-semibold">Role:</span>
                <p className="text-white">{admin.role}</p>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default AdminProfile;

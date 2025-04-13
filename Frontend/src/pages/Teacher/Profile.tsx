import React from 'react';
import Sidebar from '../../components/common/Sidebar';
import Navbar from '../../components/common/Navbar';

/**
 * TeacherProfile Component
 * --------------------------
 * Displays the teacher's profile details.
 * In a production environment, this data should be fetched from a backend service.
 */
const TeacherProfile: React.FC = () => {
  // Sample teacher data; replace with API data as needed.
  const teacher = {
    id: 2,
    name: 'Teacher User',
    email: 'teacher@example.com',
    role: 'Teacher',
    phone: '555-1234',
    dob: '1980-01-01',
    address: '123 Teacher Lane',
    joiningDate: '2015-09-01',
  };

  return (
    <div className="min-h-screen flex font-roboto bg-gradient-to-br from-gray-900 to-black">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <Navbar />
        <main className="p-8">
          {/* Page Heading */}
          <h1 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500 mb-8">
            Teacher Profile
          </h1>
          <div className="bg-black bg-opacity-50 border border-indigo-500 rounded-xl shadow-xl p-8 max-w-2xl mx-auto">
            <div className="space-y-4">
              <div>
                <span className="block text-gray-300 font-semibold">ID:</span>
                <p className="text-white">{teacher.id}</p>
              </div>
              <div>
                <span className="block text-gray-300 font-semibold">Name:</span>
                <p className="text-white">{teacher.name}</p>
              </div>
              <div>
                <span className="block text-gray-300 font-semibold">Email:</span>
                <p className="text-white">{teacher.email}</p>
              </div>
              <div>
                <span className="block text-gray-300 font-semibold">Phone:</span>
                <p className="text-white">{teacher.phone}</p>
              </div>
              <div>
                <span className="block text-gray-300 font-semibold">Date of Birth:</span>
                <p className="text-white">{teacher.dob}</p>
              </div>
              <div>
                <span className="block text-gray-300 font-semibold">Address:</span>
                <p className="text-white">{teacher.address}</p>
              </div>
              <div>
                <span className="block text-gray-300 font-semibold">Joining Date:</span>
                <p className="text-white">{teacher.joiningDate}</p>
              </div>
              <div>
                <span className="block text-gray-300 font-semibold">Role:</span>
                <p className="text-white">{teacher.role}</p>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default TeacherProfile;

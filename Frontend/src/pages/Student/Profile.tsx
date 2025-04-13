import React from 'react';
import Sidebar from '../../components/common/Sidebar';
import Navbar from '../../components/common/Navbar';

/**
 * StudentProfile Component
 * --------------------------
 * Displays the student's profile details.
 * In a real-world scenario, data should be fetched from the backend.
 */
const StudentProfile: React.FC = () => {
  // Sample student data; replace with actual data when integrating with backend.
  const student = {
    id: 3,
    firstName: 'Student',
    lastName: 'User',
    email: 'student@example.com',
    role: 'Student',
    dateOfBirth: '2000-01-01',
    gender: 'Female',
    address: '456 Student Ave',
    contactNumber: '555-5678',
    nationality: 'American',
  };

  return (
    <div className="min-h-screen flex font-roboto bg-gradient-to-br from-gray-900 to-black">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <Navbar />
        <main className="p-8">
          {/* Page Heading */}
          <h1 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500 mb-8">
            Student Profile
          </h1>
          <div className="bg-black bg-opacity-50 border border-indigo-500 rounded-xl shadow-xl p-8 max-w-2xl mx-auto">
            <div className="space-y-4">
              <div>
                <span className="block text-gray-300 font-semibold">ID:</span>
                <p className="text-white">{student.id}</p>
              </div>
              <div>
                <span className="block text-gray-300 font-semibold">Name:</span>
                <p className="text-white">{student.firstName} {student.lastName}</p>
              </div>
              <div>
                <span className="block text-gray-300 font-semibold">Email:</span>
                <p className="text-white">{student.email}</p>
              </div>
              <div>
                <span className="block text-gray-300 font-semibold">Date of Birth:</span>
                <p className="text-white">{student.dateOfBirth}</p>
              </div>
              <div>
                <span className="block text-gray-300 font-semibold">Gender:</span>
                <p className="text-white">{student.gender}</p>
              </div>
              <div>
                <span className="block text-gray-300 font-semibold">Address:</span>
                <p className="text-white">{student.address}</p>
              </div>
              <div>
                <span className="block text-gray-300 font-semibold">Contact Number:</span>
                <p className="text-white">{student.contactNumber}</p>
              </div>
              <div>
                <span className="block text-gray-300 font-semibold">Nationality:</span>
                <p className="text-white">{student.nationality}</p>
              </div>
              <div>
                <span className="block text-gray-300 font-semibold">Role:</span>
                <p className="text-white">{student.role}</p>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default StudentProfile;

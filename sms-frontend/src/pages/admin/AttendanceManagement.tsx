/**
 * Attendance.tsx
 *
 * This component renders the Attendance page with a dark theme consistent with the admin dashboard.
 * It displays today's attendance records in a table format.
 * Dummy data is used for demonstration; replace it with live data from your backend as needed.
 */

import React from 'react';
import Navbar from '../../components/common/Navbar';
import Sidebar from '../../components/common/Sidebar';

const dummyAttendanceRecords = [
  { id: 1, name: 'Alice Johnson', status: 'Present' },
  { id: 2, name: 'Bob Smith', status: 'Absent' },
  { id: 3, name: 'Charlie Brown', status: 'Present' },
  { id: 4, name: 'Diana Prince', status: 'Present' },
  { id: 5, name: 'Ethan Hunt', status: 'Absent' },
];

const Attendance: React.FC = () => {
  return (
    <div className="min-h-screen flex bg-black">
      {/* Sidebar Navigation */}
      <Sidebar />
      <div className="flex-1 p-6">
        {/* Top Navbar */}
        <Navbar />
        {/* Main content with spacing from Navbar */}
        <div className="mt-6">
          <h1 className="text-3xl font-bold text-white mb-6">Attendance</h1>
          <div className="bg-[#1E1E1E] p-6 rounded-lg shadow">
            <p className="text-gray-300 mb-4">
              Attendance records for today are displayed below.
            </p>
            <div className="overflow-x-auto">
              <table className="min-w-full text-white">
                <thead>
                  <tr>
                    <th className="px-4 py-2 border-b border-gray-700 text-left">ID</th>
                    <th className="px-4 py-2 border-b border-gray-700 text-left">Student Name</th>
                    <th className="px-4 py-2 border-b border-gray-700 text-left">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {dummyAttendanceRecords.map((record) => (
                    <tr key={record.id} className="hover:bg-gray-800 transition-colors">
                      <td className="px-4 py-2 border-b border-gray-700">{record.id}</td>
                      <td className="px-4 py-2 border-b border-gray-700">{record.name}</td>
                      <td className="px-4 py-2 border-b border-gray-700">
                        {record.status === 'Present' ? (
                          <span className="text-green-500 font-semibold">{record.status}</span>
                        ) : (
                          <span className="text-red-500 font-semibold">{record.status}</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Attendance;

import React from 'react';
import Navbar from '../../components/common/Navbar';
import Sidebar from '../../components/common/Sidebar';

const Attendance: React.FC = () => {
  return (
    <div className="min-h-screen flex">
      <Sidebar />
      <div className="flex-1 bg-gray-100 p-6">
        <Navbar />
        <h1 className="text-3xl font-bold mb-4">Class Attendance</h1>
        <table className="min-w-full bg-white shadow rounded-lg overflow-hidden">
          <thead className="bg-gray-200">
            <tr>
              <th className="py-2 px-4 text-left">Date</th>
              <th className="py-2 px-4 text-left">Class</th>
              <th className="py-2 px-4 text-left">Status</th>
            </tr>
          </thead>
          <tbody>
            <tr className="border-t">
              <td className="py-2 px-4">2025-03-15</td>
              <td className="py-2 px-4">Mathematics</td>
              <td className="py-2 px-4">Pending</td>
            </tr>
            <tr className="border-t">
              <td className="py-2 px-4">2025-03-14</td>
              <td className="py-2 px-4">Physics</td>
              <td className="py-2 px-4">Completed</td>
            </tr>
            {/* More records can be added here */}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Attendance;

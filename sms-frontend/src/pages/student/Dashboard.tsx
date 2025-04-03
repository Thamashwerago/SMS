import React from 'react';
import Navbar from '../../components/common/Navbar';
import Sidebar from '../../components/common/Sidebar';

const Dashboard: React.FC = () => {
  return (
    <div className="min-h-screen flex">
      <Sidebar />
      <div className="flex-1 bg-gray-100 p-6">
        <Navbar />
        <h1 className="text-3xl font-bold mb-4">Student Dashboard</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div className="bg-white p-4 rounded-lg shadow">
            <h2 className="text-xl font-semibold">Enrolled Courses</h2>
            <p className="text-gray-600">5 Courses</p>
          </div>
          <div className="bg-white p-4 rounded-lg shadow">
            <h2 className="text-xl font-semibold">Attendance</h2>
            <p className="text-gray-600">95% Attendance</p>
          </div>
          <div className="bg-white p-4 rounded-lg shadow">
            <h2 className="text-xl font-semibold">Upcoming Exams</h2>
            <p className="text-gray-600">Next exam in 3 days</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;

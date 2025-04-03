import React from 'react';
import Navbar from '../../components/common/Navbar';
import Sidebar from '../../components/common/Sidebar';

const Timetable: React.FC = () => {
  return (
    <div className="min-h-screen flex">
      <Sidebar />
      <div className="flex-1 bg-gray-100 p-6">
        <Navbar />
        <h1 className="text-3xl font-bold mb-4">My Timetable</h1>
        <div className="bg-white p-4 rounded-lg shadow space-y-2">
          <p className="text-gray-600"><strong>Monday:</strong> Advanced Mathematics, Computer Science</p>
          <p className="text-gray-600"><strong>Tuesday:</strong> Physics, Advanced Mathematics</p>
          <p className="text-gray-600"><strong>Wednesday:</strong> Computer Science, Physics</p>
          <p className="text-gray-600"><strong>Thursday:</strong> Advanced Mathematics, Lab Session</p>
          <p className="text-gray-600"><strong>Friday:</strong> Computer Science, Physics</p>
          {/* Additional days and details as needed */}
        </div>
      </div>
    </div>
  );
};

export default Timetable;

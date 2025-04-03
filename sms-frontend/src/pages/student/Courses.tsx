import React from 'react';
import Navbar from '../../components/common/Navbar';
import Sidebar from '../../components/common/Sidebar';

const Courses: React.FC = () => {
  return (
    <div className="min-h-screen flex">
      <Sidebar />
      <div className="flex-1 bg-gray-100 p-6">
        <Navbar />
        <h1 className="text-3xl font-bold mb-4">My Courses</h1>
        <ul className="space-y-4">
          <li className="bg-white p-4 rounded-lg shadow">
            <h2 className="text-xl font-semibold">Mathematics</h2>
            <p className="text-gray-600">Learn algebra, calculus, and statistics.</p>
          </li>
          <li className="bg-white p-4 rounded-lg shadow">
            <h2 className="text-xl font-semibold">History</h2>
            <p className="text-gray-600">Explore historical events and influential figures.</p>
          </li>
          <li className="bg-white p-4 rounded-lg shadow">
            <h2 className="text-xl font-semibold">Science</h2>
            <p className="text-gray-600">Dive into physics, chemistry, and biology fundamentals.</p>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default Courses;

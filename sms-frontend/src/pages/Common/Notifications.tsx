/**
 * Notifications.tsx
 *
 * This component represents the Notifications page for the admin.
 * It displays a list of notifications in a table format.
 * The page includes the Sidebar and Navbar for a consistent dashboard layout.
 * In a production application, notifications would be fetched from a backend API.
 */

import React from 'react';
import Sidebar from '../../components/common/Sidebar';
import Navbar from '../../components/common/Navbar';

const Notifications: React.FC = () => {
  // Dummy notifications data; replace with live data as needed.
  const dummyNotifications = [
    { id: 1, message: "New student registered.", time: "10:30 AM" },
    { id: 2, message: "Teacher profile updated.", time: "11:15 AM" },
    { id: 3, message: "Course 'Math 101' created.", time: "12:00 PM" },
  ];

  return (
    <div className="min-h-screen flex bg-black text-white">
      {/* Sidebar Navigation */}
      <Sidebar />
      {/* Main Content Area */}
      <div className="flex-1 p-6">
        {/* Top Navbar */}
        <Navbar />
        {/* Content Container */}
        <div className="mt-6">
          {/* Page Header */}
          <h1 className="text-3xl font-bold mb-2">Notifications</h1>
          <p className="mb-6 text-gray-300">
            Here are your latest notifications.
          </p>
          {/* Notifications Table */}
          <div className="overflow-x-auto">
            <table className="min-w-full bg-[#1E1E1E] rounded-lg">
              <thead>
                <tr className="bg-gray-800">
                  <th className="py-3 px-4 border-b border-gray-700 text-left">Message</th>
                  <th className="py-3 px-4 border-b border-gray-700 text-left">Time</th>
                </tr>
              </thead>
              <tbody>
                {dummyNotifications.map((notification) => (
                  <tr key={notification.id} className="hover:bg-gray-700 transition-colors">
                    <td className="py-2 px-4 border-b border-gray-700">
                      {notification.message}
                    </td>
                    <td className="py-2 px-4 border-b border-gray-700">
                      {notification.time}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Notifications;

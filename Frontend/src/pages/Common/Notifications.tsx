/**
 * Notifications.tsx
 *
 * Futuristic Notifications Page
 * -----------------------------
 * - Displays notifications in card format.
 * - Each notification shows a title, message, and timestamp.
 * - Unread notifications offer a "Mark as read" action.
 * - Uses a dark gradient background with neon accents for a modern, futuristic look.
 */

import React, { useState } from 'react';
import Sidebar from '../../components/common/Sidebar';
import Navbar from '../../components/common/Navbar';

interface Notification {
  id: number;
  title: string;
  message: string;
  time: string;
  read: boolean;
}

const initialNotifications: Notification[] = [
  {
    id: 1,
    title: 'New Student Registered',
    message: 'Alice Johnson has registered as a new student.',
    time: '10:30 AM',
    read: false,
  },
  {
    id: 2,
    title: 'Course Created',
    message: 'The course "Quantum Mechanics" has been created.',
    time: '11:15 AM',
    read: false,
  },
  {
    id: 3,
    title: 'Teacher Updated',
    message: 'Dr. Emily Carter updated her profile.',
    time: '12:00 PM',
    read: true,
  },
];

const Notifications: React.FC = () => {
  const [notifications, setNotifications] = useState<Notification[]>(initialNotifications);

  const markAsRead = (id: number) => {
    setNotifications((prev) =>
      prev.map((notification) =>
        notification.id === id ? { ...notification, read: true } : notification
      )
    );
  };

  return (
    <div className="min-h-screen flex font-roboto bg-gradient-to-br from-gray-900 to-black">
      {/* Sidebar */}
      <Sidebar />
      <div className="flex-1 flex flex-col">
        {/* Navbar */}
        <Navbar />
        <main className="p-8">
          <h1 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500 mb-8">
            Notifications
          </h1>
          <div className="bg-black bg-opacity-50 border border-indigo-500 rounded-xl shadow-xl p-6">
            {notifications.length === 0 ? (
              <p className="text-white">No notifications available.</p>
            ) : (
              <ul className="space-y-4">
                {notifications.map((notification) => (
                  <li
                    key={notification.id}
                    className={`p-4 rounded-lg border ${
                      notification.read ? 'border-gray-600' : 'border-indigo-500'
                    } bg-gray-800 bg-opacity-75 transition-colors hover:bg-gray-700`}
                  >
                    <div className="flex justify-between items-center">
                      <h2 className="text-xl font-bold text-white">{notification.title}</h2>
                      {!notification.read && (
                        <button
                          onClick={() => markAsRead(notification.id)}
                          className="text-sm font-semibold text-indigo-400 hover:text-indigo-300 transition-colors"
                        >
                          Mark as read
                        </button>
                      )}
                    </div>
                    <p className="text-gray-300 mt-2">{notification.message}</p>
                    <p className="text-gray-400 text-sm mt-1">{notification.time}</p>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

export default Notifications;

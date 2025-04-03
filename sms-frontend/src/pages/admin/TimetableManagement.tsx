/**
 * Timetable.tsx
 *
 * This component represents the Timetable page for the admin.
 * It displays today's timetable details in a responsive table format.
 * In a production app, timetable data would typically be fetched from a backend API.
 *
 * The UI uses a dark theme consistent with the admin dashboard and includes clear spacing,
 * hover effects, and responsive design.
 */

import React from 'react';
import Navbar from '../../components/common/Navbar';
import Sidebar from '../../components/common/Sidebar';

interface TimetableEntry {
  id: number;
  time: string;
  subject: string;
  teacher: string;
  room: string;
}

// Dummy timetable data; replace with live data as needed.
const dummyTimetable: TimetableEntry[] = [
  { id: 1, time: '08:00 - 09:00', subject: 'Mathematics', teacher: 'Mr. Smith', room: 'A101' },
  { id: 2, time: '09:15 - 10:15', subject: 'English', teacher: 'Ms. Johnson', room: 'B202' },
  { id: 3, time: '10:30 - 11:30', subject: 'Science', teacher: 'Mrs. Lee', room: 'C303' },
  { id: 4, time: '11:45 - 12:45', subject: 'History', teacher: 'Mr. Brown', room: 'D404' },
];

const Timetable: React.FC = () => {
  return (
    <div className="min-h-screen flex bg-black text-white">
      {/* Sidebar Navigation */}
      <Sidebar />
      {/* Main Content */}
      <div className="flex-1 p-6">
        {/* Top Navbar */}
        <Navbar />
        {/* Content Container with spacing */}
        <div className="mt-6">
          <h1 className="text-3xl font-bold mb-4">Timetable</h1>
          <p className="text-gray-300 mb-6">
            View today's timetable details below.
          </p>
          {/* Timetable Table */}
          <div className="overflow-x-auto">
            <table className="min-w-full bg-[#1E1E1E] rounded-lg">
              <thead>
                <tr className="bg-gray-800">
                  <th className="py-3 px-4 border-b border-gray-700 text-left">Time</th>
                  <th className="py-3 px-4 border-b border-gray-700 text-left">Subject</th>
                  <th className="py-3 px-4 border-b border-gray-700 text-left">Teacher</th>
                  <th className="py-3 px-4 border-b border-gray-700 text-left">Room</th>
                </tr>
              </thead>
              <tbody>
                {dummyTimetable.map((entry) => (
                  <tr key={entry.id} className="hover:bg-gray-700 transition-colors">
                    <td className="py-2 px-4 border-b border-gray-700">{entry.time}</td>
                    <td className="py-2 px-4 border-b border-gray-700">{entry.subject}</td>
                    <td className="py-2 px-4 border-b border-gray-700">{entry.teacher}</td>
                    <td className="py-2 px-4 border-b border-gray-700">{entry.room}</td>
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

export default Timetable;

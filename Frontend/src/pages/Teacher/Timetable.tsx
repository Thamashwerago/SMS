// src/pages/Teacher/TeacherTimetable.tsx
import React, { useMemo } from 'react';
import Sidebar from '../../components/common/Sidebar';
import Navbar from '../../components/common/Navbar';

interface TimetableEntry {
  id: number;
  day: string;
  course: string;
  room: string;
  time: string;
}

// Dummy timetable data for the teacher.
const timetableData: TimetableEntry[] = [
  { id: 1, day: 'Monday', course: 'Calculus I', room: 'Room 101', time: '9:00 AM - 10:30 AM' },
  { id: 2, day: 'Monday', course: 'Physics', room: 'Room 102', time: '11:00 AM - 12:30 PM' },
  { id: 3, day: 'Tuesday', course: 'Calculus I', room: 'Room 101', time: '9:00 AM - 10:30 AM' },
  { id: 4, day: 'Tuesday', course: 'Chemistry', room: 'Room 103', time: '2:00 PM - 3:30 PM' },
  { id: 5, day: 'Wednesday', course: 'Calculus I', room: 'Room 101', time: '9:00 AM - 10:30 AM' },
  { id: 6, day: 'Wednesday', course: 'Physics', room: 'Room 102', time: '11:00 AM - 12:30 PM' },
  { id: 7, day: 'Thursday', course: 'Chemistry', room: 'Room 103', time: '9:00 AM - 10:30 AM' },
  { id: 8, day: 'Friday', course: 'Calculus I', room: 'Room 101', time: '10:00 AM - 11:30 AM' },
];

const TeacherTimetable: React.FC = () => {
  // Group timetable entries by day using useMemo to optimize performance.
  const groupedTimetable = useMemo(() => {
    return timetableData.reduce<Record<string, TimetableEntry[]>>((acc, entry) => {
      if (!acc[entry.day]) {
        acc[entry.day] = [];
      }
      acc[entry.day].push(entry);
      return acc;
    }, {});
  }, []);

  // Define an ordered list of days for consistent rendering.
  const orderedDays = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

  return (
    <div className="min-h-screen flex font-roboto bg-gradient-to-br from-gray-900 to-black">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <Navbar />
        <main className="p-8">
          <h1 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500 mb-8">
            My Timetable
          </h1>
          <div className="space-y-8">
            {orderedDays.map((day) => {
              const entries = groupedTimetable[day];
              if (!entries || entries.length === 0) return null;
              return (
                <div key={day} className="bg-black bg-opacity-50 border border-indigo-500 rounded-xl shadow-xl p-6">
                  <h2 className="text-3xl font-bold text-white mb-4">{day}</h2>
                  <ul className="space-y-4">
                    {entries.map((entry) => (
                      <li key={entry.id} className="border-b border-gray-700 pb-2">
                        <div className="flex justify-between items-center">
                          <span className="text-white font-semibold">{entry.course}</span>
                          <span className="text-gray-300">{entry.time}</span>
                        </div>
                        <p className="text-gray-400 mt-1">Room: {entry.room}</p>
                      </li>
                    ))}
                  </ul>
                </div>
              );
            })}
          </div>
        </main>
      </div>
    </div>
  );
};

export default TeacherTimetable;

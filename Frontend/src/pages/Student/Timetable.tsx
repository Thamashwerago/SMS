// src/pages/Student/Timetable.tsx
import React, { useMemo } from 'react';
import Sidebar from '../../components/common/Sidebar';
import Navbar from '../../components/common/Navbar';

interface TimetableEntry {
  id: number;
  day: string;
  course: string;
  teacher: string;
  time: string;
}

// Dummy timetable data for the student.
const timetableData: TimetableEntry[] = [
  { id: 1, day: 'Monday', course: 'Calculus I', teacher: 'Dr. John Smith', time: '9:00 AM - 10:30 AM' },
  { id: 2, day: 'Monday', course: 'Physics', teacher: 'Dr. Emily Carter', time: '11:00 AM - 12:30 PM' },
  { id: 3, day: 'Tuesday', course: 'History', teacher: 'Ms. Anna Lee', time: '10:00 AM - 11:30 AM' },
  { id: 4, day: 'Wednesday', course: 'Calculus I', teacher: 'Dr. John Smith', time: '9:00 AM - 10:30 AM' },
  { id: 5, day: 'Wednesday', course: 'Chemistry', teacher: 'Dr. Mark White', time: '11:00 AM - 12:30 PM' },
  { id: 6, day: 'Thursday', course: 'Literature', teacher: 'Ms. Laura Green', time: '9:00 AM - 10:30 AM' },
  { id: 7, day: 'Friday', course: 'Computer Science', teacher: 'Mr. Bob Brown', time: '10:00 AM - 11:30 AM' },
];

const Timetable: React.FC = () => {
  // Group timetable entries by day using useMemo.
  const groupedTimetable = useMemo(() => {
    return timetableData.reduce<Record<string, TimetableEntry[]>>((acc, entry) => {
      if (!acc[entry.day]) {
        acc[entry.day] = [];
      }
      acc[entry.day].push(entry);
      return acc;
    }, {});
  }, []);

  // Define an ordered list of days to ensure consistent rendering.
  const orderedDays = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

  return (
    <div className="min-h-screen flex font-roboto bg-gradient-to-br from-gray-900 to-black">
      {/* Sidebar */}
      <Sidebar />
      <div className="flex-1 flex flex-col">
        {/* Navbar */}
        <Navbar />
        <main className="p-8">
          <h1 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500 mb-8">
            My Timetable
          </h1>
          <div className="space-y-8">
            {orderedDays.map((day) => {
              const classes = groupedTimetable[day];
              if (!classes || classes.length === 0) return null;
              return (
                <div key={day} className="bg-black bg-opacity-50 border border-indigo-500 rounded-xl shadow-xl p-6">
                  <h2 className="text-3xl font-bold text-white mb-4">{day}</h2>
                  <ul className="space-y-4">
                    {classes.map((entry) => (
                      <li key={entry.id} className="flex flex-col md:flex-row justify-between border-b border-gray-700 pb-2">
                        <span className="text-white font-semibold">{entry.course}</span>
                        <span className="text-gray-300">{entry.time}</span>
                        <span className="text-gray-400">{entry.teacher}</span>
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

export default Timetable;

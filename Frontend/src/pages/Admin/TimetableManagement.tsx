// src/pages/Admin/Timetable.tsx
import React, { useState, ChangeEvent } from 'react';
import Sidebar from '../../components/common/Sidebar';
import Navbar from '../../components/common/Navbar';

interface TimetableEntry {
  id: number;
  date: string;         // ISO date string (e.g., "2025-04-02")
  startTime: string;    // ISO time string (e.g., "10:00")
  endTime: string;      // ISO time string (e.g., "11:30")
  teacherId: number;
  courseId: number;
  classroom: string;
}

// Dummy timetable data based on the new backend model.
const initialTimetable: TimetableEntry[] = [
  {
    id: 1,
    date: '2025-04-02',
    startTime: '10:00',
    endTime: '11:30',
    teacherId: 101,
    courseId: 201,
    classroom: 'Room 101',
  },
  {
    id: 2,
    date: '2025-04-03',
    startTime: '13:00',
    endTime: '14:30',
    teacherId: 102,
    courseId: 202,
    classroom: 'Room 202',
  },
  {
    id: 3,
    date: '2025-04-04',
    startTime: '09:00',
    endTime: '12:00',
    teacherId: 103,
    courseId: 203,
    classroom: 'Room 303',
  },
];

const Timetable: React.FC = () => {
  const [timetable, setTimetable] = useState<TimetableEntry[]>(initialTimetable);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentEntry, setCurrentEntry] = useState<TimetableEntry | null>(null);

  // Open the reschedule modal with the selected timetable entry.
  const openModal = (entry: TimetableEntry) => {
    setCurrentEntry(entry);
    setIsModalOpen(true);
  };

  // Close modal and reset current entry.
  const closeModal = () => {
    setIsModalOpen(false);
    setCurrentEntry(null);
  };

  // Handle changes in the modal form inputs.
  const handleFormChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (currentEntry) {
      setCurrentEntry({ ...currentEntry, [e.target.name]: e.target.value });
    }
  };

  // Handle reschedule form submission.
  const handleFormSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (currentEntry) {
      setTimetable(
        timetable.map((entry) =>
          entry.id === currentEntry.id ? currentEntry : entry
        )
      );
      closeModal();
    }
  };

  return (
    <div className="min-h-screen flex font-roboto bg-gradient-to-br from-gray-900 to-black">
      {/* Sidebar Navigation */}
      <Sidebar />
      <div className="flex-1 flex flex-col">
        {/* Top Navbar */}
        <Navbar />
        <main className="p-8">
          <h1 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500 mb-8">
            Timetable Management
          </h1>
          <div className="overflow-x-auto bg-black bg-opacity-50 border border-indigo-500 rounded-xl shadow-xl">
            <table className="min-w-full divide-y divide-gray-700">
              <thead className="bg-gray-800">
                <tr>
                  <th className="px-6 py-3 text-left text-sm font-medium text-white uppercase tracking-wider">
                    Date
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-medium text-white uppercase tracking-wider">
                    Start Time
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-medium text-white uppercase tracking-wider">
                    End Time
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-medium text-white uppercase tracking-wider">
                    Teacher ID
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-medium text-white uppercase tracking-wider">
                    Course ID
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-medium text-white uppercase tracking-wider">
                    Classroom
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-medium text-white uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-black divide-y divide-gray-800">
                {timetable.map((entry) => (
                  <tr key={entry.id} className="hover:bg-gray-700 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap text-white">{entry.date}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-white">{entry.startTime}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-white">{entry.endTime}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-white">{entry.teacherId}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-white">{entry.courseId}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-white">{entry.classroom}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <button
                        onClick={() => openModal(entry)}
                        className="px-3 py-1 bg-indigo-600 hover:bg-indigo-700 rounded text-white text-sm transition duration-300"
                      >
                        Reschedule
                      </button>
                    </td>
                  </tr>
                ))}
                {timetable.length === 0 && (
                  <tr>
                    <td colSpan={7} className="px-6 py-4 text-center text-white">
                      No timetable entries found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </main>

        {/* Modal for Rescheduling */}
        {isModalOpen && currentEntry && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-70 z-50">
            <div className="bg-gray-800 p-8 rounded-xl border border-indigo-500 shadow-xl w-full max-w-lg mx-4 animate-fadeIn">
              <h2 className="text-2xl font-bold text-white mb-4">Reschedule Timetable Entry</h2>
              <form onSubmit={handleFormSubmit}>
                <div className="mb-4">
                  <label htmlFor="date" className="block text-white mb-1">
                    Date
                  </label>
                  <input
                    id="date"
                    name="date"
                    type="date"
                    value={currentEntry.date}
                    onChange={handleFormChange}
                    required
                    className="w-full px-4 py-2 bg-black bg-opacity-50 border border-indigo-500 rounded-md focus:outline-none text-white"
                  />
                </div>
                <div className="mb-4">
                  <label htmlFor="startTime" className="block text-white mb-1">
                    Start Time
                  </label>
                  <input
                    id="startTime"
                    name="startTime"
                    type="time"
                    value={currentEntry.startTime}
                    onChange={handleFormChange}
                    required
                    className="w-full px-4 py-2 bg-black bg-opacity-50 border border-indigo-500 rounded-md focus:outline-none text-white"
                  />
                </div>
                <div className="mb-4">
                  <label htmlFor="endTime" className="block text-white mb-1">
                    End Time
                  </label>
                  <input
                    id="endTime"
                    name="endTime"
                    type="time"
                    value={currentEntry.endTime}
                    onChange={handleFormChange}
                    required
                    className="w-full px-4 py-2 bg-black bg-opacity-50 border border-indigo-500 rounded-md focus:outline-none text-white"
                  />
                </div>
                <div className="mb-4">
                  <label htmlFor="classroom" className="block text-white mb-1">
                    Classroom
                  </label>
                  <input
                    id="classroom"
                    name="classroom"
                    type="text"
                    value={currentEntry.classroom}
                    onChange={handleFormChange}
                    required
                    className="w-full px-4 py-2 bg-black bg-opacity-50 border border-indigo-500 rounded-md focus:outline-none text-white"
                  />
                </div>
                <div className="flex justify-end space-x-4">
                  <button
                    type="button"
                    onClick={closeModal}
                    className="px-4 py-2 bg-gray-600 hover:bg-gray-700 rounded-md text-white transition duration-300"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 rounded-md text-white font-bold transition duration-300"
                  >
                    Save Changes
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Timetable;

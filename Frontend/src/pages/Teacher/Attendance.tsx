// src/pages/Teacher/Attendance.tsx
import React, { useState, useMemo, useEffect } from 'react';
import Sidebar from '../../components/common/Sidebar';
import Navbar from '../../components/common/Navbar';

// Dummy data: Teacher's courses.
const teacherCourses = [
  { id: 'course1', name: 'Calculus' },
  { id: 'course2', name: 'Physics' },
];

// Dummy data: Students per course.
const studentsByCourse: Record<string, Array<{ id: string; name: string; email: string }>> = {
  course1: [
    { id: 's1', name: 'Alice', email: 'alice@example.com' },
    { id: 's2', name: 'Bob', email: 'bob@example.com' },
    { id: 's3', name: 'Charlie', email: 'charlie@example.com' },
  ],
  course2: [
    { id: 's4', name: 'David', email: 'david@example.com' },
    { id: 's5', name: 'Eve', email: 'eve@example.com' },
  ],
};

interface AttendanceRecord {
  courseId: string;
  date: string;
  present: string[]; // Array of student IDs
}

const Attendance: React.FC = () => {
  // Selected course for input; default to first course.
  const [selectedCourse, setSelectedCourse] = useState<string>(teacherCourses[0].id);
  // Attendance input for the current session.
  const [attendanceInput, setAttendanceInput] = useState<Record<string, boolean>>({});
  // Array of attendance records (each record corresponds to one session input).
  const [attendanceRecords, setAttendanceRecords] = useState<AttendanceRecord[]>([]);

  // When selectedCourse changes, initialize the attendance input based on that course's students.
  useEffect(() => {
    const students = studentsByCourse[selectedCourse] || [];
    // Set default to false (absent) for all students.
    const initialInput: Record<string, boolean> = {};
    students.forEach((student) => {
      initialInput[student.id] = false;
    });
    setAttendanceInput(initialInput);
  }, [selectedCourse]);

  // Handle course selection change.
  const handleCourseChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedCourse(e.target.value);
  };

  // Toggle attendance checkbox for a student.
  const handleCheckboxChange = (studentId: string) => {
    setAttendanceInput((prev) => ({
      ...prev,
      [studentId]: !prev[studentId],
    }));
  };

  // Submit current session attendance.
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const presentStudents = Object.entries(attendanceInput)
      .filter(([, isPresent]) => isPresent)
      .map(([studentId]) => studentId);
    const newRecord: AttendanceRecord = {
      courseId: selectedCourse,
      date: new Date().toLocaleString(),
      present: presentStudents,
    };
    setAttendanceRecords((prev) => [...prev, newRecord]);
    alert('Attendance recorded successfully!');
  };

  // Compute overall attendance statistics across all sessions.
  const overallStats = useMemo(() => {
    let totalExpected = 0;
    let totalAttended = 0;
    attendanceRecords.forEach((record) => {
      const students = studentsByCourse[record.courseId] || [];
      totalExpected += students.length;
      totalAttended += record.present.length;
    });
    const overallPercentage = totalExpected > 0 ? ((totalAttended / totalExpected) * 100).toFixed(1) : '0';
    return { totalSessions: attendanceRecords.length, totalExpected, totalAttended, overallPercentage };
  }, [attendanceRecords]);

  return (
    <div className="min-h-screen flex font-roboto bg-gradient-to-br from-gray-900 to-black">
      {/* Sidebar */}
      <Sidebar />
      <div className="flex-1 flex flex-col">
        {/* Navbar */}
        <Navbar />
        <main className="p-8 space-y-12">
          <h1 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500">
            Record Attendance
          </h1>
          {/* Attendance Input Form */}
          <section className="bg-black bg-opacity-50 border border-indigo-500 rounded-xl shadow-xl p-8">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="course" className="block text-white text-lg font-semibold mb-2">
                  Select Course
                </label>
                <select
                  id="course"
                  value={selectedCourse}
                  onChange={handleCourseChange}
                  className="w-full px-4 py-2 bg-black bg-opacity-50 border border-indigo-500 rounded-md focus:outline-none text-white"
                >
                  {teacherCourses.map((course) => (
                    <option key={course.id} value={course.id}>
                      {course.name}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <p className="block text-white text-lg font-semibold mb-2">Mark Present</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {(studentsByCourse[selectedCourse] || []).map((student) => (
                    <label key={student.id} className="flex items-center space-x-2 text-white">
                      <input
                        type="checkbox"
                        checked={attendanceInput[student.id] || false}
                        onChange={() => handleCheckboxChange(student.id)}
                        className="h-4 w-4"
                      />
                      <span>{student.name}</span>
                    </label>
                  ))}
                </div>
              </div>
              <div>
                <button
                  type="submit"
                  className="w-full px-6 py-2 bg-indigo-600 hover:bg-indigo-700 rounded-md text-white font-bold transition duration-300"
                >
                  Submit Attendance
                </button>
              </div>
            </form>
          </section>

          {/* Overall Attendance Summary */}
          <section className="bg-black bg-opacity-50 border border-indigo-500 rounded-xl shadow-xl p-8">
            <h2 className="text-3xl font-bold text-white mb-4">Overall Attendance Summary</h2>
            <div className="flex flex-col md:flex-row justify-around items-center space-y-4 md:space-y-0">
              <div className="text-center">
                <p className="text-xl text-gray-300">Total Sessions</p>
                <p className="text-3xl font-bold text-white">{overallStats.totalSessions}</p>
              </div>
              <div className="text-center">
                <p className="text-xl text-gray-300">Total Expected</p>
                <p className="text-3xl font-bold text-white">{overallStats.totalExpected}</p>
              </div>
              <div className="text-center">
                <p className="text-xl text-gray-300">Total Attended</p>
                <p className="text-3xl font-bold text-white">{overallStats.totalAttended}</p>
              </div>
              <div className="text-center">
                <p className="text-xl text-gray-300">Overall %</p>
                <p className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-blue-500">
                  {overallStats.overallPercentage}%
                </p>
              </div>
            </div>
          </section>

          {/* Detailed Attendance Records */}
          <section className="bg-black bg-opacity-50 border border-indigo-500 rounded-xl shadow-xl p-8">
            <h2 className="text-3xl font-bold text-white mb-4">Attendance Records</h2>
            {attendanceRecords.length > 0 ? (
              <table className="min-w-full text-white">
                <thead className="bg-gray-800">
                  <tr>
                    <th className="border-b border-gray-600 p-3 text-left uppercase tracking-wider">Course</th>
                    <th className="border-b border-gray-600 p-3 text-left uppercase tracking-wider">Date</th>
                    <th className="border-b border-gray-600 p-3 text-left uppercase tracking-wider">Present</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-700">
                  {attendanceRecords.map((record) => (
                    <tr key={`${record.courseId}-${record.date}`} className="hover:bg-gray-700 transition-colors">
                      <td className="p-3">
                        {teacherCourses.find((c) => c.id === record.courseId)?.name ?? record.courseId}
                      </td>
                      <td className="p-3">{record.date}</td>
                      <td className="p-3">{record.present.join(', ') || '-'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <p className="text-center text-white">No attendance records available.</p>
            )}
          </section>
        </main>
      </div>
    </div>
  );
};

export default Attendance;

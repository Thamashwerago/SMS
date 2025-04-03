// src/pages/Student/Attendance.tsx
import React, { useMemo } from 'react';
import Sidebar from '../../components/common/Sidebar';
import Navbar from '../../components/common/Navbar';

interface CourseAttendance {
  id: number;
  course: string;
  totalClasses: number;
  attendedClasses: number;
}

// Dummy data for course attendance
const courseAttendanceData: CourseAttendance[] = [
  { id: 1, course: 'Calculus I', totalClasses: 30, attendedClasses: 28 },
  { id: 2, course: 'Physics', totalClasses: 30, attendedClasses: 26 },
  { id: 3, course: 'History', totalClasses: 30, attendedClasses: 30 },
  { id: 4, course: 'Chemistry', totalClasses: 30, attendedClasses: 27 },
];

const Attendance: React.FC = () => {
  // Calculate overall statistics using useMemo.
  const overallStats = useMemo(() => {
    const totalClasses = courseAttendanceData.reduce(
      (acc, course) => acc + course.totalClasses,
      0
    );
    const totalAttended = courseAttendanceData.reduce(
      (acc, course) => acc + course.attendedClasses,
      0
    );
    const overallPercentage =
      totalClasses > 0 ? ((totalAttended / totalClasses) * 100).toFixed(1) : '0';
    return { totalClasses, totalAttended, overallPercentage };
  }, []);

  return (
    <div className="min-h-screen flex font-roboto bg-gradient-to-br from-gray-900 to-black">
      {/* Sidebar */}
      <Sidebar />
      <div className="flex-1 flex flex-col">
        {/* Navbar */}
        <Navbar />
        <main className="p-8">
          <h1 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500 mb-8">
            My Attendance
          </h1>
          {/* Overall Attendance Summary */}
          <section className="mb-8">
            <div className="bg-black bg-opacity-50 border border-indigo-500 rounded-xl shadow-xl p-8 flex flex-col md:flex-row justify-around">
              <div className="text-center">
                <p className="text-xl text-gray-300">Total Classes</p>
                <p className="text-3xl font-bold text-white">
                  {overallStats.totalClasses}
                </p>
              </div>
              <div className="text-center">
                <p className="text-xl text-gray-300">Attended Classes</p>
                <p className="text-3xl font-bold text-white">
                  {overallStats.totalAttended}
                </p>
              </div>
              <div className="text-center">
                <p className="text-xl text-gray-300">Overall Attendance</p>
                <p className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-blue-500">
                  {overallStats.overallPercentage}%
                </p>
              </div>
            </div>
          </section>
          {/* Course-wise Attendance Table */}
          <section>
            <h2 className="text-3xl font-bold text-white mb-4">
              Course Attendance Details
            </h2>
            <div className="overflow-x-auto bg-black bg-opacity-50 border border-indigo-500 rounded-xl shadow-xl">
              <table className="min-w-full text-white">
                <thead className="bg-gray-800">
                  <tr>
                    <th className="border-b border-gray-600 p-3 text-left uppercase tracking-wider">
                      Course
                    </th>
                    <th className="border-b border-gray-600 p-3 text-left uppercase tracking-wider">
                      Attended
                    </th>
                    <th className="border-b border-gray-600 p-3 text-left uppercase tracking-wider">
                      Total
                    </th>
                    <th className="border-b border-gray-600 p-3 text-left uppercase tracking-wider">
                      Attendance %
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-700">
                  {courseAttendanceData.map((course) => {
                    const percentage =
                      course.totalClasses > 0
                        ? ((course.attendedClasses / course.totalClasses) * 100).toFixed(1)
                        : '0';
                    return (
                      <tr key={course.id} className="hover:bg-gray-700 transition-colors">
                        <td className="p-3">{course.course}</td>
                        <td className="p-3">{course.attendedClasses}</td>
                        <td className="p-3">{course.totalClasses}</td>
                        <td className="p-3">{percentage}%</td>
                      </tr>
                    );
                  })}
                  {courseAttendanceData.length === 0 && (
                    <tr>
                      <td colSpan={4} className="p-3 text-center">
                        No attendance data found.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </section>
        </main>
      </div>
    </div>
  );
};

export default Attendance;

import React, { useState, useEffect, useMemo } from 'react';
import Sidebar from '../../components/common/Sidebar';
import Navbar from '../../components/common/Navbar';
import CourseCard, { AggregatedCourseAttendance } from '../../components/common/CourseCard';

interface AttendanceRecord {
  id: number;
  userId: number;
  role: string;
  courseId: number;
  date: string; // ISO date string, e.g., "2025-04-02"
  status: string; // "Present" or "Absent"
}

// Dummy initial attendance records.
const initialAttendanceRecords: AttendanceRecord[] = [
  { id: 1, userId: 1, role: 'Student', courseId: 1, date: '2025-04-02', status: 'Present' },
  { id: 2, userId: 2, role: 'Student', courseId: 1, date: '2025-04-02', status: 'Absent' },
  { id: 3, userId: 3, role: 'Student', courseId: 1, date: '2025-04-02', status: 'Present' },
  { id: 4, userId: 4, role: 'Student', courseId: 2, date: '2025-04-02', status: 'Present' },
  { id: 5, userId: 5, role: 'Student', courseId: 2, date: '2025-04-02', status: 'Present' },
  { id: 6, userId: 6, role: 'Student', courseId: 3, date: '2025-04-02', status: 'Absent' },
];

// Dummy mapping for course info.
const courseInfo: Record<number, { courseName: string; teacher: string; totalStudents: number }> = {
  1: { courseName: 'Quantum Mechanics', teacher: 'Dr. Alice Carter', totalStudents: 100 },
  2: { courseName: 'Linear Algebra', teacher: 'Prof. Bob Smith', totalStudents: 80 },
  3: { courseName: 'Modern Art History', teacher: 'Ms. Sarah Lee', totalStudents: 60 },
};

// Dummy mapping for user info.
const userInfo: Record<number, { firstName: string; lastName: string }> = {
  1: { firstName: 'Alice', lastName: 'Johnson' },
  2: { firstName: 'Bob', lastName: 'Smith' },
  3: { firstName: 'Charlie', lastName: 'Davis' },
  4: { firstName: 'David', lastName: 'Lee' },
  5: { firstName: 'Eve', lastName: 'Williams' },
  6: { firstName: 'Frank', lastName: 'Miller' },
};


const AttendanceManagement: React.FC = () => {
  const [attendanceRecords, setAttendanceRecords] = useState<AttendanceRecord[]>(initialAttendanceRecords);
  // State for the course popup modal.
  const [selectedCoursePopup, setSelectedCoursePopup] = useState<AggregatedCourseAttendance | null>(null);
  // Sorting state for user-wise attendance table.
  const [userSortColumn, setUserSortColumn] = useState<'firstName' | 'lastName' | 'coursesAttended' | 'attendancePercentage'>('firstName');
  const [userSortDirection, setUserSortDirection] = useState<'asc' | 'desc'>('asc');

  // Function to update attendance records with random status changes.
  const updateAttendanceStatus = (prevRecords: AttendanceRecord[]): AttendanceRecord[] => {
    return prevRecords.map(record => {
      const flip = Math.random() < 0.3;
      return flip
        ? { ...record, status: record.status === 'Present' ? 'Absent' : 'Present' }
        : record;
    });
  };

  // Simulate real-time updates every 5 seconds.
  useEffect(() => {
    const interval = setInterval(() => {
      setAttendanceRecords(prevRecords => updateAttendanceStatus(prevRecords));
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  // Aggregate attendance data per course.
  const aggregatedCourseAttendance: AggregatedCourseAttendance[] = useMemo(() => {
    const groups = new Map<number, AttendanceRecord[]>();
    attendanceRecords.forEach(record => {
      if (!groups.has(record.courseId)) {
        groups.set(record.courseId, []);
      }
      groups.get(record.courseId)!.push(record);
    });
    const aggregates: AggregatedCourseAttendance[] = [];
    groups.forEach((records, courseId) => {
      const presentCount = records.filter(r => r.status === 'Present').length;
      const info = courseInfo[courseId] || { courseName: `Course ${courseId}`, teacher: 'Unknown', totalStudents: 0 };
      aggregates.push({
        courseId,
        courseName: info.courseName,
        teacher: info.teacher,
        totalStudents: info.totalStudents,
        present: presentCount,
        updatedAt: new Date().toLocaleTimeString(),
        records,
      });
    });
    return aggregates;
  }, [attendanceRecords]);

  // Aggregate attendance by user, including first and last names.
  const aggregatedUserAttendance = useMemo(() => {
    const userMap = new Map<number, { userId: number; firstName: string; lastName: string; coursesAttended: number }>();
    attendanceRecords.forEach(record => {
      if (record.status === 'Present') {
        if (userMap.has(record.userId)) {
          userMap.get(record.userId)!.coursesAttended += 1;
        } else {
          const info = userInfo[record.userId] || { firstName: 'Unknown', lastName: 'User' };
          userMap.set(record.userId, { userId: record.userId, firstName: info.firstName, lastName: info.lastName, coursesAttended: 1 });
        }
      }
    });
    const totalCourses = Object.keys(courseInfo).length;
    return Array.from(userMap.values()).map(user => ({
      ...user,
      attendancePercentage: totalCourses > 0 ? (user.coursesAttended / totalCourses) * 100 : 0,
    }));
  }, [attendanceRecords]);

  // Enable sorting on the user-wise attendance table.
  const sortedUserAttendance = useMemo(() => {
    const data = [...aggregatedUserAttendance];
    data.sort((a, b) => {
      let compA, compB;
      if (userSortColumn === 'firstName') {
        compA = a.firstName.toLowerCase();
        compB = b.firstName.toLowerCase();
      } else if (userSortColumn === 'lastName') {
        compA = a.lastName.toLowerCase();
        compB = b.lastName.toLowerCase();
      } else if (userSortColumn === 'coursesAttended') {
        compA = a.coursesAttended;
        compB = b.coursesAttended;
      } else {
        compA = a.attendancePercentage;
        compB = b.attendancePercentage;
      }
      if (compA < compB) return userSortDirection === 'asc' ? -1 : 1;
      if (compA > compB) return userSortDirection === 'asc' ? 1 : -1;
      return 0;
    });
    return data;
  }, [aggregatedUserAttendance, userSortColumn, userSortDirection]);

  const handleUserSort = (column: 'firstName' | 'lastName' | 'coursesAttended' | 'attendancePercentage') => {
    if (userSortColumn === column) {
      setUserSortDirection(userSortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setUserSortColumn(column);
      setUserSortDirection('asc');
    }
  };

  return (
    <div className="min-h-screen flex font-roboto bg-gradient-to-br from-gray-900 to-black">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <Navbar />
        <main className="p-8">
          <h1 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500 mb-8">
            Attendance Management
          </h1>

          {/* Course Attendance Cards */}
          <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
            {aggregatedCourseAttendance.map(course => (
              <CourseCard
                key={course.courseId}
                course={course}
                onClick={course => setSelectedCoursePopup(course)}
              />
            ))}
            {aggregatedCourseAttendance.length === 0 && (
              <p className="text-white col-span-full text-center">No attendance data found.</p>
            )}
          </section>

          {/* User-Wise Attendance Table */}
          <section>
            <h2 className="text-3xl font-bold text-white mb-4">User-Wise Attendance</h2>
            <div className="overflow-x-auto bg-black bg-opacity-50 border border-indigo-500 rounded-xl shadow-xl">
              <table className="min-w-full divide-y divide-gray-700">
                <thead className="bg-gray-800">
                  <tr>
                    <th
                      onClick={() => handleUserSort('firstName')}
                      className="px-6 py-3 text-left text-sm font-medium text-white uppercase tracking-wider cursor-pointer"
                    >
                      First Name {userSortColumn === 'firstName' && (userSortDirection === 'asc' ? '▲' : '▼')}
                    </th>
                    <th
                      onClick={() => handleUserSort('lastName')}
                      className="px-6 py-3 text-left text-sm font-medium text-white uppercase tracking-wider cursor-pointer"
                    >
                      Last Name {userSortColumn === 'lastName' && (userSortDirection === 'asc' ? '▲' : '▼')}
                    </th>
                    <th
                      onClick={() => handleUserSort('coursesAttended')}
                      className="px-6 py-3 text-left text-sm font-medium text-white uppercase tracking-wider cursor-pointer"
                    >
                      Courses Attended {userSortColumn === 'coursesAttended' && (userSortDirection === 'asc' ? '▲' : '▼')}
                    </th>
                    <th
                      onClick={() => handleUserSort('attendancePercentage')}
                      className="px-6 py-3 text-left text-sm font-medium text-white uppercase tracking-wider cursor-pointer"
                    >
                      Attendance % {userSortColumn === 'attendancePercentage' && (userSortDirection === 'asc' ? '▲' : '▼')}
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-black divide-y divide-gray-800">
                  {sortedUserAttendance.map(user => (
                    <tr key={user.userId} className="hover:bg-gray-700 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap text-white">{user.firstName}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-white">{user.lastName}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-white">{user.coursesAttended}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-white">
                        {user.attendancePercentage.toFixed(1)}%
                      </td>
                    </tr>
                  ))}
                  {sortedUserAttendance.length === 0 && (
                    <tr>
                      <td colSpan={4} className="px-6 py-4 text-center text-white">
                        No user attendance data found.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </section>
        </main>
      </div>

      {/* Popup Modal for Course Details */}
      {selectedCoursePopup && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-70 z-50">
          <div className="bg-gray-800 p-8 rounded-xl border border-indigo-500 shadow-xl w-full max-w-lg mx-4 animate-fadeIn max-h-[80vh] overflow-y-auto">
            <h2 className="text-2xl font-bold text-white mb-4">
              {selectedCoursePopup.courseName} Attendees
            </h2>
            <p className="text-gray-300 mb-2">Teacher: {selectedCoursePopup.teacher}</p>
            <ul className="text-gray-200 text-sm">
              {selectedCoursePopup.records.map(record => {
                const user = userInfo[record.userId] || { firstName: 'Unknown', lastName: 'User' };
                return (
                  <li key={record.id} className="mb-1">
                    {user.firstName} {user.lastName} - {record.date} ({record.status})
                  </li>
                );
              })}
            </ul>
            <button
              onClick={() => setSelectedCoursePopup(null)}
              className="mt-6 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 rounded-md text-white font-bold transition duration-300"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AttendanceManagement;

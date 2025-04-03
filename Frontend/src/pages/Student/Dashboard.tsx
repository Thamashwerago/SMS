// src/pages/Student/StudentDashboard.tsx
import React, { useMemo } from 'react';
import Sidebar from '../../components/common/Sidebar';
import Navbar from '../../components/common/Navbar';
import Card from '../../components/common/Card';
import Chart from '../../components/common/Chart';

const StudentDashboard: React.FC = () => {
  // Dummy metrics for the student dashboard.
  const metrics = {
    enrolledCourses: 5,
    averageAttendance: 88,
    upcomingClasses: 2,
    pendingAssignments: 3,
  };

  // Dummy data for the attendance trend chart (line chart).
  const attendanceTrendData = useMemo(() => ({
    labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4'],
    attendance: [80, 85, 90, 88],
  }), []);

  const lineChartData = useMemo(() => ({
    labels: attendanceTrendData.labels,
    datasets: [
      {
        label: 'Attendance Trend (%)',
        data: attendanceTrendData.attendance,
        borderColor: ['rgba(0,230,255,0.8)'],
        backgroundColor: ['rgba(0,230,255,0.2)'],
        borderWidth: 2,
        tension: 0.4,
      },
    ],
  }), [attendanceTrendData]);

  const lineChartOptions = useMemo(() => ({
    responsive: true,
    plugins: {
      legend: { position: 'top' as const, labels: { color: 'white' } },
      title: { display: true, text: 'Attendance Trend', color: 'white' },
    },
    scales: {
      x: { ticks: { color: 'white' }, grid: { color: 'rgba(255,255,255,0.1)' } },
      y: { ticks: { color: 'white' }, grid: { color: 'rgba(255,255,255,0.1)' } },
    },
  }), []);

  // Dummy timetable data for today's classes.
  const timetable = [
    { id: 1, course: 'Calculus I', time: '9:00 AM - 10:30 AM', teacher: 'Dr. John Smith' },
    { id: 2, course: 'Physics', time: '11:00 AM - 12:30 PM', teacher: 'Dr. Emily Carter' },
    { id: 3, course: 'Literature', time: '2:00 PM - 3:30 PM', teacher: 'Ms. Anna Lee' },
  ];

  // Dummy course attendance totals.
  const courseAttendanceTotals = [
    { id: 1, course: 'Calculus I', attended: 28, total: 30 },
    { id: 2, course: 'Physics', attended: 26, total: 30 },
    { id: 3, course: 'Literature', attended: 30, total: 30 },
  ];

  return (
    <div className="min-h-screen flex font-roboto bg-gradient-to-br from-gray-900 to-black">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <Navbar />
        <main className="p-8">
          {/* Metrics Cards */}
          <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
            <Card title="Enrolled Courses" value={metrics.enrolledCourses} icon="📚" />
            <Card title="Avg. Attendance" value={`${metrics.averageAttendance}%`} icon="✅" />
            <Card title="Upcoming Classes" value={metrics.upcomingClasses} icon="🗓️" />
            <Card title="Pending Assignments" value={metrics.pendingAssignments} icon="✏️" />
          </section>

          {/* Attendance Trend Chart */}
          <section className="mb-8">
            <div className="bg-black bg-opacity-50 border border-indigo-500 p-8 rounded-xl shadow-xl">
              <Chart type="line" data={lineChartData} options={lineChartOptions} />
            </div>
          </section>

          {/* Timetable Section */}
          <section className="mb-8">
            <h2 className="text-3xl font-bold text-white mb-4">Today's Timetable</h2>
            <div className="bg-black bg-opacity-50 border border-indigo-500 rounded-xl shadow-xl p-4">
              <ul>
                {timetable.map((entry) => (
                  <li key={entry.id} className="border-b border-gray-700 py-2">
                    <div className="flex justify-between">
                      <span className="text-white font-semibold">{entry.course}</span>
                      <span className="text-gray-300">{entry.time}</span>
                    </div>
                    <p className="text-gray-400">{entry.teacher}</p>
                  </li>
                ))}
              </ul>
            </div>
          </section>

          {/* Course Attendance Totals */}
          <section>
            <h2 className="text-3xl font-bold text-white mb-4">Course Attendance Totals</h2>
            <div className="bg-black bg-opacity-50 border border-indigo-500 rounded-xl shadow-xl p-4">
              <table className="min-w-full text-white">
                <thead>
                  <tr>
                    <th className="border-b border-gray-600 pb-2 text-left">Course</th>
                    <th className="border-b border-gray-600 pb-2 text-left">Attendance</th>
                  </tr>
                </thead>
                <tbody>
                  {courseAttendanceTotals.map((course) => {
                    const percentage = ((course.attended / course.total) * 100).toFixed(1);
                    return (
                      <tr key={course.id} className="hover:bg-gray-800 transition-colors">
                        <td className="py-2">{course.course}</td>
                        <td className="py-2">
                          {`${course.attended} / ${course.total} (${percentage}%)`}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </section>
        </main>
      </div>
    </div>
  );
};

export default StudentDashboard;

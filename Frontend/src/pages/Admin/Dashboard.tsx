// src/pages/Admin/Dashboard.tsx
import React, { useMemo, useState } from 'react';
import Sidebar from '../../components/common/Sidebar';
import Navbar from '../../components/common/Navbar';
import Card from '../../components/common/Card';
import Chart from '../../components/common/Chart';

const Dashboard: React.FC = () => {
  // Dummy metrics (to be replaced with real backend data)
  const metrics = {
    totalStudents: 750,
    totalTeachers: 65,
    totalCourses: 25,
    todaysClasses: 10,
    averageAttendance: 95,
  };

  // Dummy data for recent activities
  const recentActivities = [
    { id: 1, activity: 'New student enrolled', time: '09:45 AM' },
    { id: 2, activity: 'Teacher updated profile', time: '10:30 AM' },
    { id: 3, activity: 'Course "Quantum Physics" added', time: '11:15 AM' },
  ];

  // State for chart data
  const [enrollmentTrendData, setEnrollmentTrendData] = useState({
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul'],
    enrollments: [200, 300, 400, 350, 450, 500, 550],
  });

  const [attendanceDistribution, setAttendanceDistribution] = useState({
    present: 95,
    absent: 5,
  });

  // Function to refresh chart data with new dummy values
  const refreshChartData = () => {
    const newEnrollments = enrollmentTrendData.labels.map(() => Math.floor(Math.random() * 400) + 200);
    setEnrollmentTrendData({ ...enrollmentTrendData, enrollments: newEnrollments });

    const newPresent = Math.floor(Math.random() * 10) + 90; // generates a number between 90 and 99
    setAttendanceDistribution({ present: newPresent, absent: 100 - newPresent });
  };

  // State and filter for recent activities search
  const [searchTerm, setSearchTerm] = useState('');
  const filteredActivities = recentActivities.filter((item) =>
    item.activity.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Memoized data for the enrollment trends line chart
  const lineChartData = useMemo(() => ({
    labels: enrollmentTrendData.labels,
    datasets: [
      {
        label: 'Enrollments',
        data: enrollmentTrendData.enrollments,
        borderColor: 'rgba(0,230,255,0.8)',
        backgroundColor: 'rgba(0,230,255,0.2)',
        tension: 0.4,
      },
    ],
  }), [enrollmentTrendData]);

  const lineChartOptions = useMemo(() => ({
    responsive: true,
    plugins: {
      legend: { position: 'top' as const, labels: { color: 'white' } },
      title: { display: true, text: 'Enrollment Trends', color: 'white' },
    },
    scales: {
      x: {
        ticks: { color: 'white' },
        grid: { color: 'rgba(255,255,255,0.1)' },
      },
      y: {
        ticks: { color: 'white' },
        grid: { color: 'rgba(255,255,255,0.1)' },
      },
    },
  }), []);

  // Memoized data for the attendance distribution pie chart
  const pieChartData = useMemo(() => ({
    labels: ['Present', 'Absent'],
    datasets: [
      {
        label: 'Attendance Distribution',
        data: [attendanceDistribution.present, attendanceDistribution.absent],
        backgroundColor: ['rgba(40,167,69,0.8)', 'rgba(255,193,7,0.8)'],
        hoverBackgroundColor: ['rgba(40,167,69,1)', 'rgba(255,193,7,1)'],
      },
    ],
  }), [attendanceDistribution]);

  const pieChartOptions = useMemo(() => ({
    responsive: true,
    plugins: {
      legend: { position: 'top' as const, labels: { color: 'white' } },
      title: { display: true, text: 'Attendance Distribution', color: 'white' },
    },
  }), []);

  return (
    <div className="min-h-screen flex font-roboto bg-gradient-to-br from-gray-900 to-black">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <Navbar />
        <main className="p-4 sm:p-8">
          {/* Overview Cards Section */}
          <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-8">
            <div className="hover:scale-105 transition-transform duration-300">
              <Card title="Total Students" value={metrics.totalStudents} icon="👨‍🎓" />
            </div>
            <div className="hover:scale-105 transition-transform duration-300">
              <Card title="Total Teachers" value={metrics.totalTeachers} icon="👩‍🏫" />
            </div>
            <div className="hover:scale-105 transition-transform duration-300">
              <Card title="Total Courses" value={metrics.totalCourses} icon="📚" />
            </div>
            <div className="hover:scale-105 transition-transform duration-300">
              <Card title="Today's Classes" value={metrics.todaysClasses} icon="🗓️" />
            </div>
            <div className="hover:scale-105 transition-transform duration-300">
              <Card title="Avg. Attendance" value={`${metrics.averageAttendance}%`} icon="✅" />
            </div>
          </section>

          {/* Refresh Button for Charts */}
          <div className="flex justify-end mb-4">
            <button 
              onClick={refreshChartData}
              className="px-4 py-2 bg-indigo-500 hover:bg-indigo-600 transition-colors rounded text-white"
            >
              Refresh Charts
            </button>
          </div>

          {/* Charts Section */}
          <section className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
            <div className="bg-black bg-opacity-50 border border-indigo-500 p-6 sm:p-8 rounded-xl shadow-xl">
              <Chart type="line" data={lineChartData} options={lineChartOptions} />
            </div>
            <div className="bg-black bg-opacity-50 border border-indigo-500 p-6 sm:p-8 rounded-xl shadow-xl">
              <Chart type="pie" data={pieChartData} options={pieChartOptions} />
            </div>
          </section>

          {/* Recent Activities Section */}
          <section className="bg-black bg-opacity-50 border border-indigo-500 p-6 sm:p-8 rounded-xl shadow-xl">
            <div className="flex flex-col sm:flex-row justify-between items-center mb-6">
              <h2 className="text-3xl font-bold text-white">Recent Activities</h2>
              <div className="mt-4 sm:mt-0">
                <input
                  type="text"
                  placeholder="Search activities..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="px-4 py-2 rounded bg-gray-800 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-white">
                <thead>
                  <tr>
                    <th className="border-b border-gray-600 pb-3 text-left">Activity</th>
                    <th className="border-b border-gray-600 pb-3 text-left">Time</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredActivities.map((item) => (
                    <tr key={item.id} className="hover:bg-gray-800 transition-colors">
                      <td className="py-4">{item.activity}</td>
                      <td className="py-4">{item.time}</td>
                    </tr>
                  ))}
                  {filteredActivities.length === 0 && (
                    <tr>
                      <td className="py-4" colSpan={2}>No activities found.</td>
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

export default Dashboard;

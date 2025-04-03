/**
 * Dashboard.tsx
 *
 * Advanced Admin Dashboard with Reusable Components and Optimized Chart Data
 * ------------------------------------------------------------------------------
 * This component presents a modern, interactive admin dashboard that:
 * - Displays key metrics via reusable overview cards.
 * - Includes a line chart for enrollment trends.
 * - Includes a pie chart for attendance distribution.
 * - Shows a table of recent activities.
 *
 * The design now reflects a modern minimal theme using a white, clean aesthetic.
 */

import React, { useMemo } from 'react';
import Navbar from '../../components/common/Navbar';
import Sidebar from '../../components/common/Sidebar';
import { Line, Pie } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  ChartOptions,
} from 'chart.js';

// Register ChartJS components
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, ArcElement);

/**
 * OverviewCard Component
 * ------------------------
 * A reusable component to display a metric card with a title, value, and an optional icon.
 *
 * Props:
 * - title: The title of the metric.
 * - value: The metric value (can be a string or number).
 * - icon: (Optional) An icon to display alongside the title.
 */
interface OverviewCardProps {
  title: string;
  value: string | number;
  icon?: React.ReactNode;
}

const OverviewCard: React.FC<OverviewCardProps> = ({ title, value, icon }) => {
  return (
    <div className="bg-white border border-gray-200 p-6 rounded-lg shadow hover:shadow-xl transition-shadow">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold text-gray-900">{title}</h2>
        {icon && <div>{icon}</div>}
      </div>
      <p className="mt-2 text-gray-800 text-2xl font-bold">{value}</p>
    </div>
  );
};

/**
 * Dummy Data for Dashboard Metrics and Charts
 * --------------------------------------------
 * Replace these dummy values with data fetched from your backend.
 */
const dummyMetrics = {
  totalStudents: 500,
  totalTeachers: 50,
  totalCourses: 20,
  todaysClasses: 8,
  attendanceSummary: 98,
};

const dummyEnrollmentData = {
  labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul'],
  enrollments: [200, 250, 300, 280, 350, 400, 420],
};

const dummyAttendanceData = {
  present: 98,
  absent: 2,
};

const dummyRecentActivities = [
  { id: 1, activity: 'New student registered', time: '10:30 AM' },
  { id: 2, activity: 'Teacher profile updated', time: '11:15 AM' },
  { id: 3, activity: 'Course "Math 101" created', time: '12:00 PM' },
];

/**
 * Dashboard Component
 * -------------------
 * Renders the admin dashboard with overview cards, charts, and a recent activities table.
 * Added spacing (mt-6) between the Navbar and the dashboard content.
 */
const Dashboard: React.FC = () => {
  // Memoize the enrollment trends chart data to optimize performance.
  const lineChartData = useMemo(() => ({
    labels: dummyEnrollmentData.labels,
    datasets: [
      {
        label: 'Enrollments',
        data: dummyEnrollmentData.enrollments,
        borderColor: '#007BFF', // Primary blue
        backgroundColor: 'rgba(0, 123, 255, 0.2)',
        tension: 0.3,
      },
    ],
  }), []);

  // Memoize the enrollment trends chart options.
  const lineOptions: ChartOptions<'line'> = useMemo(() => ({
    responsive: true,
    plugins: {
      legend: { position: 'top' },
      title: { display: true, text: 'Enrollment Trends' },
    },
  }), []);

  // Memoize the attendance distribution pie chart data.
  const pieChartData = useMemo(() => ({
    labels: ['Present', 'Absent'],
    datasets: [
      {
        label: 'Attendance',
        data: [dummyAttendanceData.present, dummyAttendanceData.absent],
        backgroundColor: ['#28A745', '#FFC107'], // Secondary colors: green & orange
        hoverBackgroundColor: ['#218838', '#e0a800'],
      },
    ],
  }), []);

  // Memoize the pie chart options.
  const pieOptions: ChartOptions<'pie'> = useMemo(() => ({
    responsive: true,
    plugins: {
      legend: { position: 'top' },
      title: { display: true, text: 'Attendance Distribution' },
    },
  }), []);

  return (
    <div className="min-h-screen flex bg-white font-roboto">
      {/* Sidebar Navigation */}
      <Sidebar />
      <div className="flex-1 p-6">
        {/* Top Navbar */}
        <Navbar />
        {/* Added margin-top for spacing between the Navbar and dashboard content */}
        <div className="mt-6">
          {/* Overview Cards Section */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-6">
            <OverviewCard title="👨‍🎓 Total Students" value={dummyMetrics.totalStudents} />
            <OverviewCard title="👩‍🏫 Total Teachers" value={dummyMetrics.totalTeachers} />
            <OverviewCard title="📚 Total Courses" value={dummyMetrics.totalCourses} />
            <OverviewCard title="🗓️ Today's Classes" value={dummyMetrics.todaysClasses} />
            <OverviewCard title="✅ Attendance Summary" value={`${dummyMetrics.attendanceSummary}% Present Today`} />
          </div>
          
          {/* Charts Section */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Enrollment Trends Line Chart */}
            <div className="bg-white border border-gray-200 p-6 rounded-lg shadow">
              <Line data={lineChartData} options={lineOptions} />
            </div>
            {/* Attendance Distribution Pie Chart */}
            <div className="bg-white border border-gray-200 p-6 rounded-lg shadow">
              <Pie data={pieChartData} options={pieOptions} />
            </div>
          </div>
          
          {/* Recent Activities Table */}
          <div className="bg-white border border-gray-200 p-6 rounded-lg shadow mt-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Recent Activities</h2>
            <div className="overflow-x-auto">
              <table className="w-full text-gray-900">
                <thead>
                  <tr>
                    <th className="border-b border-gray-200 pb-2 text-left">Activity</th>
                    <th className="border-b border-gray-200 pb-2 text-left">Time</th>
                  </tr>
                </thead>
                <tbody>
                  {dummyRecentActivities.map((item) => (
                    <tr key={item.id} className="hover:bg-gray-100 transition-colors">
                      <td className="py-2">{item.activity}</td>
                      <td className="py-2">{item.time}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;

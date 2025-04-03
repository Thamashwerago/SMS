/**
 * AdminRoutes.tsx
 *
 * This file defines all admin-specific routes for the application.
 * It includes routes for:
 * - Dashboard
 * - Student Management
 * - Teacher Management
 * - User Management
 * - Course Management
 * - Timetable Management
 * - Attendance Management
 * - Settings
 * - Profile & Notifications
 *
 * These routes are only accessible by admin users.
 */

import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';

// Import admin page components (create these components as needed)
import Dashboard from '../pages/admin/Dashboard';
import StudentManagement from '../pages/admin/StudentManagement';
import TeacherManagement from '../pages/admin/TeacherManagement';
import CourseManagement from '../pages/admin/CourseManagement';
import TimetableManagement from '../pages/admin/TimetableManagement';
import AttendanceManagement from '../pages/admin/AttendanceManagement';
import Settings from '../pages/Common/Settings';
import Profile from '../pages/Common/Profile';
import Notifications from '../pages/Common/Notifications';

const AdminRoutes: React.FC = () => {
  return (
    <Routes>
      {/* Redirect base admin URL to dashboard */}
      <Route path="/admin" element={<Navigate to="/admin/dashboard" />} />

      {/* Dashboard */}
      <Route path="/admin/dashboard" element={<Dashboard />} />

      {/* Management Pages */}
      <Route path="/admin/student-management" element={<StudentManagement />} />
      <Route path="/admin/teacher-management" element={<TeacherManagement />} />
      <Route path="/admin/course-management" element={<CourseManagement />} />
      <Route path="/admin/timetable-management" element={<TimetableManagement />} />
      <Route path="/admin/attendance-management" element={<AttendanceManagement />} />

      {/* Settings and User Related Pages */}
      <Route path="/admin/settings" element={<Settings />} />
      <Route path="/admin/profile" element={<Profile />} />
      <Route path="/admin/notifications" element={<Notifications />} />

      
    </Routes>
  );
};

export default AdminRoutes;

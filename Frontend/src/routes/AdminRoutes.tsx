/**
 * AdminRoutes.tsx
 *
 * This file defines all admin-specific routes for the application, including:
 * - Dashboard
 * - Student Management
 * - Teacher Management
 * - User Management
 * - Course Management
 * - Timetable Management
 * - Attendance Management
 * - AddAdmin, AddStudent, AddTeacher (for creation flows)
 * - Settings, Profile, and Notifications (user-related pages)
 *
 * These routes are only accessible by admin users.
 */

import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';

// Import admin page components (create these components as needed)
import Dashboard from '../pages/Admin/Dashboard';
import StudentManagement from '../pages/Admin/StudentManagement';
import TeacherManagement from '../pages/Admin/TeacherManagement';
import UserManagement from '../pages/Admin/UserManagement';
import CourseManagement from '../pages/Admin/CourseManagement';
import TimetableManagement from '../pages/Admin/TimetableManagement';
import AttendanceManagement from '../pages/Admin/AttendanceManagement';
import AddAdmin from '../pages/Admin/AddAdmin';
import AddStudent from '../pages/Admin/AddStudent';
import AddTeacher from '../pages/Admin/AddTeacher';

// Import common pages for admin
import Settings from '../pages/Common/Settings';
import Profile from '../pages/Common/Profile';
import Notifications from '../pages/Common/Notifications';
import AddCourse from '../pages/Admin/AddCourse';

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
      <Route path="/admin/user-management" element={<UserManagement />} />
      <Route path="/admin/course-management" element={<CourseManagement />} />
      <Route path="/admin/timetable-management" element={<TimetableManagement />} />
      <Route path="/admin/attendance-management" element={<AttendanceManagement />} />

      {/* Add (Create) Pages */}
      <Route path="/admin/add-admin" element={<AddAdmin />} />
      <Route path="/admin/add-student" element={<AddStudent />} />
      <Route path="/admin/add-teacher" element={<AddTeacher />} />
      <Route path="/admin/add-course" element={<AddCourse />} />

      {/* Settings and User Related Pages */}
      <Route path="/admin/settings" element={<Settings />} />
      <Route path="/admin/profile" element={<Profile />} />
      <Route path="/admin/notifications" element={<Notifications />} />
    </Routes>
  );
};

export default AdminRoutes;

import React, { Suspense, lazy } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';

// Lazy load admin pages for performance optimization.
const Dashboard = lazy(() => import('../pages/Admin/Dashboard'));
const StudentManagement = lazy(() => import('../pages/Admin/StudentManagement'));
const TeacherManagement = lazy(() => import('../pages/Admin/TeacherManagement'));
const UserManagement = lazy(() => import('../pages/Admin/UserManagement'));
const CourseManagement = lazy(() => import('../pages/Admin/CourseManagement'));
const TimetableManagement = lazy(() => import('../pages/Admin/TimetableManagement'));
const AttendanceManagement = lazy(() => import('../pages/Admin/AttendanceManagement'));
const AdminProfile = lazy(() => import('../pages/Admin/Profile'));
const AddAdmin = lazy(() => import('../pages/Admin/AddAdmin'));
const AddStudent = lazy(() => import('../pages/Admin/AddStudent'));
const AddTeacher = lazy(() => import('../pages/Admin/AddTeacher'));
const AddCourse = lazy(() => import('../pages/Admin/AddCourse'));
const AddTimetable = lazy(() => import('../pages/Admin/AddTimetable'));

// Import route string constants.
import {
  ADMIN_BASE_PATH,
  ADMIN_DASHBOARD_PATH,
  ADMIN_STUDENT_MANAGEMENT_PATH,
  ADMIN_TEACHER_MANAGEMENT_PATH,
  ADMIN_USER_MANAGEMENT_PATH,
  ADMIN_COURSE_MANAGEMENT_PATH,
  ADMIN_TIMETABLE_MANAGEMENT_PATH,
  ADMIN_ATTENDANCE_MANAGEMENT_PATH,
  ADMIN_ADD_ADMIN_PATH,
  ADMIN_ADD_STUDENT_PATH,
  ADMIN_ADD_TEACHER_PATH,
  ADMIN_ADD_COURSE_PATH,
  ADMIN_ADD_TIMETABLE_PATH,
  ADMIN_PROFILE_PATH,
} from '../constants/RouteStrings';

/**
 * AdminRoutes Component
 * -----------------------
 * Defines all routes for the admin area with lazy loading for improved performance.
 * - The base admin URL is redirected to the dashboard.
 * - It includes routes for management, creation, and profile pages.
 * - Routes are wrapped in a Suspense component with a fallback UI while pages are loading.
 *
 * @returns A JSX element representing the admin routes.
 */
const AdminRoutes: React.FC = () => {
  return (
    <Suspense fallback={<div className="text-center text-white mt-8">Loading admin pages...</div>}>
      <Routes>
        {/* Redirect base admin URL to dashboard */}
        <Route path={ADMIN_BASE_PATH} element={<Navigate to={ADMIN_DASHBOARD_PATH} replace />} />

        {/* Dashboard Route */}
        <Route path={ADMIN_DASHBOARD_PATH} element={<Dashboard />} />

        {/* Management Routes */}
        <Route path={ADMIN_STUDENT_MANAGEMENT_PATH} element={<StudentManagement />} />
        <Route path={ADMIN_TEACHER_MANAGEMENT_PATH} element={<TeacherManagement />} />
        <Route path={ADMIN_USER_MANAGEMENT_PATH} element={<UserManagement />} />
        <Route path={ADMIN_COURSE_MANAGEMENT_PATH} element={<CourseManagement />} />
        <Route path={ADMIN_TIMETABLE_MANAGEMENT_PATH} element={<TimetableManagement />} />
        <Route path={ADMIN_ATTENDANCE_MANAGEMENT_PATH} element={<AttendanceManagement />} />

        {/* Creation Routes */}
        <Route path={ADMIN_ADD_ADMIN_PATH} element={<AddAdmin />} />
        <Route path={ADMIN_ADD_STUDENT_PATH} element={<AddStudent />} />
        <Route path={ADMIN_ADD_TEACHER_PATH} element={<AddTeacher />} />
        <Route path={ADMIN_ADD_COURSE_PATH} element={<AddCourse />} />
        <Route path={ADMIN_ADD_TIMETABLE_PATH} element={<AddTimetable />} />

        {/* Profile Route */}
        <Route path={ADMIN_PROFILE_PATH} element={<AdminProfile />} />
      </Routes>
    </Suspense>
  );
};

export default AdminRoutes;

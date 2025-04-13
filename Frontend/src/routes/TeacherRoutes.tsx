import React, { Suspense, lazy } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import {
  TEACHER_BASE_PATH,
  TEACHER_DASHBOARD_PATH,
  TEACHER_COURSES_PATH,
  TEACHER_TIMETABLE_PATH,
  TEACHER_ATTENDANCE_PATH,
  TEACHER_PROFILE_PATH,
  TEACHER_FALLBACK_ROUTE,
  TEACHER_LOADING_MESSAGE,
} from '../constants/RouteStrings';

// Lazy load teacher pages for improved performance.
const TeacherDashboard = lazy(() => import('../pages/Teacher/Dashboard'));
const Courses = lazy(() => import('../pages/Teacher/Courses'));
const TeacherTimetable = lazy(() => import('../pages/Teacher/Timetable'));
const Attendance = lazy(() => import('../pages/Teacher/Attendance'));
const TeacherProfile = lazy(() => import('../pages/Teacher/Profile'));

/**
 * TeacherRoutes Component
 * -------------------------
 * Defines all routes for the teacher area of the application.
 *
 * Key features:
 * - Lazy loads pages for performance improvements.
 * - Uses Suspense to display a fallback UI during page loading.
 * - Redirects base teacher URL to the dashboard.
 * - Provides routes for dashboard, courses, timetable, attendance, and profile.
 * - Includes a catch-all route that redirects to the dashboard.
 *
 * @returns A JSX element representing the teacher routes.
 */
const TeacherRoutes: React.FC = () => {
  return (
    <Suspense fallback={<div className="text-center text-white mt-8">{TEACHER_LOADING_MESSAGE}</div>}>
      <Routes>
        {/* Redirect base teacher URL to the dashboard */}
        <Route path={TEACHER_BASE_PATH} element={<Navigate to={TEACHER_DASHBOARD_PATH} replace />} />

        {/* Main Teacher Routes */}
        <Route path={TEACHER_DASHBOARD_PATH} element={<TeacherDashboard />} />
        <Route path={TEACHER_COURSES_PATH} element={<Courses />} />
        <Route path={TEACHER_TIMETABLE_PATH} element={<TeacherTimetable />} />
        <Route path={TEACHER_ATTENDANCE_PATH} element={<Attendance />} />
        <Route path={TEACHER_PROFILE_PATH} element={<TeacherProfile />} />

        {/* Catch-all route for undefined teacher routes */}
        <Route path="*" element={<Navigate to={TEACHER_FALLBACK_ROUTE} replace />} />
      </Routes>
    </Suspense>
  );
};

export default TeacherRoutes;

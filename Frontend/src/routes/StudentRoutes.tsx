import React, { Suspense, lazy } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import {
  STUDENT_BASE_PATH,
  STUDENT_DASHBOARD_PATH,
  STUDENT_COURSES_PATH,
  STUDENT_TIMETABLE_PATH,
  STUDENT_ATTENDANCE_PATH,
  STUDENT_PROFILE_PATH,
  STUDENT_FALLBACK_ROUTE,
  STUDENT_LOADING_MESSAGE,
} from '../constants/RouteStrings';

// Lazy load student pages for improved performance.
const StudentDashboard = lazy(() => import('../pages/Student/Dashboard'));
const Courses = lazy(() => import('../pages/Student/Courses'));
const Timetable = lazy(() => import('../pages/Student/Timetable'));
const Attendance = lazy(() => import('../pages/Student/Attendance'));
const StudentProfile = lazy(() => import('../pages/Student/Profile'));

/**
 * Routes Component
 * -------------------------
 * Defines all the routes for the student area of the application.
 * Utilizes lazy loading for student pages and displays a fallback message while loading.
 * Unrecognized routes will be redirected to the dashboard.
 *
 * @returns JSX.Element representing the set of student routes.
 */
const StudentRoutes: React.FC = () => {
  return (
    <Suspense fallback={<div className="text-center text-white mt-8">{STUDENT_LOADING_MESSAGE}</div>}>
      <Routes>
        {/* Redirect base student URL to the dashboard */}
        <Route path={STUDENT_BASE_PATH} element={<Navigate to={STUDENT_DASHBOARD_PATH} replace />} />

        {/* Main Student Pages */}
        <Route path={STUDENT_DASHBOARD_PATH} element={<StudentDashboard />} />
        <Route path={STUDENT_COURSES_PATH} element={<Courses />} />
        <Route path={STUDENT_TIMETABLE_PATH} element={<Timetable />} />
        <Route path={STUDENT_ATTENDANCE_PATH} element={<Attendance />} />
        <Route path={STUDENT_PROFILE_PATH} element={<StudentProfile />} />

        {/* Catch-all route: Redirect unknown paths to the dashboard */}
        <Route path="*" element={<Navigate to={STUDENT_FALLBACK_ROUTE} replace />} />
      </Routes>
    </Suspense>
  );
};

export default StudentRoutes;

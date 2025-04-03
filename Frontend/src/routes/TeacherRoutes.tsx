// src/routes/TeacherRoutes.tsx
import React, { Suspense, lazy } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';

// Lazy load teacher pages for performance optimization.
const TeacherDashboard = lazy(() => import('../pages/Teacher/Dashboard'));
const Courses = lazy(() => import('../pages/Teacher/Courses'));
const TeacherTimetable = lazy(() => import('../pages/Teacher/Timetable'));
const Attendance = lazy(() => import('../pages/Teacher/Attendance'));

// Common pages shared across roles.
const Settings = lazy(() => import('../pages/Common/Settings'));
const Profile = lazy(() => import('../pages/Common/Profile'));
const Notifications = lazy(() => import('../pages/Common/Notifications'));

const TeacherRoutes: React.FC = () => {
  return (
    <Suspense fallback={<div className="text-center text-white mt-8">Loading...</div>}>
      <Routes>
        {/* Redirect base teacher URL to dashboard */}
        <Route path="/teacher" element={<Navigate to="/teacher/dashboard" replace />} />
        <Route path="/teacher/dashboard" element={<TeacherDashboard />} />
        <Route path="/teacher/courses" element={<Courses />} />
        <Route path="/teacher/timetable" element={<TeacherTimetable />} />
        <Route path="/teacher/attendance" element={<Attendance />} />
        <Route path="/teacher/settings" element={<Settings />} />
        <Route path="/teacher/profile" element={<Profile />} />
        <Route path="/teacher/notifications" element={<Notifications />} />
      </Routes>
    </Suspense>
  );
};

export default TeacherRoutes;

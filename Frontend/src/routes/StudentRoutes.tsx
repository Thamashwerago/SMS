// src/routes/StudentRoutes.tsx
import React, { Suspense, lazy } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';

// Lazy load student pages for performance optimization.
const StudentDashboard = lazy(() => import('../pages/Student/Dashboard'));
const Courses = lazy(() => import('../pages/Student/Courses'));
const Timetable = lazy(() => import('../pages/Student/Timetable'));
const Attendance = lazy(() => import('../pages/Student/Attendance'));

// Common pages that can be shared across roles.
const Settings = lazy(() => import('../pages/Common/Settings'));
const Profile = lazy(() => import('../pages/Common/Profile'));
const Notifications = lazy(() => import('../pages/Common/Notifications'));

const StudentRoutes: React.FC = () => {
  return (
    <Suspense fallback={<div className="text-center text-white mt-8">Loading...</div>}>
      <Routes>
        {/* Redirect base student URL to the dashboard */}
        <Route path="/student" element={<Navigate to="/student/dashboard" replace />} />
        <Route path="/student/dashboard" element={<StudentDashboard />} />
        <Route path="/student/courses" element={<Courses />} />
        <Route path="/student/timetable" element={<Timetable />} />
        <Route path="/student/attendance" element={<Attendance />} />
        <Route path="/student/settings" element={<Settings />} />
        <Route path="/student/profile" element={<Profile />} />
        <Route path="/student/notifications" element={<Notifications />} />
      </Routes>
    </Suspense>
  );
};

export default StudentRoutes;

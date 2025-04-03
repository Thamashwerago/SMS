import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Dashboard from '../pages/teacher/Dashboard';
import Courses from '../pages/teacher/Courses';
import Attendance from '../pages/teacher/Attendance';
import Timetable from '../pages/teacher/Timetable';

const TeacherRoutes: React.FC = () => {
  return (
    <Routes>
      <Route path="/teacher/dashboard" element={<Dashboard />} />
      <Route path="/teacher/courses" element={<Courses />} />
      <Route path="/teacher/attendance" element={<Attendance />} />
      <Route path="/teacher/timetable" element={<Timetable />} />
    </Routes>
  );
};

export default TeacherRoutes;

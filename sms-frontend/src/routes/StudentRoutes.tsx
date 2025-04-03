import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Dashboard from '../pages/student/Dashboard';
import Courses from '../pages/student/Courses';
import Attendance from '../pages/student/Attendance';
import Timetable from '../pages/student/Timetable';

const StudentRoutes: React.FC = () => {
  return (
    <Routes>
      <Route path="/student/dashboard" element={<Dashboard />} />
      <Route path="/student/courses" element={<Courses />} />
      <Route path="/student/attendance" element={<Attendance />} />
      <Route path="/student/timetable" element={<Timetable />} />
    </Routes>
  );
};

export default StudentRoutes;

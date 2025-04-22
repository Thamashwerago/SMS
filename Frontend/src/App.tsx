// src/App.tsx

import React from 'react';
import {
  Routes,
  Route,
  Navigate,
  Outlet
} from 'react-router-dom';
import AdminRoutes from './routes/AdminRoutes';
import AuthRoutes from './routes/AuthRoutes';
import StudentRoutes from './routes/StudentRoutes';
import TeacherRoutes from './routes/TeacherRoutes';
import ProtectedRoute from './routes//ProtectedRoute';

const App: React.FC = () => (
  <Routes>
    {/* Public auth pages */}
    <Route path="/login/*" element={<AuthRoutes />} />

    {/* Admin-only area */}
    <Route element={<ProtectedRoute allowedRoles={["admin"]} />}>
      <Route path="/admin/*" element={<Outlet />}>
        {AdminRoutes}
      </Route>
    </Route>

    {/* Student-only area */}
    <Route element={<ProtectedRoute allowedRoles={["student"]} />}>
      <Route path="/student/*" element={<StudentRoutes />} />
    </Route>

    {/* Teacher-only area */}
    <Route element={<ProtectedRoute allowedRoles={["teacher"]} />}>
      <Route path="/teacher/*" element={<TeacherRoutes />} />
    </Route>

    {/* Redirect root and unknown URLs to login */}
    <Route path="/" element={<Navigate to="/login" replace />} />
    <Route path="*" element={<Navigate to="/login" replace />} />
  </Routes>
);

export default App;

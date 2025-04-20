// src/App.tsx

import React from 'react';
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from 'react-router-dom';
import AdminRoutes from './routes/AdminRoutes';
import AuthRoutes from './routes/AuthRoutes';
import StudentRoutes from './routes/StudentRoutes';
import TeacherRoutes from './routes/TeacherRoutes';
import ProtectedRoute from './routes//ProtectedRoute';

const App: React.FC = () => (
  <Router>
    <Routes>
      {/* Public auth pages */}
      <Route path="/login/*" element={<AuthRoutes />} />

      {/* Admin-only area */}
      <Route
        path="/admin/*"
        element={
          <ProtectedRoute allowedRoles={['admin']}>
            <AdminRoutes />
          </ProtectedRoute>
        }
      />

      {/* Student-only area */}
      <Route
        path="/student/*"
        element={
          <ProtectedRoute allowedRoles={['student']}>
            <StudentRoutes />
          </ProtectedRoute>
        }
      />

      {/* Teacher-only area */}
      <Route
        path="/teacher/*"
        element={
          <ProtectedRoute allowedRoles={['teacher']}>
            <TeacherRoutes />
          </ProtectedRoute>
        }
      />

      {/* Redirect root and unknown URLs to login */}
      <Route path="/" element={<Navigate to="/login" replace />} />
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  </Router>
);

export default App;

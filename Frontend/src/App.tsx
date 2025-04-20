import React from 'react';
<<<<<<< Updated upstream
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import AdminRoutes from './routes/AdminRoutes';
import AuthRoutes from './routes/AuthRoutes';
import StudentRoutes from './routes/StudentRoutes';
import TeacherRoutes from './routes/TeacherRoutes';
import ProtectedRoute from './components/ProtectedRoute';
=======
import { BrowserRouter as Router } from 'react-router-dom';
// import AdminRoutes from './routes/AdminRoutes';
// import AuthRoutes from './routes/AuthRoutes';
// import StudentRoutes from './routes/StudentRoutes';
import TeacherRoutes from './routes/TeacherRoutes';
>>>>>>> Stashed changes

const App: React.FC = () => {
  return (
    <Router>
<<<<<<< Updated upstream
      <Routes>
        {/* Auth Routes (Public) */}
        <Route path="/login/*" element={<AuthRoutes />} />
        
        {/* Protected Routes */}
        <Route path="/admin/*" element={
          <ProtectedRoute allowedRoles={['admin']}>
            <AdminRoutes />
          </ProtectedRoute>
        } />
        
        <Route path="/student/*" element={
          <ProtectedRoute allowedRoles={['student']}>
            <StudentRoutes />
          </ProtectedRoute>
        } />
        
        <Route path="/teacher/*" element={
          <ProtectedRoute allowedRoles={['teacher']}>
            <TeacherRoutes />
          </ProtectedRoute>
        } />
        
        {/* Redirect root to login */}
        <Route path="/" element={<Navigate to="/login" replace />} />
        
        {/* Catch all route */}
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
=======
      {/* <AuthRoutes /> */}
      {/* <AdminRoutes /> */}
      {/* <StudentRoutes /> */}
      <TeacherRoutes />

>>>>>>> Stashed changes
    </Router>
  );
};

export default App;
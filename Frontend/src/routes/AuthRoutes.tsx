// src/routes/AuthRoutes.tsx
import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Login from '../pages/Auth/Login';

const AuthRoutes: React.FC = () => {
  return (
    <Routes>
      {/* Authentication Pages */}
      <Route path="/login" element={<Login />} />

      {/* Fallback: redirect all unknown auth routes to /login */}
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
};

export default AuthRoutes;

// src/routes/ProtectedRoutes.tsx
import React, { useMemo } from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';

interface ProtectedRoutesProps {
  allowedRoles?: string[]; // Optional list of allowed roles (e.g., ['admin', 'teacher'])
}

const ProtectedRoutes: React.FC<ProtectedRoutesProps> = ({ allowedRoles }) => {
  const location = useLocation();

  // Retrieve auth token and user role from session storage.
  const authToken = useMemo(() => sessionStorage.getItem('authToken'), []);
  const userRole = useMemo(() => sessionStorage.getItem('userRole'), []);

  // If there's no auth token, redirect to login and preserve the current location.
  if (!authToken) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  // If allowedRoles are provided and userRole is not among them, redirect to an unauthorized page.
  if (allowedRoles && allowedRoles.length > 0 && (!userRole || !allowedRoles.includes(userRole))) {
    return <Navigate to="/unauthorized" replace state={{ from: location }} />;
  }

  // If authenticated (and role authorized), render child routes.
  return <Outlet />;
};

export default ProtectedRoutes;

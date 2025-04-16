import React from 'react';
import { Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { RootState } from '../store';

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles: string[];
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, allowedRoles }) => {
  const { role } = useSelector((state: RootState) => state.auth);

  if (!role) {
    // No role means not logged in
    return <Navigate to="/login" replace />;
  }

  if (!allowedRoles.includes(role.toLowerCase())) {
    // Role not allowed
    return <Navigate to="/unauthorized" replace />;
  }

  // Role is allowed, render the children
  return <>{children}</>;
};

export default ProtectedRoute; 
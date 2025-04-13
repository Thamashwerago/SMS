import React, { useMemo } from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { LOGIN_PATH, UNAUTHORIZED_PATH } from '../constants/RouteStrings';

interface ProtectedRoutesProps {
  allowedRoles?: string[]; // Optional list of allowed roles (e.g., ['admin', 'teacher'])
}

/**
 * ProtectedRoutes Component
 * ---------------------------
 * Acts as a route guard to protect certain routes.
 * - Checks if an authentication token is available.
 * - Optionally verifies if the user's role is within the allowed roles.
 * - If not authenticated, the user is redirected to the login page.
 * - If the user role is not allowed, the user is redirected to the unauthorized page.
 * - Otherwise, it renders the nested routes using <Outlet />.
 *
 * @param allowedRoles - An optional array of roles permitted to access the nested routes.
 * @returns A JSX element that either redirects or renders the nested content.
 */
const ProtectedRoutes: React.FC<ProtectedRoutesProps> = ({ allowedRoles }) => {
  const location = useLocation();

  // Retrieve auth token and user role from session storage using useMemo for performance.
  const authToken = useMemo(() => sessionStorage.getItem('authToken'), []);
  const userRole = useMemo(() => sessionStorage.getItem('userRole'), []);

  // If the user is not authenticated, redirect to the login page.
  if (!authToken) {
    return <Navigate to={LOGIN_PATH} replace state={{ from: location }} />;
  }

  // If allowedRoles are provided and the user's role is not included, redirect to the unauthorized page.
  if (allowedRoles && allowedRoles.length > 0 && (!userRole || !allowedRoles.includes(userRole))) {
    return <Navigate to={UNAUTHORIZED_PATH} replace state={{ from: location }} />;
  }

  // If authentication (and role, if applicable) is valid, render the child routes.
  return <Outlet />;
};

export default ProtectedRoutes;

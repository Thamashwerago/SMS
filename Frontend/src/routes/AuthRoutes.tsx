import React, { Suspense, lazy } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import {
  AUTH_LOADING_MESSAGE,
} from '../constants/RouteStrings';

// Lazy load the Login page for performance optimization.
const Login = lazy(() => import('../pages/Auth/Login'));

/**
 * AuthRoutes Component
 * ----------------------
 * Defines the routes for authentication.
 * - Lazy loads the Login page.
 * - Uses a Suspense component to show a fallback message while the Login page is loading.
 * - Redirects any unknown authentication routes to the login page.
 *
 * @returns A JSX element representing authentication routes.
 */
const AuthRoutes: React.FC = () => {
  return (
    <Suspense fallback={<div className="text-center text-white mt-8">{AUTH_LOADING_MESSAGE}</div>}>
      <Routes>
        {/* Authentication Page: Login */}
        <Route path="/" element={<Login />} />
        
        {/* Fallback: Redirect all unknown auth routes to login */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Suspense>
  );
};

export default AuthRoutes;

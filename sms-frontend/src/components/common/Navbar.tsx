/**
 * Navbar.tsx
 *
 * This component renders a role-based navigation bar that displays:
 * - The current page name (derived from the URL).
 * - Links to Profile, Notifications, and a Logout button.
 *
 * The current page name is extracted from the URL's last non-empty segment.
 * On logout, the authentication token is removed from session storage,
 * and the user is redirected to the login page.
 */

import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';

const Navbar: React.FC = () => {
  // Get the current URL location and navigation functions.
  const location = useLocation();
  const navigate = useNavigate();

  // Extract path segments and filter out any empty segments.
  const pathSegments = location.pathname.split('/').filter(Boolean);
  // The role is assumed to be the first segment (e.g., "admin", "student", "teacher").
  const role = pathSegments[0] || '';
  // The current page name is the last segment in the URL.
  const currentPageRaw = pathSegments[pathSegments.length - 1] || 'dashboard';
  // Capitalize the first letter of the current page name.
  const currentPage = currentPageRaw.charAt(0).toUpperCase() + currentPageRaw.slice(1);

  /**
   * handleLogout
   *
   * Clears the authentication token from session storage and redirects the user to the login page.
   */
  const handleLogout = () => {
    sessionStorage.removeItem('authToken');
    navigate(`/login`);
  };

  return (
    <nav className="bg-gradient-to-r from-gray-900 to-gray-800 shadow p-4 flex justify-between items-center">
      {/* Display the current page name */}
      <div>
        <h1 className="text-xl font-bold text-white">{currentPage}</h1>
      </div>
      {/* Navigation Links */}
      <div className="flex items-center space-x-6">
        {/*
         * Profile Link: Navigates to the profile page.
         * Includes a user icon.
         */}
        <Link to={`/${role}/profile`} className="flex items-center text-gray-300 hover:text-white transition">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6 mr-1"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M5.121 17.804A9 9 0 1118.88 6.196M12 14v.01"
            />
          </svg>
          Profile
        </Link>
        {/*
         * Notifications Link: Navigates to the notifications page.
         * Includes a bell icon.
         */}
        <Link to={`/${role}/notifications`} className="flex items-center text-gray-300 hover:text-white transition">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6 mr-1"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V4a2 2 0 10-4 0v1.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
            />
          </svg>
          Notifications
        </Link>
        {/*
         * Logout Button: Clears the session token and logs the user out.
         * Includes a logout arrow icon.
         */}
        <button onClick={handleLogout} className="flex items-center text-gray-300 hover:text-white transition">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6 mr-1"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7" />
          </svg>
          Logout
        </button>
      </div>
    </nav>
  );
};

export default Navbar;

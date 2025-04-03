// src/components/common/Navbar.tsx
import React, { useMemo, useCallback } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';

const Navbar: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();

  // Extract the role from the URL's first segment.
  const role = useMemo(() => {
    const segments = location.pathname.split('/').filter(Boolean);
    return segments[0] || 'guest';
  }, [location.pathname]);

  // Memoized logout handler.
  const handleLogout = useCallback(() => {
    sessionStorage.removeItem('authToken');
    sessionStorage.removeItem('userRole');
    navigate('/login');
  }, [navigate]);

  return (
    <nav className="bg-gradient-to-r from-gray-800 to-gray-900 shadow-lg p-4 flex justify-end items-center">
      <div className="flex items-center space-x-6">
        {/* Profile Link */}
        <Link
          to={`/${role}/profile`}
          className="flex items-center text-gray-300 hover:text-white transition duration-200"
          aria-label="Profile"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6 mr-1"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5.121 17.804A9 9 0 1118.88 6.196M12 14v.01" />
          </svg>
          <span className="hidden md:inline">Profile</span>
        </Link>
        {/* Notifications Link */}
        <Link
          to={`/${role}/notifications`}
          className="flex items-center text-gray-300 hover:text-white transition duration-200"
          aria-label="Notifications"
        >
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
          <span className="hidden md:inline">Notifications</span>
        </Link>
        {/* Logout Button */}
        <button
          onClick={handleLogout}
          className="flex items-center text-gray-300 hover:text-white transition duration-200"
          aria-label="Logout"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6 mr-1"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7" />
          </svg>
          <span className="hidden md:inline">Logout</span>
        </button>
      </div>
    </nav>
  );
};

export default React.memo(Navbar);

import React, { useMemo, useCallback } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  NAVBAR_PROFILE_LABEL,
  NAVBAR_LOGOUT_LABEL,
  NAVBAR_ROLE_LABEL,
} from "../../constants/components/navbarStrings";

/**
 * Navbar Component
 * ------------------
 * Renders the top navigation bar, which includes links to the profile page, a logout button,
 * and displays the current user's role if available.
 * The role is extracted from the URL's first segment.
 *
 * @returns A JSX element representing the navbar.
 */
const Navbar: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();

  // Extract the role from the URL's first segment, or use an empty string if not found.
  const role = useMemo(() => {
    const segments = location.pathname.split("/").filter(Boolean);
    return segments[0] || "";
  }, [location.pathname]);

  // Memoized logout handler: clears session storage and navigates to the login page.
  const handleLogout = useCallback(() => {
    sessionStorage.removeItem("authToken");
    sessionStorage.removeItem("userRole");
    sessionStorage.removeItem("user");
    navigate("/login");
  }, []);

  return (
    <nav className="bg-gradient-to-r from-gray-800 to-gray-900 shadow-lg p-4 flex justify-between items-center">
      {/* Left Section: Conditionally display the user's role if available */}
      {role && (
        <div className="flex items-center space-x-2">
          <span className="text-gray-300 font-semibold">
            {NAVBAR_ROLE_LABEL}
          </span>
          <span className="text-white font-bold">{role}</span>
        </div>
      )}

      {/* Right Section: Profile and Logout */}
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
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M5.121 17.804A9 9 0 1118.88 6.196M12 14v.01"
            />
          </svg>
          <span className="hidden md:inline">{NAVBAR_PROFILE_LABEL}</span>
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
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M17 16l4-4m0 0l-4-4m4 4H7"
            />
          </svg>
          <span className="hidden md:inline">{NAVBAR_LOGOUT_LABEL}</span>
        </button>
      </div>
    </nav>
  );
};

export default React.memo(Navbar);

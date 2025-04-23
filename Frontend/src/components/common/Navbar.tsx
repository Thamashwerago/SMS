import React, { useMemo, useCallback, useState, useRef, useEffect, KeyboardEvent } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  NAVBAR_PROFILE_LABEL,
  NAVBAR_LOGOUT_LABEL,
  NAVBAR_ROLE_LABEL,
} from "../../constants/components/navbarStrings";

/**
 * Navbar Component
 * ------------------
 * Renders a responsive, sticky navigation bar with:
 * - Brand link
 * - User role badge
 * - Profile dropdown (Profile & Logout)
 * - Hover/focus states for accessibility
 * - Keyboard navigation
 */
const Navbar: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();

  // Extract role from URL
  const role = useMemo(() => {
    const [first] = location.pathname.split("/").filter(Boolean);
    return first || "";
  }, [location.pathname]);

  // Logout handler
  const handleLogout = useCallback(() => {
    sessionStorage.removeItem("authToken");
    sessionStorage.removeItem("userRole");
    sessionStorage.removeItem("user");
    navigate("/login");
  }, [navigate]);

  // Dropdown state & outside click
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClick = (e: globalThis.MouseEvent) => {
      if (open && ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [open]);

  const onKeyDown = (e: KeyboardEvent<HTMLButtonElement>) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      setOpen((o) => !o);
    }
  };

  return (
    <header className="sticky top-0 z-50 bg-gradient-to-r from-gray-800 to-gray-900 shadow-lg">
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        {/* Brand & Role */}
        <div className="flex items-center space-x-4">
          <Link
            to={`/${role}/dashboard`}
            className="text-white text-2xl font-bold hover:text-gray-200 transition"
          >
            School Management System
          </Link>
          {role && (
            <span className="px-2 py-1 bg-indigo-600 text-white text-sm rounded">
              {NAVBAR_ROLE_LABEL} {role.toUpperCase()}
            </span>
          )}
        </div>

        {/* Profile Dropdown */}
        <div ref={ref} className="relative">
          <button
            onClick={() => setOpen((o) => !o)}
            onKeyDown={onKeyDown}
            aria-haspopup="true"
            className="flex items-center space-x-1 text-gray-300 hover:text-white focus:outline-none focus:ring-2 focus:ring-indigo-400 rounded transition"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
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
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className={`h-4 w-4 transform transition-transform ${
                open ? "rotate-180" : "rotate-0"
              }`}
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>

          {open && (
            <ul className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded shadow-lg ring-1 ring-black ring-opacity-5 py-1">
              <li>
                <Link
                  to={`/${role}/profile`}
                  className="block px-4 py-2 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
                >
                  {NAVBAR_PROFILE_LABEL}
                </Link>
              </li>
              <li>
                <button
                  onClick={handleLogout}
                  className="w-full text-left block px-4 py-2 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
                >
                  {NAVBAR_LOGOUT_LABEL}
                </button>
              </li>
            </ul>
          )}
        </div>
      </div>
    </header>
  );
};

export default React.memo(Navbar);

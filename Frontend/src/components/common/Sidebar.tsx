import React, { useMemo } from "react";
import { NavLink, useLocation } from "react-router-dom";
import {
  SIDEBAR_HEADER,
  DEFAULT_ROLE,
  NAV_LINKS,
} from "../../constants/components/sidebarStrings";

/**
 * Sidebar Component
 * -----------------
 * Renders the navigation sidebar with links based on the user role.
 * The user role is extracted from the first segment of the URL,
 * and if not found, defaults to 'student'.
 *
 * @returns JSX Element representing the sidebar.
 */
const Sidebar: React.FC = () => {
  const location = useLocation();

  // Extract the user role from the URL (first segment) or use the default role.
  const role = useMemo(() => {
    const segments = location.pathname.split("/").filter(Boolean);
    return segments[0] || DEFAULT_ROLE;
  }, [location.pathname]);

  // Retrieve the navigation links based on the current role.
  const links = useMemo(
    () => NAV_LINKS[role] || NAV_LINKS[DEFAULT_ROLE],
    [role]
  );

  return (
    <aside className="w-64 bg-gray-800 text-white min-h-screen p-6 shadow-lg">
      {/* Sidebar Header */}
      <header>
        <h2 className="text-2xl font-bold mb-6 uppercase tracking-wide">
          {SIDEBAR_HEADER}
        </h2>
      </header>
      {/* Navigation Menu */}
      <nav aria-label="Main Navigation">
        <ul className="space-y-4">
          {links.map((link) => (
            <li key={link.name}>
              <NavLink
                to={`/${role}/${link.path}`}
                className={({ isActive }) =>
                  `block p-3 rounded transition-colors duration-200 ${
                    isActive ? "bg-gray-700" : "hover:bg-gray-700"
                  }`
                }
              >
                {link.name}
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>
    </aside>
  );
};

export default React.memo(Sidebar);

import React, { useMemo } from "react";
import { NavLink, Link, useLocation } from "react-router-dom";
import clsx from "clsx";
import logo from "../../assets/logo.png";
import { DEFAULT_ROLE, NAV_LINKS } from "../../constants/components/sidebarStrings";

type NavLinkItem = (typeof NAV_LINKS)[keyof typeof NAV_LINKS][number] & {
  Icon?: React.ComponentType<React.SVGProps<SVGSVGElement>>;
};

/**
 * Sidebar Component
 * ---------------
 * - Fixed width, always expanded
 * - Logo on top with larger size
 * - Sidebar spans full page height
 * - Role-based navigation links
 * - Footer with copyright
 */
const Sidebar: React.FC = () => {
  const location = useLocation();

  // Determine current role from URL
  const role = useMemo(() => {
    const [first] = location.pathname.split("/").filter(Boolean);
    return first || DEFAULT_ROLE;
  }, [location.pathname]);

  // Navigation links for this role
  const links: NavLinkItem[] = NAV_LINKS[role] || NAV_LINKS[DEFAULT_ROLE];

  return (
    <aside
      aria-label="Application navigation"
      className={clsx(
        "fixed top-0 left-0 h-screen w-64",
        "flex flex-col bg-gray-800 text-white shadow-lg z-50"
      )}
    >
      {/* Logo Header */}
      <div className="flex items-center justify-center px-4 py-8 bg-gray-900">
        <Link to={`/${role}/dashboard`}>
          <img src={logo} alt="QuantumSync Labs Logo" className="h-50 w-auto" />
        </Link>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 overflow-y-auto py-4">
        <ul className="space-y-1">
          {links.map(({ name, path, Icon }) => (
            <li key={path}>
              <NavLink
                to={`/${role}/${path}`}
                className={({ isActive }) =>
                  clsx(
                    "flex items-center px-4 py-2 transition-colors duration-200",
                    isActive
                      ? "bg-gray-700 border-l-4 border-indigo-500"
                      : "hover:bg-gray-700",
                    "focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                  )
                }
              >
                {Icon && <Icon className="h-6 w-6 flex-shrink-0" />}
                <span className="ml-3 whitespace-nowrap">{name}</span>
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>

      {/* Footer */}
      <div className="px-4 py-3 bg-gray-900 text-center">
        <p className="text-xs text-gray-400">
          © {new Date().getFullYear()} QuantumSync Labs
        </p>
      </div>
    </aside>
  );
};

export default React.memo(Sidebar);

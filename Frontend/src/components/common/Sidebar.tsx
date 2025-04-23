import React, {
  useMemo,
  useState,
  useCallback,
  useEffect,
  KeyboardEvent,
} from "react";
import { NavLink, Link, useLocation } from "react-router-dom";
import clsx from "clsx";
import { ChevronsLeft, ChevronsRight } from "lucide-react";
import logo from "../../assets/logo.png";
import {
  DEFAULT_ROLE,
  NAV_LINKS,
} from "../../constants/components/sidebarStrings";

type NavLinkItem = (typeof NAV_LINKS)[keyof typeof NAV_LINKS][number] & {
  Icon?: React.ComponentType<React.SVGProps<SVGSVGElement>>;
};

interface SidebarProps {
  /** Optional: initial collapse state */
  initialCollapsed?: boolean;
}

const Sidebar: React.FC<SidebarProps> = ({ initialCollapsed = false }) => {
  const location = useLocation();

  // Persistent collapse state
  const [collapsed, setCollapsed] = useState<boolean>(() => {
    const stored = localStorage.getItem("sidebarCollapsed");
    return stored !== null ? JSON.parse(stored) : initialCollapsed;
  });
  useEffect(() => {
    localStorage.setItem("sidebarCollapsed", JSON.stringify(collapsed));
  }, [collapsed]);

  // Extract role
  const role = useMemo(() => {
    const [first] = location.pathname.split("/").filter(Boolean);
    return first || DEFAULT_ROLE;
  }, [location.pathname]);

  // Links for active role
  const links: NavLinkItem[] = NAV_LINKS[role] || NAV_LINKS[DEFAULT_ROLE];

  // Toggle collapse
  const toggle = useCallback(() => setCollapsed((c) => !c), []);
  const handleToggleKey = useCallback(
    (e: KeyboardEvent<HTMLButtonElement>) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        toggle();
      }
    },
    [toggle]
  );

  return (
    <aside
      aria-label="Application navigation"
      className={clsx(
        "flex flex-col bg-gray-800 text-white h-screen shadow-lg",
        "transition-[width] duration-300 ease-in-out",
        collapsed ? "w-20" : "w-64"
      )}
    >
      {/* Header: Centered logo when collapsed, spaced when expanded */}
      <div
        className={clsx(
          "flex items-center px-4 py-4",
          collapsed ? "justify-center" : "justify-between"
        )}
      >
        <Link to={`/${role}/dashboard`} className="flex items-center">
          <img
            src={logo}
            alt="QuantumSync Labs Logo"
            className={clsx(
              "w-auto transition-all duration-200",
              collapsed ? "h-10" : "h-16"
            )}
          />
        </Link>
        {/* Collapse toggle only when expanded */}
        {!collapsed && (
          <button
            type="button"
            onClick={toggle}
            onKeyDown={handleToggleKey}
            aria-label="Collapse sidebar"
            className="p-2 rounded hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            <ChevronsLeft size={20} />
          </button>
        )}
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 overflow-y-auto" aria-label="Main">
        <ul className="mt-4 space-y-1">
          {links.map(({ name, path, Icon }) => (
            <li key={path}>
              <NavLink
                to={`/${role}/${path}`}
                title={name}
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
                {!collapsed && (
                  <span className="ml-3 truncate whitespace-nowrap">
                    {name}
                  </span>
                )}
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>

      {/* Footer: Toggle expand when collapsed, copyright when expanded */}
      <div className="px-4 py-3 flex items-center justify-center">
        {collapsed ? (
          <button
            type="button"
            onClick={toggle}
            onKeyDown={handleToggleKey}
            aria-label="Expand sidebar"
            className="p-2 rounded hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            <ChevronsRight size={20} />
          </button>
        ) : (
          <p className="text-xs text-gray-400">
            © {new Date().getFullYear()} QuantumSync Labs
          </p>
        )}
      </div>
    </aside>
  );
};

export default React.memo(Sidebar);

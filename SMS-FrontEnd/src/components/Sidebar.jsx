import { NavLink } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Sidebar = () => {
  const { user } = useAuth();

  return (
    <aside className="w-64 bg-gray-800 text-white min-h-screen p-6">
      <ul className="space-y-4">
        <li>
          <NavLink to="/dashboard" className="block p-2 hover:bg-gray-700 rounded">
            Dashboard
          </NavLink>
        </li>

        {/* Admin & Teacher can manage students */}
        {(user.role === "Admin" || user.role === "Teacher") && (
          <li>
            <NavLink to="/students" className="block p-2 hover:bg-gray-700 rounded">
              Manage Students
            </NavLink>
          </li>
        )}

        {/* AI Performance Page - Available for all roles */}
        <li>
          <NavLink to="/performance" className="block p-2 hover:bg-gray-700 rounded">
            AI Predictions
          </NavLink>
        </li>

        {/* Admin Only - Manage Users */}
        {user.role === "Admin" && (
          <li>
            <NavLink to="/users" className="block p-2 hover:bg-gray-700 rounded">
              Manage Users
            </NavLink>
          </li>
        )}
      </ul>
    </aside>
  );
};

export default Sidebar;

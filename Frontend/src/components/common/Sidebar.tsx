// src/components/common/Sidebar.tsx
import React, { useMemo } from 'react';
import { NavLink, useLocation } from 'react-router-dom';

// Define a static mapping of navigation links per role.
const navLinksMap: Record<string, Array<{ name: string; path: string }>> = {
  admin: [
    { name: 'Dashboard', path: 'dashboard' },
    { name: 'User Management', path: 'user-management' },
    { name: 'Student Management', path: 'student-management' },
    { name: 'Teacher Management', path: 'teacher-management' },
    { name: 'Course Management', path: 'course-management' },
    { name: 'Timetable Management', path: 'timetable-management' },
    { name: 'Attendance Management', path: 'attendance-management' },
    { name: 'Settings', path: 'settings' },
  ],
  student: [
    { name: 'Dashboard', path: 'dashboard' },
    { name: 'Courses', path: 'courses' },
    { name: 'Timetable', path: 'timetable' },
    { name: 'Attendance', path: 'attendance' },
    { name: 'Settings', path: 'settings' },
  ],
  teacher: [
    { name: 'Dashboard', path: 'dashboard' },
    { name: 'Courses', path: 'courses' },
    { name: 'Timetable', path: 'timetable' },
    { name: 'Attendance', path: 'attendance' },
    { name: 'Settings', path: 'settings' },
  ],
};

const Sidebar: React.FC = () => {
  const location = useLocation();

  // Extract the user role from the first URL segment.
  const role = useMemo(() => {
    const segments = location.pathname.split('/').filter(Boolean);
    return segments[0] || 'student'; // Default to student if no role found.
  }, [location.pathname]);

  // Get the appropriate links for the current role.
  const links = useMemo(() => navLinksMap[role] || navLinksMap.student, [role]);

  return (
    <aside className="w-64 bg-gray-800 text-white min-h-screen p-6 shadow-lg">
      {/* Sidebar Header */}
      <header>
        <h2 className="text-2xl font-bold mb-6 uppercase tracking-wide">
          School Management System
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
                    isActive ? 'bg-gray-700' : 'hover:bg-gray-700'
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

/**
 * Sidebar.tsx
 *
 * This component renders a sidebar with role-based navigation links.
 * - Admin users see a comprehensive management menu.
 * - Students and Teachers see a simplified menu.
 *
 * The sidebar extracts the role from the URL's first segment and dynamically
 * generates the navigation links accordingly. UI enhancements include:
 * - Improved hover effects and active link highlighting.
 * - Responsive design with consistent spacing and typography.
 */

import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';

const Sidebar: React.FC = () => {
  // Get the current URL location.
  const location = useLocation();

  // Extract the role from the URL's first segment (e.g., "admin", "student", "teacher").
  const pathSegments = location.pathname.split('/');
  const role = pathSegments[1] || '';

  // Define comprehensive navigation links for admin users.
  const adminLinks = [
    { name: 'Dashboard', path: 'dashboard' },
    { name: 'Student Management', path: 'student-management' },
    { name: 'Teacher Management', path: 'teacher-management' },
    { name: 'Course Management', path: 'course-management' },
    { name: 'Timetable Management', path: 'timetable-management' },
    { name: 'Attendance Management', path: 'attendance-management' },
    { name: 'Settings', path: 'settings' },
  ];

  // Define simplified navigation links for students and teachers.
  const userLinks = [
    { name: 'Dashboard', path: 'dashboard' },
    { name: 'Courses', path: 'courses' },
    { name: 'Timetable', path: 'timetable' },
    { name: 'Attendance', path: 'attendance' },
    { name: 'Settings', path: 'settings' },
  ];

  // Choose the appropriate link set based on the extracted role.
  const links = role === 'admin' ? adminLinks : userLinks;

  return (
    <div className="w-64 bg-gray-800 text-white min-h-screen p-6 shadow-lg">
      {/* Sidebar Header */}
      <h2 className="text-2xl font-bold mb-6 uppercase tracking-wide">
        School Management System
      </h2>
      {/* Navigation Menu */}
      <nav>
        <ul className="space-y-4">
          {links.map((link) => (
            <li key={link.name}>
              <NavLink
                to={`/${role}/${link.path}`}
                className={({ isActive }) =>
                  isActive
                    ? 'block p-3 bg-gray-700 rounded transition-colors duration-200'
                    : 'block p-3 hover:bg-gray-700 rounded transition-colors duration-200'
                }
              >
                {link.name}
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  );
};

export default Sidebar;

// src/constants/sidebarStrings.ts
// Contains string constants and navigation links used by the Sidebar component.

export const SIDEBAR_HEADER = "School Management System";
export const DEFAULT_ROLE = "student";

// Navigation links mapping per role
export const NAV_LINKS: Record<string, Array<{ name: string; path: string }>> = {
  admin: [
    { name: "Dashboard", path: "dashboard" },
    { name: "User Management", path: "user-management" },
    { name: "Student Management", path: "student-management" },
    { name: "Teacher Management", path: "teacher-management" },
    { name: "Course Management", path: "course-management" },
    { name: "Timetable Management", path: "timetable-management" },
    { name: "Attendance Management", path: "attendance-management" },
  ],
  student: [
    { name: "Dashboard", path: "dashboard" },
    { name: "Courses", path: "courses" },
    { name: "Timetable", path: "timetable" },
    { name: "Attendance", path: "attendance" },
  ],
  teacher: [
    { name: "Dashboard", path: "dashboard" },
    { name: "Courses", path: "courses" },
    { name: "Timetable", path: "timetable" },
    { name: "Attendance", path: "attendance" },
  ],
};

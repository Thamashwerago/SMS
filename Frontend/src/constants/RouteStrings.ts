// src/constants/RouteStrings.ts
// Contains route path constants used in the admin area.

export const ADMIN_BASE_PATH = "/admin";
export const ADMIN_DASHBOARD_PATH = "/admin/dashboard";
export const ADMIN_STUDENT_MANAGEMENT_PATH = "/admin/student-management";
export const ADMIN_TEACHER_MANAGEMENT_PATH = "/admin/teacher-management";
export const ADMIN_USER_MANAGEMENT_PATH = "/admin/user-management";
export const ADMIN_COURSE_MANAGEMENT_PATH = "/admin/course-management";
export const ADMIN_TIMETABLE_MANAGEMENT_PATH = "/admin/timetable-management";
export const ADMIN_ATTENDANCE_MANAGEMENT_PATH = "/admin/attendance-management";
export const ADMIN_ADD_ADMIN_PATH = "/admin/add-admin";
export const ADMIN_ADD_STUDENT_PATH = "/admin/add-student";
export const ADMIN_ADD_TEACHER_PATH = "/admin/add-teacher";
export const ADMIN_ADD_COURSE_PATH = "/admin/add-course";
export const ADMIN_ADD_TIMETABLE_PATH = "/admin/add-timetable";
export const ADMIN_PROFILE_PATH = "/admin/profile";

// Contains route path constants used in the Student area.

export const STUDENT_BASE_PATH = "/student";
export const STUDENT_DASHBOARD_PATH = "/student/dashboard";
export const STUDENT_COURSES_PATH = "/student/courses";
export const STUDENT_TIMETABLE_PATH = "/student/timetable";
export const STUDENT_ATTENDANCE_PATH = "/student/attendance";
export const STUDENT_PROFILE_PATH = "/student/profile";

// Fallback route to redirect undefined routes.
export const STUDENT_FALLBACK_ROUTE = STUDENT_DASHBOARD_PATH;

// Loading message displayed during lazy loading.
export const STUDENT_LOADING_MESSAGE = "Loading...";

// Contains route path constants used in the Teacher area.

export const TEACHER_BASE_PATH = "/teacher";
export const TEACHER_DASHBOARD_PATH = "/teacher/dashboard";
export const TEACHER_COURSES_PATH = "/teacher/courses";
export const TEACHER_TIMETABLE_PATH = "/teacher/timetable";
export const TEACHER_ATTENDANCE_PATH = "/teacher/attendance";
export const TEACHER_PROFILE_PATH = "/teacher/profile";

// Fallback route for unknown teacher routes.
export const TEACHER_FALLBACK_ROUTE = TEACHER_DASHBOARD_PATH;

// Loading message to display while lazy-loading teacher pages.
export const TEACHER_LOADING_MESSAGE = "Loading teacher pages...";

// Contains route path constants used in the authentication area.

export const AUTH_LOGIN_PATH = "/login";
export const AUTH_FALLBACK_ROUTE = "/login";
export const AUTH_LOADING_MESSAGE = "Loading authentication...";

// Contains route path constants used in the ProtectedRoutes component.

export const LOGIN_PATH = "/login";
export const UNAUTHORIZED_PATH = "/unauthorized";

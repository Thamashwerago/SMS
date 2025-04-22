// src/constants/RouteStrings.ts
// Contains route path constants used in the admin area.

export const ADMIN_BASE_PATH = "admin";
export const ADMIN_DASHBOARD_PATH = "dashboard";
export const ADMIN_STUDENT_MANAGEMENT_PATH = "student-management";
export const ADMIN_TEACHER_MANAGEMENT_PATH = "teacher-management";
export const ADMIN_USER_MANAGEMENT_PATH = "user-management";
export const ADMIN_COURSE_MANAGEMENT_PATH = "course-management";
export const ADMIN_TIMETABLE_MANAGEMENT_PATH = "timetable-management";
export const ADMIN_ATTENDANCE_MANAGEMENT_PATH = "attendance-management";
export const ADMIN_ADD_ADMIN_PATH = "add-admin";
export const ADMIN_ADD_STUDENT_PATH = "add-student";
export const ADMIN_ADD_TEACHER_PATH = "add-teacher";
export const ADMIN_ADD_COURSE_PATH = "add-course";
export const ADMIN_ADD_TIMETABLE_PATH = "add-timetable";
export const ADMIN_PROFILE_PATH = "profile";

// Contains route path constants used in the Student area.

export const STUDENT_BASE_PATH = "student";
export const STUDENT_DASHBOARD_PATH = "dashboard";
export const STUDENT_COURSES_PATH = "courses";
export const STUDENT_TIMETABLE_PATH = "timetable";
export const STUDENT_ATTENDANCE_PATH = "attendance";
export const STUDENT_PROFILE_PATH = "profile";

// Fallback route to redirect undefined routes.
export const STUDENT_FALLBACK_ROUTE = STUDENT_DASHBOARD_PATH;

// Loading message displayed during lazy loading.
export const STUDENT_LOADING_MESSAGE = "Loading...";

// Contains route path constants used in the Teacher area.

export const TEACHER_BASE_PATH = "teacher";
export const TEACHER_DASHBOARD_PATH = "dashboard";
export const TEACHER_COURSES_PATH = "courses";
export const TEACHER_TIMETABLE_PATH = "timetable";
export const TEACHER_ATTENDANCE_PATH = "attendance";
export const TEACHER_PROFILE_PATH = "profile";

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

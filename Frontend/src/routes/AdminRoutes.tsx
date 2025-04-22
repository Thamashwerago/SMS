// src/routes/AdminRoutes.tsx
import { Suspense, lazy } from "react";
import { Route, Navigate } from "react-router-dom";

// Lazy-loaded components
const Dashboard = lazy(() => import("../pages/Admin/Dashboard"));
const StudentManagement = lazy(
  () => import("../pages/Admin/StudentManagement")
);
const TeacherManagement = lazy(
  () => import("../pages/Admin/TeacherManagement")
);
const UserManagement = lazy(() => import("../pages/Admin/UserManagement"));
const CourseManagement = lazy(() => import("../pages/Admin/CourseManagement"));
const TimetableManagement = lazy(
  () => import("../pages/Admin/TimetableManagement")
);
const AttendanceManagement = lazy(
  () => import("../pages/Admin/AttendanceManagement")
);
const AdminProfile = lazy(() => import("../pages/Admin/Profile"));
const AddAdmin = lazy(() => import("../pages/Admin/AddAdmin"));
const AddStudent = lazy(() => import("../pages/Admin/AddStudent"));
const AddTeacher = lazy(() => import("../pages/Admin/AddTeacher"));
const AddCourse = lazy(() => import("../pages/Admin/AddCourse"));
const AddTimetable = lazy(() => import("../pages/Admin/AddTimetable"));

// Routes
import {
  ADMIN_BASE_PATH,
  ADMIN_DASHBOARD_PATH,
  ADMIN_STUDENT_MANAGEMENT_PATH,
  ADMIN_TEACHER_MANAGEMENT_PATH,
  ADMIN_USER_MANAGEMENT_PATH,
  ADMIN_COURSE_MANAGEMENT_PATH,
  ADMIN_TIMETABLE_MANAGEMENT_PATH,
  ADMIN_ATTENDANCE_MANAGEMENT_PATH,
  ADMIN_ADD_ADMIN_PATH,
  ADMIN_ADD_STUDENT_PATH,
  ADMIN_ADD_TEACHER_PATH,
  ADMIN_ADD_COURSE_PATH,
  ADMIN_ADD_TIMETABLE_PATH,
  ADMIN_PROFILE_PATH,
} from "../constants/RouteStrings";

/**
 * AdminRoutes — only <Route> children, no <Routes> here.
 */
const AdminRoutes = [
  <Route
    key="admin-redirect"
    path={ADMIN_BASE_PATH}
    element={<Navigate to={ADMIN_DASHBOARD_PATH} replace />}
  />,
  <Route
    key="dashboard"
    path={ADMIN_DASHBOARD_PATH}
    element={
      <Suspense fallback={<div>Loading Dashboard...</div>}>
        <Dashboard />
      </Suspense>
    }
  />,
  <Route
    key="student"
    path={ADMIN_STUDENT_MANAGEMENT_PATH}
    element={
      <Suspense fallback={<div>Loading Student Management...</div>}>
        <StudentManagement />
      </Suspense>
    }
  />,
  <Route
    key="teacher"
    path={ADMIN_TEACHER_MANAGEMENT_PATH}
    element={
      <Suspense fallback={<div>Loading Teacher Management...</div>}>
        <TeacherManagement />
      </Suspense>
    }
  />,
  <Route
    key="user"
    path={ADMIN_USER_MANAGEMENT_PATH}
    element={
      <Suspense fallback={<div>Loading User Management...</div>}>
        <UserManagement />
      </Suspense>
    }
  />,
  <Route
    key="course"
    path={ADMIN_COURSE_MANAGEMENT_PATH}
    element={
      <Suspense fallback={<div>Loading Course Management...</div>}>
        <CourseManagement />
      </Suspense>
    }
  />,
  <Route
    key="timetable"
    path={ADMIN_TIMETABLE_MANAGEMENT_PATH}
    element={
      <Suspense fallback={<div>Loading Timetable Management...</div>}>
        <TimetableManagement />
      </Suspense>
    }
  />,
  <Route
    key="attendance"
    path={ADMIN_ATTENDANCE_MANAGEMENT_PATH}
    element={
      <Suspense fallback={<div>Loading Attendance Management...</div>}>
        <AttendanceManagement />
      </Suspense>
    }
  />,
  <Route
    key="add-admin"
    path={ADMIN_ADD_ADMIN_PATH}
    element={
      <Suspense fallback={<div>Loading Add Admin...</div>}>
        <AddAdmin />
      </Suspense>
    }
  />,
  <Route
    key="add-student"
    path={ADMIN_ADD_STUDENT_PATH}
    element={
      <Suspense fallback={<div>Loading Add Student...</div>}>
        <AddStudent />
      </Suspense>
    }
  />,
  <Route
    key="add-teacher"
    path={ADMIN_ADD_TEACHER_PATH}
    element={
      <Suspense fallback={<div>Loading Add Teacher...</div>}>
        <AddTeacher />
      </Suspense>
    }
  />,
  <Route
    key="add-course"
    path={ADMIN_ADD_COURSE_PATH}
    element={
      <Suspense fallback={<div>Loading Add Course...</div>}>
        <AddCourse />
      </Suspense>
    }
  />,
  <Route
    key="add-timetable"
    path={ADMIN_ADD_TIMETABLE_PATH}
    element={
      <Suspense fallback={<div>Loading Add Timetable...</div>}>
        <AddTimetable />
      </Suspense>
    }
  />,
  <Route
    key="profile"
    path={ADMIN_PROFILE_PATH}
    element={
      <Suspense fallback={<div>Loading Profile...</div>}>
        <AdminProfile />
      </Suspense>
    }
  />,
];

export default AdminRoutes;
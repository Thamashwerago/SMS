// src/App.tsx
import React from "react";
import { Routes, Route, Navigate, Outlet } from "react-router-dom";
import { useSelector } from "react-redux";
import AdminRoutes from "./routes/AdminRoutes";
import AuthRoutes from "./routes/AuthRoutes";
import StudentRoutes from "./routes/StudentRoutes";
import TeacherRoutes from "./routes/TeacherRoutes";
import ProtectedRoute from "./routes/ProtectedRoute";
import useRestoreAuth from "./store/useRestoreAuth"; // this should be a valid hook
import { RootState } from "./store";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const App: React.FC = () => {
  useRestoreAuth();

  const { rehydrated } = useSelector((state: RootState) => state.auth);

  if (!rehydrated) {
    return <div className="text-white text-center mt-10">Loading...</div>; // show a spinner or loading screen
  }

  return (
    <>
      <Routes>
        {/* Public auth pages */}
        <Route path="/login/*" element={<AuthRoutes />} />

        {/* Admin-only area */}
        <Route element={<ProtectedRoute allowedRoles={["admin"]} />}>
          <Route path="/admin/*" element={<Outlet />}>
            {AdminRoutes}
          </Route>
        </Route>

        {/* Student-only area */}
        <Route element={<ProtectedRoute allowedRoles={["student"]} />}>
          <Route path="/student/*" element={<StudentRoutes />} />
        </Route>

        {/* Teacher-only area */}
        <Route element={<ProtectedRoute allowedRoles={["teacher"]} />}>
          <Route path="/teacher/*" element={<TeacherRoutes />} />
        </Route>

        {/* Redirect root and unknown URLs to login */}
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
      <ToastContainer position="top-right" autoClose={3000} />
    </>
  );
};

export default App;

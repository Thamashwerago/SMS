import { Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import StudentManagement from "./pages/StudentManagement";
import PerformancePrediction from "./pages/PerformancePrediction";
import PrivateRoute from "./components/PrivateRoute";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/dashboard" element={<PrivateRoute roles={["Admin", "Teacher", "Parent", "Student"]}><Dashboard /></PrivateRoute>} />
      <Route path="/students" element={<PrivateRoute roles={["Admin", "Teacher"]}><StudentManagement /></PrivateRoute>} />
      <Route path="/performance" element={<PrivateRoute roles={["Admin", "Teacher", "Parent", "Student"]}><PerformancePrediction /></PrivateRoute>} />
    </Routes>
  );
}

export default App;

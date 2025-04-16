// src/pages/Auth/Login.tsx
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setCredentials } from "../../store/authSlice";
import userService from "../../components/services/userService";
import {
  ADMIN_DASHBOARD_PATH,
  STUDENT_DASHBOARD_PATH,
  TEACHER_DASHBOARD_PATH,
} from "../../constants/RouteStrings";

const Login: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [userRole, setUserRole] = useState<string>("");

  // Define valid roles and their corresponding dashboard paths
  const roleToPath: Record<string, string> = {
    admin: ADMIN_DASHBOARD_PATH,
    student: STUDENT_DASHBOARD_PATH,
    teacher: TEACHER_DASHBOARD_PATH,
  };

  const handleNavigation = (role: string) => {
    if (!role) return;
    const normalizedRole = role.toLowerCase().trim();
    if (!roleToPath[normalizedRole]) {
      throw new Error(`Invalid role: ${normalizedRole}`);
    }
    navigate(roleToPath[normalizedRole]);
  };

  useEffect(() => {
    const user = sessionStorage.getItem("user");
    if (user) {
      const { role } = JSON.parse(user);
      setUserRole(role);
      handleNavigation(role);
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    // Basic validation
    if (!username || !password) {
      setError("Please provide both username and password.");
      setLoading(false);
      return;
    }

    try {
      const role = await userService.isUser(username, password);

      if (!role) {
        setError("Invalid username or password.");
        setLoading(false);
        return;
      }

      // Store user data in session storage
      sessionStorage.setItem(
        "user",
        JSON.stringify({
          username: username,
          password: password,
          role: role,
        })
      );

      setUserRole(role);

      // Store auth token
      const authToken = "dummyAuthToken123";

      // Update Redux store with credentials
      dispatch(setCredentials({ token: authToken, role: role }));

      // Redirect user based on their role using the correct path
      handleNavigation(role);
    } catch (err) {
      console.error("Login error:", err);
      setError("An error occurred during login. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 to-black">
      <div className="bg-black bg-opacity-75 border border-indigo-500 rounded-xl shadow-xl p-8 w-full max-w-md">
        <h1 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500 mb-6 text-center">
          Login
        </h1>
        {error && <p className="text-red-500 mb-4 text-center">{error}</p>}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label
              htmlFor="username"
              className="block text-white font-semibold mb-1"
            >
              Username
            </label>
            <input
              id="username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              className="w-full px-4 py-2 bg-gray-800 border border-indigo-500 rounded focus:outline-none text-white"
            />
          </div>
          <div>
            <label
              htmlFor="password"
              className="block text-white font-semibold mb-1"
            >
              Password
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full px-4 py-2 bg-gray-800 border border-indigo-500 rounded focus:outline-none text-white"
            />
          </div>
          <div className="flex items-center">
            <input
              id="rememberMe"
              type="checkbox"
              checked={rememberMe}
              onChange={(e) => setRememberMe(e.target.checked)}
              className="mr-2"
            />
            <label htmlFor="rememberMe" className="text-white">
              Remember Me
            </label>
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full py-2 bg-indigo-600 hover:bg-indigo-700 rounded text-white font-bold transition duration-300"
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;

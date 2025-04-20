// src/pages/Auth/Login.tsx
<<<<<<< Updated upstream
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
=======
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

// Common UI component
import Button from "../../components/common/Button";
>>>>>>> Stashed changes

// Auth service
import userService from "../../services/userService";

// Extracted strings
import { LOGIN_STRINGS } from "../../constants/auth/loginConsts";

/**
 * Login Component
 * ----------------
 * Renders a login form that authenticates users via userService.
 * Handles validation, API errors, and provides feedback.
 */
const Login: React.FC = () => {
  const navigate = useNavigate();
<<<<<<< Updated upstream
  const dispatch = useDispatch();
  const [username, setUsername] = useState("");
=======

  // Form state
  const [email, setEmail] = useState("");
>>>>>>> Stashed changes
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);

  // Feedback state
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

  /**
   * handleSubmit
   * -------------
   * Validates inputs and calls userService.isUser to authenticate.
   * Manages separate exception cases for validation and API.
   */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // 1. Input validation
    if (!email.trim() || !password) {
      setError(LOGIN_STRINGS.ERROR_REQUIRED);
      return;
    }

    setLoading(true);
    try {
      // 2. API call to validate credentials
      const role = await userService.isUser(email, password);

<<<<<<< Updated upstream
    // Basic validation
    if (!username || !password) {
      setError("Please provide both username and password.");
=======
      if (!role || role === "null") {
        // 3a. Invalid credentials
        setError(LOGIN_STRINGS.ERROR_INVALID);
      } else {
        // 3b. Successful login: store token/role
        const token = `token_${role}_${Date.now()}`; // simulate a token
        if (rememberMe) {
          localStorage.setItem("authToken", token);
          localStorage.setItem("userRole", role);
        } else {
          sessionStorage.setItem("authToken", token);
          sessionStorage.setItem("userRole", role);
        }
        // 4. Redirect to role-based dashboard
        navigate(`/${role}/dashboard`);
      }
    } catch (apiError) {
      // 3c. API exception
      console.error("Login API error:", apiError);
      setError(LOGIN_STRINGS.ERROR_API);
    } finally {
>>>>>>> Stashed changes
      setLoading(false);
    }
<<<<<<< Updated upstream

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

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 to-black">
      {/* Login Container */}
      <div className="bg-black bg-opacity-75 border border-indigo-500 rounded-xl shadow-xl p-8 w-full max-w-md">
        {/* Title */}
        <h1 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500 mb-6 text-center">
          {LOGIN_STRINGS.PAGE_TITLE}
        </h1>

        {/* Error Message */}
        {error && <p className="text-red-500 mb-4 text-center">{error}</p>}

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Email Field */}
          <div>
            <label
<<<<<<< Updated upstream
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
=======
              htmlFor="email"
              className="block text-white font-semibold mb-1"
            >
              {LOGIN_STRINGS.LABEL_EMAIL}
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder={LOGIN_STRINGS.PH_EMAIL}
>>>>>>> Stashed changes
              className="w-full px-4 py-2 bg-gray-800 border border-indigo-500 rounded focus:outline-none text-white"
              required
            />
          </div>

          {/* Password Field */}
          <div>
            <label
              htmlFor="password"
              className="block text-white font-semibold mb-1"
            >
<<<<<<< Updated upstream
              Password
=======
              {LOGIN_STRINGS.LABEL_PASSWORD}
>>>>>>> Stashed changes
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder={LOGIN_STRINGS.PH_PASSWORD}
              className="w-full px-4 py-2 bg-gray-800 border border-indigo-500 rounded focus:outline-none text-white"
              required
            />
          </div>

          {/* Remember Me */}
          <div className="flex items-center">
            <input
              id="rememberMe"
              type="checkbox"
              checked={rememberMe}
              onChange={(e) => setRememberMe(e.target.checked)}
              className="mr-2"
            />
            <label htmlFor="rememberMe" className="text-white">
              {LOGIN_STRINGS.LABEL_REMEMBER}
            </label>
          </div>
<<<<<<< Updated upstream
          <button
            type="submit"
            disabled={loading}
            className="w-full py-2 bg-indigo-600 hover:bg-indigo-700 rounded text-white font-bold transition duration-300"
          >
            {loading ? "Logging in..." : "Login"}
          </button>
=======

          {/* Login Button */}
          <div>
            <Button
              type="submit"
              label={
                loading ? LOGIN_STRINGS.BTN_LOGGING_IN : LOGIN_STRINGS.BTN_LOGIN
              }
              isLoading={loading}
              variant="primary"
              className="w-full"
            />
          </div>
>>>>>>> Stashed changes
        </form>
      </div>
    </div>
  );
};

export default Login;

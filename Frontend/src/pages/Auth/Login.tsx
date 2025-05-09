// src/pages/Auth/Login.tsx

import React, { useState, useEffect, useCallback, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setCredentials } from "../../store/authSlice";
import Button from "../../components/common/Button";
import userService from "../../services/userService";
import { LOGIN_STRINGS } from "../../constants/auth/loginConsts";

/**
 * Login Component
 * Renders a login form, authenticates via userService,
 * stores credentials in Redux + storage, and redirects by role.
 */
const Login: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // Form state
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);

  // Feedback state
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // Map roles to dashboard routes
  const roleToPath = useMemo(
    () => ({
      admin: "/admin/dashboard",
      student: "/student/dashboard",
      teacher: "/teacher/dashboard",
    }),
    []
  );

  /** Redirect helper */
  const handleNavigation = useCallback((role: string) => {
    const key = role.toLowerCase().trim();
    const path = roleToPath[key as keyof typeof roleToPath];
    if (!path) {
      throw new Error(`Invalid role: ${key}`);
    }
    navigate(path);
  }, [navigate, roleToPath]);

  /** On mount: if already logged in, redirect */
  useEffect(() => {
    const stored =
      localStorage.getItem("user") ?? sessionStorage.getItem("user");

    if (!stored) return;

    try {
      const { role, token } = JSON.parse(stored);

      if (token && role) {
        dispatch(setCredentials({ token, role }));

        // Delay navigation to avoid conflict with initial render
        setTimeout(() => {
          handleNavigation(role);
        }, 0);
      }
    } catch (e) {
      console.error("Invalid user data in storage:", e);
    }
  }, [dispatch, handleNavigation]);

  /**
   * Form submit:
   * 1) Validate inputs
   * 2) Call API
   * 3) Handle invalid / API errors
   * 4) Store token + redux + redirect
   */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // 1) Basic validation
    if (!username.trim() || !password) {
      setError(LOGIN_STRINGS.ERROR_REQUIRED);
      return;
    }

    setLoading(true);
    try {
      // 2) Authenticate
      const user = await userService.isUser(username, password);

      if (!user) {
        // 3a) Invalid credentials
        setError(LOGIN_STRINGS.ERROR_INVALID);
      } else {
        // 3b) Success: generate/store token
        const token = user.token;
        const role = user.role.toLowerCase().trim();
        if (!token || !role) {
          setError(LOGIN_STRINGS.ERROR_INVALID);
          return;
        }
      
        if (!rememberMe && localStorage.getItem("authToken")) {
          // Clear localStorage if switching to sessionStorage
          localStorage.removeItem("authToken");
          localStorage.removeItem("userRole");
          localStorage.removeItem("user");
        }

        if (rememberMe) {
          localStorage.setItem("authToken", token);
          localStorage.setItem("userRole", role);
          localStorage.setItem("user", JSON.stringify(user));
        } else {
          sessionStorage.setItem("authToken", token);
          sessionStorage.setItem("userRole", role);
          sessionStorage.setItem("user", JSON.stringify(user));
        }

        dispatch(setCredentials({ token, role }));
        handleNavigation(role);
      }
    } catch (apiError) {
      // 3c) API / network error
      console.error("Login API error:", apiError);
      setError(LOGIN_STRINGS.ERROR_API);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 to-black">
      <div className="bg-black bg-opacity-75 border border-indigo-500 rounded-xl shadow-xl p-8 w-full max-w-md">
        {/* Title */}
        <h1 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500 mb-6 text-center">
          {LOGIN_STRINGS.PAGE_TITLE}
        </h1>

        {/* Error Message */}
        {error && (
          <p className="text-red-500 mb-4 text-center">{error}</p>
        )}

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Email Field */}
          <div>
            <label
              htmlFor="username"
              className="block text-white font-semibold mb-1"
            >
              {LOGIN_STRINGS.LABEL_USERNAME}
            </label>
            <input
              id="username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder={LOGIN_STRINGS.PH_USERNAME}
              required
              className="w-full px-4 py-2 bg-gray-800 border border-indigo-500 rounded focus:outline-none text-white"
            />
          </div>

          {/* Password Field */}
          <div>
            <label
              htmlFor="password"
              className="block text-white font-semibold mb-1"
            >
              {LOGIN_STRINGS.LABEL_PASSWORD}
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder={LOGIN_STRINGS.PH_PASSWORD}
              required
              className="w-full px-4 py-2 bg-gray-800 border border-indigo-500 rounded focus:outline-none text-white"
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

          {/* Submit Button */}
          <div>
            <Button
              type="submit"
              label={
                loading
                  ? LOGIN_STRINGS.BTN_LOGGING_IN
                  : LOGIN_STRINGS.BTN_LOGIN
              }
              isLoading={loading}
              variant="primary"
              className="w-full"
            />
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;

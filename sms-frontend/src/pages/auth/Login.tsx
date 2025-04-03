/*
  Login.tsx
  ---------
  This component renders the login form for the School Management System.
  It handles user input for email/username, password, toggling password visibility,
  and the "Remember me" option. On submission, it calls the loginUser service to authenticate
  the user and navigates to the appropriate dashboard based on the user's role.
*/

import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { loginUser } from "../../microservice/user/userService";

const Login: React.FC = () => {
  // Component state for managing input values and UI states.
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // Hook for programmatic navigation.
  const navigate = useNavigate();

  /*
    handleSubmit
    ------------
    Handles form submission for login.
    - Prevents the default form submission behavior.
    - Validates that email and password are provided.
    - Calls the loginUser service with credentials.
    - Stores the authentication token in localStorage or sessionStorage based on the "Remember me" option.
    - Navigates to the appropriate dashboard based on the user's role.
    - Handles and displays errors if authentication fails.
  */
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);

    // Validate that both email and password are provided.
    if (!email || !password) {
      setError("Both email/username and password are required.");
      return;
    }

    setLoading(true);
    try {
      // Attempt to log in the user with the provided credentials.
      const response = await loginUser({ email, password });
      if (!response?.token) {
        setError("Invalid credentials.");
        return;
      }
      
      // Store the token based on the 'Remember me' option.
      const storage = rememberMe ? localStorage : sessionStorage;
      storage.setItem("authToken", response.token);

      // Define role-based routes for navigation.
      const roleRoutes: Record<string, string> = {
        admin: "/admin/dashboard",
        student: "/student/dashboard",
        teacher: "/teacher/dashboard",
      };

      // Navigate to the corresponding dashboard based on the user's role.
      if (response.role && roleRoutes[response.role]) {
        navigate(roleRoutes[response.role]);
      } else {
        setError("Invalid user role.");
      }
    } catch (err: unknown) {
      // Log and display error messages.
      console.error("Login error:", err);
      setError(err instanceof Error ? err.message : "Login failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-black px-4">
      <div className="max-w-md w-full space-y-6 animate-fadeIn">
        {/* Header Section */}
        <div className="text-center space-y-1">
          <h1 className="text-xl md:text-2xl font-bold text-white">
            School Management System
          </h1>
          <p className="text-gray-400">Sign in to your account</p>
        </div>

        {/* Display error message if any */}
        {error && (
          <div className="text-center text-sm text-red-400 border border-red-400 rounded p-2">
            {error}
          </div>
        )}

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="bg-[#1E1E1E] rounded-md shadow p-5 space-y-4">
            {/* Username / Email Field */}
            <div>
              <label htmlFor="email" className="sr-only">
                Username / Email
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M5.121 17.804A9 9 0 1118.88 6.196M12 14v.01"
                    />
                  </svg>
                </span>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Username / Email"
                  className="w-full pl-10 pr-3 py-2 rounded bg-[#2A2A2A] text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
            </div>

            {/* Password Field */}
            <div>
              <label htmlFor="password" className="sr-only">
                Password
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M12 11c1.657 0 3 1.343 3 3v3H9v-3c0-1.657 1.343-3 3-3z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M7 11V7a5 5 0 0110 0v4"
                    />
                  </svg>
                </span>
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Password"
                  className="w-full pl-10 pr-10 py-2 rounded bg-[#2A2A2A] text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
                {/* Toggle Password Visibility Button */}
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400"
                  aria-label="Toggle Password Visibility"
                >
                  {showPassword ? (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={2}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.29-2.731-9.945-6.705a.993.993 0 010-.59A10.054 10.054 0 017.86 5.289m3.907-1.094A9.995 9.995 0 0112 5c4.478 0 8.29 2.731 9.542 6.705.129.322.129.68 0 1.002a10.05 10.05 0 01-2.983 3.8M3 3l18 18"
                      />
                    </svg>
                  ) : (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={2}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M2.458 12C3.732 7.943 7.313 5 12 5c4.687 0 8.268 2.943 9.542 7-1.274 4.057-4.855 7-9.542 7-4.687 0-8.268-2.943-9.542-7z"
                      />
                    </svg>
                  )}
                </button>
              </div>
            </div>

            {/* Remember Me Checkbox */}
            <div className="flex items-center justify-between">
              <label className="flex items-center text-sm text-gray-400">
                <input
                  type="checkbox"
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded mr-2"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                />
                <span>Remember me</span>
              </label>
            </div>

            {/* Login Button */}
            <button
              type="submit"
              disabled={loading}
              className={`w-full flex items-center justify-center space-x-2 py-2 text-white rounded font-semibold transition-colors ${
                loading ? "bg-blue-400 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700"
              }`}
            >
              {loading ? (
                <>
                  <svg
                    className="animate-spin h-5 w-5 mr-1 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8v8H4z"
                    />
                  </svg>
                  <span>Signing In...</span>
                </>
              ) : (
                <>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M10 9l5 3-5 3V9z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M19 12H5"
                    />
                  </svg>
                  <span>LOGIN</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;

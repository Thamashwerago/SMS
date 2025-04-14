// src/pages/Auth/Login.tsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { setCredentials } from '../../store/authSlice';
import userService from '../../components/services/userService';

// Dummy users list to simulate user lookup
const dummyUsers = [
  { email: 'admin@example.com', password: 'admin123', role: 'ADMIN', name: 'Admin User' },
  { email: 'teacher@example.com', password: 'teacher123', role: 'teacher', name: 'Teacher User' },
  { email: 'student@example.com', password: 'student123', role: 'student', name: 'Student User' },
];

const Login: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    // Basic validation
    if (!email || !password) {
      setError('Please provide both email and password.');
      setLoading(false);
      return;
    }

    try {
      // Call the userService to validate credentials
      const userRole = await userService.isUser(email, password);

      if (!userRole) {
        setError('Invalid email or password.');
        setLoading(false);
        return;
      }

      // Find the user in our dummy users list to get full user data
      const foundUser = dummyUsers.find(
        (user) => user.email.toLowerCase() === email.toLowerCase() && user.password === password
      );

      if (!foundUser) {
        setError('Invalid email or password.');
        setLoading(false);
        return;
      }

    // Dummy auth token
    const authToken = 'dummyAuthToken123';

    // Store token in localStorage if "Remember Me" is checked; otherwise, in sessionStorage.
    if (rememberMe) {
      localStorage.setItem('authToken', authToken);
    } else {
      sessionStorage.setItem('authToken', authToken);
    }

    sessionStorage.setItem('user', JSON.stringify({
      email: foundUser.email,
      password: foundUser.password,
      role: foundUser.role,
      name: foundUser.name
    }));

    // Store user role separately for easy access
    sessionStorage.setItem('userRole', foundUser.role);

      // Update Redux store with credentials
      dispatch(setCredentials({ token: authToken, role: foundUser.role }));

      // Redirect user based on their role
      navigate(`/${foundUser.role.toLowerCase()}/dashboard`);
    } catch (err) {
      console.error('Login error:', err);
      setError('An error occurred during login. Please try again.');
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
            <label htmlFor="email" className="block text-white font-semibold mb-1">
              Email
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-4 py-2 bg-gray-800 border border-indigo-500 rounded focus:outline-none text-white"
            />
          </div>
          <div>
            <label htmlFor="password" className="block text-white font-semibold mb-1">
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
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;

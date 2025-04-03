/**
 * Settings.tsx
 *
 * Futuristic Settings Page
 * -------------------------
 * - Provides a form for admin users to update application settings.
 * - Options include username, notification preferences, theme selection,
 *   time zone, and auto-update toggle.
 * - Uses a dark gradient background with neon accents and smooth transitions.
 */

import React, { useState } from 'react';
import Sidebar from '../../components/common/Sidebar';
import Navbar from '../../components/common/Navbar';

const Settings: React.FC = () => {
  // State for various settings
  const [username, setUsername] = useState('admin');
  const [enableNotifications, setEnableNotifications] = useState(true);
  const [theme, setTheme] = useState('dark');
  const [timeZone, setTimeZone] = useState('GMT');
  const [autoUpdate, setAutoUpdate] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // For demonstration, log the settings
    console.log({
      username,
      enableNotifications,
      theme,
      timeZone,
      autoUpdate,
    });
    // Additional logic (e.g., API calls) can be added here.
  };

  return (
    <div className="min-h-screen flex font-roboto bg-gradient-to-br from-gray-900 to-black">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <Navbar />
        <main className="p-8">
          <h1 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500 mb-8">
            Settings
          </h1>
          <div className="bg-black bg-opacity-50 border border-indigo-500 rounded-xl shadow-xl p-8">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Username */}
              <div>
                <label htmlFor="username" className="block text-white text-lg font-semibold mb-2">
                  Username
                </label>
                <input
                  id="username"
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full px-4 py-2 bg-black bg-opacity-50 border border-indigo-500 rounded-md focus:outline-none text-white"
                />
              </div>

              {/* Enable Notifications */}
              <div>
                <label htmlFor="enableNotifications" className="block text-white text-lg font-semibold mb-2">
                  Enable Notifications
                </label>
                <div className="flex items-center">
                  <input
                    id="enableNotifications"
                    type="checkbox"
                    checked={enableNotifications}
                    onChange={(e) => setEnableNotifications(e.target.checked)}
                    className="mr-2"
                  />
                  <label htmlFor="enableNotifications" className="text-white">
                    Yes, send notifications
                  </label>
                </div>
              </div>

              {/* Theme Selection */}
              <div>
                <label htmlFor="theme" className="block text-white text-lg font-semibold mb-2">
                  Theme
                </label>
                <select
                  id="theme"
                  value={theme}
                  onChange={(e) => setTheme(e.target.value)}
                  className="w-full px-4 py-2 bg-black bg-opacity-50 border border-indigo-500 rounded-md focus:outline-none text-white"
                >
                  <option value="dark">Dark</option>
                  <option value="light">Light</option>
                  <option value="neon">Neon</option>
                </select>
              </div>

              {/* Time Zone */}
              <div>
                <label htmlFor="timeZone" className="block text-white text-lg font-semibold mb-2">
                  Time Zone
                </label>
                <input
                  id="timeZone"
                  type="text"
                  value={timeZone}
                  onChange={(e) => setTimeZone(e.target.value)}
                  className="w-full px-4 py-2 bg-black bg-opacity-50 border border-indigo-500 rounded-md focus:outline-none text-white"
                />
              </div>

              {/* Auto Update */}
              <div>
                <label htmlFor="autoUpdate" className="block text-white text-lg font-semibold mb-2">
                  Auto Update
                </label>
                <div className="flex items-center">
                  <input
                    id="autoUpdate"
                    type="checkbox"
                    checked={autoUpdate}
                    onChange={(e) => setAutoUpdate(e.target.checked)}
                    className="mr-2"
                  />
                  <label htmlFor="autoUpdate" className="text-white">
                    Enable auto update of settings
                  </label>
                </div>
              </div>

              {/* Submit Button */}
              <div>
                <button
                  type="submit"
                  className="px-6 py-2 bg-indigo-600 hover:bg-indigo-700 rounded-md text-white font-bold transition duration-300"
                >
                  Save Settings
                </button>
              </div>
            </form>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Settings;

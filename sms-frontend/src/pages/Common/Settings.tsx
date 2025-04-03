/**
 * Settings.tsx
 *
 * This component represents the Settings page for the admin.
 * It displays a form that allows the admin to update system preferences.
 * The page includes the Sidebar and Navbar for a consistent dashboard layout.
 * In production, settings would be fetched from and updated via a backend API.
 */

import React, { useState } from 'react';
import Sidebar from '../../components/common/Sidebar';
import Navbar from '../../components/common/Navbar';

const Settings: React.FC = () => {
  // State for system settings.
  const [systemName, setSystemName] = useState("School Management System");
  const [emailNotifications, setEmailNotifications] = useState(true);

  /**
   * handleSubmit
   *
   * Handles form submission for updating settings.
   * Currently, it logs the settings to the console.
   */
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // In a production app, send this data to your backend API.
    console.log("Settings saved:", { systemName, emailNotifications });
  };

  return (
    <div className="min-h-screen flex bg-black text-white">
      {/* Sidebar Navigation */}
      <Sidebar />
      {/* Main Content Area */}
      <div className="flex-1 p-6">
        {/* Top Navbar */}
        <Navbar />
        {/* Content Container with spacing */}
        <div className="mt-6">
          {/* Page Header */}
          <h1 className="text-3xl font-bold mb-4">Settings</h1>
          <p className="mb-6 text-gray-300">
            Update your system preferences below.
          </p>
          {/* Settings Form Container */}
          <div className="bg-[#1E1E1E] p-6 rounded-lg shadow">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* System Name Input */}
              <div>
                <label htmlFor="systemName" className="block text-gray-300 mb-2">
                  System Name
                </label>
                <input
                  type="text"
                  id="systemName"
                  value={systemName}
                  onChange={(e) => setSystemName(e.target.value)}
                  className="w-full p-2 bg-[#1E1E1E] border border-gray-700 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              {/* Email Notifications Toggle */}
              <div>
                <label htmlFor="emailNotifications" className="block text-gray-300 mb-2">
                  Email Notifications
                </label>
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="emailNotifications"
                    checked={emailNotifications}
                    onChange={(e) => setEmailNotifications(e.target.checked)}
                    className="mr-2"
                  />
                  <span>{emailNotifications ? "Enabled" : "Disabled"}</span>
                </div>
              </div>
              {/* Save Settings Button */}
              <button
                type="submit"
                className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded transition-colors duration-200"
              >
                Save Settings
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;

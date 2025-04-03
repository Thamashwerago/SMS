/**
 * Profile.tsx
 *
 * This component represents the Profile page for the admin.
 * It displays a profile form with basic user information and allows the user to update their profile details.
 * The page layout includes a Sidebar and Navbar for a consistent dashboard UI.
 * In a production application, profile data would be fetched from and updated to a backend API.
 */

import React, { useState } from 'react';
import Sidebar from '../../components/common/Sidebar';
import Navbar from '../../components/common/Navbar';

const Profile: React.FC = () => {
  // Dummy profile data for demonstration purposes.
  const [profile, setProfile] = useState({
    firstName: 'Admin',
    lastName: 'User',
    email: 'admin@example.com',
  });

  /**
   * handleUpdateProfile
   *
   * Handles form submission for updating the profile.
   * Currently, it logs the updated profile data to the console.
   */
  const handleUpdateProfile = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log('Profile updated:', profile);
    // In a production application, you would send the updated profile data to your backend here.
  };

  return (
    <div className="min-h-screen flex bg-black text-white">
      {/* Sidebar Navigation */}
      <Sidebar />
      {/* Main Content Area */}
      <div className="flex-1 p-6">
        {/* Top Navbar */}
        <Navbar />
        {/* Content Container */}
        <div className="mt-6">
          {/* Page Header */}
          <h1 className="text-3xl font-bold mb-4">Profile</h1>
          <p className="mb-6 text-gray-300">
            View and update your profile information below.
          </p>
          {/* Profile Form Container */}
          <div className="bg-[#1E1E1E] p-6 rounded-lg shadow max-w-md">
            <form onSubmit={handleUpdateProfile} className="space-y-6">
              {/* First Name Input */}
              <div>
                <label htmlFor="firstName" className="block text-gray-300 mb-2">
                  First Name
                </label>
                <input
                  type="text"
                  id="firstName"
                  value={profile.firstName}
                  onChange={(e) =>
                    setProfile({ ...profile, firstName: e.target.value })
                  }
                  className="w-full p-2 bg-[#1E1E1E] border border-gray-700 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              {/* Last Name Input */}
              <div>
                <label htmlFor="lastName" className="block text-gray-300 mb-2">
                  Last Name
                </label>
                <input
                  type="text"
                  id="lastName"
                  value={profile.lastName}
                  onChange={(e) =>
                    setProfile({ ...profile, lastName: e.target.value })
                  }
                  className="w-full p-2 bg-[#1E1E1E] border border-gray-700 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              {/* Email Input */}
              <div>
                <label htmlFor="email" className="block text-gray-300 mb-2">
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  value={profile.email}
                  onChange={(e) =>
                    setProfile({ ...profile, email: e.target.value })
                  }
                  className="w-full p-2 bg-[#1E1E1E] border border-gray-700 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              {/* Save Profile Button */}
              <button
                type="submit"
                className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded transition-colors duration-200"
              >
                Save Profile
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;

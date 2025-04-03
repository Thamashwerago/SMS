// src/pages/Admin/Profile.tsx
import React, { useState } from 'react';
import Sidebar from '../../components/common/Sidebar';
import Navbar from '../../components/common/Navbar';

interface ProfileData {
  name: string;
  email: string;
  role: string;
  phone: string;
}

const Profile: React.FC = () => {
  // Initial profile data (could be fetched from an API)
  const [profile, setProfile] = useState<ProfileData>({
    name: 'Admin User',
    email: 'admin@example.com',
    role: 'Administrator', // For teachers/students, set role to "Teacher" or "Student"
    phone: '123-456-7890',
  });
  const [isEditing, setIsEditing] = useState(false);

  // Determine if editing should be limited (only email and password) for teacher/student.
  const isLimited = profile.role.toLowerCase() !== 'administrator';

  // For admin (full editing), we use the profile fields.
  const [fullFormData, setFullFormData] = useState({
    name: profile.name,
    email: profile.email,
    phone: profile.phone,
  });

  // For teacher/student (limited editing), use separate state for email and password.
  const [limitedFormData, setLimitedFormData] = useState({
    email: profile.email,
    password: '',
    confirmPassword: '',
  });

  const handleFullChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFullFormData({ ...fullFormData, [e.target.name]: e.target.value });
  };

  const handleLimitedChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLimitedFormData({ ...limitedFormData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (isLimited) {
      // Validate that the new password and confirm password match.
      if (limitedFormData.password !== limitedFormData.confirmPassword) {
        alert('Passwords do not match.');
        return;
      }
      // Update profile with new email (password update would be handled securely in a real app)
      setProfile({ ...profile, email: limitedFormData.email });
    } else {
      // For admin, update full profile details.
      setProfile({
        ...profile,
        name: fullFormData.name,
        email: fullFormData.email,
        phone: fullFormData.phone,
      });
    }
    setIsEditing(false);
    console.log('Profile saved:', profile);
    // In a real application, you would persist changes via an API call here.
  };

  return (
    <div className="min-h-screen flex font-roboto bg-gradient-to-br from-gray-900 to-black">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <Navbar />
        <main className="p-8">
          <h1 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500 mb-8">
            {profile.role} Profile
          </h1>
          <div className="bg-black bg-opacity-50 border border-indigo-500 rounded-xl shadow-xl p-8">
            {isEditing ? (
              <form onSubmit={handleSubmit} className="space-y-6">
                {isLimited ? (
                  // Limited editing for Teacher/Student: only Email & Password.
                  <>
                    <div>
                      <label htmlFor="email" className="block text-white text-lg font-semibold mb-2">
                        Email
                      </label>
                      <input
                        id="email"
                        name="email"
                        type="email"
                        value={limitedFormData.email}
                        onChange={handleLimitedChange}
                        required
                        className="w-full px-4 py-2 bg-black bg-opacity-50 border border-indigo-500 rounded-md focus:outline-none text-white"
                      />
                    </div>
                    <div>
                      <label htmlFor="password" className="block text-white text-lg font-semibold mb-2">
                        New Password
                      </label>
                      <input
                        id="password"
                        name="password"
                        type="password"
                        value={limitedFormData.password}
                        onChange={handleLimitedChange}
                        required
                        className="w-full px-4 py-2 bg-black bg-opacity-50 border border-indigo-500 rounded-md focus:outline-none text-white"
                      />
                    </div>
                    <div>
                      <label htmlFor="confirmPassword" className="block text-white text-lg font-semibold mb-2">
                        Confirm Password
                      </label>
                      <input
                        id="confirmPassword"
                        name="confirmPassword"
                        type="password"
                        value={limitedFormData.confirmPassword}
                        onChange={handleLimitedChange}
                        required
                        className="w-full px-4 py-2 bg-black bg-opacity-50 border border-indigo-500 rounded-md focus:outline-none text-white"
                      />
                    </div>
                  </>
                ) : (
                  // Full editing for Admin: Name, Email, Phone. Role remains read-only.
                  <>
                    <div>
                      <label htmlFor="name" className="block text-white text-lg font-semibold mb-2">
                        Name
                      </label>
                      <input
                        id="name"
                        name="name"
                        type="text"
                        value={fullFormData.name}
                        onChange={handleFullChange}
                        required
                        className="w-full px-4 py-2 bg-black bg-opacity-50 border border-indigo-500 rounded-md focus:outline-none text-white"
                      />
                    </div>
                    <div>
                      <label htmlFor="email" className="block text-white text-lg font-semibold mb-2">
                        Email
                      </label>
                      <input
                        id="email"
                        name="email"
                        type="email"
                        value={fullFormData.email}
                        onChange={handleFullChange}
                        required
                        className="w-full px-4 py-2 bg-black bg-opacity-50 border border-indigo-500 rounded-md focus:outline-none text-white"
                      />
                    </div>
                    <div>
                      <label htmlFor="phone" className="block text-white text-lg font-semibold mb-2">
                        Phone
                      </label>
                      <input
                        id="phone"
                        name="phone"
                        type="text"
                        value={fullFormData.phone}
                        onChange={handleFullChange}
                        required
                        className="w-full px-4 py-2 bg-black bg-opacity-50 border border-indigo-500 rounded-md focus:outline-none text-white"
                      />
                    </div>
                    <div>
                      <label htmlFor="role" className="block text-white text-lg font-semibold mb-2">
                        Role
                      </label>
                      <input
                        id="role"
                        name="role"
                        type="text"
                        value={profile.role}
                        readOnly
                        className="w-full px-4 py-2 bg-gray-700 border border-indigo-500 rounded-md focus:outline-none text-white cursor-not-allowed"
                      />
                    </div>
                  </>
                )}
                <div className="flex justify-end space-x-4">
                  <button
                    type="button"
                    onClick={() => setIsEditing(false)}
                    className="px-4 py-2 bg-gray-600 hover:bg-gray-700 rounded-md text-white transition duration-300"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 rounded-md text-white font-bold transition duration-300"
                  >
                    Save Changes
                  </button>
                </div>
              </form>
            ) : (
              // View mode: display profile details
              <div className="space-y-6">
                <div>
                  <span className="block text-white text-lg font-semibold mb-2">Name:</span>
                  <p className="text-gray-300">{profile.name}</p>
                </div>
                <div>
                  <span className="block text-white text-lg font-semibold mb-2">Email:</span>
                  <p className="text-gray-300">{profile.email}</p>
                </div>
                <div>
                  <span className="block text-white text-lg font-semibold mb-2">Phone:</span>
                  <p className="text-gray-300">{profile.phone}</p>
                </div>
                <div>
                  <span className="block text-white text-lg font-semibold mb-2">Role:</span>
                  <p className="text-gray-300">{profile.role}</p>
                </div>
                <div className="flex justify-end">
                  <button
                    onClick={() => setIsEditing(true)}
                    className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 rounded-md text-white font-bold transition duration-300"
                  >
                    Edit Profile
                  </button>
                </div>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

export default Profile;

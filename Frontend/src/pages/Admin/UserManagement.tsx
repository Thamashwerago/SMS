import React, { useState, useEffect, useMemo, ChangeEvent } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../../components/common/Sidebar";
import Navbar from "../../components/common/Navbar";
import CommonTable, { Column } from "../../components/common/Table";
import CommonButton from "../../components/common/Button";
import userService from "../../components/services/userService";
import {
  USER_MANAGEMENT_HEADING,
  SEARCH_PLACEHOLDER,
  ADD_ADMIN_BUTTON_LABEL,
} from "../../constants/admin/userManagementStrings";
import { FETCH_USERS_EXCEPTION } from "../../constants/exceptionMessages";

/**
 * User interface represents a user object fetched from the backend.
 */
interface User {
  id: number;
  username: string;
  email: string;
  password: string;
  role: string;
  status?: string;
}

/**
 * UserManagement Component
 * --------------------------
 * Displays a table of users with search, sorting, and editing capabilities.
 * User data is fetched from the backend using userService.getAll().
 * The component utilizes CommonTable for rendering the table and CommonButton for actions.
 * Exception messages and literal strings are imported from separate constants files.
 */
const UserManagement: React.FC = () => {
  const navigate = useNavigate();

  // State to store user data fetched from backend.
  const [users, setUsers] = useState<User[]>([]);
  // State for the search query input.
  const [searchQuery, setSearchQuery] = useState("");
  // States for editing user details.
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [editData, setEditData] = useState<{
    username: string;
    email: string;
    password: string;
  }>({
    username: "",
    email: "",
    password: "",
  });
  // State for error messages.
  const [error, setError] = useState<string | null>(null);

  /**
   * useEffect - Fetch user data from the backend when the component mounts.
   */
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        // Fetch all users using the userService.
        const data = await userService.getAll();
        // Map service data to ensure status is defined.
        const mappedData = data.map((user: User) => ({
          ...user,
          status: user.status ?? "active",
        }));
        setUsers(mappedData);
      } catch (err) {
        console.error("Error fetching users:", err);
        setError(FETCH_USERS_EXCEPTION);
      }
    };
    fetchUsers();
  }, []);

  /**
   * handleSearchChange - Updates the search query state as the user types.
   * @param e - Input change event.
   */
  const handleSearchChange = (e: ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  /**
   * filteredUsers - Filters the list of users based on the search query.
   */
  const filteredUsers = useMemo(() => {
    return users.filter(
      (user) =>
        user.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.role.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [users, searchQuery]);

  /**
   * columns - Defines the table columns for the CommonTable component.
   */
  const columns: Column<User>[] = useMemo(
    () => [
      { header: "User ID", accessor: "id" },
      { header: "Username", accessor: "username" },
      { header: "Role", accessor: "role" },
    ],
    []
  );

  /**
   * handleRowClick - Opens the modal to edit user details.
   * Initializes editData with the selected user's data.
   * @param user - The selected user.
   */
  const handleRowClick = (user: User) => {
    setSelectedUser(user);
    setEditData({
      username: user.username,
      email: user.email,
      password: user.password,
    });
    setIsEditing(false);
  };

  /**
   * handleEditChange - Updates the editData state as input values change.
   * @param e - Input change event.
   */
  const handleEditChange = (e: ChangeEvent<HTMLInputElement>) => {
    setEditData({ ...editData, [e.target.name]: e.target.value });
  };

  /**
   * handleEditClick - Enables editing mode for the user details modal.
   */
  const handleEditClick = () => {
    setIsEditing(true);
  };

  /**
   * handleSave - Saves the edited user data.
   * In a production scenario, an API call would update the backend.
   */
  const handleSave = () => {
    if (selectedUser) {
      setSelectedUser({
        ...selectedUser,
        username: editData.username,
        email: editData.email,
        password: editData.password,
      });
      setIsEditing(false);
    }
  };

  /**
   * handleCancelEdit - Cancels editing and resets editData to the selected user's data.
   */
  const handleCancelEdit = () => {
    setIsEditing(false);
    if (selectedUser) {
      setEditData({
        username: selectedUser.username,
        email: selectedUser.email,
        password: selectedUser.password,
      });
    }
  };

  /**
   * handleClose - Closes the user details modal and resets the selected user.
   */
  const handleClose = () => {
    setSelectedUser(null);
    navigate("/admin/user-management");
  };

  return (
    <div className="min-h-screen flex font-roboto bg-gradient-to-br from-gray-900 to-black">
      {/* Sidebar Navigation */}
      <Sidebar />
      <div className="flex-1 flex flex-col">
        {/* Top Navbar */}
        <Navbar />
        <main className="p-8">
          {/* Header Section with Search Input and Add Admin Button */}
          <div className="flex flex-col sm:flex-row items-center justify-between mb-8">
            <h1 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500">
              {USER_MANAGEMENT_HEADING}
            </h1>
            <div className="flex items-center mt-4 sm:mt-0">
              <input
                type="text"
                placeholder={SEARCH_PLACEHOLDER}
                value={searchQuery}
                onChange={handleSearchChange}
                className="px-4 py-2 bg-black bg-opacity-50 border border-indigo-500 rounded-l-xl focus:outline-none text-white placeholder-gray-400"
              />
              <CommonButton
                label={ADD_ADMIN_BUTTON_LABEL}
                onClick={() => navigate("/admin/add-admin")}
                className="rounded-r-xl"
              />
            </div>
          </div>

          {/* Display error message if any */}
          {error && (
            <div className="mb-4 p-4 bg-red-500 bg-opacity-50 border border-red-700 rounded-xl text-white">
              {error}
            </div>
          )}

          {/* Common Table Component to display user data */}
          <CommonTable
            columns={columns}
            data={filteredUsers}
            initialSortColumn="username"
            initialSortDirection="asc"
            onRowClick={handleRowClick}
          />

          {/* User Details Modal */}
          {selectedUser && (
            <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-70 z-50">
              <div className="bg-gray-800 p-8 rounded-xl border border-indigo-500 shadow-xl max-w-lg w-full mx-4 animate-fadeIn">
                <h2 className="text-2xl font-bold text-white mb-4">
                  User Details
                </h2>
                <div className="space-y-4">
                  <div>
                    <span className="block text-white text-lg font-semibold">
                      User ID:
                    </span>
                    <p className="text-gray-300">{selectedUser.id}</p>
                  </div>
                  <div>
                    <span className="block text-white text-lg font-semibold">
                      Username:
                    </span>
                    {isEditing ? (
                      <input
                        type="text"
                        name="username"
                        value={editData.username}
                        onChange={handleEditChange}
                        placeholder="Username"
                        className="w-full px-4 py-2 bg-black bg-opacity-50 border border-indigo-500 rounded-md focus:outline-none text-white"
                      />
                    ) : (
                      <p className="text-gray-300">{selectedUser.username}</p>
                    )}
                  </div>
                  <div>
                    <span className="block text-white text-lg font-semibold">
                      Email:
                    </span>
                    {isEditing ? (
                      <input
                        type="email"
                        name="email"
                        value={editData.email}
                        onChange={handleEditChange}
                        placeholder="Email"
                        className="w-full px-4 py-2 bg-black bg-opacity-50 border border-indigo-500 rounded-md focus:outline-none text-white"
                      />
                    ) : (
                      <p className="text-gray-300">{selectedUser.email}</p>
                    )}
                  </div>
                  <div>
                    <span className="block text-white text-lg font-semibold">
                      Password:
                    </span>
                    {isEditing ? (
                      <input
                        type="text"
                        name="password"
                        value={editData.password}
                        onChange={handleEditChange}
                        placeholder="Password"
                        className="w-full px-4 py-2 bg-black bg-opacity-50 border border-indigo-500 rounded-md focus:outline-none text-white"
                      />
                    ) : (
                      <p className="text-gray-300">{selectedUser.password}</p>
                    )}
                  </div>
                  <div>
                    <span className="block text-white text-lg font-semibold">
                      Role:
                    </span>
                    <p className="text-gray-300">{selectedUser.role}</p>
                  </div>
                </div>
                <div className="mt-6 flex justify-end space-x-4">
                  {isEditing ? (
                    <>
                      <CommonButton
                        label="Save"
                        onClick={handleSave}
                        className="bg-green-600 hover:bg-green-700"
                      />
                      <CommonButton
                        label="Cancel"
                        onClick={handleCancelEdit}
                        className="bg-yellow-600 hover:bg-yellow-700"
                      />
                    </>
                  ) : (
                    <CommonButton
                      label="Edit"
                      onClick={handleEditClick}
                      className="bg-blue-600 hover:bg-blue-700"
                    />
                  )}
                  <CommonButton
                    label="Close"
                    onClick={handleClose}
                    className="bg-indigo-600 hover:bg-indigo-700"
                  />
                </div>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default UserManagement;

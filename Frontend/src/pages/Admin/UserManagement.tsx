// src/pages/Admin/UserManagement.tsx
import React, { useState, useEffect, useMemo, ChangeEvent } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../../components/common/Sidebar";
import Navbar from "../../components/common/Navbar";
import CommonTable, { Column } from "../../components/common/Table";
import CommonButton from "../../components/common/Button";
import userService, { User } from "../../services/userService";
import { Plus, Search, X } from "lucide-react";
import {
  USER_MANAGEMENT_HEADING,
  SEARCH_PLACEHOLDER,
  ADD_ADMIN_BUTTON_LABEL,
} from "../../constants/admin/userManagementStrings";
import {
  FETCH_USERS_EXCEPTION,
  UPDATE_USER_EXCEPTION,
} from "../../constants/exceptionMessages";

// Editable fields for user update
interface EditableUserData {
  username: string;
  email: string;
  password: string;
}

const UserManagement: React.FC = () => {
  const navigate = useNavigate();
  const [users, setUsers] = useState<User[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState<EditableUserData>({
    username: "",
    email: "",
    password: "",
  });
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // Fetch users on mount
  useEffect(() => {
    (async () => {
      setLoading(true);
      try {
        const resp = await userService.getAll();
        setUsers(Array.isArray(resp) ? resp : []);
      } catch (err) {
        console.error(err);
        setError(FETCH_USERS_EXCEPTION);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  // Filter users by search query
  const filteredUsers = useMemo(
    () =>
      users.filter((u) =>
        [u.username, u.email, u.role].some((field) =>
          field.toLowerCase().includes(searchQuery.toLowerCase())
        )
      ),
    [users, searchQuery]
  );

  // Table columns
  const columns: Column<User>[] = useMemo(
    () => [
      { header: "ID", accessor: "id" },
      { header: "Username", accessor: "username" },
      { header: "Email", accessor: "email" },
      { header: "Role", accessor: "role" },
    ],
    []
  );

  // Handlers
  const handleSearch = (e: ChangeEvent<HTMLInputElement>) =>
    setSearchQuery(e.target.value);
  const clearSearch = () => setSearchQuery("");
  const goAddAdmin = () => navigate("/admin/add-admin");

  const handleRowClick = (user: User) => {
    setError(null);
    setSelectedUser(user);
    setEditData({ username: user.username, email: user.email, password: "" });
    setIsEditing(false);
  };

  const handleEditChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setEditData((prev) => ({ ...prev, [name]: value }));
  };

  const saveUser = async () => {
    if (!selectedUser) return;
    setError(null);
    try {
      const updated = await userService.update(selectedUser.id, editData);
      setUsers((prev) => prev.map((u) => (u.id === updated.id ? updated : u)));
      setSelectedUser(updated);
      setIsEditing(false);
    } catch (err) {
      console.error(err);
      setError(UPDATE_USER_EXCEPTION);
    }
  };

  const cancelEdit = () => {
    if (selectedUser) {
      setEditData({
        username: selectedUser.username,
        email: selectedUser.email,
        password: "",
      });
    }
    setIsEditing(false);
    setError(null);
  };

  const closeModal = () => setSelectedUser(null);

  return (
    <div className="min-h-screen flex bg-gradient-to-br from-gray-900 to-black text-white">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <Navbar />
        <main className="p-8 space-y-6">
          {/* Header */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center">
            <h1 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500">
              {USER_MANAGEMENT_HEADING}
            </h1>
            <div className="flex items-center mt-4 sm:mt-0 space-x-2">
              <div className="relative">
                <Search className="absolute inset-y-0 left-0 pl-3 h-10 w-7 text-gray-400" />
                <input
                  type="text"
                  placeholder={SEARCH_PLACEHOLDER}
                  value={searchQuery}
                  onChange={handleSearch}
                  className="pl-10 pr-3 py-2 bg-gray-800 text-white placeholder-gray-400 border border-indigo-500 rounded-l-md focus:outline-none focus:ring focus:ring-indigo-500"
                />
              </div>
              {searchQuery && (
                <CommonButton
                  size="sm"
                  variant="secondary"
                  label=""
                  leftIcon={<X />}
                  onClick={clearSearch}
                />
              )}
              <CommonButton
                size="md"
                variant="primary"
                label={ADD_ADMIN_BUTTON_LABEL}
                leftIcon={<Plus />}
                onClick={goAddAdmin}
              />
            </div>
          </div>

          {/* Error */}
          {error && <div className="p-4 bg-red-600 bg-opacity-50 rounded">{error}</div>}

          {/* User Table */}
          <div className="bg-black bg-opacity-50 border border-indigo-500 rounded-lg shadow overflow-hidden">
            <CommonTable
              columns={columns}
              data={filteredUsers}
              loading={loading}
              initialSortColumn="username"
              initialSortDirection="asc"
              onRowClick={handleRowClick}
            />
          </div>

          {/* Detail Slide-over */}
          {selectedUser && (
            <div className="fixed inset-0 z-50 flex">
              {/* Overlay */}
              <button
                className="absolute inset-0 bg-black bg-opacity-70 border-0 w-full cursor-default"
                onClick={closeModal}
                aria-label="Close user details"
              />

              {/* Slide-over */}
              <aside className="relative ml-auto w-full max-w-md h-full bg-gray-800 p-6">
                {/* Close icon */}
                <button
                  onClick={closeModal}
                  aria-label="Close"
                  className="absolute top-4 right-4 p-2 bg-gray-700 rounded hover:bg-gray-600 focus:outline-none focus:ring focus:ring-indigo-500"
                >
                  <X className="h-5 w-5 text-gray-300" />
                </button>

                <h2 className="text-2xl font-bold mb-4">User Details</h2>
                {error && <p className="text-red-500 mb-2">{error}</p>}

                <div className="space-y-4">
                  {[
                    { label: "Username", name: "username" },
                    { label: "Email", name: "email" },
                    { label: "Password", name: "password" },
                  ].map((field) => (
                    <div key={field.name}>
                      <label
                        htmlFor={field.name}
                        className="block text-sm font-semibold mb-1 text-gray-200"
                      >
                        {field.label}
                      </label>
                      {isEditing ? (
                        <input
                          id={field.name}
                          type={field.name === "password" ? "password" : "text"}
                          name={field.name}
                          value={
                            editData[field.name as keyof EditableUserData]
                          }
                          onChange={handleEditChange}
                          placeholder={`Enter ${field.label.toLowerCase()}`}
                          className="w-full px-3 py-2 bg-gray-700 border border-indigo-500 rounded focus:outline-none focus:ring focus:ring-indigo-500 text-white"
                        />
                      ) : (
                        <p className="text-gray-300">
                          {field.name === "password"
                            ? "••••••"
                            : selectedUser[field.name as keyof EditableUserData]}
                        </p>
                      )}
                    </div>
                  ))}

                  <div>
                    <div className="block text-sm font-semibold mb-1 text-gray-200">
                      Role
                    </div>
                    <p className="text-gray-300">{selectedUser.role}</p>
                  </div>
                </div>

                <div className="mt-6 flex justify-end space-x-2">
                  {isEditing ? (
                    <>
                      <CommonButton
                        size="sm"
                        variant="primary"
                        label="Save"
                        onClick={saveUser}
                      />
                      <CommonButton
                        size="sm"
                        variant="secondary"
                        label="Cancel"
                        onClick={cancelEdit}
                      />
                    </>
                  ) : (
                    <CommonButton
                      size="sm"
                      variant="primary"
                      label="Edit"
                      onClick={() => setIsEditing(true)}
                    />
                  )}
                </div>
              </aside>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default React.memo(UserManagement);

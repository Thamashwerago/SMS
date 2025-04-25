// src/pages/Admin/UserManagement.tsx
import React, { useState, useEffect, useMemo, ChangeEvent } from "react";
import { useNavigate } from "react-router-dom";
import { Plus, Search, X, Edit3 } from "lucide-react";
import Sidebar from "../../components/common/Sidebar";
import Navbar from "../../components/common/Navbar";
import CommonTable, { Column } from "../../components/common/Table";
import CommonButton from "../../components/common/Button";
import userService, { User } from "../../services/userService";
import {
  USER_MANAGEMENT_HEADING,
  SEARCH_PLACEHOLDER,
  ADD_ADMIN_BUTTON_LABEL,
  USER_EDIT_BUTTON_LABEL,
  USER_SAVE_BUTTON_LABEL,
  USER_CANCEL_BUTTON_LABEL,
  USER_CLOSE_BUTTON_LABEL,
} from "../../constants/admin/userManagementStrings";
import {
  FETCH_USERS_EXCEPTION,
  UPDATE_USER_EXCEPTION,
} from "../../constants/exceptionMessages";

interface EditableUserData {
  username: string;
  email: string;
  password: string;
}

const UserManagement: React.FC = () => {
  const navigate = useNavigate();

  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [error, setError] = useState<string | null>(null);

  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState<EditableUserData>({
    username: "",
    email: "",
    password: "",
  });

  // Load users
  useEffect(() => {
    (async () => {
      setLoading(true);
      try {
        const data = await userService.getAll();
        setUsers(Array.isArray(data) ? data : []);
      } catch (e) {
        console.error(e);
        setError(FETCH_USERS_EXCEPTION);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  // Filtered list
  const filteredUsers = useMemo(
    () =>
      users.filter((u) =>
        [u.username, u.email, u.role]
          .some((f) => f.toLowerCase().includes(searchQuery.toLowerCase()))
      ),
    [users, searchQuery]
  );

  const handleSearch = (e: ChangeEvent<HTMLInputElement>) =>
    setSearchQuery(e.target.value);
  const clearSearch = () => setSearchQuery("");
  const goAddAdmin = () => navigate("/admin/add-admin");

  const handleRowClick = (user: User) => {
    setError(null);
    setSelectedUser(user);
    setEditData({
      username: user.username,
      email: user.email,
      password: "",
    });
    setIsEditing(false);
  };

  const handleEditChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setEditData((prev) => ({ ...prev, [name]: value }));
    setError(null);
  };

  const saveUser = async () => {
    if (!selectedUser) return;
    setError(null);
    try {
      const updated = await userService.update(selectedUser.id, editData);
      setUsers((prev) =>
        prev.map((u) => (u.id === updated.id ? updated : u))
      );
      setSelectedUser(updated);
      setIsEditing(false);
    } catch (e) {
      console.error(e);
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

  const handleClose = () => setSelectedUser(null);

  // Table columns
  const columns: Column<User>[] = useMemo(
    () => [
      { header: "ID", accessor: "id" },
      { header: "Username", accessor: "username" },
      { header: "Email", accessor: "email" },
      { header: "Role", accessor: "role" },
      {
        header: "Actions",
        accessor: (u) => (
          <CommonButton
            size="sm"
            variant="primary"
            leftIcon={<Edit3 />}
            label={USER_EDIT_BUTTON_LABEL}
            onClick={() => handleRowClick(u)}
          />
        ),
      },
    ],
    []
  );

  return (
    <div className="min-h-screen flex bg-gray-900 text-white">
      <Sidebar />
      <div className="ml-64 flex-1 flex flex-col">
        <Navbar />

        <main className="p-6 space-y-8">
          {/* Header */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center">
            <h1 className="text-3xl font-bold">{USER_MANAGEMENT_HEADING}</h1>
            <div className="flex items-center mt-4 sm:mt-0 space-x-2">
              <div className="relative">
                <Search className="absolute inset-y-0 left-0 pl-3 h-11 w-7 text-gray-400" />
                <input
                  type="text"
                  placeholder={SEARCH_PLACEHOLDER}
                  value={searchQuery}
                  onChange={handleSearch}
                  className="pl-10 pr-3 py-2 bg-gray-800 border border-indigo-500 rounded-l-md focus:outline-none focus:ring focus:ring-indigo-500 text-white"
                />
              </div>
              {searchQuery && (
                <CommonButton
                  size="sm"
                  variant="secondary"
                  icon={<X />}
                  label="Clear search"
                  onClick={clearSearch}
                />
              )}
              <CommonButton
                size="md"
                variant="primary"
                leftIcon={<Plus />}
                label={ADD_ADMIN_BUTTON_LABEL}
                onClick={goAddAdmin}
              />
            </div>
          </div>

          {/* Error */}
          {error && (
            <div className="p-4 bg-red-600 rounded text-white">
              {error}
            </div>
          )}

          {/* User Table */}
          <div className="bg-gray-800 rounded-lg shadow overflow-auto">
            <CommonTable
              columns={columns}
              data={filteredUsers}
              loading={loading}
              initialSortColumn="username"
              initialSortDirection="asc"
            />
          </div>

          {/* Slide-over detail / edit */}
          {selectedUser && (
            <div className="fixed inset-0 flex z-50">
              {/* backdrop */}
              <button
                className="absolute inset-0 bg-black bg-opacity-70"
                onClick={handleClose}
                aria-label="Close user details"
              />

              <aside className="relative ml-auto w-full max-w-md h-full bg-gray-800 p-6 shadow-xl">
                {/* Title & Close */}
                <h2 className="text-2xl font-semibold mb-4">User Details</h2>
                <button
                  onClick={handleClose}
                  aria-label="Close"
                  className="absolute top-4 right-4 p-2 bg-gray-700 rounded-full hover:bg-gray-600 focus:outline-none focus:ring focus:ring-indigo-500"
                >
                  <X className="h-5 w-5 text-gray-300" />
                </button>

                {/* Fields */}
                <div className="space-y-4">
                  {[
                    { label: "Username", name: "username" },
                    { label: "Email",    name: "email" },
                    { label: "Password", name: "password" },
                  ].map((field) => (
                    <div key={field.name}>
                      <label
                        htmlFor={field.name}
                        className="block text-sm font-medium text-gray-200 mb-1"
                      >
                        {field.label}
                      </label>
                      {isEditing ? (
                        <input
                          id={field.name}
                          name={field.name}
                          type={field.name === "password" ? "password" : "text"}
                          value={
                            editData[field.name as keyof EditableUserData]
                          }
                          onChange={handleEditChange}
                          className="w-full px-3 py-2 bg-gray-700 border border-indigo-500 rounded focus:outline-none focus:ring focus:ring-indigo-500 text-white"
                        />
                      ) : (
                        <p className="text-gray-300">
                          {field.name === "password"
                            ? "••••••"
                            : selectedUser[field.name as keyof User]}
                        </p>
                      )}
                    </div>
                  ))}

                  {/* Role (read-only) */}
                  <div>
                    <label 
                      htmlFor="user-role" 
                      className="block text-sm font-medium text-gray-200 mb-1"
                    >
                      Role
                    </label>
                    <p id="user-role" className="text-gray-300">{selectedUser.role}</p>
                  </div>
                </div>

                {/* Actions */}
                <div className="mt-6 flex justify-end space-x-2">
                  {isEditing ? (
                    <>
                      <CommonButton
                        size="sm"
                        variant="primary"
                        label={USER_SAVE_BUTTON_LABEL}
                        onClick={saveUser}
                      />
                      <CommonButton
                        size="sm"
                        variant="secondary"
                        label={USER_CANCEL_BUTTON_LABEL}
                        onClick={cancelEdit}
                      />
                    </>
                  ) : (
                    <CommonButton
                      size="sm"
                      variant="primary"
                      leftIcon={<Edit3 />}
                      label={USER_EDIT_BUTTON_LABEL}
                      onClick={() => setIsEditing(true)}
                    />
                  )}
                  <CommonButton
                    size="sm"
                    variant="secondary"
                    label={USER_CLOSE_BUTTON_LABEL}
                    onClick={handleClose}
                  />
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

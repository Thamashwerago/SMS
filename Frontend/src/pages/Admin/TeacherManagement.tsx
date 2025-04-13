import React, { useState, useEffect, useMemo, ChangeEvent } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../../components/common/Sidebar";
import Navbar from "../../components/common/Navbar";
import CommonTable, { Column } from "../../components/common/Table";
import CommonButton from "../../components/common/Button";
import teacherService from "../../components/services/teacherService";
import {
  TEACHER_MANAGEMENT_HEADING,
  TEACHER_SEARCH_PLACEHOLDER,
  TEACHER_ADD_BUTTON_LABEL,
  TEACHER_EDIT_BUTTON_LABEL,
  TEACHER_DELETE_BUTTON_LABEL,
  TEACHER_SAVE_BUTTON_LABEL,
  TEACHER_CANCEL_BUTTON_LABEL,
  TEACHER_CLOSE_BUTTON_LABEL,
} from "../../constants/admin/teacherManagementStrings";
import {
  FETCH_TEACHERS_EXCEPTION,
  UPDATE_TEACHER_EXCEPTION,
  DELETE_TEACHER_EXCEPTION,
} from "../../constants/exceptionMessages";

/**
 * Teacher interface represents the teacher data model.
 */
interface Teacher {
  id: number;
  userId: number;
  name: string;
  phone: string;
  dob: string;
  gender: string;
  address: string;
  joiningDate: string;
  role: string;
}

/**
 * TeacherManagement Component
 * -----------------------------
 * This component fetches teacher data from the backend using teacherService,
 * and displays the data in a searchable, sortable table using the reusable CommonTable component.
 * It also allows for editing and deleting teacher records, using CommonButton components
 * for actions. Exception handling is applied for each operation.
 */
const TeacherManagement: React.FC = () => {
  const navigate = useNavigate();

  // State for teacher data fetched from backend.
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  // State for search query.
  const [searchQuery, setSearchQuery] = useState("");
  // States for editing: selected teacher, editing mode, and edit data.
  const [selectedTeacher, setSelectedTeacher] = useState<Teacher | null>(null);
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [editData, setEditData] = useState<{
    name: string;
    phone: string;
    address: string;
  }>({
    name: "",
    phone: "",
    address: "",
  });
  // State for error and success messages.
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  /**
   * fetchTeachers
   * --------------
   * Retrieves teacher data from the backend using teacherService.
   * In case of an exception, displays a specific error message.
   */
  const fetchTeachers = async () => {
    try {
      const data = await teacherService.getAll();
      setTeachers(data);
    } catch (err) {
      console.error("Error fetching teachers:", err);
      setError(FETCH_TEACHERS_EXCEPTION);
    }
  };

  // Fetch teacher data when component mounts.
  useEffect(() => {
    fetchTeachers();
  }, []);

  /**
   * handleSearchChange
   * ------------------
   * Updates the search query state as the user types.
   * @param e - Input change event.
   */
  const handleSearchChange = (e: ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  /**
   * filteredTeachers
   * ----------------
   * Computes a filtered list of teachers based on the search query.
   */
  const filteredTeachers = useMemo(() => {
    return teachers.filter(
      (teacher) =>
        teacher.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        teacher.phone.toLowerCase().includes(searchQuery.toLowerCase()) ||
        teacher.role.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [teachers, searchQuery]);

  /**
   * columns
   * -------
   * Defines the columns for the CommonTable component.
   */
  const columns: Column<Teacher>[] = useMemo(
    () => [
      { header: "Teacher ID", accessor: "id" },
      { header: "Name", accessor: "name" },
      { header: "Phone", accessor: "phone" },
      { header: "Role", accessor: "role" },
      {
        header: "Actions",
        accessor: (row: Teacher) => (
          <div className="flex space-x-2">
            <CommonButton
              label={TEACHER_EDIT_BUTTON_LABEL}
              onClick={() => handleRowClick(row)}
              className="bg-blue-600 hover:bg-blue-700"
            />
            <CommonButton
              label={TEACHER_DELETE_BUTTON_LABEL}
              onClick={() => handleDelete(row.id)}
              className="bg-red-600 hover:bg-red-700"
            />
          </div>
        ),
      },
    ],
    []
  );

  /**
   * handleRowClick
   * --------------
   * Opens the modal for editing teacher details and initializes the editData state.
   * @param teacher - The selected teacher.
   */
  const handleRowClick = (teacher: Teacher) => {
    setSelectedTeacher(teacher);
    setEditData({
      name: teacher.name,
      phone: teacher.phone,
      address: teacher.address,
    });
    setIsEditing(false);
  };

  /**
   * handleEditChange
   * ----------------
   * Updates the editData state when inputs change in the modal.
   * @param e - Input change event.
   */
  const handleEditChange = (e: ChangeEvent<HTMLInputElement>) => {
    setEditData({ ...editData, [e.target.name]: e.target.value });
  };

  /**
   * handleEditClick
   * ---------------
   * Enables editing mode for the teacher details modal.
   */
  const handleEditClick = () => {
    setIsEditing(true);
  };

  /**
   * handleSave
   * ----------
   * Saves the updated teacher details using teacherService.update.
   * On success, displays a success message and refreshes the teacher list.
   */
  const handleSave = async () => {
    if (selectedTeacher) {
      try {
        await teacherService.update(selectedTeacher.id, {
          name: editData.name,
          phone: editData.phone,
          address: editData.address,
        });
        setSuccess("Teacher updated successfully.");
        setSelectedTeacher(null);
        fetchTeachers();
      } catch (err) {
        console.error("Error updating teacher:", err);
        setError(UPDATE_TEACHER_EXCEPTION);
      }
    }
  };

  /**
   * handleDelete
   * ------------
   * Deletes a teacher record using teacherService.delete.
   * On success, displays a success message and refreshes the teacher list.
   * @param id - The teacher's ID.
   */
  const handleDelete = async (id: number) => {
    try {
      await teacherService.delete(id);
      setSuccess("Teacher deleted successfully.");
      fetchTeachers();
    } catch (err) {
      console.error("Error deleting teacher:", err);
      setError(DELETE_TEACHER_EXCEPTION);
    }
  };

  /**
   * handleCancelEdit
   * ----------------
   * Cancels editing mode and resets the editData state to the selected teacher's current data.
   */
  const handleCancelEdit = () => {
    if (selectedTeacher) {
      setEditData({
        name: selectedTeacher.name,
        phone: selectedTeacher.phone,
        address: selectedTeacher.address,
      });
    }
    setIsEditing(false);
  };

  /**
   * handleClose
   * -----------
   * Closes the teacher details modal.
   */
  const handleClose = () => {
    setSelectedTeacher(null);
  };

  return (
    <div className="min-h-screen flex font-roboto bg-gradient-to-br from-gray-900 to-black">
      {/* Sidebar Navigation */}
      <Sidebar />
      <div className="flex-1 flex flex-col">
        {/* Top Navbar */}
        <Navbar />
        <main className="p-8">
          {/* Header Section: Title, Search, and Add Teacher Button */}
          <div className="flex flex-col sm:flex-row items-center justify-between mb-8">
            <h1 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500">
              {TEACHER_MANAGEMENT_HEADING}
            </h1>
            <div className="flex items-center mt-4 sm:mt-0">
              <input
                type="text"
                placeholder={TEACHER_SEARCH_PLACEHOLDER}
                value={searchQuery}
                onChange={handleSearchChange}
                className="px-4 py-2 bg-black bg-opacity-50 border border-indigo-500 rounded-l-xl focus:outline-none text-white placeholder-gray-400"
              />
              <CommonButton
                label={TEACHER_ADD_BUTTON_LABEL}
                onClick={() => navigate("/admin/add-teacher")}
                className="rounded-r-xl bg-indigo-600 hover:bg-indigo-700"
              />
            </div>
          </div>

          {/* Display error message if exists */}
          {error && (
            <div className="mb-4 p-4 bg-red-500 bg-opacity-50 border border-red-700 rounded-xl text-white">
              {error}
            </div>
          )}

          {/* Display success message if exists */}
          {success && (
            <div className="mb-4 p-4 bg-green-500 bg-opacity-50 border border-green-700 rounded-xl text-white">
              {success}
            </div>
          )}

          {/* Teacher Data Table using CommonTable component */}
          <CommonTable
            columns={columns}
            data={filteredTeachers}
            initialSortColumn="name"
            initialSortDirection="asc"
            onRowClick={handleRowClick}
          />

          {/* Teacher Details Modal */}
          {selectedTeacher && (
            <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-70 z-50">
              <div className="bg-gray-800 p-8 rounded-xl border border-indigo-500 shadow-xl max-w-lg w-full mx-4 animate-fadeIn max-h-[80vh] overflow-y-auto">
                <h2 className="text-2xl font-bold text-white mb-4">
                  Teacher Details
                </h2>
                <div className="space-y-4">
                  <div>
                    <span className="block text-white text-lg font-semibold">
                      Teacher ID:
                    </span>
                    <p className="text-gray-300">{selectedTeacher.id}</p>
                  </div>
                  <div>
                    <span className="block text-white text-lg font-semibold">
                      User ID:
                    </span>
                    <p className="text-gray-300">{selectedTeacher.userId}</p>
                  </div>
                  <div>
                    <span className="block text-white text-lg font-semibold">
                      Name:
                    </span>
                    {isEditing ? (
                      <input
                        type="text"
                        name="name"
                        value={editData.name}
                        onChange={handleEditChange}
                        placeholder="Enter teacher name"
                        className="w-full px-4 py-2 bg-black bg-opacity-50 border border-indigo-500 rounded-md focus:outline-none text-white"
                      />
                    ) : (
                      <p className="text-gray-300">{selectedTeacher.name}</p>
                    )}
                  </div>
                  <div>
                    <span className="block text-white text-lg font-semibold">
                      Phone:
                    </span>
                    {isEditing ? (
                      <input
                        type="text"
                        name="phone"
                        value={editData.phone}
                        onChange={handleEditChange}
                        placeholder="Enter phone number"
                        className="w-full px-4 py-2 bg-black bg-opacity-50 border border-indigo-500 rounded-md focus:outline-none text-white"
                      />
                    ) : (
                      <p className="text-gray-300">{selectedTeacher.phone}</p>
                    )}
                  </div>
                  <div>
                    <span className="block text-white text-lg font-semibold">
                      DOB:
                    </span>
                    <p className="text-gray-300">{selectedTeacher.dob}</p>
                  </div>
                  <div>
                    <span className="block text-white text-lg font-semibold">
                      Gender:
                    </span>
                    <p className="text-gray-300">{selectedTeacher.gender}</p>
                  </div>
                  <div>
                    <span className="block text-white text-lg font-semibold">
                      Address:
                    </span>
                    {isEditing ? (
                      <input
                        type="text"
                        name="address"
                        value={editData.address}
                        onChange={handleEditChange}
                        placeholder="Enter address"
                        className="w-full px-4 py-2 bg-black bg-opacity-50 border border-indigo-500 rounded-md focus:outline-none text-white"
                      />
                    ) : (
                      <p className="text-gray-300">{selectedTeacher.address}</p>
                    )}
                  </div>
                  <div>
                    <span className="block text-white text-lg font-semibold">
                      Joining Date:
                    </span>
                    <p className="text-gray-300">
                      {selectedTeacher.joiningDate}
                    </p>
                  </div>
                  <div>
                    <span className="block text-white text-lg font-semibold">
                      Role:
                    </span>
                    <p className="text-gray-300">{selectedTeacher.role}</p>
                  </div>
                </div>
                <div className="mt-6 flex justify-end space-x-4">
                  {isEditing ? (
                    <>
                      <CommonButton
                        label={TEACHER_SAVE_BUTTON_LABEL}
                        onClick={handleSave}
                        className="bg-green-600 hover:bg-green-700"
                      />
                      <CommonButton
                        label={TEACHER_CANCEL_BUTTON_LABEL}
                        onClick={handleCancelEdit}
                        className="bg-yellow-600 hover:bg-yellow-700"
                      />
                    </>
                  ) : (
                    <CommonButton
                      label={TEACHER_EDIT_BUTTON_LABEL}
                      onClick={handleEditClick}
                      className="bg-blue-600 hover:bg-blue-700"
                    />
                  )}
                  <CommonButton
                    label={TEACHER_CLOSE_BUTTON_LABEL}
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

export default TeacherManagement;

// src/pages/Admin/TeacherManagement.tsx

import React, {
  useState,
  useEffect,
  useMemo,
  ChangeEvent,
  Fragment,
} from "react";
import { useNavigate } from "react-router-dom";

// Common UI components
import Sidebar from "../../components/common/Sidebar";
import Navbar from "../../components/common/Navbar";
import CommonTable, { Column } from "../../components/common/Table";
import CommonButton from "../../components/common/Button";

// Services
import teacherService from "../../services/teacherService";

// String constants
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
 * Teacher interface represents our data model.
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
 * TeacherManagement
 * -----------------
 * Fetches, displays, and allows CRUD on teacher records.
 * - Searchable & sortable table via CommonTable
 * - In‑row Edit/Delete buttons
 * - Modal for viewing / editing a single teacher
 */
const TeacherManagement: React.FC = () => {
  const navigate = useNavigate();

  // Full list of teachers
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  // Search input
  const [searchQuery, setSearchQuery] = useState<string>("");
  // Modal & edit state
  const [selectedTeacher, setSelectedTeacher] = useState<Teacher | null>(null);
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [editData, setEditData] = useState<{
    name: string;
    phone: string;
    address: string;
  }>({ name: "", phone: "", address: "" });
  // Feedback messages
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  /** Fetch all teachers from backend */
  const fetchTeachers = async () => {
    setError(null);
    try {
      const data = await teacherService.getAll();
      // Format dates to YYYY-MM-DD
      const formatted = data.map((t) => ({
        ...t,
        dob: new Date(t.dob).toISOString().split("T")[0],
        joiningDate: new Date(t.joiningDate)
          .toISOString()
          .split("T")[0],
      }));
      setTeachers(formatted);
    } catch {
      setError(FETCH_TEACHERS_EXCEPTION);
    }
  };

  useEffect(() => {
    fetchTeachers();
  }, []);

  /** Handle search input change */
  const handleSearchChange = (e: ChangeEvent<HTMLInputElement>) =>
    setSearchQuery(e.target.value);

  /** Filter teachers by name/phone/role */
  const filteredTeachers = useMemo(
    () =>
      teachers.filter(
        (t) =>
          t.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          t.phone.toLowerCase().includes(searchQuery.toLowerCase()) ||
          t.role.toLowerCase().includes(searchQuery.toLowerCase())
      ),
    [teachers, searchQuery]
  );

  /** Table columns definition */
  const columns: Column<Teacher>[] = useMemo(
    () => [
      { header: "ID", accessor: "id" },
      { header: "Name", accessor: "name" },
      { header: "Phone", accessor: "phone" },
      { header: "Role", accessor: "role" },
      {
        header: "Actions",
        accessor: (row) => (
          <div className="flex space-x-2">
            <CommonButton
              label={TEACHER_EDIT_BUTTON_LABEL}
              onClick={() => openModal(row)}
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

  /** Open detail/edit modal */
  const openModal = (teacher: Teacher) => {
    setSelectedTeacher(teacher);
    setEditData({
      name: teacher.name,
      phone: teacher.phone,
      address: teacher.address,
    });
    setIsEditing(false);
    setError(null);
    setSuccess(null);
  };

  /** Handle inline edit field changes */
  const handleEditChange = (e: ChangeEvent<HTMLInputElement>) =>
    setEditData((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  /** Enter editing mode */
  const handleEditClick = () => setIsEditing(true);

  /** Save updated teacher */
  const handleSave = async () => {
    if (!selectedTeacher) return;
    setError(null);
    try {
      await teacherService.update(selectedTeacher.id, {
        name: editData.name,
        phone: editData.phone,
        address: editData.address,
      });
      setSuccess("Teacher updated successfully.");
      fetchTeachers();
      setSelectedTeacher(null);
    } catch {
      setError(UPDATE_TEACHER_EXCEPTION);
    }
  };

  /** Delete teacher record */
  const handleDelete = async (id: number) => {
    setError(null);
    try {
      await teacherService.delete(id);
      setSuccess("Teacher deleted successfully.");
      fetchTeachers();
    } catch {
      setError(DELETE_TEACHER_EXCEPTION);
    }
  };

  /** Cancel edits */
  const handleCancelEdit = () => {
    if (!selectedTeacher) return;
    setEditData({
      name: selectedTeacher.name,
      phone: selectedTeacher.phone,
      address: selectedTeacher.address,
    });
    setIsEditing(false);
  };

  /** Close modal */
  const handleClose = () => setSelectedTeacher(null);

  return (
    <div className="min-h-screen flex font-roboto bg-gradient-to-br from-gray-900 to-black">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <Navbar />
        <main className="p-8 space-y-6">

          {/* Header: Title, Search & Add */}
          <div className="flex flex-col sm:flex-row justify-between items-center mb-6 space-y-4 sm:space-y-0">
            <h1 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500">
              {TEACHER_MANAGEMENT_HEADING}
            </h1>
            <div className="flex">
              <input
                type="text"
                placeholder={TEACHER_SEARCH_PLACEHOLDER}
                value={searchQuery}
                onChange={handleSearchChange}
                className="px-4 py-2 bg-black bg-opacity-50 border border-indigo-500 rounded-l-xl text-white placeholder-gray-400 focus:outline-none"
              />
              <CommonButton
                label={TEACHER_ADD_BUTTON_LABEL}
                onClick={() => navigate("/admin/add-teacher")}
                className="rounded-r-xl bg-indigo-600 hover:bg-indigo-700"
              />
            </div>
          </div>

          {/* Error & Success Alerts */}
          {error && (
            <div className="p-3 bg-red-600 text-white rounded-md">
              {error}
            </div>
          )}
          {success && (
            <div className="p-3 bg-green-600 text-white rounded-md">
              {success}
            </div>
          )}

          {/* Teachers Table */}
          <CommonTable
            columns={columns}
            data={filteredTeachers}
            initialSortColumn="name"
            initialSortDirection="asc"
            onRowClick={openModal}
          />

          {/* Detail/Edit Modal */}
          {selectedTeacher && (
            <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-70 z-50">
              <div className="bg-gray-800 p-6 rounded-xl shadow-xl max-w-lg w-full space-y-4">
                <h2 className="text-2xl font-bold text-white">Teacher Details</h2>

                {/* ID & UserID (read-only) */}
                <div>
                  <span className="text-gray-300 font-semibold">ID:</span>
                  <p className="text-white">{selectedTeacher.id}</p>
                </div>
                <div>
                  <span className="text-gray-300 font-semibold">User ID:</span>
                  <p className="text-white">{selectedTeacher.userId}</p>
                </div>

                {/* Name */}
                <div>
                  <label htmlFor="teacherName" className="text-gray-300 font-semibold">Name:</label>
                  {isEditing ? (
                    <input
                      id="teacherName"
                      name="name"
                      value={editData.name}
                      onChange={handleEditChange}
                      className="w-full px-3 py-2 bg-black bg-opacity-50 border border-indigo-500 rounded text-white focus:outline-none"
                      aria-label="Teacher Name"
                      placeholder="Enter teacher name"
                    />
                  ) : (
                    <p className="text-white">{selectedTeacher.name}</p>
                  )}
                </div>
                <div>
                  <label htmlFor="teacherPhone" className="text-gray-300 font-semibold">Phone:</label>
                  {isEditing ? (
                    <input
                      id="teacherPhone"
                      name="phone"
                      value={editData.phone}
                      onChange={handleEditChange}
                      className="w-full px-3 py-2 bg-black bg-opacity-50 border border-indigo-500 rounded text-white focus:outline-none"
                      aria-label="Teacher Phone"
                      placeholder="Enter phone number"
                    />
                  ) : (
                    <p className="text-white">{selectedTeacher.phone}</p>
                  )}
                </div>

                {/* DOB & Gender & Joining Date & Role (read-only) */}
                <div>
                  <span className="text-gray-300 font-semibold">DOB:</span>
                  <p className="text-white">{selectedTeacher.dob}</p>
                </div>
                <div>
                  <span className="text-gray-300 font-semibold">Gender:</span>
                  <p className="text-white">{selectedTeacher.gender}</p>
                </div>
                <div>
                  <span className="text-gray-300 font-semibold">Joining Date:</span>
                  <p className="text-white">{selectedTeacher.joiningDate}</p>
                </div>
                <div>
                  <label htmlFor="teacherAddress" className="text-gray-300 font-semibold">Address:</label>
                  {isEditing ? (
                    <input
                      id="teacherAddress"
                      name="address"
                      value={editData.address}
                      onChange={handleEditChange}
                      className="w-full px-3 py-2 bg-black bg-opacity-50 border border-indigo-500 rounded text-white focus:outline-none"
                      aria-label="Teacher Address"
                      placeholder="Enter address"
                    />
                  ) : (
                    <p className="text-white">{selectedTeacher.address}</p>
                  )}
                </div>
                <div className="flex justify-end space-x-3 mt-4">
                  {isEditing ? (
                    <Fragment>
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
                    </Fragment>
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

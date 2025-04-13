import React, { useState, useEffect, useMemo, ChangeEvent } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../../components/common/Sidebar";
import Navbar from "../../components/common/Navbar";
import CommonTable, { Column } from "../../components/common/Table";
import CommonButton from "../../components/common/Button";
import studentService from "../../components/services/studentService";
import {
  STUDENT_MANAGEMENT_HEADING,
  STUDENT_SEARCH_PLACEHOLDER,
  STUDENT_EDIT_BUTTON_LABEL,
  STUDENT_DELETE_BUTTON_LABEL,
  STUDENT_SAVE_BUTTON_LABEL,
  STUDENT_CANCEL_BUTTON_LABEL,
  STUDENT_CLOSE_BUTTON_LABEL,
  STUDENT_ADD_BUTTON_LABEL,
} from "../../constants/admin/studentManagementStrings";
import {
  FETCH_STUDENTS_EXCEPTION,
  UPDATE_STUDENT_EXCEPTION,
  DELETE_STUDENT_EXCEPTION,
} from "../../constants/exceptionMessages";

/**
 * Student interface represents a student's data.
 */
interface Student {
  id: number;
  userId: number;
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  gender: string;
  address: string;
  contactNumber: string;
  nationality: string;
}

/**
 * StudentManagement Component
 * -----------------------------
 * Manages the student data by retrieving it from the backend,
 * providing a searchable, sortable table, and allowing updates and deletion.
 *
 * Utilizes the CommonTable and CommonButton reusable components.
 */
const StudentManagement: React.FC = () => {
  const navigate = useNavigate();

  // State for storing student data fetched from backend.
  const [students, setStudents] = useState<Student[]>([]);
  // State for storing search query.
  const [searchQuery, setSearchQuery] = useState("");
  // States for editing a selected student's information.
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [editData, setEditData] = useState<{
    firstName: string;
    lastName: string;
    contactNumber: string;
  }>({
    firstName: "",
    lastName: "",
    contactNumber: "",
  });
  // State for error messages.
  const [error, setError] = useState<string | null>(null);
  // State for success messages.
  const [success, setSuccess] = useState<string | null>(null);

  /**
   * fetchStudents
   * -------------
   * Retrieves student data from the backend using studentService.
   * In case of error, sets an error message.
   */
  const fetchStudents = async () => {
    try {
      const data = await studentService.getAll();
      // Map the service's Student type to match our component's Student interface
      const mappedStudents: Student[] = data.map((student) => ({
        id: student.id,
        userId: student.userId,
        firstName: student.firstName,
        lastName: student.lastName,
        dateOfBirth: student.dateOfBirth,
        gender: student.gender,
        address: student.address,
        contactNumber: student.contactNumber,
        nationality: student.nationality,
      }));
      setStudents(mappedStudents);
    } catch (err) {
      console.error("Error fetching students:", err);
      setError(FETCH_STUDENTS_EXCEPTION);
    }
  };

  // Fetch student data when the component mounts.
  useEffect(() => {
    fetchStudents();
  }, []);

  /**
   * handleSearchChange
   * ------------------
   * Updates the search query state as the user types.
   */
  const handleSearchChange = (e: ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  /**
   * filteredStudents
   * ----------------
   * Computes a filtered list of students based on the search query.
   */
  const filteredStudents = useMemo(() => {
    return students.filter(
      (student) =>
        student.firstName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        student.lastName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        student.gender.toLowerCase().includes(searchQuery.toLowerCase()) ||
        student.nationality.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [students, searchQuery]);

  /**
   * StudentActions Component
   * ------------------------
   * Represents the action buttons for each student row.
   */
  interface StudentActionsProps {
    student: Student;
    onEdit: (student: Student) => void;
    onDelete: (id: number) => void;
  }

  const StudentActions: React.FC<StudentActionsProps> = ({
    student,
    onEdit,
    onDelete,
  }) => (
    <div className="flex space-x-2">
      <CommonButton
        label={STUDENT_EDIT_BUTTON_LABEL}
        onClick={() => onEdit(student)}
        className="bg-blue-600 hover:bg-blue-700"
      />
      <CommonButton
        label={STUDENT_DELETE_BUTTON_LABEL}
        onClick={() => onDelete(student.id)}
        className="bg-red-600 hover:bg-red-700"
      />
    </div>
  );

  /**
   * columns
   * -------
   * Defines the columns for the CommonTable component.
   */
  const columns: Column<Student>[] = useMemo(
    () => [
      { header: "Student ID", accessor: "id" },
      {
        header: "Full Name",
        accessor: (row: Student) => `${row.firstName} ${row.lastName}`,
      },
      { header: "Gender", accessor: "gender" },
      { header: "Nationality", accessor: "nationality" },
      {
        header: "Actions",
        accessor: (row: Student) => (
          <StudentActions
            student={row}
            onEdit={handleRowClick}
            onDelete={handleDelete}
          />
        ),
      },
    ],
    []
  );

  /**
   * handleRowClick
   * --------------
   * Opens the modal for editing a student's details.
   * @param student - The student selected for editing.
   */
  const handleRowClick = (student: Student) => {
    setSelectedStudent(student);
    setEditData({
      firstName: student.firstName,
      lastName: student.lastName,
      contactNumber: student.contactNumber,
    });
    setIsEditing(false);
  };

  /**
   * handleEditChange
   * ----------------
   * Updates the editData state as the user types in the edit form.
   */
  const handleEditChange = (e: ChangeEvent<HTMLInputElement>) => {
    setEditData({ ...editData, [e.target.name]: e.target.value });
  };

  /**
   * handleEditClick
   * ---------------
   * Enables the editing mode for the student details modal.
   */
  const handleEditClick = () => {
    setIsEditing(true);
  };

  /**
   * handleSave
   * ----------
   * Saves the edited student details using studentService.update.
   * On success, refreshes the student data.
   */
  const handleSave = async () => {
    if (selectedStudent) {
      try {
        await studentService.update(selectedStudent.id, {
          firstName: editData.firstName,
          lastName: editData.lastName,
          contactNumber: editData.contactNumber,
        });
        setSuccess("Student updated successfully.");
        setSelectedStudent(null);
        fetchStudents();
      } catch (err) {
        console.error("Error updating student:", err);
        setError(UPDATE_STUDENT_EXCEPTION);
      }
    }
  };

  /**
   * handleDelete
   * ------------
   * Deletes a student using studentService.delete and refreshes the list.
   * @param id - The student's ID.
   */
  const handleDelete = async (id: number) => {
    try {
      await studentService.delete(id);
      setSuccess("Student deleted successfully.");
      fetchStudents();
    } catch (err) {
      console.error("Error deleting student:", err);
      setError(DELETE_STUDENT_EXCEPTION);
    }
  };

  /**
   * handleCancelEdit
   * ----------------
   * Cancels the editing process and resets the editData state.
   */
  const handleCancelEdit = () => {
    setIsEditing(false);
    if (selectedStudent) {
      setEditData({
        firstName: selectedStudent.firstName,
        lastName: selectedStudent.lastName,
        contactNumber: selectedStudent.contactNumber,
      });
    }
  };

  /**
   * handleClose
   * -----------
   * Closes the student details modal.
   */
  const handleClose = () => {
    setSelectedStudent(null);
  };

  return (
    <div className="min-h-screen flex font-roboto bg-gradient-to-br from-gray-900 to-black">
      {/* Sidebar Component */}
      <Sidebar />
      <div className="flex-1 flex flex-col">
        {/* Navbar Component */}
        <Navbar />
        <main className="p-8">
          {/* Header Section with Search and Add Student Button */}
          <div className="flex flex-col sm:flex-row items-center justify-between mb-8">
            <h1 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500">
              {STUDENT_MANAGEMENT_HEADING}
            </h1>
            <div className="flex items-center mt-4 sm:mt-0">
              <input
                type="text"
                placeholder={STUDENT_SEARCH_PLACEHOLDER}
                value={searchQuery}
                onChange={handleSearchChange}
                className="px-4 py-2 bg-black bg-opacity-50 border border-indigo-500 rounded-l-xl focus:outline-none text-white placeholder-gray-400"
              />
              <CommonButton
                label={STUDENT_ADD_BUTTON_LABEL}
                onClick={() => navigate("/admin/add-student")}
                className="rounded-r-xl bg-indigo-600 hover:bg-indigo-700"
              />
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-4 p-4 bg-red-500 bg-opacity-50 border border-red-700 rounded-xl text-white">
              {error}
            </div>
          )}

          {/* Success Message */}
          {success && (
            <div className="mb-4 p-4 bg-green-500 bg-opacity-50 border border-green-700 rounded-xl text-white">
              {success}
            </div>
          )}

          {/* Students Table rendered with the CommonTable component */}
          <CommonTable
            columns={columns}
            data={filteredStudents}
            initialSortColumn="firstName"
            initialSortDirection="asc"
            onRowClick={handleRowClick}
          />

          {/* Student Details Modal */}
          {selectedStudent && (
            <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-70 z-50">
              <div className="bg-gray-800 p-8 rounded-xl border border-indigo-500 shadow-xl max-w-lg w-full mx-4 animate-fadeIn max-h-[80vh] overflow-y-auto">
                <h2 className="text-2xl font-bold text-white mb-4">
                  Student Details
                </h2>
                <div className="space-y-4">
                  <div>
                    <span className="block text-white text-lg font-semibold">
                      Student ID:
                    </span>
                    <p className="text-gray-300">{selectedStudent.id}</p>
                  </div>
                  <div>
                    <span className="block text-white text-lg font-semibold">
                      User ID:
                    </span>
                    <p className="text-gray-300">{selectedStudent.userId}</p>
                  </div>
                  <div>
                    <span className="block text-white text-lg font-semibold">
                      First Name:
                    </span>
                    {isEditing ? (
                      <input
                        type="text"
                        name="firstName"
                        value={editData.firstName}
                        onChange={handleEditChange}
                        placeholder="Enter first name"
                        className="w-full px-4 py-2 bg-black bg-opacity-50 border border-indigo-500 rounded-md focus:outline-none text-white"
                      />
                    ) : (
                      <p className="text-gray-300">
                        {selectedStudent.firstName}
                      </p>
                    )}
                  </div>
                  <div>
                    <span className="block text-white text-lg font-semibold">
                      Last Name:
                    </span>
                    {isEditing ? (
                      <input
                        type="text"
                        name="lastName"
                        value={editData.lastName}
                        onChange={handleEditChange}
                        placeholder="Enter last name"
                        className="w-full px-4 py-2 bg-black bg-opacity-50 border border-indigo-500 rounded-md focus:outline-none text-white"
                      />
                    ) : (
                      <p className="text-gray-300">
                        {selectedStudent.lastName}
                      </p>
                    )}
                  </div>
                  <div>
                    <span className="block text-white text-lg font-semibold">
                      Contact Number:
                    </span>
                    {isEditing ? (
                      <input
                        type="text"
                        name="contactNumber"
                        value={editData.contactNumber}
                        onChange={handleEditChange}
                        placeholder="Enter contact number"
                        className="w-full px-4 py-2 bg-black bg-opacity-50 border border-indigo-500 rounded-md focus:outline-none text-white"
                      />
                    ) : (
                      <p className="text-gray-300">
                        {selectedStudent.contactNumber}
                      </p>
                    )}
                  </div>
                  <div>
                    <span className="block text-white text-lg font-semibold">
                      Nationality:
                    </span>
                    <p className="text-gray-300">
                      {selectedStudent.nationality}
                    </p>
                  </div>
                </div>
                <div className="mt-6 flex justify-end space-x-4">
                  {isEditing ? (
                    <>
                      <CommonButton
                        label={STUDENT_SAVE_BUTTON_LABEL}
                        onClick={handleSave}
                        className="bg-green-600 hover:bg-green-700"
                      />
                      <CommonButton
                        label={STUDENT_CANCEL_BUTTON_LABEL}
                        onClick={handleCancelEdit}
                        className="bg-yellow-600 hover:bg-yellow-700"
                      />
                    </>
                  ) : (
                    <CommonButton
                      label={STUDENT_EDIT_BUTTON_LABEL}
                      onClick={handleEditClick}
                      className="bg-blue-600 hover:bg-blue-700"
                    />
                  )}
                  <CommonButton
                    label={STUDENT_CLOSE_BUTTON_LABEL}
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

export default StudentManagement;

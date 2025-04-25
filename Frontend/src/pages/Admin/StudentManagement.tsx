import React, { useState, useEffect, useMemo, ChangeEvent } from "react";
import { useNavigate } from "react-router-dom";
import { Plus, Search, X, Edit3, Trash2 } from "lucide-react";
import Sidebar from "../../components/common/Sidebar";
import Navbar from "../../components/common/Navbar";
import CommonTable, { Column } from "../../components/common/Table";
import CommonButton from "../../components/common/Button";
import studentService from "../../services/studentService";
import {
  STUDENT_MANAGEMENT_HEADING,
  STUDENT_SEARCH_PLACEHOLDER,
  STUDENT_EDIT_BUTTON_LABEL,
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

interface StudentActionsProps {
  student: Student;
  onEdit: (student: Student) => void;
  onDelete: (id: number) => void;
}

const StudentActions: React.FC<StudentActionsProps> = ({ student, onEdit, onDelete }) => {
  return (
    <div className="flex space-x-2">
      <CommonButton 
        size="sm" 
        variant="primary" 
        leftIcon={<Edit3 />} 
        label="Edit" 
        onClick={() => onEdit(student)} 
      />
      <CommonButton 
        size="sm" 
        variant="danger" 
        leftIcon={<Trash2 />} 
        label="Delete" 
        onClick={() => onDelete(student.id)} 
      />
    </div>
  );
};

const StudentManagement: React.FC = () => {
  const navigate = useNavigate();
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState({ firstName: "", lastName: "", contactNumber: "" });
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // Fetch students
  useEffect(() => {
    (async () => {
      setLoading(true);
      try {
        const resp = await studentService.getAll();
        setStudents(Array.isArray(resp) ? resp : []);
      } catch (err) {
        console.error(err);
        setError(FETCH_STUDENTS_EXCEPTION);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  // Filter by search
  const filteredStudents = useMemo(
    () =>
      students.filter((s) =>
        [s.firstName, s.lastName, s.gender, s.nationality]
          .some((field) => field.toLowerCase().includes(searchQuery.toLowerCase()))
      ),
    [students, searchQuery]
  );

  const handleSearch = (e: ChangeEvent<HTMLInputElement>) => setSearchQuery(e.target.value);
  const clearSearch = () => setSearchQuery("");
  const goAdd = () => navigate('/admin/add-student');

  const handleRowClick = (student: Student) => {
    setError(null);
    setSuccess(null);
    setSelectedStudent(student);
    setEditData(student);
    setIsEditing(false);
  };

  const handleEditChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setEditData(prev => ({ ...prev, [name]: value }));
  };

  const handleEditClick = () => setIsEditing(true);

  const handleSave = async () => {
    if (!selectedStudent) return;
    setError(null);
    try {
      await studentService.update(selectedStudent.id, editData);
      setSuccess('Updated successfully');
      setSelectedStudent(null);
      const refreshed = await studentService.getAll();
      setStudents(Array.isArray(refreshed) ? refreshed : []);
    } catch (err) {
      console.error(err);
      setError(UPDATE_STUDENT_EXCEPTION);
    }
  };

  const handleDelete = async (id: number) => {
    setError(null);
    try {
      await studentService.delete(id);
      setSuccess('Deleted successfully');
      const refreshed = await studentService.getAll();
      setStudents(Array.isArray(refreshed) ? refreshed : []);
    } catch (err) {
      console.error(err);
      setError(DELETE_STUDENT_EXCEPTION);
    }
  };

  const handleCancelEdit = () => {
    if (selectedStudent) {
      setEditData({ firstName: selectedStudent.firstName, lastName: selectedStudent.lastName, contactNumber: selectedStudent.contactNumber });
    }
    setIsEditing(false);
    setError(null);
  };

  const handleClose = () => setSelectedStudent(null);

  // define which Student fields are editable so we can index them with proper types
  const editableFields = ['firstName', 'lastName', 'contactNumber'] as const;

  const columns: Column<Student>[] = useMemo(() => [
    { header: 'ID', accessor: 'id' },
    { header: 'Name', accessor: row => `${row.firstName} ${row.lastName}` },
    { header: 'Gender', accessor: 'gender' },
    { header: 'Nationality', accessor: 'nationality' },
    { header: 'Actions', accessor: row => (
        <StudentActions 
          student={row} 
          onEdit={handleRowClick} 
          onDelete={handleDelete} 
        />
      )
    }
  ], []);

  return (
    <div className="min-h-screen flex bg-gradient-to-br from-gray-900 to-black text-white">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <Navbar />
        <main className="p-8 space-y-6">
          {/* Header */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center">
            <h1 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500">
              {STUDENT_MANAGEMENT_HEADING}
            </h1>
            <div className="flex items-center mt-4 sm:mt-0 space-x-2">
              <div className="relative">
                <Search className="absolute inset-y-0 left-0 pl-3 h-11 w-7 text-gray-400" />
                <input
                  type="text"
                  placeholder={STUDENT_SEARCH_PLACEHOLDER}
                  value={searchQuery}
                  onChange={handleSearch}
                  className="pl-10 pr-3 py-2 bg-gray-800 border border-indigo-500 rounded-l-md focus:outline-none focus:ring focus:ring-indigo-500"
                />
              </div>
              {searchQuery && (
                <CommonButton size="sm" variant="secondary" leftIcon={<X />} label="Clear" onClick={clearSearch} />
              )}
              <CommonButton
                size="md"
                variant="primary"
                label={STUDENT_ADD_BUTTON_LABEL}
                leftIcon={<Plus />}
                onClick={goAdd}
              />
            </div>
          </div>

          {/* Messages */}
          {(error || success) && (
            <div className={`p-4 rounded-xl text-white ${error ? 'bg-red-600' : 'bg-green-600'}`}> {error ?? success} </div>
          )}

          {/* Table Container */}
          <div className="bg-black bg-opacity-50 border border-indigo-500 rounded-lg shadow overflow-hidden">
            <CommonTable
              columns={columns}
              data={filteredStudents}
              loading={loading}
              initialSortColumn="firstName"
              initialSortDirection="asc"
            />
          </div>

          {/* Slide-over */}
          {selectedStudent && (
            <div className="fixed inset-0 flex z-50">
              <button
                className="absolute inset-0 bg-black bg-opacity-70 border-0"
                onClick={handleClose}
                aria-label="Close student details"
              />
              <aside className="relative ml-auto w-full max-w-md h-full bg-gray-800 p-6 shadow-xl transform transition-transform duration-300 ease-out">
                <button
                  onClick={handleClose}
                  aria-label="Close"
                  className="absolute top-4 right-4 p-2 bg-gray-700 rounded-full hover:bg-gray-600 focus:outline-none focus:ring focus:ring-indigo-500"
                >
                  <X className="h-5 w-5 text-gray-300" />
                </button>
                {editableFields.map((field) => (
                  <div key={field} className="mb-4">
                    <label
                      htmlFor={`edit-${field}`}
                      className="block text-sm font-semibold text-gray-200 mb-1 capitalize"
                    >
                      {field.replace(/([A-Z])/g, ' $1')}
                    </label>
                    {isEditing ? (
                      <input
                        id={`edit-${field}`}
                        name={field}
                        value={editData[field]}
                        onChange={handleEditChange}
                        placeholder={`Enter ${field.replace(/([A-Z])/g, ' $1').toLowerCase()}`}
                        aria-label={field.replace(/([A-Z])/g, ' $1')}
                        className="w-full px-3 py-2 bg-gray-700 border border-indigo-500 rounded focus:outline-none focus:ring focus:ring-indigo-500 text-white"
                      />
                    ) : (
                      <p className="text-gray-300">{selectedStudent[field]}</p>
                    )}
                  </div>
                ))}
                <div className="mb-4">
                  <label
                    htmlFor="display-nationality"
                    className="block text-sm font-semibold text-gray-200 mb-1"
                  >
                    Nationality
                  </label>
                  <p id="display-nationality" className="text-gray-300">{selectedStudent.nationality}</p>
                </div>
                <div className="mt-6 flex justify-end space-x-2">
                  {isEditing ? (
                    <>
                      <CommonButton size="sm" variant="primary" label={STUDENT_SAVE_BUTTON_LABEL} onClick={handleSave} />
                      <CommonButton size="sm" variant="secondary" label={STUDENT_CANCEL_BUTTON_LABEL} onClick={handleCancelEdit} />
                    </>
                  ) : (
                    <CommonButton size="sm" variant="primary" leftIcon={<Edit3 />} label={STUDENT_EDIT_BUTTON_LABEL} onClick={handleEditClick} />
                  )}
                  <CommonButton size="sm" variant="secondary" label={STUDENT_CLOSE_BUTTON_LABEL} onClick={handleClose} />
                </div>
              </aside>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default React.memo(StudentManagement);

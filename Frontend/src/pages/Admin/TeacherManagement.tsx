import React, { useState, useEffect, useMemo, ChangeEvent, KeyboardEvent } from "react";
import { useNavigate } from "react-router-dom";
import { Plus, Search, X, Edit3, Trash2 } from "lucide-react";
import Sidebar from "../../components/common/Sidebar";
import Navbar from "../../components/common/Navbar";
import CommonTable, { Column } from "../../components/common/Table";
import CommonButton from "../../components/common/Button";
import teacherService from "../../services/teacherService";
import {
  TEACHER_MANAGEMENT_HEADING,
  TEACHER_SEARCH_PLACEHOLDER,
  TEACHER_ADD_BUTTON_LABEL,
  TEACHER_EDIT_BUTTON_LABEL,
  TEACHER_SAVE_BUTTON_LABEL,
  TEACHER_CANCEL_BUTTON_LABEL,
  TEACHER_CLOSE_BUTTON_LABEL,
} from "../../constants/admin/teacherManagementStrings";
import {
  FETCH_TEACHERS_EXCEPTION,
  UPDATE_TEACHER_EXCEPTION,
  DELETE_TEACHER_EXCEPTION,
} from "../../constants/exceptionMessages";

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

const TeacherManagement: React.FC = () => {
  const navigate = useNavigate();
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [selectedTeacher, setSelectedTeacher] = useState<Teacher | null>(null);
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [editData, setEditData] = useState({ name: "", phone: "", address: "" });
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // Fetch teachers
  useEffect(() => {
    (async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await teacherService.getAll();
        const formatted = data.map(t => ({
          ...t,
          dob: new Date(t.dob).toISOString().split("T")[0],
          joiningDate: new Date(t.joiningDate).toISOString().split("T")[0],
        }));
        setTeachers(formatted);
      } catch (e) {
        console.error(e);
        setError(FETCH_TEACHERS_EXCEPTION);
      }
      setLoading(false);
    })();
  }, []);

  // Search handlers
  const handleSearch = (e: ChangeEvent<HTMLInputElement>) => setSearchQuery(e.target.value);
  const clearSearch = () => setSearchQuery("");

  // Filtered teachers
  const filtered = useMemo(
    () => teachers.filter(t =>
      [t.name, t.phone, t.role].some(field =>
        field.toLowerCase().includes(searchQuery.toLowerCase())
      )
    ),
    [teachers, searchQuery]
  );

  // Table columns
  const columns: Column<Teacher>[] = useMemo(
    () => [
      { header: "ID", accessor: "id" },
      { header: "Name", accessor: "name" },
      { header: "Phone", accessor: "phone" },
      { header: "Role", accessor: "role" },
      {
        header: "Actions",
        accessor: row => (
          <div className="flex space-x-2">
            <CommonButton size="sm" variant="primary" leftIcon={<Edit3 />} label={TEACHER_EDIT_BUTTON_LABEL} onClick={() => openModal(row)} />
            <CommonButton size="sm" variant="danger" leftIcon={<Trash2 />} label="Delete" onClick={() => handleDelete(row.id)} />
          </div>
        ),
      },
    ], []
  );

  // Open modal
  const openModal = (teacher: Teacher) => {
    setSelectedTeacher(teacher);
    setEditData(teacher);
    setIsEditing(false);
    setError(null);
    setSuccess(null);
  };

  // Edit data change
  const handleEditChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setEditData(prev => ({ ...prev, [name]: value }));
    setError(null);
    setSuccess(null);
  };

  const handleEditClick = () => setIsEditing(true);

  // Save update
  const handleSave = async () => {
    if (!selectedTeacher) return;
    setError(null);
    try {
      await teacherService.update(selectedTeacher.id, editData);
      setSuccess("Teacher updated successfully.");
      const updated = await teacherService.getAll();
      setTeachers(updated.map(t => ({ ...t, dob: new Date(t.dob).toISOString().split("T")[0], joiningDate: new Date(t.joiningDate).toISOString().split("T")[0] })));
      setSelectedTeacher(null);
    } catch (e) {
      console.error(e);
      setError(UPDATE_TEACHER_EXCEPTION);
    }
  };

  // Delete
  const handleDelete = async (id: number) => {
    if (!confirm("Are you sure?")) return;
    setError(null);
    try {
      await teacherService.delete(id);
      setSuccess("Teacher deleted successfully.");
      setTeachers(prev => prev.filter(t => t.id !== id));
    } catch (e) {
      console.error(e);
      setError(DELETE_TEACHER_EXCEPTION);
    }
  };

  const handleCancelEdit = () => {
    if (selectedTeacher) {
      setEditData({ name: selectedTeacher.name, phone: selectedTeacher.phone, address: selectedTeacher.address });
    }
    setIsEditing(false);
  };

  const handleClose = () => setSelectedTeacher(null);

  // Keydown handler for modal (Escape to close)
  const onKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    if (e.key === 'Escape') handleClose();
  };

  return (
    <div className="min-h-screen flex bg-gradient-to-br from-gray-900 to-black text-white">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <Navbar />
        <main className="p-8 space-y-6">
          {/* Header */}
          <div className="flex flex-col sm:flex-row justify-between items-center">
            <h1 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500">
              {TEACHER_MANAGEMENT_HEADING}
            </h1>
            <div className="flex mt-4 sm:mt-0 space-x-2">
              <div className="relative">
                <Search className="absolute inset-y-0 left-0 pl-3 h-11 w-7 text-gray-400" />
                <input
                  type="text"
                  placeholder={TEACHER_SEARCH_PLACEHOLDER}
                  value={searchQuery}
                  onChange={handleSearch}
                  className="pl-10 pr-3 py-2 bg-gray-800 border border-indigo-500 rounded-l-md focus:outline-none focus:ring focus:ring-indigo-500 text-white"
                />
              </div>
              {searchQuery && <CommonButton size="sm" variant="secondary" label="Clear" leftIcon={<X />} onClick={clearSearch} />}
              <CommonButton size="md" variant="primary" label={TEACHER_ADD_BUTTON_LABEL} leftIcon={<Plus />} onClick={() => navigate('/admin/add-teacher')} />
            </div>
          </div>

          {/* Alerts */}
          {(error || success) && (
            <div className={`p-3 rounded-md text-white ${error ? 'bg-red-600' : 'bg-green-600'}`}>{error ?? success}</div>
          )}

          {/* Table */}
          <div className="bg-black bg-opacity-50 border border-indigo-500 rounded-lg shadow overflow-auto">
            <CommonTable columns={columns} data={filtered} loading={loading} initialSortColumn="name" initialSortDirection="asc" />
          </div>

          {/* Modal */}
          {selectedTeacher && (
            <div className="fixed inset-0 flex z-50" onKeyDown={onKeyDown} tabIndex={-1}>
              <div 
                className="absolute inset-0 bg-black bg-opacity-70" 
                onClick={handleClose} 
                role="presentation" 
                aria-label="Close modal backdrop"
              />
              <dialog open className="relative ml-auto w-full max-w-md h-full bg-gray-800 p-6 shadow-lg transform transition-transform duration-300 ease-out" aria-modal="true">
                <button onClick={handleClose} aria-label="Close" className="absolute top-4 right-4 p-2 rounded-full bg-gray-700 hover:bg-gray-600 focus:outline-none focus:ring focus:ring-indigo-500">
                  <X className="h-5 w-5 text-gray-300" />
                </button>
                <h2 className="text-2xl font-bold mb-4">Teacher Details</h2>
                <div className="space-y-4">
                  {['Name','Phone','Address'].map(field => (
                    <div key={field.toLowerCase()}>
                      <label htmlFor={`${field.toLowerCase()}-input`} className="block text-sm font-semibold text-gray-300 mb-1">{field}</label>
                      {isEditing ? (
                        <input
                          id={`${field.toLowerCase()}-input`}
                          name={field.toLowerCase()}
                          value={editData[field.toLowerCase() as keyof typeof editData]}
                          onChange={handleEditChange}
                          placeholder={`Enter ${field.toLowerCase()}`}
                          aria-label={field}
                          className="w-full px-3 py-2 bg-gray-700 border border-indigo-500 rounded-md focus:outline-none focus:ring focus:ring-indigo-500 text-white"
                        />
                      ) : (
                        <p className="text-white">{selectedTeacher[field.toLowerCase() as 'name' | 'phone' | 'address']}</p>
                      )}
                    </div>
                  ))}
                  {['dob','gender','joiningDate','role'].map((field) => (
                    <div key={field}>
                      <span className="block text-sm font-semibold text-gray-300 mb-1 capitalize">{field.replace(/([A-Z])/g,' $1')}</span>
                      <p className="text-white">{selectedTeacher[field as keyof Teacher]}</p>
                    </div>
                  ))}
                </div>
                <div className="mt-6 flex justify-end space-x-2">
                  {isEditing ? (
                    <>
                      <CommonButton size="sm" variant="primary" label={TEACHER_SAVE_BUTTON_LABEL} onClick={handleSave} />
                      <CommonButton size="sm" variant="secondary" label={TEACHER_CANCEL_BUTTON_LABEL} onClick={handleCancelEdit} />
                    </>
                  ) : (
                    <CommonButton size="sm" variant="primary" leftIcon={<Edit3 />} label={TEACHER_EDIT_BUTTON_LABEL} onClick={handleEditClick} />
                  )}
                  <CommonButton size="sm" variant="secondary" label={TEACHER_CLOSE_BUTTON_LABEL} onClick={handleClose} />
                </div>
              </dialog>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default React.memo(TeacherManagement);

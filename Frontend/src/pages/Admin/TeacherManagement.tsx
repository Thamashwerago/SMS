import React, {
  useState,
  useEffect,
  useMemo,
  ChangeEvent,
  KeyboardEvent,
} from "react";
import { useNavigate } from "react-router-dom";
import { Plus, Search, X, Edit3, Trash2 } from "lucide-react";
import Sidebar from "../../components/common/Sidebar";
import Navbar from "../../components/common/Navbar";
import CommonTable, { Column } from "../../components/common/Table";
import CommonButton from "../../components/common/Button";
import teacherService, { Teacher as ServiceTeacher } from "../../services/teacherService";
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
  dob: string;         // YYYY-MM-DD
  gender: string;
  address: string;
  joiningDate: string; // YYYY-MM-DD
  role: string;
}

// State for the form
interface EditData {
  name: string;
  phone: string;
  address: string;
  dob: string;
  gender: string;
  joiningDate: string;
}

// Which fields in the form we want to render inputs for
const editableFields: (keyof EditData)[] = [
  "name",
  "phone",
  "address",
  "dob",
  "gender",
  "joiningDate",
];

const TeacherManagement: React.FC = () => {
  const navigate = useNavigate();

  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTeacher, setSelectedTeacher] = useState<Teacher | null>(null);
  const [isEditing, setIsEditing] = useState(false);

  // editData holds all editable form fields
  const [editData, setEditData] = useState<EditData>({
    name: "",
    phone: "",
    address: "",
    dob: "",
    gender: "",
    joiningDate: "",
  });

  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // 1) Fetch once on mount
  useEffect(() => {
    (async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await teacherService.getAll();
        // normalize dates to YYYY-MM-DD
        const normalized = data.map((t) => ({
          ...t,
          dob: new Date(t.dob).toISOString().split("T")[0],
          joiningDate: new Date(t.joiningDate).toISOString().split("T")[0],
        }));
        setTeachers(normalized);
      } catch (e) {
        console.error(e);
        setError(FETCH_TEACHERS_EXCEPTION);
      }
      setLoading(false);
    })();
  }, []);

  // 2) Search filter
  const handleSearch = (e: ChangeEvent<HTMLInputElement>) =>
    setSearchQuery(e.target.value);
  const clearSearch = () => setSearchQuery("");

  const filtered = useMemo(
    () =>
      teachers.filter((t) =>
        [t.name, t.phone, t.role].some((f) =>
          f.toLowerCase().includes(searchQuery.toLowerCase())
        )
      ),
    [teachers, searchQuery]
  );

  // 3) Open the slide-over
  const openModal = (t: Teacher) => {
    setSelectedTeacher(t);
    setEditData({
      name: t.name,
      phone: t.phone,
      address: t.address,
      dob: t.dob,
      gender: t.gender,
      joiningDate: t.joiningDate,
    });
    setIsEditing(false);
    setError(null);
    setSuccess(null);
  };

  // 4) Handle form field changes
  const handleEditChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setEditData((prev) => ({
      ...prev,
      [name as keyof EditData]: value,
    }));
    setError(null);
    setSuccess(null);
  };

  // 5) Save edits back to the API
  const handleSave = async () => {
    if (!selectedTeacher) return;
    setError(null);

    try {
      // prepare payload with ISO date strings for the API
      const payload: Partial<ServiceTeacher> = {
        ...editData,
        dob: editData.dob,
        joiningDate: new Date(editData.joiningDate),
      };
      await teacherService.update(selectedTeacher.id, payload);

      setSuccess("Teacher updated successfully.");

      // re-fetch & normalize
      const data = await teacherService.getAll();
      setTeachers(
        data.map((t) => ({
          ...t,
          dob: new Date(t.dob).toISOString().split("T")[0],
          joiningDate: new Date(t.joiningDate).toISOString().split("T")[0],
        }))
      );

      setSelectedTeacher(null);
    } catch (e) {
      console.error(e);
      setError(UPDATE_TEACHER_EXCEPTION);
    }
  };

  // 6) Delete flow
  const handleDelete = async (id: number) => {
    if (!confirm("Are you sure you want to delete this teacher?")) return;
    setError(null);
    try {
      await teacherService.delete(id);
      setTeachers((prev) => prev.filter((t) => t.id !== id));
      setSuccess("Teacher deleted successfully.");
    } catch (e) {
      console.error(e);
      setError(DELETE_TEACHER_EXCEPTION);
    }
  };

  const handleCancelEdit = () => {
    if (selectedTeacher) openModal(selectedTeacher);
  };
  const handleClose = () => setSelectedTeacher(null);

  // allow Escape key to close modal
  const onKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    if (e.key === "Escape") handleClose();
  };

  // Table columns
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
              size="sm"
              variant="primary"
              leftIcon={<Edit3 />}
              label={TEACHER_EDIT_BUTTON_LABEL}
              onClick={() => openModal(row)}
            />
            <CommonButton
              size="sm"
              variant="danger"
              leftIcon={<Trash2 />}
              label="Delete"
              onClick={() => handleDelete(row.id)}
            />
          </div>
        ),
      },
    ],
    []
  );

  return (
    <div className="min-h-screen flex bg-gray-900 text-white">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <Navbar />
        <main className="p-6 space-y-8">
          {/* Header */}
          <div className="flex flex-col sm:flex-row justify-between items-center">
            <h1 className="text-3xl font-bold">
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
              {searchQuery && (
                <CommonButton
                  size="sm"
                  variant="secondary"
                  leftIcon={<X />}
                  label="Clear"
                  onClick={clearSearch}
                />
              )}
              <CommonButton
                size="md"
                variant="primary"
                leftIcon={<Plus />}
                label={TEACHER_ADD_BUTTON_LABEL}
                onClick={() => navigate("/admin/add-teacher")}
              />
            </div>
          </div>

          {/* Alerts */}
          {(error || success) && (
            <div
              className={`p-4 rounded text-white ${
                error ? "bg-red-600" : "bg-green-600"
              }`}
              role="alert"
            >
              {error ?? success}
            </div>
          )}

          {/* Table */}
          <div className="bg-gray-800 rounded-lg shadow overflow-auto">
            <CommonTable
              columns={columns}
              data={filtered}
              loading={loading}
              initialSortColumn="name"
              initialSortDirection="asc"
            />
          </div>

          {/* Slide-over Modal */}
          {selectedTeacher && (
            <div
              className="fixed inset-0 flex z-50"
              tabIndex={-1}
              onKeyDown={onKeyDown}
            >
              <div
                className="absolute inset-0 bg-black bg-opacity-70"
                onClick={handleClose}
                aria-label="Close backdrop"
              />
              <aside className="relative ml-auto w-full max-w-md h-full bg-gray-800 p-6 shadow-xl transform transition-transform duration-300 ease-out">
                <button
                  onClick={handleClose}
                  aria-label="Close"
                  className="absolute top-4 right-4 p-2 bg-gray-700 rounded-full hover:bg-gray-600 focus:outline-none focus:ring focus:ring-indigo-500"
                >
                  <X className="h-5 w-5 text-gray-300" />
                </button>

                <h2 className="text-2xl font-semibold mb-4">
                  Teacher Details
                </h2>

                <div className="space-y-4">
                  {editableFields.map((field) => {
                    const label =
                      field.charAt(0).toUpperCase() +
                      field.slice(1).replace(/([A-Z])/g, " $1");
                    const type = ["dob", "joiningDate"].includes(field)
                      ? "date"
                      : "text";
                    return (
                      <div key={field}>
                        <label
                          htmlFor={`input-${field}`}
                          className="block text-sm font-medium text-gray-200 mb-1"
                        >
                          {label}
                        </label>
                        {isEditing ? (
                          <input
                            id={`input-${field}`}
                            name={field}
                            type={type}
                            value={editData[field]}
                            onChange={handleEditChange}
                            className="w-full px-3 py-2 bg-gray-700 border border-indigo-500 rounded focus:outline-none focus:ring focus:ring-indigo-500 text-white"
                          />
                        ) : (
                          <p className="text-gray-300">
                            {selectedTeacher[field as keyof Teacher]}
                          </p>
                        )}
                      </div>
                    );
                  })}
                </div>

                <div className="mt-6 flex justify-end space-x-2">
                  {isEditing ? (
                    <>
                      <CommonButton
                        size="sm"
                        variant="primary"
                        label={TEACHER_SAVE_BUTTON_LABEL}
                        onClick={handleSave}
                      />
                      <CommonButton
                        size="sm"
                        variant="secondary"
                        label={TEACHER_CANCEL_BUTTON_LABEL}
                        onClick={handleCancelEdit}
                      />
                    </>
                  ) : (
                    <CommonButton
                      size="sm"
                      variant="primary"
                      leftIcon={<Edit3 />}
                      label={TEACHER_EDIT_BUTTON_LABEL}
                      onClick={() => setIsEditing(true)}
                    />
                  )}
                  <CommonButton
                    size="sm"
                    variant="secondary"
                    label={TEACHER_CLOSE_BUTTON_LABEL}
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

export default React.memo(TeacherManagement);

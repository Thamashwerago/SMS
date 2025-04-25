// src/pages/Admin/Timetable.tsx
import React, {
  useState,
  useEffect,
  useMemo,
  ChangeEvent,
} from "react";
import { useNavigate } from "react-router-dom";
import { Plus, Search, X, Edit3, Trash2 } from "lucide-react";
import Sidebar from "../../components/common/Sidebar";
import Navbar from "../../components/common/Navbar";
import CommonTable, { Column } from "../../components/common/Table";
import CommonButton from "../../components/common/Button";
import timetableService, { TimetableEntry } from "../../services/timetableService";
import {
  TIMETABLE_HEADING,
  TIMETABLE_SEARCH_PLACEHOLDER,
  TIMETABLE_ADD_BUTTON_LABEL,
  TIMETABLE_NO_DATA_FOUND,
} from "../../constants/admin/timetableStrings";
import {
  FETCH_TIMETABLE_EXCEPTION,
  DELETE_TIMETABLE_EXCEPTION,
} from "../../constants/exceptionMessages";
import {
  ADD_TIMETABLE_HEADING,
  BUTTON_SAVE,
  BUTTON_CANCEL,
  SUCCESS_MESSAGE_ADD,
  ERROR_MESSAGE_ADD,
} from "../../constants/admin/addTimetableStrings";

const editableFields = [
  "date",
  "startTime",
  "endTime",
  "courseId",
  "classroom",
] as const;

type EditData = {
  [K in typeof editableFields[number]]: string;
};

const Timetable: React.FC = () => {
  const navigate = useNavigate();

  const [entries, setEntries] = useState<TimetableEntry[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // slide-over edit
  const [selected, setSelected] = useState<TimetableEntry | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState<EditData>({
    date: "",
    startTime: "",
    endTime: "",
    courseId: "",
    classroom: "",
  });
  const [saving, setSaving] = useState(false);

  const fetchAll = async () => {
    try {
      const data = await timetableService.getAll();
      setEntries(data);
    } catch (e) {
      console.error(e);
      setError(FETCH_TIMETABLE_EXCEPTION);
    }
  };
  useEffect(() => {
    fetchAll();
  }, []);

  const filtered = useMemo(
    () =>
      entries.filter((e) =>
        [e.date, e.startTime, e.endTime, e.classroom]
          .some((f) => f.toLowerCase().includes(searchQuery.toLowerCase()))
      ),
    [entries, searchQuery]
  );

  const columns: Column<TimetableEntry>[] = useMemo(
    () => [
      { header: "Date", accessor: "date" },
      { header: "Start", accessor: "startTime" },
      { header: "End", accessor: "endTime" },
      { header: "Course ID", accessor: "courseId" },
      { header: "Classroom", accessor: "classroom" },
      {
        header: "Actions",
        accessor: (r) => (
          <div className="flex space-x-2">
            <CommonButton
              size="sm"
              variant="primary"
              leftIcon={<Edit3 />}
              label="Edit"
              onClick={() => {
                setSelected(r);
                setEditData({
                  date: r.date,
                  startTime: r.startTime,
                  endTime: r.endTime,
                  courseId: String(r.courseId),
                  classroom: r.classroom,
                });
                setIsEditing(false);
                setError(null);
                setSuccess(null);
              }}
            />
            <CommonButton
              size="sm"
              variant="danger"
              leftIcon={<Trash2 />}
              label="Delete"
              onClick={async () => {
                if (!confirm("Delete this entry?")) return;
                try {
                  await timetableService.delete(r.id);
                  setSuccess("Deleted successfully");
                  fetchAll();
                } catch (e) {
                  console.error(e);
                  setError(DELETE_TIMETABLE_EXCEPTION);
                }
              }}
            />
          </div>
        ),
      },
    ],
    []
  );

  const handleSearch = (e: ChangeEvent<HTMLInputElement>) =>
    setSearchQuery(e.target.value);
  const clearSearch = () => setSearchQuery("");

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setEditData((prev) => ({
      ...prev,
      [name]: value,
    }));
    setError(null);
    setSuccess(null);
  };

  const handleSave = async () => {
    if (!selected) return;
    setSaving(true);
    try {
      await timetableService.update(selected.id, {
        date: editData.date,
        startTime: editData.startTime,
        endTime: editData.endTime,
        courseId: Number(editData.courseId),
        classroom: editData.classroom,
      });
      setSuccess(SUCCESS_MESSAGE_ADD);
      setSelected(null);
      fetchAll();
    } catch (e) {
      console.error(e);
      setError(ERROR_MESSAGE_ADD);
    }
    setSaving(false);
  };

  const handleCancel = () => setSelected(null);

  return (
    <div className="min-h-screen flex bg-gray-900 text-white">
      <Sidebar />
      <div className="ml-64 flex-1 flex flex-col overflow-x-hidden">
        <Navbar />
        <main className="p-8 space-y-8 overflow-x-auto">
          {/* Header */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center">
            <h1 className="text-3xl font-bold">{TIMETABLE_HEADING}</h1>
            <div className="flex items-center mt-4 sm:mt-0 space-x-2">
              <div className="relative">
                <Search className="absolute inset-y-0 left-0 pl-3 h-11 w-7 text-gray-400" />
                <input
                  type="text"
                  placeholder={TIMETABLE_SEARCH_PLACEHOLDER}
                  value={searchQuery}
                  onChange={handleSearch}
                  className="pl-10 pr-3 py-2 bg-gray-800 border border-indigo-500 rounded-l-md focus:outline-none focus:ring focus:ring-indigo-500"
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
                label={TIMETABLE_ADD_BUTTON_LABEL}
                leftIcon={<Plus />}
                onClick={() => navigate("/admin/add-timetable")}
              />
            </div>
          </div>

          {/* Messages */}
          {(error || success) && (
            <div
              className={`p-4 rounded text-white ${
                error ? "bg-red-600" : "bg-green-600"
              }`}
            >
              {error ?? success}
            </div>
          )}

          {/* Table */}
          <div className="bg-gray-800 rounded-lg shadow overflow-hidden">
            <CommonTable
              columns={columns}
              data={filtered}
              loading={false}
              initialSortColumn="date"
              initialSortDirection="asc"
            />
          </div>
          {filtered.length === 0 && (
            <p className="text-center mt-4">{TIMETABLE_NO_DATA_FOUND}</p>
          )}

          {/* Slide-over */}
          {selected && (
            <div className="fixed inset-0 flex z-50">
              <button
                className="absolute inset-0 bg-black bg-opacity-70"
                onClick={handleCancel}
                aria-label="Close"
              />
              <aside className="relative ml-auto w-full max-w-md h-full bg-gray-800 p-6 shadow-xl transform transition-transform duration-300 ease-out">
                <h2 className="text-2xl font-semibold mb-4">
                  {ADD_TIMETABLE_HEADING}
                </h2>
                <button
                  onClick={handleCancel}
                  aria-label="Close"
                  className="absolute top-4 right-4 p-2 bg-gray-700 rounded-full hover:bg-gray-600 focus:outline-none focus:ring focus:ring-indigo-500"
                >
                  <X className="h-5 w-5 text-gray-300" />
                </button>

                {editableFields.map((field) => {
                  const label = field
                    .replace(/([A-Z])/g, " $1")
                    .replace(/^./, (s) => s.toUpperCase());
                  const getInputType = (fieldName: string): string => {
                    if (fieldName === "courseId") return "number";
                    if (fieldName === "date") return "date";
                    if (fieldName.includes("Time")) return "time";
                    return "text";
                  };
                  const type = getInputType(field);
                  return (
                    <div key={field} className="mb-4">
                      <label
                        htmlFor={field}
                        className="block text-sm font-medium text-gray-200 mb-1 capitalize"
                      >
                        {label}
                      </label>
                      <input
                        id={field}
                        name={field}
                        type={type}
                        value={editData[field]}
                        onChange={handleChange}
                        className="w-full px-3 py-2 bg-gray-700 border border-indigo-500 rounded focus:outline-none focus:ring focus:ring-indigo-500 text-white"
                      />
                    </div>
                  );
                })}

                <div className="mt-6 flex justify-end space-x-2">
                  {isEditing ? null : (
                    <CommonButton
                      size="sm"
                      variant="primary"
                      leftIcon={<Edit3 />}
                      label={BUTTON_SAVE}
                      onClick={handleSave}
                      isLoading={saving}
                    />
                  )}
                  <CommonButton
                    size="sm"
                    variant="secondary"
                    label={BUTTON_CANCEL}
                    onClick={handleCancel}
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

export default React.memo(Timetable);

// src/pages/Admin/AttendanceManagement.tsx
import React, {
  useState,
  useEffect,
  useMemo,
  ChangeEvent,
} from "react";
import { Search, X, Edit3, Trash2 } from "lucide-react";
import Sidebar from "../../components/common/Sidebar";
import Navbar from "../../components/common/Navbar";
import CommonTable, { Column } from "../../components/common/Table";
import CommonButton from "../../components/common/Button";
import attendanceService, { Attendance } from "../../services/attendanceService";
import {
  ATTENDANCE_MANAGEMENT_HEADING,
  ATTENDANCE_SEARCH_PLACEHOLDER,
  ATTENDANCE_EDIT_BUTTON_LABEL,
  ATTENDANCE_SAVE_BUTTON_LABEL,
  ATTENDANCE_CANCEL_BUTTON_LABEL,
  ATTENDANCE_CLOSE_BUTTON_LABEL,
} from "../../constants/admin/attendanceManagementStrings";
import {
  FETCH_ATTENDANCE_EXCEPTION,
  UPDATE_ATTENDANCE_EXCEPTION,
  DELETE_ATTENDANCE_EXCEPTION,
} from "../../constants/exceptionMessages";

interface EditAttendanceData {
  status: string;
}

const AttendanceManagement: React.FC = () => {
  const [records, setRecords] = useState<Attendance[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selected, setSelected] = useState<Attendance | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState<EditAttendanceData>({ status: "" });
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      setLoading(true);
      try {
        const all = await attendanceService.getAll();
        setRecords(all);
      } catch {
        setError(FETCH_ATTENDANCE_EXCEPTION);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const filtered = useMemo(
    () =>
      records.filter((r) =>
        `${r.date} ${r.userId} ${r.courseId} ${r.status}`
          .toLowerCase()
          .includes(searchQuery.toLowerCase())
      ),
    [records, searchQuery]
  );

  const handleSearch = (e: ChangeEvent<HTMLInputElement>) =>
    setSearchQuery(e.target.value);
  const clearSearch = () => setSearchQuery("");

  const openRow = (r: Attendance) => {
    setSelected(r);
    setEditData({ status: r.status });
    setIsEditing(false);
    setError(null);
    setSuccess(null);
  };
  const closeRow = () => setSelected(null);

  const handleEditChange = (e: ChangeEvent<HTMLSelectElement>) => {
    setEditData({ status: e.target.value });
  };

  const save = async () => {
    if (!selected) return;
    setError(null);
    try {
      await attendanceService.updateAttendance(selected.id, { status: editData.status });
      setSuccess("Updated successfully");
      closeRow();
      const all = await attendanceService.getAll();
      setRecords(all);
    } catch {
      setError(UPDATE_ATTENDANCE_EXCEPTION);
    }
  };

  const remove = async (id: number) => {
    setError(null);
    try {
      await attendanceService.unMarkAttendance(id);
      setSuccess("Deleted successfully");
      const all = await attendanceService.getAll();
      setRecords(all);
    } catch {
      setError(DELETE_ATTENDANCE_EXCEPTION);
    }
  };

  const columns: Column<Attendance>[] = useMemo(
    () => [
      { header: "ID", accessor: "id" },
      { header: "Date", accessor: "date" },
      { header: "User ID", accessor: "userId" },
      { header: "Course ID", accessor: "courseId" },
      { header: "Status", accessor: "status" },
      {
        header: "Actions",
        accessor: (r) => (
          <div className="flex space-x-2">
            <CommonButton
              size="sm"
              variant="primary"
              leftIcon={<Edit3 />}
              label={ATTENDANCE_EDIT_BUTTON_LABEL}
              onClick={() => openRow(r)}
            />
            <CommonButton
              size="sm"
              variant="danger"
              leftIcon={<Trash2 />}
              label="Delete"
              onClick={() => remove(r.id)}
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
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center">
            <h1 className="text-3xl font-bold">{ATTENDANCE_MANAGEMENT_HEADING}</h1>
            <div className="flex items-center mt-4 sm:mt-0 space-x-2">
              <div className="relative">
                <Search className="absolute inset-y-0 left-0 pl-3 h-10 w-7 text-gray-400" />
                <input
                  type="text"
                  placeholder={ATTENDANCE_SEARCH_PLACEHOLDER}
                  value={searchQuery}
                  onChange={handleSearch}
                  className="pl-10 pr-3 py-2 bg-gray-800 border border-indigo-500 rounded-l-md focus:outline-none text-white"
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
            </div>
          </div>

          {/* Alerts */}
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
              loading={loading}
              initialSortColumn="date"
              initialSortDirection="asc"
            />
          </div>

          {/* Slide-over */}
          {selected && (
            <div className="fixed inset-0 flex z-50">
              <button
                className="absolute inset-0 bg-black bg-opacity-70"
                onClick={closeRow}
                aria-label="Close"
              />
              <aside className="relative ml-auto w-full max-w-md h-full bg-gray-800 p-6 shadow-xl">
                <h2 className="text-2xl font-semibold mb-4">Attendance Details</h2>
                <button
                  onClick={closeRow}
                  aria-label="Close"
                  className="absolute top-4 right-4 p-2 bg-gray-700 rounded-full hover:bg-gray-600"
                >
                  <X className="h-5 w-5 text-gray-300" />
                </button>

                <div className="space-y-4">
                  <div>
                    <div className="block text-sm font-medium text-gray-200 mb-1">Date</div>
                    <p className="text-gray-300">{selected.date}</p>
                  </div>
                  <div>
                    <div className="block text-sm font-medium text-gray-200 mb-1">User ID</div>
                    <p className="text-gray-300">{selected.userId}</p>
                  </div>
                  <div>
                    <div className="block text-sm font-medium text-gray-200 mb-1">Course ID</div>
                    <p className="text-gray-300">{selected.courseId}</p>
                  </div>
                  <div>
                    <label htmlFor="statusSelect" className="block text-sm font-medium text-gray-200 mb-1">
                      Status
                    </label>
                    {isEditing ? (
                      <select
                        id="statusSelect"
                        name="status"
                        value={editData.status}
                        onChange={handleEditChange}
                        className="w-full px-3 py-2 bg-gray-700 border border-indigo-500 rounded text-white"
                      >
                        <option value="Present">Present</option>
                        <option value="Absent">Absent</option>
                      </select>
                    ) : (
                      <p className="text-gray-300">{selected.status}</p>
                    )}
                  </div>
                </div>

                <div className="mt-6 flex justify-end space-x-2">
                  {isEditing ? (
                    <>
                      <CommonButton
                        size="sm"
                        variant="primary"
                        label={ATTENDANCE_SAVE_BUTTON_LABEL}
                        onClick={save}
                      />
                      <CommonButton
                        size="sm"
                        variant="secondary"
                        label={ATTENDANCE_CANCEL_BUTTON_LABEL}
                        onClick={() => {
                          openRow(selected);
                          setIsEditing(false);
                        }}
                      />
                    </>
                  ) : (
                    <CommonButton
                      size="sm"
                      variant="primary"
                      leftIcon={<Edit3 />}
                      label={ATTENDANCE_EDIT_BUTTON_LABEL}
                      onClick={() => setIsEditing(true)}
                    />
                  )}
                  <CommonButton
                    size="sm"
                    variant="secondary"
                    label={ATTENDANCE_CLOSE_BUTTON_LABEL}
                    onClick={closeRow}
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

export default React.memo(AttendanceManagement);

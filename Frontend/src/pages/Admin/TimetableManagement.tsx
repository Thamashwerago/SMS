import React, { useState, useEffect, useMemo, ChangeEvent } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../../components/common/Sidebar";
import Navbar from "../../components/common/Navbar";
import CommonTable, { Column } from "../../components/common/Table";
import CommonButton from "../../components/common/Button";
import timetableService, {
  TimetableEntry,
} from "../../services/timetableService";
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

/**
 * TimetableManagement Component
 * -------------------------------
 * Displays timetable entries in a searchable, sortable table.
 * Retrieves data from the backend using timetableService.getAll().
 * Provides functionality to delete an entry.
 * The "Add Timetable" button navigates to the AddTimetable page.
 */
const Timetable: React.FC = () => {
  const navigate = useNavigate();

  // State for storing timetable entries.
  const [timetable, setTimetable] = useState<TimetableEntry[]>([]);
  // State for search query.
  const [searchQuery, setSearchQuery] = useState("");
  // State for error and success messages.
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  /**
   * fetchTimetable
   * --------------
   * Retrieves timetable entries from the backend using timetableService.getAll().
   */
  const fetchTimetable = async () => {
    try {
      const data = await timetableService.getAll();
      setTimetable(data);
    } catch (err) {
      console.error("Error fetching timetable:", err);
      setError(FETCH_TIMETABLE_EXCEPTION);
    }
  };

  // Fetch timetable data on component mount.
  useEffect(() => {
    fetchTimetable();
  }, []);

  /**
   * handleSearchChange
   * ------------------
   * Updates the search query as the user types.
   */
  const handleSearchChange = (e: ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  /**
   * filteredTimetable
   * -------------------
   * Filters timetable entries based on the search query.
   */
  const filteredTimetable = useMemo(() => {
    return timetable.filter(
      (entry) =>
        entry.date.toLowerCase().includes(searchQuery.toLowerCase()) ||
        entry.startTime.toLowerCase().includes(searchQuery.toLowerCase()) ||
        entry.endTime.toLowerCase().includes(searchQuery.toLowerCase()) ||
        entry.classroom.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [timetable, searchQuery]);

  /**
   * columns
   * -------
   * Defines the columns for the CommonTable component.
   */
  const columns: Column<TimetableEntry>[] = useMemo(
    () => [
      { header: "Date", accessor: "date" },
      { header: "Start Time", accessor: "startTime" },
      { header: "End Time", accessor: "endTime" },
      { header: "Teacher ID", accessor: "teacherId" },
      { header: "Course ID", accessor: "courseId" },
      { header: "Classroom", accessor: "classroom" },
      {
        header: "Actions",
        accessor: (row: TimetableEntry) => (
          <div className="flex space-x-2">
            <CommonButton
              label="Delete"
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
   * handleDelete
   * ------------
   * Deletes a timetable entry by its ID using timetableService.delete.
   */
  const handleDelete = async (id: number) => {
    if (
      window.confirm("Are you sure you want to delete this timetable entry?")
    ) {
      try {
        await timetableService.delete(id);
        setSuccess("Timetable entry deleted successfully.");
        fetchTimetable();
      } catch (err) {
        console.error("Error deleting timetable entry:", err);
        setError(DELETE_TIMETABLE_EXCEPTION);
      }
    }
  };

  return (
    <div className="min-h-screen flex font-roboto bg-gradient-to-br from-gray-900 to-black">
      <Sidebar />
      <div className="ml-64 flex-1 flex flex-col overflow-hidden">
        {/* Top Navbar */}
        <Navbar />
        <main className="flex-1 p-6 md:p-8 overflow-x-auto">
          {/* Header Section with Title, Search, and Add Timetable Button */}
          <div className="flex flex-col sm:flex-row items-center justify-between mb-8">
            <h1 className="text-4xl md:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500">
              {TIMETABLE_HEADING}
            </h1>
            <div className="flex items-center mt-4 sm:mt-0">
              <input
                type="text"
                placeholder={TIMETABLE_SEARCH_PLACEHOLDER}
                value={searchQuery}
                onChange={handleSearchChange}
                className="px-4 py-2 bg-black bg-opacity-50 border border-indigo-500 rounded-l-xl focus:outline-none text-white placeholder-gray-400"
              />
              <CommonButton
                label={TIMETABLE_ADD_BUTTON_LABEL}
                onClick={() => navigate("/admin/add-timetable")}
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

          {/* Timetable Table rendered with CommonTable component */}
          <CommonTable
            columns={columns}
            data={filteredTimetable}
            initialSortColumn="date"
            initialSortDirection="asc"
            onRowClick={() => {}} // Actions are handled in the custom Actions column.
          />

          {/* Display a message when no timetable entries are found */}
          {filteredTimetable.length === 0 && (
            <p className="text-white text-center mt-4">
              {TIMETABLE_NO_DATA_FOUND}
            </p>
          )}
        </main>
      </div>
    </div>
  );
};

export default Timetable;

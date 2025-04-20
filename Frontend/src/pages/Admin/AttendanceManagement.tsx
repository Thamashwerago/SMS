import React, { useState, useEffect, useMemo, ChangeEvent } from "react";
import Sidebar from "../../components/common/Sidebar";
import Navbar from "../../components/common/Navbar";
import CommonButton from "../../components/common/Button";
import CommonTable, { Column } from "../../components/common/Table";
import CourseCard, {
  AggregatedCourseAttendance,
} from "../../components/common/CourseCard";
import Chart from "../../components/common/Chart";
import attendanceService, {
  Attendance,
} from "../../services/attendanceService";
import {
  ATTENDANCE_HEADING,
  ATTENDANCE_SEARCH_PLACEHOLDER,
  ATTENDANCE_NO_DATA_FOUND,
  ATTENDANCE_DELETE_BUTTON_LABEL,
  COURSE_CHART_TITLE,
  COURSE_POPUP_HEADING,
  COURSE_POPUP_CLOSE_BUTTON_LABEL,
} from "../../constants/admin/attendanceManagementStrings";
import {
  FETCH_ATTENDANCE_EXCEPTION,
  DELETE_ATTENDANCE_EXCEPTION,
} from "../../constants/exceptionMessages";

/**
 * AttendanceManagement Component
 * -------------------------------
 * Retrieves attendance records from the backend via attendanceService,
 * aggregates the records by course, and displays them using CourseCard components
 * and a bar chart visualization. Individual attendance records can be deleted
 * from within a popup modal that displays course details.
 *
 * Exception handling is applied for each backend operation.
 */
const AttendanceManagement: React.FC = () => {
  // State for attendance records retrieved from the backend.
  const [attendanceRecords, setAttendanceRecords] = useState<Attendance[]>([]);
  // State for search query.
  const [searchQuery, setSearchQuery] = useState("");
  // State for error messages.
  const [error, setError] = useState<string | null>(null);
  // State for success messages (if needed).
  const [success, setSuccess] = useState<string | null>(null);
  // State for the course details popup modal.
  const [selectedCoursePopup, setSelectedCoursePopup] =
    useState<AggregatedCourseAttendance | null>(null);

  /**
   * fetchAttendance
   * -----------------
   * Retrieves all attendance records from the backend using attendanceService.getAll().
   * Exceptions are caught and an error message is set.
   */
  const fetchAttendance = async () => {
    try {
      // Call the service to retrieve all attendance records.
      const data = await attendanceService.getAll();
      setAttendanceRecords(data);
    } catch (err) {
      console.error("Error fetching attendance:", err);
      setError(FETCH_ATTENDANCE_EXCEPTION);
    }
  };

  // Fetch attendance records when the component mounts.
  useEffect(() => {
    fetchAttendance();
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
   * filteredAttendance
   * --------------------
   * Filters the attendance records based on the search query.
   */
  const filteredAttendance = useMemo(() => {
    return attendanceRecords.filter(
      (record) =>
        record.date.toLowerCase().includes(searchQuery.toLowerCase()) ||
        record.status.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [attendanceRecords, searchQuery]);

  /**
   * aggregatedCourseAttendance
   * ----------------------------
   * Aggregates attendance records by course.
   * For each course, calculates:
   * - courseId
   * - courseName (as "Course {courseId}")
   * - teacher (default to "Unknown")
   * - totalStudents (number of unique students for the course)
   * - present (number of records with status "Present")
   * - updatedAt (current time)
   * - records (all attendance records for that course)
   */
  const aggregatedCourseAttendance: AggregatedCourseAttendance[] =
    useMemo(() => {
      const groups = new Map<number, Attendance[]>();
      filteredAttendance.forEach((record) => {
        if (!groups.has(record.courseId)) {
          groups.set(record.courseId, []);
        }
        groups.get(record.courseId)!.push(record);
      });
      const aggregates: AggregatedCourseAttendance[] = [];
      groups.forEach((records, courseId) => {
        const presentCount = records.filter(
          (r) => r.status === "Present"
        ).length;
        const uniqueStudents = new Set(records.map((r) => r.userId)).size;
        aggregates.push({
          courseId,
          courseName: `Course ${courseId}`,
          teacher: "Unknown",
          totalStudents: uniqueStudents,
          present: presentCount,
          updatedAt: new Date().toLocaleTimeString(),
          records,
        });
      });
      return aggregates;
    }, [filteredAttendance]);

  /**
   * handleCourseCardClick
   * -----------------------
   * Opens the course details popup modal for the selected course.
   * @param course - Aggregated course attendance data.
   */
  const handleCourseCardClick = (course: AggregatedCourseAttendance) => {
    setSelectedCoursePopup(course);
  };

  /**
   * handleDeleteAttendance
   * ------------------------
   * Deletes an individual attendance record using attendanceService.unMarkAttendance.
   * Refreshes the attendance data upon successful deletion.
   * @param id - The ID of the attendance record to delete.
   */
  const handleDeleteAttendance = async (id: number) => {
    if (
      window.confirm("Are you sure you want to delete this attendance record?")
    ) {
      try {
        await attendanceService.unMarkAttendance(id);
        setSuccess("Attendance record deleted successfully.");
        // Refresh the attendance records after deletion.
        fetchAttendance();
      } catch (err) {
        console.error("Error deleting attendance record:", err);
        setError(DELETE_ATTENDANCE_EXCEPTION);
      }
    }
  };

  /**
   * chartData
   * ---------
   * Prepares the data for a bar chart visualization of course attendance.
   * X-axis: Course Names.
   * Y-axis: Number of present attendance records.
   */
  const chartData = useMemo(
    () => ({
      labels: aggregatedCourseAttendance.map((course) => course.courseName),
      datasets: [
        {
          label: "Attendance",
          data: aggregatedCourseAttendance.map((course) => course.present),
          borderColor: "rgba(0,230,255,0.8)",
          backgroundColor: "rgba(0,230,255,0.2)",
          tension: 0.4,
        },
      ],
    }),
    [aggregatedCourseAttendance]
  );

  const columnsForUserAttendance: Column<Attendance>[] = [
    { header: "User ID", accessor: "userId" },
    { header: "Date", accessor: "date" },
    { header: "Status", accessor: "status" },
  ];

  return (
    <div className="min-h-screen flex font-roboto bg-gradient-to-br from-gray-900 to-black">
      {/* Sidebar Navigation */}
      <Sidebar />
      <div className="flex-1 flex flex-col">
        {/* Top Navbar */}
        <Navbar />
        <main className="p-6 md:p-8">
          {/* Page Heading */}
          <h1 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500 mb-8">
            {ATTENDANCE_HEADING}
          </h1>

          {/* Search Bar */}
          <div className="flex items-center mb-8">
            <input
              type="text"
              placeholder={ATTENDANCE_SEARCH_PLACEHOLDER}
              value={searchQuery}
              onChange={handleSearchChange}
              className="px-4 py-2 bg-black bg-opacity-50 border border-indigo-500 rounded-l-xl focus:outline-none text-white placeholder-gray-400"
            />
          </div>

          {/* Display error message if present */}
          {error && (
            <div className="mb-4 p-4 bg-red-500 bg-opacity-50 border border-red-700 rounded-xl text-white">
              {error}
            </div>
          )}

          {/* Display success message if present */}
          {success && (
            <div className="mb-4 p-4 bg-green-500 bg-opacity-50 border border-green-700 rounded-xl text-white">
              {success}
            </div>
          )}

          {/* Course Attendance Cards */}
          <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
            {aggregatedCourseAttendance.length > 0 ? (
              aggregatedCourseAttendance.map((course) => (
                <CourseCard
                  key={course.courseId}
                  course={course}
                  onClick={handleCourseCardClick}
                />
              ))
            ) : (
              <p className="text-white col-span-full text-center">
                {ATTENDANCE_NO_DATA_FOUND}
              </p>
            )}
          </section>

          {/* Bar Chart Visualization */}
          <section className="mb-12">
            <h2 className="text-3xl font-bold text-white mb-4">
              {COURSE_CHART_TITLE}
            </h2>
            <div className="bg-black bg-opacity-50 border border-indigo-500 rounded-xl shadow-xl p-6">
              {/* Ensure that your Chart component has registered BarElement for "bar" charts */}
              <Chart
                type="bar"
                data={chartData}
                options={{
                  responsive: true,
                  plugins: { legend: { position: "top" } },
                }}
              />
            </div>
          </section>

          {/* (Optional) User-Wise Attendance Table */}
          {/* Uncomment below if you wish to display user-wise attendance */}

          <section>
            <h2 className="text-3xl font-bold text-white mb-4">
              User-Wise Attendance
            </h2>
            <CommonTable
              columns={columnsForUserAttendance}
              data={[]}
              initialSortColumn="userId"
              initialSortDirection="asc"
            />
          </section>
        </main>
      </div>

      {/* Popup Modal for Course Details */}
      {selectedCoursePopup && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-70 z-50">
          <div className="bg-gray-800 p-8 rounded-xl border border-indigo-500 shadow-xl w-full max-w-lg mx-4 animate-fadeIn max-h-[80vh] overflow-y-auto">
            <h2 className="text-2xl font-bold text-white mb-4">
              {COURSE_POPUP_HEADING}: {selectedCoursePopup.courseName}
            </h2>
            <p className="text-gray-300 mb-2">
              Teacher: {selectedCoursePopup.teacher}
            </p>
            <ul className="text-gray-200 text-sm mb-4">
              {selectedCoursePopup.records.map((record) => (
                <li
                  key={record.id}
                  className="mb-1 flex justify-between items-center"
                >
                  <span>
                    User {record.userId} - {record.date} ({record.status})
                  </span>
                  <CommonButton
                    label={ATTENDANCE_DELETE_BUTTON_LABEL}
                    onClick={() => handleDeleteAttendance(record.id)}
                    className="bg-red-600 hover:bg-red-700 text-xs"
                  />
                </li>
              ))}
            </ul>
            <CommonButton
              label={COURSE_POPUP_CLOSE_BUTTON_LABEL}
              onClick={() => setSelectedCoursePopup(null)}
              className="bg-indigo-600 hover:bg-indigo-700"
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default AttendanceManagement;

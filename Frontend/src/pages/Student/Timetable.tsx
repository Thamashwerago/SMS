// -----------------------------
// src/pages/Student/Timetable.tsx
// -----------------------------
import React, { useState, useEffect, useCallback, useMemo } from "react";

// Common UI components
import Sidebar from "../../components/common/Sidebar";
import Navbar from "../../components/common/Navbar";
import Card from "../../components/common/Card";
import CommonTable from "../../components/common/Table";
import Button from "../../components/common/Button";

// Services
import courseService from "../../services/courseService";
import timetableService, {
  TimetableEntry,
} from "../../services/timetableService";

// Strings
import { TIMETABLE_STRINGS } from "../../constants/student/timetableConsts";

/**
 * Student Timetable Component
 * ---------------------------
 * Fetches a student's course assignments and timetable entries,
 * filters by that student, and displays grouped schedule by day.
 * Each fetch is wrapped in its own try–catch for clear error handling.
 */
const Timetable: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [entries, setEntries] = useState<TimetableEntry[]>([]);

  /**
   * fetchData
   * ---------
   * 1. Reads student ID from sessionStorage
   * 2. Fetches course assignments for the student
   * 3. Fetches all timetable entries
   * 4. Filters entries by assigned courses
   */
  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);

    // 1. Student ID
    const studentId = sessionStorage.getItem("userId");
    if (!studentId) {
      setError(TIMETABLE_STRINGS.ERROR_NO_USER_ID);
      setLoading(false);
      return;
    }

    // 2. Course Assignments
    let assigns;
    try {
      assigns = await courseService.getAllCourseAssigns();
      assigns = assigns.filter((a) => a.userId === Number(studentId));
    } catch (e) {
      console.error(TIMETABLE_STRINGS.ERROR_FETCH_ASSIGNMENTS, e);
      setError(TIMETABLE_STRINGS.ERROR_FETCH_ASSIGNMENTS);
      setLoading(false);
      return;
    }

    const courseIds = assigns.map((a) => a.courseId);

    // 3. Timetable Entries
    let allEntries;
    try {
      allEntries = await timetableService.getAll();
    } catch (e) {
      console.error(TIMETABLE_STRINGS.ERROR_FETCH_TIMETABLE, e);
      setError(TIMETABLE_STRINGS.ERROR_FETCH_TIMETABLE);
      setLoading(false);
      return;
    }

    // 4. Filter by student's courses
    const filtered = allEntries.filter((e) => courseIds.includes(e.courseId));
    setEntries(filtered);
    setLoading(false);
  }, []);

  // Initial load
  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Group by day
  const byDay = useMemo(() => {
    return entries.reduce<Record<string, TimetableEntry[]>>((acc, entry) => {
      acc[entry.date] = acc[entry.date] || [];
      acc[entry.date].push(entry);
      return acc;
    }, {});
  }, [entries]);

  // Ordered list of dates
  const orderedDates = Object.keys(byDay).sort((a, b) => a.localeCompare(b));

  // removed unused columns definition

  return (
    <div className="min-h-screen flex font-roboto bg-gradient-to-br from-gray-900 to-black">
      <Sidebar />
      <div className="ml-64 flex-1 flex flex-col overflow-x-hidden">
        <Navbar />
        <main className="p-8 overflow-x-auto">
          {/* Heading & Refresh */}
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500">
              {TIMETABLE_STRINGS.PAGE_HEADING}
            </h1>
            <Button
              label={TIMETABLE_STRINGS.BTN_REFRESH}
              onClick={fetchData}
              isLoading={loading}
              variant="primary"
            />
          </div>

          {/* Error or No Data */}
          {error && <p className="text-red-500 mb-4">{error}</p>}
          {!loading && entries.length === 0 && !error && (
            <p className="text-white">{TIMETABLE_STRINGS.NO_DATA}</p>
          )}

          {/* Grouped Timetable */}
          {orderedDates.map((date) => (
            <Card key={date} title={date} value="" className="mb-6">
              <CommonTable
                columns={[
                  {
                    header: TIMETABLE_STRINGS.COL_COURSE,
                    accessor: (entry) => entry.courseId.toString(),
                  },
                  {
                    header: TIMETABLE_STRINGS.COL_TIME,
                    accessor: (entry) =>
                      `${entry.startTime} - ${entry.endTime}`,
                  },
                  {
                    header: TIMETABLE_STRINGS.COL_TEACHER,
                    accessor: (entry) => entry.teacherId.toString(),
                  },
                  {
                    header: TIMETABLE_STRINGS.COL_CLASSROOM,
                    accessor: (entry) => entry.classroom,
                  },
                ]}
                data={byDay[date]}
              />
            </Card>
          ))}
        </main>
      </div>
    </div>
  );
};

export default Timetable;

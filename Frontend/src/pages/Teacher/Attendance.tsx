// src/pages/Teacher/Attendance.tsx
import React, { useState, useEffect, useCallback, useMemo } from "react";

// UI Components
import Sidebar from "../../components/common/Sidebar";
import Navbar from "../../components/common/Navbar";
import Card from "../../components/common/Card";
import CommonTable, { Column } from "../../components/common/Table";
import Button from "../../components/common/Button";

// Services
import courseService, { Course } from "../../services/courseService";
import studentService, { Student } from "../../services/studentService";
import attendanceService from "../../services/attendanceService";

// Strings
import { TEACHER_ATTENDANCE_STRINGS as S } from "../../constants/teacher/attendanceConsts";

/**
 * AttendanceRecordRow
 * -------------------
 * Simplified record for display.
 */
interface AttendanceRecordRow {
  id: string | number;
  courseName: string;
  date: string;
  presentNames: string;
}

const AttendancePage: React.FC = () => {
  // Loading & error state
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Data state
  const [courses, setCourses] = useState<Course[]>([]);
  const [selectedCourseId, setSelectedCourseId] = useState<number | null>(null);
  const [students, setStudents] = useState<Student[]>([]);
  const [attendanceInput, setAttendanceInput] = useState<
    Record<number, boolean>
  >({});
  const [records, setRecords] = useState<AttendanceRecordRow[]>([]);

  /**
   * fetchData
   * ---------
   * 1. Gets teacher's courses
   * 2. Default-selects first course and loads its students & records
   */
  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);

    // 1. Get teacher ID
    const teacherId = sessionStorage.getItem("userId");
    if (!teacherId) {
      setError(S.ERROR_NO_USER_ID);
      setLoading(false);
      return;
    }

    // 2. Fetch course assignments
    try {
      const assigns = await courseService.getAllCourseAssigns();
      // Filter assignments where role = 'Teacher'
      const myCourses = assigns.filter(
        (a) => a.userId === Number(teacherId) && a.role === "Teacher"
      );
      const courseDetails: Course[] = [];
      for (const a of myCourses) {
        try {
          const c = await courseService.getById(a.courseId);
          courseDetails.push(c);
        } catch {
          // Skip if course fetch fails
        }
      }
      setCourses(courseDetails);
      if (courseDetails.length > 0) {
        setSelectedCourseId(courseDetails[0].id);
      }
    } catch (e) {
      console.error("Assignments fetch error", e);
      setError(S.ERROR_FETCH_ASSIGNMENTS);
    }

    setLoading(false);
  }, []);

  // Load courses on mount
  useEffect(() => {
    fetchData();
  }, [fetchData]);

  /**
   * loadCourseDetails
   * -----------------
   * Fetches students and existing attendance for the selected course.
   */
  const loadCourseDetails = useCallback(async () => {
    if (selectedCourseId == null) return;
    setLoading(true);
    setError(null);

    // 1. Fetch students assigned to this course
    try {
      const assigns = await courseService.getAllCourseAssigns();
      const studentAssigns = assigns.filter(
        (a) => a.courseId === selectedCourseId && a.role === "Student"
      );
      const studDetails: Student[] = [];
      for (const a of studentAssigns) {
        try {
          const s = await studentService.getById(a.userId);
          studDetails.push(s);
        } catch {
          // skip
        }
      }
      setStudents(studDetails);
      // Initialize input map
      const initInput: Record<number, boolean> = {};
      studDetails.forEach((s) => (initInput[s.userId] = false));
      setAttendanceInput(initInput);
    } catch (e) {
      console.error("Students fetch error", e);
      setError(S.ERROR_FETCH_STUDENTS);
    }
    // 2. Fetch existing attendance records
    try {
      const atts =
        await attendanceService.getAttendanceByCourse(selectedCourseId);
      const rows: AttendanceRecordRow[] = atts.map((r, index) => ({
        id: `${r.courseId}-${r.date}-${index}`,
        courseName:
          courses.find((c) => c.id === r.courseId)?.name ?? S.COL_COURSE,
        date: r.date,
        presentNames:
          r.status.toLowerCase() === "present" ? r.userId.toString() : "",
      }));
      setRecords(rows);
      setRecords(rows);
    } catch (e) {
      console.error("Records fetch error", e);
      setError(S.ERROR_FETCH_RECORDS);
    }

    setLoading(false);
  }, [selectedCourseId, courses]);

  // Load students & records when selectedCourseId changes
  useEffect(() => {
    loadCourseDetails();
  }, [loadCourseDetails]);

  /**
   * handleCheckboxChange
   * ---------------------
   */
  const handleCheckboxChange = (userId: number) => {
    setAttendanceInput((prev) => ({ ...prev, [userId]: !prev[userId] }));
  };

  /**
   * handleSubmit
   * ------------
   * Marks attendance for each student.
   */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedCourseId == null) return;
    setLoading(true);
    setError(null);

    const date = new Date().toISOString().slice(0, 10);
    try {
      for (const [uid, present] of Object.entries(attendanceInput)) {
        const status = present ? "Present" : "Absent";
        await attendanceService.markAttendance({
          userId: Number(uid),
          role: "Student",
          courseId: selectedCourseId,
          date,
          status,
        });
      }
      // Refresh records
      await loadCourseDetails();
    } catch (e) {
      console.error("Mark attendance error", e);
      setError(S.ERROR_MARK_ATTENDANCE);
    }
    setLoading(false);
  };

  /**
   * Overall stats memo
   */
  const overallStats = useMemo(() => {
    const totalSessions = records.length;
    const totalExpected = students.length * totalSessions;
    const totalAttended = records.filter((r) => r.presentNames).length;
    const overallPercent =
      totalExpected > 0
        ? ((totalAttended / totalExpected) * 100).toFixed(1)
        : "0";
    return { totalSessions, totalExpected, totalAttended, overallPercent };
  }, [records, students]);

  // Columns for records table
  const recordCols: Column<AttendanceRecordRow>[] = useMemo(
    () => [
      { header: S.COL_DATE, accessor: "date" },
      { header: S.COL_PRESENT, accessor: "presentNames" },
    ],
    []
  );

  return (
    <div className="min-h-screen flex font-roboto bg-gradient-to-br from-gray-900 to-black">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <Navbar />
        <main className="p-8 space-y-12">
          {/* Heading & Refresh */}
          <div className="flex justify-between items-center">
            <h1 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500">
              {S.PAGE_HEADING}
            </h1>
            <Button
              label={S.BTN_REFRESH}
              onClick={loadCourseDetails}
              isLoading={loading}
              variant="primary"
            />
          </div>

          {/* Error */}
          {error && <p className="text-red-500">{error}</p>}

          {/* Attendance Input Form */}
          <Card
            title={courses.find((c) => c.id === selectedCourseId)?.name ?? ""}
            value=""
            icon="📋"
          >
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Course Select */}
              <div>
                <label
                  htmlFor="course-select"
                  className="block text-white mb-2"
                >
                  {S.LABEL_SELECT_COURSE}
                </label>
                <select
                  id="course-select"
                  value={selectedCourseId ?? ""}
                  onChange={(e) => setSelectedCourseId(Number(e.target.value))}
                  className="w-full px-4 py-2 bg-gray-800 text-white rounded"
                >
                  {courses.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Student Checkboxes */}
              <div>
                <p className="block text-white mb-2">{S.LABEL_MARK_PRESENT}</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {students.map((s) => (
                    <label
                      key={s.userId}
                      className="flex items-center space-x-2 text-white"
                    >
                      <input
                        type="checkbox"
                        checked={attendanceInput[s.userId] || false}
                        onChange={() => handleCheckboxChange(s.userId)}
                        className="h-4 w-4"
                      />
                      <span>
                        {s.firstName} {s.lastName}
                      </span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Submit Button */}
              <div>
                <Button
                  type="submit"
                  label={S.BTN_SUBMIT}
                  isLoading={loading}
                  variant="primary"
                  className="w-full"
                />
              </div>
            </form>
          </Card>

          {/* Summary Section */}
          <Card title={S.SECTION_SUMMARY} value="" icon="📊">
            <div className="flex justify-around text-center">
              <div>
                <p className="text-gray-300">{S.LABEL_TOTAL_SESSIONS}</p>
                <p className="text-white text-2xl font-bold">
                  {overallStats.totalSessions}
                </p>
              </div>
              <div>
                <p className="text-gray-300">{S.LABEL_TOTAL_EXPECTED}</p>
                <p className="text-white text-2xl font-bold">
                  {overallStats.totalExpected}
                </p>
              </div>
              <div>
                <p className="text-gray-300">{S.LABEL_TOTAL_ATTENDED}</p>
                <p className="text-white text-2xl font-bold">
                  {overallStats.totalAttended}
                </p>
              </div>
              <div>
                <p className="text-gray-300">{S.LABEL_OVERALL_PERCENT}</p>
                <p className="text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-blue-500 text-2xl font-bold">
                  {overallStats.overallPercent}%
                </p>
              </div>
            </div>
          </Card>

          {/* Detailed Records Table */}
          <section>
            <h2 className="text-3xl font-bold text-white mb-4">
              {S.SECTION_RECORDS}
            </h2>
            {records.length > 0 ? (
              <CommonTable columns={recordCols} data={records} />
            ) : (
              <p className="text-white">{S.NO_RECORDS}</p>
            )}
          </section>
        </main>
      </div>
    </div>
  );
};

export default AttendancePage;

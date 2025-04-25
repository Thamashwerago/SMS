// src/pages/Teacher/Attendance.tsx
import React, { useState, useEffect, useCallback, useMemo } from "react";

// Common UI components
import Sidebar from "../../components/common/Sidebar";
import Navbar from "../../components/common/Navbar";
import Card from "../../components/common/Card";
import CommonTable, { Column } from "../../components/common/Table";
import CommonButton from "../../components/common/Button";

// Services
import courseService, { Course } from "../../services/courseService";
import studentService, { Student } from "../../services/studentService";
import attendanceService from "../../services/attendanceService";

// Strings
import { TEACHER_ATTENDANCE_STRINGS as S } from "../../constants/teacher/attendanceConsts";

interface AttendanceRecordRow {
  id: string | number;
  date: string;
  presentNames: string;
}

const AttendancePage: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [courses, setCourses] = useState<Course[]>([]);
  const [selectedCourseId, setSelectedCourseId] = useState<number | null>(null);
  const [students, setStudents] = useState<Student[]>([]);
  const [attendanceInput, setAttendanceInput] = useState<Record<number, boolean>>({});
  const [records, setRecords] = useState<AttendanceRecordRow[]>([]);

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);
    const tid = Number(sessionStorage.getItem("userId") ?? 0);
    if (!tid) {
      setError(S.ERROR_NO_USER_ID);
      setLoading(false);
      return;
    }

    try {
      const assigns = await courseService.getAllCourseAssigns();
      const myCourses = assigns.filter(a => a.userId === tid && a.role === "Teacher");
      const details: Course[] = [];
      for (const a of myCourses) {
        try {
          details.push(await courseService.getById(a.courseId));
        } catch (err) {
          console.warn(`Failed to fetch details for course ID ${a.courseId}:`, err);
        }
      }
      setCourses(details);
      if (details.length) setSelectedCourseId(details[0].id);
    } catch (e) {
      console.error(e);
      setError(S.ERROR_FETCH_ASSIGNMENTS);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const loadCourseDetails = useCallback(async () => {
    if (selectedCourseId == null) return;
    setLoading(true);
    setError(null);

    // students
    try {
      const assigns = await courseService.getAllCourseAssigns();
      const studs = assigns
        .filter(a => a.courseId === selectedCourseId && a.role === "STUDENT")
        .map(a => a.userId);
      const details: Student[] = [];
      for (const uid of studs) {
        try {
          details.push(await studentService.getById(uid));
        } catch (err) {
          console.warn(`Failed to fetch details for student ID ${uid}:`, err);
        }
      }
      setStudents(details);
      const map: Record<number, boolean> = {};
      details.forEach(s => (map[s.userId] = false));
      setAttendanceInput(map);
    } catch (e) {
      console.error(e);
      setError(S.ERROR_FETCH_STUDENTS);
    }

    // existing records
    try {
      const atts = await attendanceService.getAttendanceByCourse(selectedCourseId);
      const rows = atts.map((r, idx) => ({
        id: `${r.courseId}-${r.date}-${idx}`,
        date: r.date,
        presentNames: r.status.toLowerCase() === "present" ? r.userId.toString() : "",
      }));
      setRecords(rows);
    } catch (e) {
      console.error(e);
      setError(S.ERROR_FETCH_RECORDS);
    }

    setLoading(false);
  }, [selectedCourseId]);

  useEffect(() => {
    loadCourseDetails();
  }, [loadCourseDetails]);

  const handleCheckboxChange = (uid: number) => {
    setAttendanceInput(prev => ({ ...prev, [uid]: !prev[uid] }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedCourseId == null) return;
    setLoading(true);
    setError(null);

    const date = new Date().toISOString().slice(0, 10);
    try {
      for (const [uid, present] of Object.entries(attendanceInput)) {
        await attendanceService.markAttendance({
          userId: Number(uid),
          role: "Student",
          courseId: selectedCourseId,
          date,
          status: present ? "Present" : "Absent",
        });
      }
      await loadCourseDetails();
    } catch (e) {
      console.error(e);
      setError(S.ERROR_MARK_ATTENDANCE);
    }
    setLoading(false);
  };

  const overallStats = useMemo(() => {
    const sessions = records.length;
    const expected = students.length * sessions;
    const attended = records.filter(r => r.presentNames).length;
    const pct = expected ? ((attended / expected) * 100).toFixed(1) : "0";
    return { sessions, expected, attended, pct };
  }, [records, students]);

  const recordCols: Column<AttendanceRecordRow>[] = useMemo(
    () => [
      { header: S.COL_DATE, accessor: "date" },
      { header: S.COL_PRESENT, accessor: "presentNames" },
    ],
    []
  );

  return (
    <div className="min-h-screen flex bg-gray-900 text-white">
      <Sidebar />
      <div className="ml-64 flex-1 flex flex-col">
        <Navbar />

        <main className="p-6 space-y-8 overflow-x-auto">
          {/* Header */}
          <div className="flex justify-between items-center">
            <h1 className="text-3xl font-bold">{S.PAGE_HEADING}</h1>
            <CommonButton
              size="md"
              variant="primary"
              label={S.BTN_REFRESH}
              onClick={loadCourseDetails}
              isLoading={loading}
            />
          </div>

          {error && <div className="p-4 bg-red-600 rounded">{error}</div>}

          {/* Attendance Form */}
          <Card
            title={courses.find(c => c.id === selectedCourseId)?.name ?? ""}
            value=""
            icon="📋"
          >
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="courseSelect" className="block mb-2">{S.LABEL_SELECT_COURSE}</label>
                <select
                  id="courseSelect"
                  value={selectedCourseId ?? ""}
                  onChange={e => setSelectedCourseId(Number(e.target.value))}
                  className="w-full bg-gray-800 px-4 py-2 rounded border border-indigo-500"
                >
                  {courses.map(c => (
                    <option key={c.id} value={c.id}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <p className="mb-2">{S.LABEL_MARK_PRESENT}</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {students.map(s => (
                    <label key={s.userId} className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        checked={attendanceInput[s.userId] || false}
                        onChange={() => handleCheckboxChange(s.userId)}
                        className="h-4 w-4"
                      />
                      <span>{s.firstName} {s.lastName}</span>
                    </label>
                  ))}
                </div>
              </div>

              <CommonButton
                type="submit"
                size="md"
                variant="primary"
                label={S.BTN_SUBMIT}
                isLoading={loading}
                className="w-full"
              />
            </form>
          </Card>

          {/* Summary */}
          <Card title={S.SECTION_SUMMARY} value="" icon="📊">
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-6 text-center">
              <div>
                <div className="text-gray-400">{S.LABEL_TOTAL_SESSIONS}</div>
                <div className="text-2xl font-bold">{overallStats.sessions}</div>
              </div>
              <div>
                <div className="text-gray-400">{S.LABEL_TOTAL_EXPECTED}</div>
                <div className="text-2xl font-bold">{overallStats.expected}</div>
              </div>
              <div>
                <div className="text-gray-400">{S.LABEL_TOTAL_ATTENDED}</div>
                <div className="text-2xl font-bold">{overallStats.attended}</div>
              </div>
              <div>
                <div className="text-gray-400">{S.LABEL_OVERALL_PERCENT}</div>
                <div className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-green-400 to-blue-500">
                  {overallStats.pct}%
                </div>
              </div>
            </div>
          </Card>

          {/* Records Table */}
          <section>
            <h2 className="text-2xl font-semibold mb-4">{S.SECTION_RECORDS}</h2>
            <div className="bg-gray-800 p-4 rounded shadow">
              <CommonTable
                columns={recordCols}
                data={records}
                loading={loading}
                noDataMessage={S.NO_RECORDS}
              />
            </div>
          </section>
        </main>
      </div>
    </div>
  );
};

export default React.memo(AttendancePage);

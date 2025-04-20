// -----------------------------
// src/pages/Teacher/TeacherProfile.tsx
// -----------------------------
import React, { useState, useEffect, useCallback, useMemo } from "react";

// Common UI components
import Sidebar from "../../components/common/Sidebar";
import Navbar from "../../components/common/Navbar";
import Card from "../../components/common/Card";
import CommonTable, { Column } from "../../components/common/Table";
import Button from "../../components/common/Button";

// Services
import teacherService, { Teacher } from "../../services/teacherService";
import userService, { User } from "../../services/userService";

// Strings
import { TEACHER_PROFILE_STRINGS } from "../../constants/teacher/profileConsts";

// Table row type
type ProfileRow = { id: number; field: string; value: string | number };

/**
 * TeacherProfile Component
 * -------------------------
 * Fetches and displays the logged-in teacher's profile and user details.
 * Each API call has its own exception handling.
 */
const TeacherProfile: React.FC = () => {
  const [teacher, setTeacher] = useState<Teacher | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  /**
   * fetchProfile
   * -------------
   * 1. Retrieve teacherId from sessionStorage
   * 2. Fetch teacher details
   * 3. Fetch linked user details
   */
  const fetchProfile = useCallback(async () => {
    setLoading(true);
    setError(null);

    // 1. Get teacher ID
    const teacherId = sessionStorage.getItem("userId");
    if (!teacherId) {
      setError(TEACHER_PROFILE_STRINGS.ERROR_NO_USER_ID);
      setLoading(false);
      return;
    }

    // 2. Fetch teacher details
    let teacherData: Teacher;
    try {
      teacherData = await teacherService.getById(Number(teacherId));
      setTeacher(teacherData);
    } catch (e) {
      console.error("Error fetching teacher:", e);
      setError(TEACHER_PROFILE_STRINGS.ERROR_FETCH_TEACHER);
      setLoading(false);
      return;
    }

    // 3. Fetch user account details
    try {
      const userData = await userService.getById(teacherData.userId);
      setUser(userData);
    } catch (e) {
      console.error("Error fetching user:", e);
      setError(TEACHER_PROFILE_STRINGS.ERROR_FETCH_USER);
    } finally {
      setLoading(false);
    }
  }, []);

  // Load on mount
  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

  // Prepare rows for the details table
  const profileRows: ProfileRow[] = useMemo(() => {
    if (!teacher || !user) return [];
    return [
      { id: 1, field: TEACHER_PROFILE_STRINGS.LABEL_ID, value: teacher.id },
      { id: 2, field: TEACHER_PROFILE_STRINGS.LABEL_NAME, value: teacher.name },
      { id: 3, field: TEACHER_PROFILE_STRINGS.LABEL_EMAIL, value: user.email },
      {
        id: 4,
        field: TEACHER_PROFILE_STRINGS.LABEL_PHONE,
        value: teacher.phone,
      },
      {
        id: 6,
        field: TEACHER_PROFILE_STRINGS.LABEL_ADDRESS,
        value: teacher.address,
      },
      {
        id: 7,
        field: TEACHER_PROFILE_STRINGS.LABEL_JOINING_DATE,
        value:
          typeof teacher.joiningDate === "object" &&
          teacher.joiningDate instanceof Date
            ? teacher.joiningDate.toLocaleDateString()
            : String(teacher.joiningDate),
      },
      { id: 8, field: TEACHER_PROFILE_STRINGS.LABEL_ROLE, value: user.role },
    ];
  }, [teacher, user]);

  // Table columns
  const columns: Column<ProfileRow>[] = useMemo(
    () => [
      { header: "Field", accessor: "field" },
      { header: "Value", accessor: (row) => row.value },
    ],
    []
  );

  return (
    <div className="min-h-screen flex font-roboto bg-gradient-to-br from-gray-900 to-black">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <Navbar />
        <main className="p-8">
          {/* Heading and Refresh Button */}
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500">
              {TEACHER_PROFILE_STRINGS.PAGE_HEADING}
            </h1>
            <Button
              label={TEACHER_PROFILE_STRINGS.BUTTON_REFRESH}
              onClick={fetchProfile}
              isLoading={loading}
              variant="primary"
            />
          </div>

          {/* Error Message */}
          {error && <p className="text-red-500 mb-4">{error}</p>}

          {/* Profile Summary Card and Details Table */}
          {teacher && user ? (
            <>
              <Card
                title={teacher.name}
                value={user.email}
                icon="👨‍🏫"
                className="mb-8"
              >
                <p className="text-gray-400">Role: {user.role}</p>
              </Card>

              <CommonTable columns={columns} data={profileRows} />
            </>
          ) : (
            !loading && (
              <p className="text-white">{TEACHER_PROFILE_STRINGS.NO_DATA}</p>
            )
          )}
        </main>
      </div>
    </div>
  );
};

export default TeacherProfile;

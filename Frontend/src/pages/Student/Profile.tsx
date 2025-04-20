// src/pages/Student/StudentProfile.tsx
import React, { useState, useEffect, useCallback, useMemo } from "react";

// Common UI components
import Sidebar from "../../components/common/Sidebar";
import Navbar from "../../components/common/Navbar";
import Card from "../../components/common/Card";
import CommonTable, { Column } from "../../components/common/Table";
import Button from "../../components/common/Button";

// Services
import studentService from "../../services/studentService";
import userService from "../../services/userService";

// Strings
import { STUDENT_PROFILE_STRINGS } from "../../constants/student/profileConsts";

// Types
import type { Student } from "../../services/studentService";
import type { User } from "../../services/userService";

// Table row shape
type ProfileRow = {
  id: number;
  field: string;
  value: string | number;
};

/**
 * StudentProfile Component
 * -------------------------
 * Fetches and displays the logged-in student's profile and account details.
 * Each fetch is wrapped in its own try–catch for isolated error handling.
 */
const StudentProfile: React.FC = () => {
  // State
  const [student, setStudent] = useState<Student | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  /**
   * fetchProfile
   * -------------
   * Retrieves student record, then linked user account info.
   */
  const fetchProfile = useCallback(async () => {
    setLoading(true);
    setError(null);

    // 1. Get student ID from session
    const studentId = sessionStorage.getItem("userId");
    if (!studentId) {
      setError(STUDENT_PROFILE_STRINGS.ERROR_NO_USER_ID);
      setLoading(false);
      return;
    }

    // 2. Fetch student details
    let studentData: Student;
    try {
      studentData = await studentService.getById(Number(studentId));
      setStudent(studentData);
    } catch (e) {
      console.error("Student fetch error:", e);
      setError(STUDENT_PROFILE_STRINGS.ERROR_FETCH_STUDENT);
      setLoading(false);
      return;
    }

    // 3. Fetch linked user account
    try {
      const userData = await userService.getById(studentData.userId);
      setUser(userData);
    } catch (e) {
      console.error("User fetch error:", e);
      setError(STUDENT_PROFILE_STRINGS.ERROR_FETCH_USER);
    } finally {
      setLoading(false);
    }
  }, []);

  // Fetch on mount
  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

  // Prepare table data via useMemo
  const profileRows: ProfileRow[] = useMemo(() => {
    if (!student || !user) return [];
    return [
      { id: 1, field: STUDENT_PROFILE_STRINGS.LABEL_ID, value: student.id },
      {
        id: 2,
        field: STUDENT_PROFILE_STRINGS.LABEL_NAME,
        value: `${student.firstName} ${student.lastName}`,
      },
      { id: 3, field: STUDENT_PROFILE_STRINGS.LABEL_EMAIL, value: user.email },
      {
        id: 4,
        field: STUDENT_PROFILE_STRINGS.LABEL_DOB,
        value: student.dateOfBirth,
      },
      {
        id: 5,
        field: STUDENT_PROFILE_STRINGS.LABEL_GENDER,
        value: student.gender,
      },
      {
        id: 6,
        field: STUDENT_PROFILE_STRINGS.LABEL_ADDRESS,
        value: student.address,
      },
      {
        id: 7,
        field: STUDENT_PROFILE_STRINGS.LABEL_CONTACT,
        value: student.contactNumber,
      },
      {
        id: 8,
        field: STUDENT_PROFILE_STRINGS.LABEL_NATIONALITY,
        value: student.nationality,
      },
      { id: 9, field: STUDENT_PROFILE_STRINGS.LABEL_ROLE, value: user.role },
    ];
  }, [student, user]);

  // Columns for CommonTable
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
          {/* Heading & Refresh */}
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500">
              {STUDENT_PROFILE_STRINGS.PAGE_HEADING}
            </h1>
            <Button
              label={STUDENT_PROFILE_STRINGS.BUTTON_REFRESH}
              onClick={fetchProfile}
              isLoading={loading}
              variant="primary"
            />
          </div>

          {/* Error Message */}
          {error && <p className="text-red-500 mb-4">{error}</p>}

          {/* Profile Card & Details Table */}
          {student && user ? (
            <>
              {/* Summary Card */}
              <Card
                title={`${student.firstName} ${student.lastName}`}
                value={user.email}
                icon="👤"
                className="mb-8"
              >
                <p className="text-gray-400">Role: {user.role}</p>
              </Card>

              {/* Detailed Table */}
              <CommonTable columns={columns} data={profileRows} />
            </>
          ) : (
            !loading && (
              <p className="text-white">{STUDENT_PROFILE_STRINGS.NO_DATA}</p>
            )
          )}
        </main>
      </div>
    </div>
  );
};

export default StudentProfile;

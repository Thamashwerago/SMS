// src/pages/Student/StudentProfile.tsx
import React, { useState, useEffect, useCallback, useMemo } from "react";

// Common UI components
import Sidebar from "../../components/common/Sidebar";
import Navbar from "../../components/common/Navbar";
import Card from "../../components/common/Card";
import CommonTable, { Column } from "../../components/common/Table";
import CommonButton from "../../components/common/Button";

// Services
import studentService from "../../services/studentService";
import userService from "../../services/userService";

// Strings
import { STUDENT_PROFILE_STRINGS as STR } from "../../constants/student/profileConsts";

// Types
import type { Student } from "../../services/studentService";
import type { User } from "../../services/userService";

// Table row shape
type ProfileRow = {
  id: number;
  field: string;
  value: string | number;
};

const StudentProfile: React.FC = () => {
  const [student, setStudent] = useState<Student | null>(null);
  const [user, setUser]       = useState<User | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState<string | null>(null);

  const fetchProfile = useCallback(async () => {
    setLoading(true);
    setError(null);

    const sid = Number(sessionStorage.getItem("userId") ?? 0);
    if (!sid) {
      setError(STR.ERROR_NO_USER_ID);
      return setLoading(false);
    }

    // 1) student data
    try {
      const s = await studentService.getById(sid);
      setStudent(s);
    } catch (e) {
      console.error("Error fetching student:", e);
      setError(STR.ERROR_FETCH_STUDENT);
      return setLoading(false);
    }

    // 2) user data
    try {
      const u = await userService.getById(student!.userId);
      setUser(u);
    } catch (e) {
      console.error("Error fetching user:", e);
      setError(STR.ERROR_FETCH_USER);
    } finally {
      setLoading(false);
    }
  }, [student]);

  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

  const profileRows: ProfileRow[] = useMemo(() => {
    if (!student || !user) return [];
    return [
      { id: 1, field: STR.LABEL_ID,           value: student.id },
      { id: 2, field: STR.LABEL_NAME,         value: `${student.firstName} ${student.lastName}` },
      { id: 3, field: STR.LABEL_EMAIL,        value: user.email },
      { id: 4, field: STR.LABEL_DOB,          value: student.dateOfBirth },
      { id: 5, field: STR.LABEL_GENDER,       value: student.gender },
      { id: 6, field: STR.LABEL_ADDRESS,      value: student.address },
      { id: 7, field: STR.LABEL_CONTACT,      value: student.contactNumber },
      { id: 8, field: STR.LABEL_NATIONALITY,  value: student.nationality },
      { id: 9, field: STR.LABEL_ROLE,         value: user.role },
    ];
  }, [student, user]);

  const columns: Column<ProfileRow>[] = useMemo(
    () => [
      { header: "Field", accessor: "field" },
      { header: "Value", accessor: row => row.value },
    ],
    []
  );

  return (
    <div className="min-h-screen flex bg-gray-900 text-white">
      <Sidebar />
      <div className="ml-64 flex-1 flex flex-col overflow-hidden">
        <Navbar />

        <main className="p-6 space-y-8">
          {/* Header */}
          <div className="flex items-center justify-between">
            <h1 className="text-3xl font-bold">
              {STR.PAGE_HEADING}
            </h1>
            <CommonButton
              size="md"
              variant="primary"
              label={STR.BUTTON_REFRESH}
              onClick={fetchProfile}
              isLoading={loading}
            />
          </div>

          {/* Error Banner */}
          {error && (
            <div className="p-4 bg-red-600 rounded text-white">
              {error}
            </div>
          )}

          {/* Profile Summary Card */}
          {student && user && (
            <Card
              title={`${student.firstName} ${student.lastName}`}
              value={user.email}
              icon="👤"
              className="bg-black bg-opacity-50 border border-indigo-500 rounded-xl shadow-xl p-6"
            >
              <p className="text-gray-300">Role: {user.role}</p>
            </Card>
          )}

          {/* Details Table */}
          {student && user && (
            <div className="bg-black bg-opacity-50 border border-indigo-500 rounded-xl shadow-xl p-6">
              <CommonTable
                columns={columns}
                data={profileRows}
                noDataMessage={STR.NO_DATA}
              />
            </div>
          )}

          {/* Fallback when no data */}
          {!loading && !student && !error && (
            <p className="text-gray-400">{STR.NO_DATA}</p>
          )}
        </main>
      </div>
    </div>
  );
};

export default React.memo(StudentProfile);

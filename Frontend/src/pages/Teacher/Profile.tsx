// src/pages/Teacher/TeacherProfile.tsx
import React, { useState, useEffect, useCallback, useMemo } from "react";

// Common UI components
import Sidebar from "../../components/common/Sidebar";
import Navbar from "../../components/common/Navbar";
import Card from "../../components/common/Card";
import CommonTable, { Column } from "../../components/common/Table";
import CommonButton from "../../components/common/Button";

// Services
import teacherService, { Teacher } from "../../services/teacherService";
import userService, { User } from "../../services/userService";

// Strings
import { TEACHER_PROFILE_STRINGS as S } from "../../constants/teacher/profileConsts";

type ProfileRow = { id: number; field: string; value: string | number };

const TeacherProfile: React.FC = () => {
  const [teacher, setTeacher] = useState<Teacher | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchProfile = useCallback(async () => {
    setLoading(true);
    setError(null);

    const tid = Number(sessionStorage.getItem("userId") ?? 0);
    if (!tid) {
      setError(S.ERROR_NO_USER_ID);
      setLoading(false);
      return;
    }

    try {
      const t = await teacherService.getById(tid);
      setTeacher(t);
      const u = await userService.getById(t.userId);
      setUser(u);
    } catch (e) {
      console.error(e);
      setError(S.ERROR_FETCH_PROFILE);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

  const rows: ProfileRow[] = useMemo(() => {
    if (!teacher || !user) return [];
    return [
      { id: 1, field: S.LABEL_ID, value: teacher.id },
      { id: 2, field: S.LABEL_NAME, value: teacher.name },
      { id: 3, field: S.LABEL_EMAIL, value: user.email },
      { id: 4, field: S.LABEL_PHONE, value: teacher.phone },
      { id: 5, field: S.LABEL_ADDRESS, value: teacher.address },
      { id: 6, field: S.LABEL_JOINING_DATE, value:
          teacher.joiningDate instanceof Date
            ? teacher.joiningDate.toLocaleDateString()
            : String(teacher.joiningDate)
      },
      { id: 7, field: S.LABEL_ROLE, value: user.role },
    ];
  }, [teacher, user]);

  const columns: Column<ProfileRow>[] = useMemo(
    () => [
      { header: "Field", accessor: "field" },
      { header: "Value", accessor: r => r.value },
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
              label={S.BUTTON_REFRESH}
              onClick={fetchProfile}
              isLoading={loading}
            />
          </div>

          {/* Error */}
          {error && (
            <div className="p-4 bg-red-600 rounded text-white">
              {error}
            </div>
          )}

          {/* Summary Card */}
          {teacher && user && (
            <Card
              title={teacher.name}
              value={user.email}
              icon="👨‍🏫"
            >
              <p className="text-gray-300">Role: {user.role}</p>
            </Card>
          )}

          {/* Details Table */}
          {rows.length > 0 && (
            <div className="bg-gray-800 rounded-lg shadow overflow-hidden">
              <CommonTable
                columns={columns}
                data={rows}
                loading={loading}
                noDataMessage={S.NO_DATA}
              />
            </div>
          )}

          {/* No Data */}
          {!loading && rows.length === 0 && !error && (
            <p className="text-center text-gray-400">{S.NO_DATA}</p>
          )}
        </main>
      </div>
    </div>
  );
};

export default React.memo(TeacherProfile);

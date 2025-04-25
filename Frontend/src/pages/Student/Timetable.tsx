// src/pages/Student/Timetable.tsx
import React, { useState, useEffect, useCallback, useMemo } from "react";

// Common UI components
import Sidebar from "../../components/common/Sidebar";
import Navbar from "../../components/common/Navbar";
import Card from "../../components/common/Card";
import CommonTable from "../../components/common/Table";
import CommonButton from "../../components/common/Button";

// Services
import courseService from "../../services/courseService";
import timetableService, { TimetableEntry } from "../../services/timetableService";

// Strings
import { TIMETABLE_STRINGS as STR } from "../../constants/student/timetableConsts";

const Timetable: React.FC = () => {
  const [entries, setEntries] = useState<TimetableEntry[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);

    const sid = Number(sessionStorage.getItem("userId") ?? 0);
    if (!sid) {
      setError(STR.ERROR_NO_USER_ID);
      return setLoading(false);
    }

    // fetch assignments
    let assigns;
    try {
      assigns = await courseService.getAllCourseAssigns();
      assigns = assigns.filter(a => a.userId === sid);
    } catch (e) {
      console.error(e);
      setError(STR.ERROR_FETCH_ASSIGNMENTS);
      return setLoading(false);
    }

    const courseIds = assigns.map(a => a.courseId);

    // fetch timetable
    let all;
    try {
      all = await timetableService.getAll();
    } catch (e) {
      console.error(e);
      setError(STR.ERROR_FETCH_TIMETABLE);
      return setLoading(false);
    }

    setEntries(all.filter(e => courseIds.includes(e.courseId)));
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // group by date
  const byDay = useMemo(() => {
    return entries.reduce<Record<string, TimetableEntry[]>>((acc, e) => {
      if (!acc[e.date]) {
        acc[e.date] = [];
      }
      acc[e.date].push(e);
      return acc;
    }, {});
  }, [entries]);

  const dates = Object.keys(byDay).sort((a, b) => a.localeCompare(b));

  return (
    <div className="min-h-screen flex bg-gray-900 text-white">
      <Sidebar />
      <div className="ml-64 flex-1 flex flex-col overflow-hidden">
        <Navbar />

        <main className="p-6 space-y-8">
          {/* Header */}
          <div className="flex items-center justify-between">
            <h1 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500">
              {STR.PAGE_HEADING}
            </h1>
            <CommonButton
              size="md"
              variant="primary"
              label={STR.BTN_REFRESH}
              onClick={fetchData}
              isLoading={loading}
            />
          </div>

          {/* Errors / No data */}
          {error && (
            <div className="p-4 bg-red-600 rounded text-white">
              {error}
            </div>
          )}
          {!loading && !error && entries.length === 0 && (
            <p className="text-gray-400">{STR.NO_DATA}</p>
          )}

          {/* Timetable grouped by day */}
          {dates.map(date => (
            <Card
              key={date}
              title={date}
              className="bg-black bg-opacity-50 border border-indigo-500 rounded-xl shadow-xl p-6"
              value=""
            >
              <CommonTable<TimetableEntry>
                columns={[
                  {
                    header: STR.COL_COURSE,
                    accessor: e => e.courseId.toString(),
                  },
                  {
                    header: STR.COL_TIME,
                    accessor: e => `${e.startTime} - ${e.endTime}`,
                  },
                  {
                    header: STR.COL_TEACHER,
                    accessor: e => e.teacherId.toString(),
                  },
                  {
                    header: STR.COL_CLASSROOM,
                    accessor: e => e.classroom,
                  },
                ]}
                data={byDay[date]}
                loading={loading}
                noDataMessage={STR.NO_DATA}
              />
            </Card>
          ))}
        </main>
      </div>
    </div>
  );
};

export default React.memo(Timetable);

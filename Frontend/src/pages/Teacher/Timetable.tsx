// src/pages/Teacher/TeacherTimetable.tsx
import React, { useState, useEffect, useCallback, useMemo } from "react";
import Sidebar from "../../components/common/Sidebar";
import Navbar from "../../components/common/Navbar";
import Card from "../../components/common/Card";
import CommonTable, { Column } from "../../components/common/Table";
import Chart from "../../components/common/Chart";
import Button from "../../components/common/Button";

import timetableService, {
  TimetableEntry,
} from "../../services/timetableService";
import { TEACHER_TIMETABLE_STRINGS as STR } from "../../constants/teacher/timetableConsts";

/**
 * TeacherTimetable Component
 * ---------------------------
 * Fetches and displays the logged-in teacher's timetable.
 * Shows metrics, a bar chart of classes per day, and a detailed table.
 */
const TeacherTimetable: React.FC = () => {
  const [entries, setEntries] = useState<TimetableEntry[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  /**
   * fetchData
   * ---------
   * Retrieves timetable entries for this teacher from the service.
   */
  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);

    // 1. Get teacher ID
    const teacherId = sessionStorage.getItem("userId");
    if (!teacherId) {
      setError(STR.ERROR_NO_TEACHER_ID);
      setLoading(false);
      return;
    }
    const tid = Number(teacherId);

    // 2. Fetch and filter
    try {
      const all = await timetableService.getAll();
      const filtered = all.filter((e) => e.teacherId === tid);
      setEntries(filtered);
    } catch (e) {
      console.error("Timetable fetch error:", e);
      setError(STR.ERROR_FETCH_TIMETABLE);
    } finally {
      setLoading(false);
    }
  }, []);

  // Load on mount
  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Today's date
  const today = useMemo(() => new Date().toISOString().slice(0, 10), []);

  // Metrics: today's classes count and this week's total
  const { todayCount, weekCount } = useMemo(() => {
    const todayEntries = entries.filter((e) => e.date === today);
    return { todayCount: todayEntries.length, weekCount: entries.length };
  }, [entries, today]);

  // Chart: classes per unique date
  const chartData = useMemo(() => {
    const counts: Record<string, number> = {};
    entries.forEach((e) => {
      counts[e.date] = (counts[e.date] || 0) + 1;
    });
    const labels = Object.keys(counts).sort((a, b) => a.localeCompare(b));
    const data = labels.map((d) => counts[d]);
    return { labels, datasets: [{ label: STR.CHART_LABEL, data }] };
  }, [entries]);

  const chartOptions = useMemo(
    () => ({
      responsive: true,
      plugins: {
        legend: { position: "top" as const, labels: { color: "white" } },
        title: { display: true, text: STR.CHART_TITLE, color: "white" },
      },
      scales: {
        x: {
          ticks: { color: "white" },
          grid: { color: "rgba(255,255,255,0.1)" },
        },
        y: {
          ticks: { color: "white" },
          grid: { color: "rgba(255,255,255,0.1)" },
        },
      },
    }),
    []
  );

  // Table columns
  const columns: Column<TimetableEntry>[] = useMemo(
    () => [
      { header: STR.COL_DATE, accessor: "date" },
      { header: STR.COL_COURSE, accessor: "courseId" },
      { header: STR.COL_ROOM, accessor: "classroom" },
      {
        header: STR.COL_TIME,
        accessor: (entry) => `${entry.startTime} - ${entry.endTime}`,
      },
    ],
    []
  );

  return (
    <div className="min-h-screen flex font-roboto bg-gradient-to-br from-gray-900 to-black">
      <Sidebar />
      <div className="ml-64 flex-1 flex flex-col overflow-x-hidden">
        <Navbar />
        <main className="p-8 space-y-8 overflow-x-auto">
          {/* Heading & Refresh */}
          <div className="flex justify-between items-center">
            <h1 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500">
              {STR.PAGE_HEADING}
            </h1>
            <Button
              label={STR.BTN_REFRESH}
              onClick={fetchData}
              isLoading={loading}
              variant="primary"
            />
          </div>

          {/* Error */}
          {error && <p className="text-red-500">{error}</p>}

          {/* Metrics Cards */}
          <section className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <Card
              title={STR.LABEL_TODAY_CLASSES}
              value={todayCount}
              icon="📆"
            />
            <Card title={STR.LABEL_WEEK_CLASSES} value={weekCount} icon="📅" />
          </section>

          {/* Chart */}
          <section className="bg-black bg-opacity-50 border border-indigo-500 rounded-xl shadow-xl p-6">
            <Chart type="bar" data={chartData} options={chartOptions} />
          </section>

          {/* Detailed Table */}
          <section>
            {entries.length > 0 ? (
              <CommonTable columns={columns} data={entries} />
            ) : (
              <p className="text-white">{STR.NO_DATA}</p>
            )}
          </section>
        </main>
      </div>
    </div>
  );
};

export default TeacherTimetable;

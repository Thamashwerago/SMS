// src/pages/Teacher/TeacherTimetable.tsx
import React, { useState, useEffect, useCallback, useMemo } from "react";
import Sidebar from "../../components/common/Sidebar";
import Navbar from "../../components/common/Navbar";
import Card from "../../components/common/Card";
import CommonTable, { Column } from "../../components/common/Table";
import Chart from "../../components/common/Chart";
import CommonButton from "../../components/common/Button";

import timetableService, { TimetableEntry } from "../../services/timetableService";
import { TEACHER_TIMETABLE_STRINGS as STR } from "../../constants/teacher/timetableConsts";

const TeacherTimetable: React.FC = () => {
  const [entries, setEntries] = useState<TimetableEntry[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);

    const tid = Number(sessionStorage.getItem("userId") ?? 0);
    if (!tid) {
      setError(STR.ERROR_NO_TEACHER_ID);
      setLoading(false);
      return;
    }

    try {
      const all = await timetableService.getAll();
      setEntries(all.filter((e) => e.teacherId === tid));
    } catch (e) {
      console.error(e);
      setError(STR.ERROR_FETCH_TIMETABLE);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const today = useMemo(() => new Date().toISOString().slice(0, 10), []);
  const { todayCount, weekCount } = useMemo(() => {
    const t = entries.filter((e) => e.date === today).length;
    return { todayCount: t, weekCount: entries.length };
  }, [entries, today]);

  const chartData = useMemo(() => {
    const counts: Record<string, number> = {};
    entries.forEach((e) => { counts[e.date] = (counts[e.date] || 0) + 1; });
    const labels = Object.keys(counts).sort((a, b) => a.localeCompare(b));
    return {
      labels,
      datasets: [{ label: STR.CHART_LABEL, data: labels.map((d) => counts[d]) }],
    };
  }, [entries]);

  const chartOptions = useMemo(() => ({
    responsive: true,
    plugins: {
      legend: { position: "top" as const, labels: { color: "white" } },
      title: { display: true, text: STR.CHART_TITLE, color: "white" },
    },
    scales: {
      x: { ticks: { color: "white" }, grid: { color: "rgba(255,255,255,0.1)" } },
      y: { ticks: { color: "white" }, grid: { color: "rgba(255,255,255,0.1)" } },
    },
  }), []);

  const columns: Column<TimetableEntry>[] = useMemo(() => [
    { header: STR.COL_DATE, accessor: "date" },
    { header: STR.COL_COURSE, accessor: "courseId" },
    { header: STR.COL_ROOM, accessor: "classroom" },
    { header: STR.COL_TIME, accessor: (e) => `${e.startTime} - ${e.endTime}` },
  ], []);

  return (
    <div className="min-h-screen flex bg-gray-900 text-white">
      <Sidebar />
      <div className="ml-64 flex-1 flex flex-col">
        <Navbar />

        <main className="p-6 space-y-8 overflow-x-auto">
          {/* Header */}
          <div className="flex justify-between items-center">
            <h1 className="text-3xl font-bold">{STR.PAGE_HEADING}</h1>
            <CommonButton
              size="md"
              variant="primary"
              label={STR.BTN_REFRESH}
              onClick={fetchData}
              isLoading={loading}
            />
          </div>

          {/* Error */}
          {error && (
            <div className="p-4 bg-red-600 rounded text-white">
              {error}
            </div>
          )}

          {/* Metrics */}
          <section className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <Card title={STR.LABEL_TODAY_CLASSES} value={todayCount} icon="📆" loading={loading} />
            <Card title={STR.LABEL_WEEK_CLASSES} value={weekCount} icon="📅" loading={loading} />
          </section>

          {/* Chart */}
          <section className="bg-gray-800 bg-opacity-50 border border-indigo-500 rounded-xl shadow-xl p-6">
            <Chart type="bar" data={chartData} options={chartOptions} />
          </section>

          {/* Table */}
          <section className="bg-gray-800 rounded-lg shadow overflow-hidden">
            <CommonTable
              columns={columns}
              data={entries}
              loading={loading}
              noDataMessage={STR.NO_DATA}
            />
          </section>
        </main>
      </div>
    </div>
  );
};

export default React.memo(TeacherTimetable);

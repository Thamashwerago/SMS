import React, { KeyboardEvent } from "react";
import {
  COURSE_CARD_TEACHER_LABEL,
  COURSE_CARD_ATTENDANCE_LABEL,
  COURSE_CARD_LAST_UPDATED_LABEL,
  COURSE_CARD_NOT_AVAILABLE,
} from "../../constants/components/courseCardStrings";

export interface AggregatedCourseAttendance {
  courseId: number;
  courseName: string;
  teacher: string;
  totalStudents: number;
  present: number;
  updatedAt: string; // ISO timestamp
  records: unknown[];
}

export interface CourseCardProps {
  course: AggregatedCourseAttendance;
  onClick: (course: AggregatedCourseAttendance) => void;
}

const timeAgo = (isoDate: string) => {
  const now = Date.now();
  const then = new Date(isoDate).getTime();
  const diff = now - then;
  const minute = 60_000;
  const hour = 60 * minute;
  const day = 24 * hour;

  if (diff < minute) return `${Math.floor(diff / 1000)}s ago`;
  if (diff < hour) return `${Math.floor(diff / minute)}m ago`;
  if (diff < day) return `${Math.floor(diff / hour)}h ago`;
  return `${Math.floor(diff / day)}d ago`;
};

const getAttendanceColor = (pct: number) => {
  if (pct >= 75) return "bg-green-500";
  if (pct >= 50) return "bg-yellow-400";
  return "bg-red-500";
};

const getInitials = (name: string) =>
  name
    .split(" ")
    .map((n) => n[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

const CourseCard: React.FC<CourseCardProps> = React.memo(
  ({ course, onClick }) => {
    const { courseName, teacher, totalStudents, present, updatedAt } = course;

    const attendancePct =
      totalStudents > 0
        ? Math.min(100, (present / totalStudents) * 100)
        : -1;

    const displayPct =
      attendancePct >= 0
        ? `${attendancePct.toFixed(1)}%`
        : COURSE_CARD_NOT_AVAILABLE;

    const handleKeyDown = (e: KeyboardEvent<HTMLButtonElement>) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        onClick(course);
      }
    };

    return (
      <button
        type="button"
        onClick={() => onClick(course)}
        onKeyDown={handleKeyDown}
        aria-label={`View details for ${courseName}`}
        className="
          group
          w-full
          text-left
          bg-white dark:bg-gray-800
          border border-gray-200 dark:border-gray-700
          rounded-xl
          p-6
          shadow-sm
          hover:shadow-lg hover:scale-[1.02]
          focus:outline-none focus:ring-2 focus:ring-indigo-400
          transition-transform duration-200
        "
      >
        {/* Course Title */}
        <h2
          className="text-xl font-semibold text-gray-900 dark:text-gray-100 truncate"
          title={courseName}
        >
          {courseName}
        </h2>

        {/* Teacher with Avatar */}
        <div className="flex items-center mt-3">
          <div
            className="
              flex-shrink-0
              w-8 h-8
              rounded-full
              bg-indigo-600
              text-white
              flex items-center justify-center
              font-medium
            "
            title={teacher}
          >
            {getInitials(teacher)}
          </div>
          <p
            className="ml-3 text-sm text-gray-700 dark:text-gray-300 truncate"
            title={teacher}
          >
            {COURSE_CARD_TEACHER_LABEL} {teacher}
          </p>
        </div>

        {/* Attendance */}
        <div className="mt-4">
          <div className="flex justify-between items-center mb-1">
            <p className="text-sm text-gray-700 dark:text-gray-300">
              {COURSE_CARD_ATTENDANCE_LABEL} {displayPct}
            </p>
            {attendancePct >= 0 && (
              <span
                className={`
                  text-xs font-medium px-2 py-0.5
                  ${attendancePct >= 75 ? "bg-green-100 text-green-800" : 
                    attendancePct >= 50 ? "bg-yellow-100 text-yellow-800" : 
                    "bg-red-100 text-red-800"}
                  rounded-full
                `}
              >
                {attendancePct >= 75
                  ? "Good"
                  : attendancePct >= 50
                  ? "Moderate"
                  : "Low"}
              </span>
            )}
          </div>
          {attendancePct >= 0 && (
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 overflow-hidden">
              <div
                className={`h-full ${getAttendanceColor(attendancePct)} w-[${attendancePct}%]`}
              />
            </div>
          )}
        </div>

        {/* Last Updated */}
        <p className="mt-4 text-xs text-gray-500 dark:text-gray-400">
          {COURSE_CARD_LAST_UPDATED_LABEL} {timeAgo(updatedAt)}
        </p>
      </button>
    );
  }
);

CourseCard.displayName = "CourseCard";
export default CourseCard;

import React from "react";
import {
  COURSE_CARD_TEACHER_LABEL,
  COURSE_CARD_ATTENDANCE_LABEL,
  COURSE_CARD_LAST_UPDATED_LABEL,
  COURSE_CARD_NOT_AVAILABLE,
} from "../../constants/components/courseCardStrings";

/**
 * AggregatedCourseAttendance interface
 * --------------------------------------
 * Describes the shape of the course attendance data.
 */
export interface AggregatedCourseAttendance {
  courseId: number;
  courseName: string;
  teacher: string;
  totalStudents: number;
  present: number;
  updatedAt: string;
  records: {
    id: number;
    userId: number;
    role: string;
    courseId: number;
    date: string;
    status: string;
  }[];
}

/**
 * CourseCardProps interface
 * ---------------------------
 * Defines the props for the CourseCard component.
 * @property course - The course attendance data.
 * @property onClick - Callback function when the card is clicked.
 */
export interface CourseCardProps {
  course: AggregatedCourseAttendance;
  onClick: (course: AggregatedCourseAttendance) => void;
}

/**
 * CourseCard Component
 * ----------------------
 * A reusable, button-style card that displays course information such as
 * course name, teacher, attendance percentage, and last updated timestamp.
 * This component is memoized to avoid unnecessary re-renders.
 *
 * @param {CourseCardProps} props - The properties for the component.
 * @returns A styled card element.
 */
const CourseCard: React.FC<CourseCardProps> = React.memo(
  ({ course, onClick }) => {
    // Calculate attendance percentage or show "N/A" if totalStudents is zero.
    const attendancePercentage =
      course.totalStudents > 0
        ? ((course.present / course.totalStudents) * 100).toFixed(1)
        : COURSE_CARD_NOT_AVAILABLE;

    return (
      <button
        onClick={() => onClick(course)}
        className="bg-black bg-opacity-50 border border-indigo-500 rounded-xl p-6 shadow-xl hover:scale-105 transition-transform duration-300 cursor-pointer w-full text-left"
        aria-label={`View details for ${course.courseName}`}
      >
        {/* Course Title */}
        <h2 className="text-2xl font-bold text-white">{course.courseName}</h2>
        {/* Teacher Information */}
        <p className="text-gray-300 mt-2">
          {COURSE_CARD_TEACHER_LABEL} {course.teacher}
        </p>
        {/* Attendance Information */}
        <p className="text-gray-300 mt-2">
          {COURSE_CARD_ATTENDANCE_LABEL} {attendancePercentage}%
        </p>
        {/* Last Updated Timestamp */}
        <p className="text-sm text-gray-400 mt-1">
          {COURSE_CARD_LAST_UPDATED_LABEL} {course.updatedAt}
        </p>
      </button>
    );
  }
);

CourseCard.displayName = "CourseCard";
export default CourseCard;

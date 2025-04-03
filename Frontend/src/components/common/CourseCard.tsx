import React from 'react';

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

export interface CourseCardProps {
  course: AggregatedCourseAttendance;
  onClick: (course: AggregatedCourseAttendance) => void;
}

const CourseCard: React.FC<CourseCardProps> = React.memo(({ course, onClick }) => {
  const attendancePercentage =
    course.totalStudents > 0 ? ((course.present / course.totalStudents) * 100).toFixed(1) : 'N/A';
  return (
    <button
      onClick={() => onClick(course)}
      className="bg-black bg-opacity-50 border border-indigo-500 rounded-xl p-6 shadow-xl hover:scale-105 transition-transform duration-300 cursor-pointer w-full text-left"
    >
      <h2 className="text-2xl font-bold text-white">{course.courseName}</h2>
      <p className="text-gray-300 mt-2">Teacher: {course.teacher}</p>
      <p className="text-gray-300 mt-2">Attendance: {attendancePercentage}%</p>
      <p className="text-sm text-gray-400 mt-1">Last Updated: {course.updatedAt}</p>
    </button>
  );
});

export default CourseCard;

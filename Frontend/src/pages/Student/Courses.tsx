// src/pages/Student/MyCourses.tsx
import React, { useState, useMemo, ChangeEvent } from 'react';
import Sidebar from '../../components/common/Sidebar';
import Navbar from '../../components/common/Navbar';

interface Course {
  id: number;
  code: string;
  name: string;
  credits: number;
  duration: number;
  description: string;
  teacher: string;
}

// Dummy course data representing courses the student is enrolled in.
const enrolledCourses: Course[] = [
  {
    id: 1,
    code: 'CS101',
    name: 'Introduction to Computer Science',
    credits: 3,
    duration: 40,
    description:
      'An introductory course that covers computer science fundamentals and basic programming concepts.',
    teacher: 'Prof. Jane Doe',
  },
  {
    id: 2,
    code: 'MATH201',
    name: 'Calculus II',
    credits: 4,
    duration: 50,
    description:
      'A deep dive into integration techniques, series, and multivariable calculus applications.',
    teacher: 'Dr. John Smith',
  },
  {
    id: 3,
    code: 'ENG301',
    name: 'Modern Literature',
    credits: 3,
    duration: 35,
    description:
      'An exploration of contemporary literature, focusing on modern themes and narrative styles.',
    teacher: 'Ms. Emily Clark',
  },
];

const MyCourses: React.FC = () => {
  const [courses] = useState<Course[]>(enrolledCourses);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);

  // Filter courses based on search query (by name, code, or teacher).
  const filteredCourses = useMemo(() => {
    return courses.filter((course) =>
      course.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      course.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
      course.teacher.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [courses, searchQuery]);

  const handleSearchChange = (e: ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  const openCourseModal = (course: Course) => {
    setSelectedCourse(course);
  };

  const closeModal = () => {
    setSelectedCourse(null);
  };

  return (
    <div className="min-h-screen flex font-roboto bg-gradient-to-br from-gray-900 to-black">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <Navbar />
        <main className="p-8">
          <h1 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500 mb-8">
            My Courses
          </h1>
          <div className="mb-6 flex justify-center">
            <input
              type="text"
              placeholder="Search by course name, code, or teacher..."
              value={searchQuery}
              onChange={handleSearchChange}
              className="w-full max-w-md px-4 py-2 bg-black bg-opacity-50 border border-indigo-500 rounded-xl focus:outline-none text-white placeholder-gray-400"
            />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredCourses.map((course) => (
              <button
                key={course.id}
                type="button"
                onClick={() => openCourseModal(course)}
                className="bg-black bg-opacity-50 border border-indigo-500 rounded-xl p-6 shadow-lg transform hover:scale-105 transition duration-300 cursor-pointer text-left w-full"
              >
                <h2 className="text-2xl font-bold text-white">{course.name}</h2>
                <p className="text-gray-300 mt-2">{course.description.substring(0, 100)}...</p>
              </button>
            ))}
            {filteredCourses.length === 0 && (
              <p className="text-white col-span-full text-center">No courses found.</p>
            )}
          </div>
        </main>
      </div>
      {/* Modal for Course Details */}
      {selectedCourse && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-70 z-50">
          <div className="bg-gray-800 p-8 rounded-xl border border-indigo-500 shadow-xl max-w-lg w-full mx-4 animate-fadeIn">
            <h2 className="text-2xl font-bold text-white mb-4">{selectedCourse.name}</h2>
            <p className="text-gray-300 mb-2">
              <span className="font-semibold">Course Code:</span> {selectedCourse.code}
            </p>
            <p className="text-gray-300 mb-2">
              <span className="font-semibold">Credits:</span> {selectedCourse.credits}
            </p>
            <p className="text-gray-300 mb-2">
              <span className="font-semibold">Duration:</span> {selectedCourse.duration} hrs
            </p>
            <p className="text-gray-300 mb-2">
              <span className="font-semibold">Teacher:</span> {selectedCourse.teacher}
            </p>
            <p className="text-gray-300 mb-4">
              <span className="font-semibold">Description:</span> {selectedCourse.description}
            </p>
            <div className="flex justify-end">
              <button
                onClick={closeModal}
                className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 rounded-md text-white font-bold transition duration-300"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MyCourses;

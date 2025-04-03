// src/pages/Teacher/Courses.tsx
import React, { useMemo } from 'react';
import Sidebar from '../../components/common/Sidebar';
import Navbar from '../../components/common/Navbar';
import Card from '../../components/common/Card';

interface Course {
  id: number;
  name: string;
  description: string;
  schedule: string;
}

// Dummy course data for the teacher.
const dummyCourses: Course[] = [
  {
    id: 1,
    name: 'Calculus I',
    description: 'An introduction to calculus concepts including limits, derivatives, and integrals.',
    schedule: 'Mon & Wed 9:00 AM - 10:30 AM',
  },
  {
    id: 2,
    name: 'Physics',
    description: 'Study of classical mechanics, electromagnetism, and thermodynamics.',
    schedule: 'Tue & Thu 11:00 AM - 12:30 PM',
  },
  {
    id: 3,
    name: 'Chemistry',
    description: 'Fundamentals of chemical reactions, the periodic table, and laboratory techniques.',
    schedule: 'Fri 2:00 PM - 3:30 PM',
  },
  {
    id: 4,
    name: 'Computer Science',
    description: 'Basics of programming, algorithms, and data structures.',
    schedule: 'Mon & Wed 11:00 AM - 12:30 PM',
  },
];

const Courses: React.FC = () => {
  // Memoize the courses array in case it will be dynamically updated in the future.
  const courses = useMemo(() => dummyCourses, []);

  return (
    <div className="min-h-screen flex font-roboto bg-gradient-to-br from-gray-900 to-black">
      {/* Sidebar Navigation */}
      <Sidebar />
      <div className="flex-1 flex flex-col">
        {/* Top Navbar */}
        <Navbar />
        <main className="p-8">
          <h1 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500 mb-8">
            My Courses
          </h1>
          <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {courses.map((course) => (
              <Card
                key={course.id}
                title={course.name}
                value={course.schedule}
                icon={<img src="/icons/book.png" alt="Course" className="h-6 w-6" />}
              >
                <p className="text-gray-300 mt-2">{course.description}</p>
              </Card>
            ))}
            {courses.length === 0 && (
              <p className="text-white col-span-full text-center">No courses found.</p>
            )}
          </section>
        </main>
      </div>
    </div>
  );
};

export default Courses;

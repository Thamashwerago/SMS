// src/pages/Admin/CourseManagement.tsx
import React, { useState, useMemo, ChangeEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../../components/common/Sidebar';
import Navbar from '../../components/common/Navbar';

interface Course {
  id: number;
  code: string;
  name: string;
  credits: number;
  duration: number;
  description: string;
}

// Dummy initial course data.
const initialCourses: Course[] = [
  {
    id: 1,
    code: 'PHY101',
    name: 'Quantum Mechanics',
    credits: 3,
    duration: 40,
    description: 'Introduction to quantum theory and applications.',
  },
  {
    id: 2,
    code: 'MAT201',
    name: 'Linear Algebra',
    credits: 4,
    duration: 50,
    description: 'Fundamentals of vector spaces and matrices.',
  },
  {
    id: 3,
    code: 'ART301',
    name: 'Modern Art History',
    credits: 2,
    duration: 30,
    description: 'Exploration of modern art movements.',
  },
];

// Memoized Course Card Component
const CourseCard: React.FC<{
  course: Course;
  expanded: boolean;
  onToggle: (id: number) => void;
  onEdit: (course: Course) => void;
  onDelete: (id: number) => void;
}> = React.memo(({ course, expanded, onToggle, onEdit, onDelete }) => {
  return (
    <button
      onClick={() => onToggle(course.id)}
      className="bg-black bg-opacity-50 border border-indigo-500 rounded-xl p-6 shadow-xl hover:scale-105 transition-transform duration-300 text-left w-full"
    >
      <h2 className="text-2xl font-bold text-white">{course.name}</h2>
      <p className="text-gray-300 mt-2 line-clamp-2">{course.description}</p>
      {expanded && (
        <div className="mt-4">
          <p className="text-gray-300 mt-2">
            <span className="font-semibold">Code:</span> {course.code}
          </p>
          <p className="text-gray-300 mt-2">
            <span className="font-semibold">Credits:</span> {course.credits}
          </p>
          <p className="text-gray-300 mt-2">
            <span className="font-semibold">Duration:</span> {course.duration} hours
          </p>
          <div className="mt-4 flex space-x-4">
            <button
              onClick={(e) => {
                e.stopPropagation();
                onEdit(course);
              }}
              className="px-3 py-1 bg-yellow-500 hover:bg-yellow-600 rounded text-white text-sm transition duration-300"
            >
              Edit
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                onDelete(course.id);
              }}
              className="px-3 py-1 bg-red-500 hover:bg-red-600 rounded text-white text-sm transition duration-300"
            >
              Delete
            </button>
          </div>
        </div>
      )}
    </button>
  );
});

const CourseManagement: React.FC = () => {
  const [courses, setCourses] = useState<Course[]>(initialCourses);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortColumn] = useState<keyof Course>('name');
  const [sortDirection] = useState<'asc' | 'desc'>('asc');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [courseForm, setCourseForm] = useState<Omit<Course, 'id'>>({
    code: '',
    name: '',
    credits: 0,
    duration: 0,
    description: '',
  });
  const [editingCourseId, setEditingCourseId] = useState<number | null>(null);
  // Track which course cards are expanded.
  const [expandedCourses, setExpandedCourses] = useState<number[]>([]);

  const navigate = useNavigate();

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  const filteredAndSortedCourses = useMemo(() => {
    const filtered = courses.filter((course) =>
      course.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      course.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      course.code.toLowerCase().includes(searchQuery.toLowerCase())
    );
    filtered.sort((a, b) => {
      const valA = a[sortColumn].toString().toLowerCase();
      const valB = b[sortColumn].toString().toLowerCase();
      if (valA < valB) return sortDirection === 'asc' ? -1 : 1;
      if (valA > valB) return sortDirection === 'asc' ? 1 : -1;
      return 0;
    });
    return filtered;
  }, [courses, searchQuery, sortColumn, sortDirection]);

  const toggleExpansion = (courseId: number) => {
    setExpandedCourses((prev) =>
      prev.includes(courseId)
        ? prev.filter((id) => id !== courseId)
        : [...prev, courseId]
    );
  };

  const openEditModal = (course: Course) => {
    setCourseForm({
      code: course.code,
      name: course.name,
      credits: course.credits,
      duration: course.duration,
      description: course.description,
    });
    setEditingCourseId(course.id);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingCourseId(null);
  };

  const handleFormChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    if (name === 'credits' || name === 'duration') {
      setCourseForm({
        ...courseForm,
        [name]: Number(value),
      });
    } else {
      setCourseForm({
        ...courseForm,
        [name]: value,
      });
    }
  };

  const handleFormSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (editingCourseId !== null) {
      setCourses(
        courses.map((course) =>
          course.id === editingCourseId ? { ...course, ...courseForm } : course
        )
      );
    }
    closeModal();
  };

  const handleDelete = (courseId: number) => {
    if (window.confirm('Are you sure you want to delete this course?')) {
      setCourses(courses.filter((course) => course.id !== courseId));
    }
  };

  return (
    <div className="min-h-screen flex font-roboto bg-gradient-to-br from-gray-900 to-black">
      {/* Sidebar Navigation */}
      <Sidebar />
      <div className="flex-1 flex flex-col">
        {/* Top Navbar */}
        <Navbar />
        <main className="p-6 md:p-8">
          <div className="flex flex-col sm:flex-row items-center justify-between mb-8">
            <h1 className="text-4xl md:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500">
              Course Management
            </h1>
            <div className="flex items-center mt-4 sm:mt-0">
              <input
                type="text"
                placeholder="Search courses..."
                value={searchQuery}
                onChange={handleSearchChange}
                className="px-4 py-2 bg-black bg-opacity-50 border border-indigo-500 rounded-l-xl focus:outline-none text-white placeholder-gray-400"
              />
              <button
                onClick={() => navigate('/admin/add-course')}
                className="px-6 py-2 bg-indigo-600 hover:bg-indigo-700 border border-indigo-500 rounded-r-xl text-white font-bold transition duration-300"
              >
                Add Course
              </button>
            </div>
          </div>

          {/* Courses Card View */}
          <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredAndSortedCourses.map((course) => (
              <CourseCard
                key={course.id}
                course={course}
                expanded={expandedCourses.includes(course.id)}
                onToggle={toggleExpansion}
                onEdit={openEditModal}
                onDelete={handleDelete}
              />
            ))}
            {filteredAndSortedCourses.length === 0 && (
              <p className="text-white col-span-full text-center">No courses found.</p>
            )}
          </section>
        </main>
      </div>

      {/* Modal for Editing Course */}
      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-70 z-50">
          <div className="bg-gray-800 p-8 rounded-xl border border-indigo-500 shadow-xl w-full max-w-lg mx-4 animate-fadeIn max-h-[80vh] overflow-y-auto">
            <h2 className="text-2xl font-bold text-white mb-4">Edit Course</h2>
            <form onSubmit={handleFormSubmit}>
              <div className="mb-4">
                <label htmlFor="code" className="block text-white mb-1">
                  Course Code
                </label>
                <input
                  id="code"
                  name="code"
                  type="text"
                  value={courseForm.code}
                  onChange={handleFormChange}
                  required
                  className="w-full px-4 py-2 bg-black bg-opacity-50 border border-indigo-500 rounded-md focus:outline-none text-white"
                />
              </div>
              <div className="mb-4">
                <label htmlFor="name" className="block text-white mb-1">
                  Course Name
                </label>
                <input
                  id="name"
                  name="name"
                  type="text"
                  value={courseForm.name}
                  onChange={handleFormChange}
                  required
                  className="w-full px-4 py-2 bg-black bg-opacity-50 border border-indigo-500 rounded-md focus:outline-none text-white"
                />
              </div>
              <div className="mb-4 grid grid-cols-2 gap-4">
                <div>
                  <label htmlFor="credits" className="block text-white mb-1">
                    Credits
                  </label>
                  <input
                    id="credits"
                    name="credits"
                    type="number"
                    value={courseForm.credits}
                    onChange={handleFormChange}
                    required
                    min="0"
                    className="w-full px-4 py-2 bg-black bg-opacity-50 border border-indigo-500 rounded-md focus:outline-none text-white"
                  />
                </div>
                <div>
                  <label htmlFor="duration" className="block text-white mb-1">
                    Duration (hours)
                  </label>
                  <input
                    id="duration"
                    name="duration"
                    type="number"
                    value={courseForm.duration}
                    onChange={handleFormChange}
                    required
                    min="0"
                    className="w-full px-4 py-2 bg-black bg-opacity-50 border border-indigo-500 rounded-md focus:outline-none text-white"
                  />
                </div>
              </div>
              <div className="mb-4">
                <label htmlFor="description" className="block text-white mb-1">
                  Description
                </label>
                <textarea
                  id="description"
                  name="description"
                  value={courseForm.description}
                  onChange={handleFormChange}
                  required
                  className="w-full px-4 py-2 bg-black bg-opacity-50 border border-indigo-500 rounded-md focus:outline-none text-white"
                />
              </div>
              <div className="flex justify-end space-x-4">
                <button
                  type="button"
                  onClick={closeModal}
                  className="px-4 py-2 bg-gray-600 hover:bg-gray-700 rounded-md text-white transition duration-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 rounded-md text-white font-bold transition duration-300"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default CourseManagement;

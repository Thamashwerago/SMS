/**
 * Courses.tsx
 *
 * This component renders the Courses page using a dark theme consistent with the admin dashboard.
 * It displays a list of courses in card format using a responsive grid layout.
 * Courses are searchable, sortable, and can be added, updated, or deleted.
 */

import React, { useState, useMemo } from 'react';
import Navbar from '../../components/common/Navbar';
import Sidebar from '../../components/common/Sidebar';

interface Course {
  id: number;
  title: string;
  description: string;
}

// Initial dummy course data; replace with backend data as needed.
const initialCourses: Course[] = [
  {
    id: 1,
    title: "Mathematics",
    description: "A comprehensive course covering algebra, calculus, and statistics.",
  },
  {
    id: 2,
    title: "Science",
    description: "Explore physics, chemistry, and biology in this engaging course.",
  },
];

const Courses: React.FC = () => {
  // State for courses, search query, sort criteria, and modal control.
  const [courses, setCourses] = useState<Course[]>(initialCourses);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState<'id' | 'title'>('id');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCourse, setEditingCourse] = useState<Course | null>(null);

  // Compute filtered and sorted courses.
  const filteredSortedCourses = useMemo(() => {
    const filtered = courses.filter(course =>
      course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      course.description.toLowerCase().includes(searchQuery.toLowerCase())
    );
    const sorted = [...filtered].sort((a, b) => {
      if (sortBy === 'id') return a.id - b.id;
      return a.title.localeCompare(b.title);
    });
    return sorted;
  }, [courses, searchQuery, sortBy]);

  // Handler for saving (adding/updating) a course.
  const handleSaveCourse = (course: Course) => {
    if (editingCourse) {
      // Update existing course.
      setCourses(prev => prev.map(c => (c.id === course.id ? course : c)));
    } else {
      // Add new course; generate new ID.
      const newId = courses.length ? courses[courses.length - 1].id + 1 : 1;
      setCourses(prev => [...prev, { ...course, id: newId }]);
    }
    setIsModalOpen(false);
    setEditingCourse(null);
  };

  // Handler for deleting a course.
  const handleDeleteCourse = (courseId: number) => {
    if (window.confirm("Are you sure you want to delete this course?")) {
      setCourses(prev => prev.filter(course => course.id !== courseId));
    }
  };

  // Open modal for editing a course.
  const openEditModal = (course: Course) => {
    setEditingCourse(course);
    setIsModalOpen(true);
  };

  // Open modal for adding a new course.
  const openAddModal = () => {
    setEditingCourse(null);
    setIsModalOpen(true);
  };

  return (
    <div className="min-h-screen flex bg-black text-white">
      {/* Sidebar Navigation */}
      <Sidebar />
      {/* Main Content Area */}
      <div className="flex-1 p-6">
        {/* Top Navbar */}
        <Navbar />
        {/* Content Container */}
        <div className="mt-6">
          {/* Page Header */}
          <h1 className="text-3xl font-bold text-white mb-6">Courses</h1>
          {/* Search, Sort Controls and Add Button */}
          <div className="mb-6 flex flex-col md:flex-row items-center justify-between">
            <input
              type="text"
              placeholder="Search courses..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full md:w-1/3 p-2 mb-4 md:mb-0 rounded bg-[#1E1E1E] border border-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <div className="flex items-center space-x-4 mb-4 md:mb-0">
              <label htmlFor="sortBy" className="text-gray-300">Sort by:</label>
              <select
                id="sortBy"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as 'id' | 'title')}
                className="p-2 rounded bg-[#1E1E1E] border border-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="id">ID</option>
                <option value="title">Title</option>
              </select>
            </div>
            <button
              onClick={openAddModal}
              className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded transition-colors duration-200"
            >
              Add Course
            </button>
          </div>
          {/* Courses Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {filteredSortedCourses.map((course) => (
              <div key={course.id} className="bg-[#1E1E1E] p-6 rounded-lg shadow hover:shadow-xl transition-shadow">
                <h2 className="text-xl font-semibold text-white">{course.title}</h2>
                <p className="mt-2 text-gray-300">{course.description}</p>
                <div className="mt-4 flex space-x-4">
                  <button
                    onClick={() => openEditModal(course)}
                    className="bg-green-600 hover:bg-green-700 text-white font-semibold py-1 px-3 rounded transition-colors duration-200"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDeleteCourse(course.id)}
                    className="bg-red-600 hover:bg-red-700 text-white font-semibold py-1 px-3 rounded transition-colors duration-200"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Modal for Adding/Editing Course */}
      {isModalOpen && (
        <CourseModal
          course={editingCourse}
          onClose={() => setIsModalOpen(false)}
          onSave={handleSaveCourse}
        />
      )}
    </div>
  );
};

/**
 * CourseModal Component
 *
 * A modal popup for adding or editing a course.
 *
 * Props:
 * - course: The course to edit (null when adding a new course).
 * - onClose: Callback to close the modal.
 * - onSave: Callback to save the course details.
 */
interface CourseModalProps {
  course: Course | null;
  onClose: () => void;
  onSave: (course: Course) => void;
}

const CourseModal: React.FC<CourseModalProps> = ({ course, onClose, onSave }) => {
  const [title, setTitle] = useState(course ? course.title : '');
  const [description, setDescription] = useState(course ? course.description : '');

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // Create updated course object. For new courses, id is 0 and will be set by the parent.
    const updatedCourse: Course = {
      id: course ? course.id : 0,
      title,
      description,
    };
    onSave(updatedCourse);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-[#1E1E1E] p-6 rounded-lg shadow-lg max-w-md w-full relative">
        {/* Close Button */}
        <button onClick={onClose} className="absolute top-2 right-2 text-gray-300 hover:text-white text-2xl">
          &times;
        </button>
        <h2 className="text-2xl font-bold mb-4">{course ? 'Edit Course' : 'Add Course'}</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="courseTitle" className="block text-gray-300 mb-2">
              Course Title
            </label>
            <input
              type="text"
              id="courseTitle"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full p-2 bg-[#1E1E1E] border border-gray-700 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          <div>
            <label htmlFor="courseDescription" className="block text-gray-300 mb-2">
              Description
            </label>
            <textarea
              id="courseDescription"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full p-2 bg-[#1E1E1E] border border-gray-700 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          <button
            type="submit"
            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded transition-colors duration-200"
          >
            Save
          </button>
        </form>
      </div>
    </div>
  );
};

export default Courses;

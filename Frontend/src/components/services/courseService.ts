// src/services/courseService.ts
import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL ?? '172.236.144.75:8081/api';

// Course interface matching the backend Course model.
export interface Course {
  id: number;
  code: string;
  name: string;
  credits: number;
  duration: number;
  description: string;
}

// CourseAssign interface matching the backend CourseAssign model.
export interface CourseAssign {
  id: number;
  courseId: number;
  userId: number;
  role: string;
}

const courseService = {
  /**
   * Retrieve all courses.
   */
  getAll: async (): Promise<Course[]> => {
    const response = await axios.get(`${API_BASE_URL}/courses`);
    return response.data;
  },

  /**
   * Retrieve a single course by its ID.
   * @param id The course ID.
   */
  getById: async (id: string): Promise<Course> => {
    const response = await axios.get(`${API_BASE_URL}/courses/${id}`);
    return response.data;
  },

  /**
   * Create a new course (only accessible by admin).
   * @param course The course data (excluding the auto-generated id).
   */
  create: async (course: Omit<Course, 'id'>): Promise<Course> => {
    const response = await axios.post(`${API_BASE_URL}/admin/courses`, course);
    return response.data;
  },

  /**
   * Update an existing course.
   * @param id The course ID.
   * @param course Partial course data to update.
   */
  update: async (id: string, course: Partial<Course>): Promise<Course> => {
    const response = await axios.put(`${API_BASE_URL}/courses/${id}`, course);
    return response.data;
  },

  /**
   * Delete a course.
   * @param id The course ID.
   */
  delete: async (id: string): Promise<void> => {
    await axios.delete(`${API_BASE_URL}/courses/${id}`);
  },

  /**
   * Assign a course to a user (teacher/student) with a specific role.
   * @param courseAssign The course assignment data (excluding the auto-generated id).
   */
  assignCourse: async (courseAssign: Omit<CourseAssign, 'id'>): Promise<CourseAssign> => {
    const response = await axios.post(`${API_BASE_URL}/admin/course-assignments`, courseAssign);
    return response.data;
  },

  /**
   * Retrieve all course assignments.
   */
  getCourseAssignments: async (): Promise<CourseAssign[]> => {
    const response = await axios.get(`${API_BASE_URL}/course-assignments`);
    return response.data;
  },
};

export default courseService;

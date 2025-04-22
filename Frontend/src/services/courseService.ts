// src/services/courseService.ts
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const API_BASE_URL =
  import.meta.env.VITE_API_URL ?? 'http://172.236.144.75:8080/api';

const navigate = useNavigate();
const token = localStorage.getItem("authToken") ?? sessionStorage.getItem("authToken");
if (!token) {
  navigate('/login');
  throw new Error('No authentication token found in session storage.');
}
const headers = {
  'Authorization': `${token}`,
  'Content-Type': 'application/json',
};

/**
 * Course interface matching the backend Course model.
 */
export interface Course {
  id: number;
  code: string;
  name: string;
  credits: number;
  duration: number;
  description: string;
}

/**
 * CourseAssign interface matching the backend CourseAssign model.
 */
export interface CourseAssign {
  id: number;
  courseId: number;
  userId: number;
  role: string;
}

const courseService = {
  /**
   * Retrieve all courses with optional pagination.
   * 
   * @param page (optional) - Page number (0-indexed). Defaults to 0.
   * @param size (optional) - Number of records per page. Defaults to 100.
   * @returns A promise resolving to an array of Course objects.
   */
  getAll: async (page: number = 0, size: number = 100): Promise<Course[]> => {
    const response = await axios.get(`${API_BASE_URL}/course`, {
      params: { page, size },
      headers: headers
    });
    // If your backend returns a paginated response, adjust accordingly (e.g., return response.data.content).
    return response.data.content ?? response.data;
  },

  /**
   * Retrieve a single course by its ID.
   *
   * @param id - The course's ID.
   * @returns A promise resolving to a Course object.
   */
  getById: async (id: number): Promise<Course> => {
    const response = await axios.get(`${API_BASE_URL}/course/${id}`, {
      headers: headers
    });
    return response.data;
  },

  /**
   * Create a new course.
   *
   * Only admins can perform this operation.
   *
   * @param course - The course data (excluding the auto-generated id).
   * @returns A promise resolving to the created Course object.
   */
  create: async (course: Omit<Course, 'id'>): Promise<Course> => {
    const response = await axios.post(`${API_BASE_URL}/course`, course, {
      headers: headers
    });
    return response.data;
  },

  /**
   * Update an existing course.
   *
   * @param id - The course's ID.
   * @param course - Partial course data to update.
   * @returns A promise resolving to the updated Course object.
   */
  update: async (id: number, course: Partial<Course>): Promise<Course> => {
    const response = await axios.put(`${API_BASE_URL}/course/${id}`, course, {
      headers: headers
    });
    return response.data;
  },

  /**
   * Delete a course.
   *
   * @param id - The course's ID.
   * @returns A promise that resolves when deletion is complete.
   */
  delete: async (id: number): Promise<void> => {
    await axios.delete(`${API_BASE_URL}/course/${id}`, {
      headers: headers
    });
  },

  // ---------------------
  // Course Assign API
  // ---------------------

  /**
  * Retrieve all course assign records with optional pagination.
  *
   * @param page (optional) - Page number (0-indexed). Defaults to 0.
  * @param size (optional) - Number of records per page. Defaults to 100.
  * @returns A promise resolving to an array of CourseAssign objects.
  */
  getAllCourseAssigns: async (page: number = 0, size: number = 100): Promise<CourseAssign[]> => {
    const response = await axios.get(`${API_BASE_URL}/courseassign`, {
      params: { page, size },
      headers: headers
    });
    // Adjust if your backend returns a paginated response.
    return response.data.content ?? response.data;
  },

  /**
  * Retrieve a single course assign record by its ID.
  *
  * @param id - The course assign record's ID.
  * @returns A promise resolving to a CourseAssign object.
  */
  getCourseAssignById: async (id: number): Promise<CourseAssign> => {
    const response = await axios.get(`${API_BASE_URL}/courseassign/${id}`, {
      headers: headers
    });
    return response.data;
  },

  /**
  * Create a new course assign record.
  *
  * Only admins can perform this operation.
  *
  * @param courseAssign - The course assign data (excluding the auto-generated id).
  * @returns A promise resolving to the created CourseAssign object.
  */
  createCourseAssign: async (courseAssign: Omit<CourseAssign, 'id'>): Promise<CourseAssign> => {
   const response = await axios.post(`${API_BASE_URL}/courseassign`, courseAssign, {
     headers: headers
   });
   return response.data;
  },

  /**
  * Update an existing course assign record.
  *
  * @param id - The course assign record's ID.
  * @param courseAssign - Partial course assign data to update.
  * @returns A promise resolving to the updated CourseAssign object.
  */
  updateCourseAssign: async (id: number, courseAssign: Partial<CourseAssign>): Promise<CourseAssign> => {
   const response = await axios.put(`${API_BASE_URL}/courseassign/${id}`, courseAssign, {
     headers: headers
   });
   return response.data;
  },

  /**
  * Delete a course assign record.
  *
  * @param id - The course assign record's ID.
  * @returns A promise that resolves when deletion is complete.
  */
  deleteCourseAssign: async (id: number): Promise<void> => {
    await axios.delete(`${API_BASE_URL}/courseassign/${id}`, {
      headers: headers
    });
  },
};

export default courseService;

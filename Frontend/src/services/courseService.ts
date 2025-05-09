// src/services/courseService.ts
import axiosInstance from './axiosInstance';

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
    const response = await axiosInstance.get(`/course`, {
      params: { page, size },
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
    const response = await axiosInstance.get(`/course/${id}`);
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
    const response = await axiosInstance.post(`/course`, course);
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
    const response = await axiosInstance.put(`/course/${id}`, course);
    return response.data;
  },

  /**
   * Delete a course.
   *
   * @param id - The course's ID.
   * @returns A promise that resolves when deletion is complete.
   */
  delete: async (id: number): Promise<void> => {
    await axiosInstance.delete(`/course/${id}`);
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
    const response = await axiosInstance.get(`/courseassign`, {
      params: { page, size },
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
    const response = await axiosInstance.get(`/courseassign/${id}`);
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
   const response = await axiosInstance.post(`/courseassign`, courseAssign);
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
   const response = await axiosInstance.put(`/courseassign/${id}`, courseAssign);
   return response.data;
  },

  /**
  * Delete a course assign record.
  *
  * @param id - The course assign record's ID.
  * @returns A promise that resolves when deletion is complete.
  */
  deleteCourseAssign: async (id: number): Promise<void> => {
    await axiosInstance.delete(`/courseassign/${id}`);
  },

  count: async (): Promise<number> => {
    const response = await axiosInstance.get(`/course/count`);
    return response.data;
  }
};

export default courseService;

// src/services/studentService.ts
import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL ?? '172.236.144.75:8081/api';

/**
 * Student interface matching the backend StudentDTO model.
 */
export interface Student {
  id: number;
  userId: number;
  firstName: string;
  lastName: string;
  dateOfBirth: string; // ISO date string, e.g., "2000-01-01"
  gender: string;
  address: string;
  contactNumber: string;
  nationality: string;
}

const studentService = {
  /**
   * Retrieve all student records with pagination.
   * @param limit Maximum number of results to return (default is 100).
   * @param offset Number of records to skip (default is 0).
   * @returns A promise resolving to an array of Student objects.
   */
  getAll: async (limit: number = 100, offset: number = 0): Promise<Student[]> => {
    const response = await axios.get(`${API_BASE_URL}/students`, {
      params: { limit, offset },
      auth: {
        username: JSON.parse(sessionStorage.getItem('user') || '{}').email,
        password: JSON.parse(sessionStorage.getItem('user') || '{}').password
      }
    });
    return response.data;
  },

  /**
   * Retrieve a single student record by ID.
   * @param id The student's ID.
   * @returns A promise resolving to the Student object.
   */
  getById: async (id: number): Promise<Student> => {
    const response = await axios.get(`${API_BASE_URL}/students/${id}`, {
      auth: {
        username: JSON.parse(sessionStorage.getItem('user') || '{}').email,
        password: JSON.parse(sessionStorage.getItem('user') || '{}').password
      }
    });
    return response.data;
  },

  /**
   * Create a new student record.
   * Only admins can perform this operation.
   * @param student The student data without an id.
   * @returns A promise resolving to the created Student object.
   */
  create: async (student: Omit<Student, 'id'>): Promise<Student> => {
    const response = await axios.post(`${API_BASE_URL}/admin/students`, student, {
      auth: {
        username: JSON.parse(sessionStorage.getItem('user') || '{}').email,
        password: JSON.parse(sessionStorage.getItem('user') || '{}').password
      }
    });
    return response.data;
  },

  /**
   * Update an existing student record.
   * @param id The student's ID.
   * @param student Partial student data to update.
   * @returns A promise resolving to the updated Student object.
   */
  update: async (id: number, student: Partial<Student>): Promise<Student> => {
    const response = await axios.put(`${API_BASE_URL}/students/${id}`, student, {
      auth: {
        username: JSON.parse(sessionStorage.getItem('user') || '{}').email,
        password: JSON.parse(sessionStorage.getItem('user') || '{}').password
      }
    });
    return response.data;
  },

  /**
   * Delete a student record by ID.
   * @param id The student's ID.
   * @returns A promise that resolves when deletion is complete.
   */
  delete: async (id: number): Promise<void> => {
    await axios.delete(`${API_BASE_URL}/students/${id}`, {
      auth: {
        username: JSON.parse(sessionStorage.getItem('user') || '{}').email,
        password: JSON.parse(sessionStorage.getItem('user') || '{}').password
      }
    });
  },
};

export default studentService;

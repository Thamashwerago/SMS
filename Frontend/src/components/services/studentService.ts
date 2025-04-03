// src/services/studentService.ts
import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL ?? 'http://localhost:5000/api';

// Define the Student interface to match the backend model.
export interface Student {
  studentId: number;
  userId: number;
  firstName: string;
  lastName: string;
  dateOfBirth: string; // Expecting an ISO date string.
  gender: string;
  address: string;
  contactNumber: string;
  nationality: string;
}

const studentService = {
  /**
   * Retrieve all student records.
   */
  getAll: async (): Promise<Student[]> => {
    const response = await axios.get(`${API_BASE_URL}/students`);
    return response.data;
  },

  /**
   * Retrieve a single student record by ID.
   * @param id The student's ID.
   */
  getById: async (id: string): Promise<Student> => {
    const response = await axios.get(`${API_BASE_URL}/students/${id}`);
    return response.data;
  },

  /**
   * Create a new student record.
   * Only admins can perform this operation.
   * @param student The student data (without a studentId).
   */
  create: async (student: Omit<Student, 'studentId'>): Promise<Student> => {
    const response = await axios.post(`${API_BASE_URL}/admin/students`, student);
    return response.data;
  },

  /**
   * Update an existing student record.
   * @param id The student's ID.
   * @param student The partial student data to update.
   */
  update: async (id: string, student: Partial<Student>): Promise<Student> => {
    const response = await axios.put(`${API_BASE_URL}/students/${id}`, student);
    return response.data;
  },

  /**
   * Delete a student record by ID.
   * @param id The student's ID.
   */
  delete: async (id: string): Promise<void> => {
    await axios.delete(`${API_BASE_URL}/students/${id}`);
  },
};

export default studentService;

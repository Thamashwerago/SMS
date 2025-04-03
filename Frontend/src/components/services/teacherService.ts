// src/services/teacherService.ts
import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:5000/api';

// Teacher interface matching the backend Teacher model.
export interface Teacher {
  id: number;
  userId: number;
  name: string;
  phone: string;
  dob: string;         // Date of birth (as an ISO string).
  gender: string;
  address: string;
  joiningDate: string; // LocalDate represented as an ISO string.
  status: string;
  role: string;
}
 
const teacherService = {
  /**
   * Retrieve all teacher records.
   */
  getAll: async (): Promise<Teacher[]> => {
    const response = await axios.get(`${API_BASE_URL}/teachers`);
    return response.data;
  },

  /**
   * Retrieve a single teacher record by ID.
   * @param id The teacher's ID.
   */
  getById: async (id: string): Promise<Teacher> => {
    const response = await axios.get(`${API_BASE_URL}/teachers/${id}`);
    return response.data;
  },

  /**
   * Create a new teacher record.
   * Only admins can perform this operation.
   * @param teacher The teacher data (excluding the auto-generated id).
   */
  create: async (teacher: Omit<Teacher, 'id'>): Promise<Teacher> => {
    const response = await axios.post(`${API_BASE_URL}/admin/teachers`, teacher);
    return response.data;
  },

  /**
   * Update an existing teacher record.
   * @param id The teacher's ID.
   * @param teacher Partial teacher data for update.
   */
  update: async (id: string, teacher: Partial<Teacher>): Promise<Teacher> => {
    const response = await axios.put(`${API_BASE_URL}/teachers/${id}`, teacher);
    return response.data;
  },

  /**
   * Delete a teacher record by ID.
   * @param id The teacher's ID.
   */
  delete: async (id: string): Promise<void> => {
    await axios.delete(`${API_BASE_URL}/teachers/${id}`);
  },
};

export default teacherService;

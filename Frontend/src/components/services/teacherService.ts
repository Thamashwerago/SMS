// src/services/teacherService.ts
import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL ?? '172.236.144.75:8081/api';

// Teacher interface matching the backend Teacher model.
export interface Teacher {
  id: number;
  userId: number;
  name: string;
  phone: string;
  dob: string;         // Date of birth (as an ISO string).
  gender: string;
  address: string;
  joiningDate: Date; // LocalDate represented as an ISO string.
  status: string;
  role: string;
}
 
const teacherService = {
  /**
   * Retrieve all teacher records.
   */
  getAll: async (): Promise<Teacher[]> => {
    const response = await axios.get(`${API_BASE_URL}/teacher`);
    return response.data;
  },

  /**
   * Retrieve a single teacher record by ID.
   * @param id The teacher's ID.
   */
  getById: async (id: string): Promise<Teacher> => {
    const response = await axios.get(`${API_BASE_URL}/teacher/${id}`);
    return response.data;
  },

  /**
   * Create a new teacher record.
   * Only admins can perform this operation.
   * @param teacher The teacher data (excluding the auto-generated id).
   */
  create: async (teacher: Omit<Teacher, 'id'>): Promise<Teacher> => {
    const response = await axios.post(`${API_BASE_URL}/teacher`, teacher);
    return response.data;
  },

  /**
   * Update an existing teacher record.
   * @param id The teacher's ID.
   * @param teacher Partial teacher data for update.
   */
  update: async (id: string, teacher: Partial<Teacher>): Promise<Teacher> => {
    const response = await axios.put(`${API_BASE_URL}/teacher/${id}`, teacher);
    return response.data;
  },

  /**
   * Delete a teacher record by ID.
   * @param id The teacher's ID.
   */
  delete: async (id: string): Promise<void> => {
    await axios.delete(`${API_BASE_URL}/teacher/${id}`);
  },
};

export default teacherService;

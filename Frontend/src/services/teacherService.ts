// src/services/teacherService.ts
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const API_BASE_URL =
  import.meta.env.VITE_API_URL ?? 'http://172.236.144.75:8080/api/teacher';

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
 * Teacher interface matching the backend Teacher model.
 */
export interface Teacher {
  id: number;
  userId: number;
  name: string;
  phone: string;
  dob: string;         // Date of birth (ISO string)
  gender: string;
  address: string;
  joiningDate: Date; // LocalDate represented as an ISO string.
  status: string;
  role: string;
}

const teacherService = {
  /**
   * Retrieve all teacher records with pagination.
   * 
   * @param page - The page number (0-based index). Default is 0.
   * @param size - The number of records per page. Default is 100.
   * @returns A promise resolving to an array of Teacher objects.
   * 
   * Assumes the backend returns a paginated result with a `content` property.
   */
  getAll: async (page: number = 0, size: number = 100): Promise<Teacher[]> => {
    const response = await axios.get(`${API_BASE_URL}`, {
      params: { page, size },
      headers: headers,
    });
    // Assuming the backend response structure is a Page with a "content" array.
    return response.data.content;
  },

  /**
   * Retrieve a single teacher record by ID.
   * 
   * @param id - The teacher's ID.
   * @returns A promise resolving to the Teacher object.
   */
  getById: async (id: number): Promise<Teacher> => {
    const response = await axios.get(`${API_BASE_URL}/${id}`,{
      headers: headers,
    });
    return response.data;
  },

  /**
   * Create a new teacher record.
   * 
   * Only admins can perform this operation.
   * 
   * @param teacher - The teacher data (excluding the auto-generated id).
   * @returns A promise resolving to the created Teacher object.
   */
  create: async (teacher: Omit<Teacher, 'id'>): Promise<Teacher> => {
    const response = await axios.post(`${API_BASE_URL}`, teacher,{
      headers: headers,
    });
    return response.data;
  },

  /**
   * Update an existing teacher record.
   * 
   * @param id - The teacher's ID.
   * @param teacher - Partial teacher data to update.
   * @returns A promise resolving to the updated Teacher object.
   */
  update: async (id: number, teacher: Partial<Teacher>): Promise<Teacher> => {
    const response = await axios.put(`${API_BASE_URL}/${id}`, teacher,{
      headers: headers,
      });
    return response.data;
  },

  /**
   * Delete a teacher record by ID.
   * 
   * @param id - The teacher's ID.
   * @returns A promise that resolves when deletion is complete.
   */
  delete: async (id: number): Promise<void> => {
    await axios.delete(`${API_BASE_URL}/${id}`,{
        headers: headers,
      });
  },
};

export default teacherService;

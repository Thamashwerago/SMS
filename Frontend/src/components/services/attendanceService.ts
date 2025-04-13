// src/services/attendanceService.ts
import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL ?? '172.236.144.75:8081/api';

/**
 * Interface representing an attendance record matching the backend Attendance model.
 */
export interface Attendance {
  id: number;
  userId: number;
  role: string;
  courseId: number;
  date: string;   // ISO date string (e.g., "2025-04-02")
  status: string;
}

const attendanceService = {
  /**
   * Retrieve all attendance records.
   * @returns A promise that resolves with an array of Attendance records.
   */
  getAll: async (): Promise<Attendance[]> => {
    const response = await axios.get(`${API_BASE_URL}/attendance`);
    return response.data;
  },

  /**
   * Retrieve a single attendance record by its ID.
   * @param id The ID of the attendance record.
   * @returns A promise that resolves with the Attendance record.
   */
  getById: async (id: number | string): Promise<Attendance> => {
    const response = await axios.get(`${API_BASE_URL}/attendance/${id}`);
    return response.data;
  },

  /**
   * Create a new attendance record.
   * This endpoint is typically admin-protected.
   * @param attendance The attendance record data (excluding the auto-generated id).
   * @returns A promise that resolves with the newly created Attendance record.
   */
  create: async (attendance: Omit<Attendance, 'id'>): Promise<Attendance> => {
    const response = await axios.post(`${API_BASE_URL}/admin/attendance`, attendance);
    return response.data;
  },

  /**
   * Update an existing attendance record by its ID.
   * @param id The ID of the attendance record to update.
   * @param attendance Partial attendance data for update.
   * @returns A promise that resolves with the updated Attendance record.
   */
  update: async (id: number | string, attendance: Partial<Attendance>): Promise<Attendance> => {
    const response = await axios.put(`${API_BASE_URL}/attendance/${id}`, attendance);
    return response.data;
  },

  /**
   * Delete an attendance record by its ID.
   * @param id The ID of the attendance record to delete.
   * @returns A promise that resolves when deletion is complete.
   */
  delete: async (id: number | string): Promise<void> => {
    await axios.delete(`${API_BASE_URL}/attendance/${id}`);
  },
};

export default attendanceService;

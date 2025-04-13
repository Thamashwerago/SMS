// src/services/timetableService.ts
import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL ?? '172.236.144.75:8081/api';

/**
 * Interface representing a timetable entry matching the backend TimeTable model.
 */
export interface TimetableEntry {
  id: number;
  date: string;         // ISO date string (e.g., "2025-04-02")
  startTime: string;    // ISO time string (e.g., "09:00:00")
  endTime: string;      // ISO time string (e.g., "10:30:00")
  teacherId: number;
  courseId: number;
  classroom: string;
}

/**
 * Service for performing CRUD operations on timetable data.
 * Note: Creation endpoints are restricted to admin users.
 */
const timetableService = {
  /**
   * Retrieves all timetable entries.
   * @returns A promise that resolves with an array of TimetableEntry objects.
   */
  getAll: async (): Promise<TimetableEntry[]> => {
    const response = await axios.get(`${API_BASE_URL}/timetable`);
    return response.data;
  },

  /**
   * Retrieves a single timetable entry by its ID.
   * @param id The ID of the timetable entry.
   * @returns A promise that resolves with the TimetableEntry.
   */
  getById: async (id: number | string): Promise<TimetableEntry> => {
    const response = await axios.get(`${API_BASE_URL}/timetable/${id}`);
    return response.data;
  },

  /**
   * Creates a new timetable entry.
   * This endpoint is admin-protected.
   * @param entry The timetable entry data (excluding the auto-generated id).
   * @returns A promise that resolves with the newly created TimetableEntry.
   */
  create: async (entry: Omit<TimetableEntry, 'id'>): Promise<TimetableEntry> => {
    const response = await axios.post(`${API_BASE_URL}/admin/timetable`, entry);
    return response.data;
  },

  /**
   * Updates an existing timetable entry by ID.
   * @param id The ID of the timetable entry to update.
   * @param entry Partial timetable data to update.
   * @returns A promise that resolves with the updated TimetableEntry.
   */
  update: async (id: number | string, entry: Partial<TimetableEntry>): Promise<TimetableEntry> => {
    const response = await axios.put(`${API_BASE_URL}/timetable/${id}`, entry);
    return response.data;
  },

  /**
   * Deletes a timetable entry by its ID.
   * @param id The ID of the timetable entry to delete.
   * @returns A promise that resolves when the deletion is complete.
   */
  delete: async (id: number | string): Promise<void> => {
    await axios.delete(`${API_BASE_URL}/timetable/${id}`);
  },
};

export default timetableService;

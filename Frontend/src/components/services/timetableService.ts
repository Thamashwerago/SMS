// src/services/timetableService.ts
import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL ?? '172.236.144.75:8081/api';

/**
 * TimetableEntry interface represents a timetable entry matching the backend TimeTable model.
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
 * timetableService provides methods for performing CRUD operations on timetable data.
 */
const timetableService = {
  /**
   * Retrieves all timetable entries with optional pagination.
   *
   * @param page - The page number (0-indexed). Defaults to 0.
   * @param size - The number of records per page. Defaults to 100.
   * @returns A promise resolving to an array of TimetableEntry objects.
   *
   * Note: If the backend returns a paginated response, we return response.data.content,
   * otherwise we return the entire response data.
   */
  getAll: async (page: number = 0, size: number = 100): Promise<TimetableEntry[]> => {
    const response = await axios.get(`${API_BASE_URL}/timetable`, {
      params: { page, size },
    });
    return response.data.content || response.data;
  },

  /**
   * Retrieves a single timetable entry by its ID.
   *
   * @param id - The timetable entry's ID.
   * @returns A promise resolving to the TimetableEntry.
   */
  getById: async (id: number): Promise<TimetableEntry> => {
    const response = await axios.get(`${API_BASE_URL}/timetable/${id}`);
    return response.data;
  },

  /**
   * Creates a new timetable entry.
   *
   * This operation is restricted to admin users.
   *
   * @param entry - The timetable entry data (excluding the auto-generated id).
   * @returns A promise resolving to the newly created TimetableEntry.
   */
  create: async (entry: Omit<TimetableEntry, 'id'>): Promise<TimetableEntry> => {
    const response = await axios.post(`${API_BASE_URL}/admin/timetable`, entry);
    return response.data;
  },

  /**
   * Updates an existing timetable entry by its ID.
   *
   * @param id - The timetable entry's ID.
   * @param entry - Partial timetable data for update.
   * @returns A promise resolving to the updated TimetableEntry.
   */
  update: async (id: number, entry: Partial<TimetableEntry>): Promise<TimetableEntry> => {
    const response = await axios.put(`${API_BASE_URL}/timetable/${id}`, entry);
    return response.data;
  },

  /**
   * Deletes a timetable entry by its ID.
   *
   * @param id - The timetable entry's ID.
   * @returns A promise that resolves when deletion is complete.
   */
  delete: async (id: number): Promise<void> => {
    await axios.delete(`${API_BASE_URL}/timetable/${id}`);
  },
};

export default timetableService;

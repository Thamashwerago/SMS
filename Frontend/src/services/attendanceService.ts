// src/services/attendanceService.ts
import axios from 'axios';

const API_BASE_URL =
  import.meta.env.VITE_API_URL ?? 'http://172.236.144.75:8081/api';

/**
 * Attendance interface representing the backend Attendance model.
 */
export interface Attendance {
  id: number;
  userId: number;
  role: string;
  courseId: number;
  date: string;   // ISO date string (e.g., "2025-04-02")
  status: string;
}

/**
 * attendanceService provides methods to perform CRUD operations
 * on attendance data. It mirrors the backend AttendanceService implementation.
 */
const attendanceService = {
  /**
   * getAll
   * ------
   * Retrieves all attendance records.
   * Endpoint: GET /attendance
   *
   * @returns A promise resolving to an array of Attendance records.
   */
  getAll: async (): Promise<Attendance[]> => {
    const response = await axios.get(`${API_BASE_URL}/attendance`, {
      auth: {
        username: JSON.parse(sessionStorage.getItem('user') || '{}').email,
        password: JSON.parse(sessionStorage.getItem('user') || '{}').password
      }
    });
    return response.data;
  },

  /**
   * markAttendance
   * --------------
   * Marks attendance for a student by creating a new attendance record.
   * Endpoint: POST /admin/attendance
   *
   * @param attendance - Attendance data (without an auto-generated id)
   * @returns A promise resolving to the created Attendance record.
   */
  markAttendance: async (attendance: Omit<Attendance, 'id'>): Promise<Attendance> => {
    const response = await axios.post(`${API_BASE_URL}/admin/attendance`, attendance, {
      auth: {
        username: JSON.parse(sessionStorage.getItem('user') || '{}').email,
        password: JSON.parse(sessionStorage.getItem('user') || '{}').password
      }
    });
    return response.data;
  },

  /**
   * getAttendanceById
   * -----------------
   * Retrieves a single attendance record by its ID.
   * Endpoint: GET /attendance/{id}
   *
   * @param id - The attendance record's ID.
   * @returns A promise resolving to the Attendance record.
   */
  getAttendanceById: async (id: number): Promise<Attendance> => {
    const response = await axios.get(`${API_BASE_URL}/attendance/${id}`, {
      auth: {
        username: JSON.parse(sessionStorage.getItem('user') || '{}').email,
        password: JSON.parse(sessionStorage.getItem('user') || '{}').password
      }
    });
    return response.data;
  },

  /**
   * updateAttendance
   * ------------------
   * Updates an existing attendance record.
   * Endpoint: PUT /attendance/{id}
   *
   * @param id - The attendance record's ID.
   * @param attendance - Partial attendance data to update.
   * @returns A promise resolving to the updated Attendance record.
   */
  updateAttendance: async (id: number, attendance: Partial<Attendance>): Promise<Attendance> => {
    const response = await axios.put(`${API_BASE_URL}/attendance/${id}`, attendance, {
      auth: {
        username: JSON.parse(sessionStorage.getItem('user') || '{}').email,
        password: JSON.parse(sessionStorage.getItem('user') || '{}').password
      }
    });
    return response.data;
  },

  /**
   * unMarkAttendance
   * ----------------
   * Deletes (unmarks) an attendance record by its ID.
   * Endpoint: DELETE /attendance/{id}
   *
   * @param id - The attendance record's ID.
   * @returns A promise that resolves when the deletion is complete.
   */
  unMarkAttendance: async (id: number): Promise<void> => {
    await axios.delete(`${API_BASE_URL}/attendance/${id}`, {
      auth: {
        username: JSON.parse(sessionStorage.getItem('user') || '{}').email,
        password: JSON.parse(sessionStorage.getItem('user') || '{}').password
      }
    });
  },

  /**
   * getAttendanceByStudentAndDate
   * -----------------------------
   * Retrieves attendance records for a specific student within a date range.
   * Endpoint: GET /attendance/studentAndDate?studentId=...&startDate=...&endDate=...
   *
   * @param studentId - The student ID.
   * @param startDate - Start date in YYYY-MM-DD format.
   * @param endDate - End date in YYYY-MM-DD format.
   * @returns A promise resolving to an array of Attendance records.
   */
  getAttendanceByStudentAndDate: async (studentId: number, startDate: string, endDate: string): Promise<Attendance[]> => {
    const response = await axios.get(`${API_BASE_URL}/attendance/studentAndDate`, {
      params: { studentId, startDate, endDate },
      auth: {
        username: JSON.parse(sessionStorage.getItem('user') || '{}').email,
        password: JSON.parse(sessionStorage.getItem('user') || '{}').password
      }
    });
    return response.data;
  },

  /**
   * getAttendanceByStudent
   * -----------------------
   * Retrieves all attendance records for a specific student.
   * Endpoint: GET /attendance/student/{userId}
   *
   * @param userId - The student's/user's ID.
   * @returns A promise resolving to an array of Attendance records.
   */
  getAttendanceByStudent: async (userId: number): Promise<Attendance[]> => {
    const response = await axios.get(`${API_BASE_URL}/attendance/student/${userId}`, {
      auth: {
        username: JSON.parse(sessionStorage.getItem('user') || '{}').email,
        password: JSON.parse(sessionStorage.getItem('user') || '{}').password
      }
    });
    return response.data;
  },

  /**
   * getAttendanceByCourse
   * ----------------------
   * Retrieves all attendance records for a specific course.
   * Endpoint: GET /attendance/course/{courseId}
   *
   * @param courseId - The course's ID.
   * @returns A promise resolving to an array of Attendance records.
   */
  getAttendanceByCourse: async (courseId: number): Promise<Attendance[]> => {
    const response = await axios.get(`${API_BASE_URL}/attendance/course/${courseId}`, {
      auth: {
        username: JSON.parse(sessionStorage.getItem('user') || '{}').email,
        password: JSON.parse(sessionStorage.getItem('user') || '{}').password
      }
    });
    return response.data;
  },

  /**
   * getAttendanceByStudentAndCourse
   * ---------------------------------
   * Retrieves attendance records for a specific student in a specific course.
   * Endpoint: GET /attendance/student/{studentId}/course/{courseId}
   *
   * @param studentId - The student ID.
   * @param courseId - The course ID.
   * @returns A promise resolving to an array of Attendance records.
   */
  getAttendanceByStudentAndCourse: async (studentId: number, courseId: number): Promise<Attendance[]> => {
    const response = await axios.get(`${API_BASE_URL}/attendance/student/${studentId}/course/${courseId}`, {
      auth: {
        username: JSON.parse(sessionStorage.getItem('user') || '{}').email,
        password: JSON.parse(sessionStorage.getItem('user') || '{}').password
      }
    });
    return response.data;
  },
};

export default attendanceService;

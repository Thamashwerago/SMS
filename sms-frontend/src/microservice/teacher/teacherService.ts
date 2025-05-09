// src/api/teacherService.ts

import axios, { AxiosResponse } from "axios";

// Base URL for the teacher microservice API.
// Ensure this endpoint uses HTTPS in production for secure communication.
const API_BASE_URL = "https://api.example.com";

/**
 * Teacher Interface
 * Defines the structure for a teacher record.
 */
export interface Teacher {
  id: number;           // Unique identifier for the teacher (generated by the backend)
  firstName: string;    // Teacher's first name
  lastName: string;     // Teacher's last name
  email: string;        // Teacher's email address
  // Additional fields can be added as needed (e.g., department, specialization, etc.)
}

/**
 * getTeachers
 *
 * Securely fetch a list of teachers from the teacher microservice.
 *
 * @param token - Authentication token for secure API access.
 * @param params - Optional query parameters for filtering or pagination.
 * @returns Promise resolving to an array of Teacher records.
 */
export const getTeachers = async (
  token: string,
  params?: Record<string, string | number | boolean>
): Promise<Teacher[]> => {
  try {
    const response: AxiosResponse<Teacher[]> = await axios.get(
      `${API_BASE_URL}/teachers`,
      {
        headers: {
          "Authorization": `Bearer ${token}`, // Securely pass the token in the header.
          "Content-Type": "application/json",
        },
        params, // Optional parameters for filtering or pagination.
      }
    );
    return response.data;
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      console.error("Error fetching teachers:", error.response?.data || error.message);
    } else {
      console.error("Unexpected error fetching teachers:", error);
    }
    throw new Error("Unable to fetch teachers. Please try again later.");
  }
};

/**
 * getTeacherById
 *
 * Securely fetch a single teacher record by its ID.
 *
 * @param token - Authentication token for secure API access.
 * @param teacherId - ID of the teacher to retrieve.
 * @returns Promise resolving to the Teacher record.
 */
export const getTeacherById = async (
  token: string,
  teacherId: number
): Promise<Teacher> => {
  try {
    const response: AxiosResponse<Teacher> = await axios.get(
      `${API_BASE_URL}/teachers/${teacherId}`,
      {
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );
    return response.data;
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      console.error(`Error fetching teacher with ID ${teacherId}:`, error.response?.data || error.message);
    } else {
      console.error(`Unexpected error fetching teacher with ID ${teacherId}:`, error);
    }
    throw new Error("Unable to fetch teacher details. Please try again later.");
  }
};

/**
 * updateTeacher
 *
 * Securely update an existing teacher record.
 *
 * @param token - Authentication token for secure API access.
 * @param teacherId - ID of the teacher to update.
 * @param data - Partial payload containing updated teacher fields.
 * @returns Promise resolving to the updated Teacher record.
 */
export const updateTeacher = async (
  token: string,
  teacherId: number,
  data: Partial<Teacher>
): Promise<Teacher> => {
  try {
    const response: AxiosResponse<Teacher> = await axios.put(
      `${API_BASE_URL}/teachers/${teacherId}`,
      data,
      {
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );
    return response.data;
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      console.error(`Error updating teacher with ID ${teacherId}:`, error.response?.data || error.message);
    } else {
      console.error(`Unexpected error updating teacher with ID ${teacherId}:`, error);
    }
    throw new Error("Unable to update teacher. Please try again later.");
  }
};

/**
 * createTeacher
 *
 * Securely create a new teacher record.
 *
 * @param token - Authentication token for secure API access.
 * @param data - Payload for the new teacher record (excluding the ID, which is generated by the backend).
 * @returns Promise resolving to the newly created Teacher record.
 */
export const createTeacher = async (
  token: string,
  data: Omit<Teacher, "id">
): Promise<Teacher> => {
  try {
    const response: AxiosResponse<Teacher> = await axios.post(
      `${API_BASE_URL}/teachers`,
      data,
      {
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );
    return response.data;
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      console.error("Error creating teacher:", error.response?.data || error.message);
    } else {
      console.error("Unexpected error creating teacher:", error);
    }
    throw new Error("Unable to create teacher. Please try again later.");
  }
};

/**
 * deleteTeacher
 *
 * Securely delete a teacher record by its ID.
 *
 * @param token - Authentication token for secure API access.
 * @param teacherId - ID of the teacher to delete.
 * @returns Promise resolving when the teacher is successfully deleted.
 */
export const deleteTeacher = async (
  token: string,
  teacherId: number
): Promise<void> => {
  try {
    await axios.delete(`${API_BASE_URL}/teachers/${teacherId}`, {
      headers: {
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      console.error(`Error deleting teacher with ID ${teacherId}:`, error.response?.data || error.message);
    } else {
      console.error(`Unexpected error deleting teacher with ID ${teacherId}:`, error);
    }
    throw new Error("Unable to delete teacher. Please try again later.");
  }
};

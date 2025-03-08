// src/services/studentService.ts
import axios from "axios";
import { Student } from "../types/Student";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8080/api/students";

/**
 * Fetch all students from backend API
 */
export const getStudents = async (): Promise<Student[]> => {
    const response = await axios.get(`${API_URL}`);
    return response.data.data;
};

/**
 * Fetch a single student by ID
 */
export const getStudentById = async (id: number): Promise<Student> => {
    const response = await axios.get(`${API_URL}/${id}`);
    return response.data.data;
};

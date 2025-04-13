// src/services/userService.ts
import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL ?? '172.236.144.75:8081/api';

// User interface matching the backend User model.
export interface User {
  id: number;
  username: string;
  email: string;
  password: string;
  role: string;
}

const userService = {
  /**
   * Retrieve all users.
   */
  getAll: async (): Promise<User[]> => {
    const response = await axios.get(`${API_BASE_URL}/users`);
    return response.data;
  },
 
  /**
   * Retrieve a single user by their ID.
   * @param id The user's ID.
   */
  getById: async (id: number | string): Promise<User> => {
    const response = await axios.get(`${API_BASE_URL}/users/${id}`);
    return response.data;
  },

  /**
   * Create a new user.
   * @param user The user data (excluding the auto-generated id).
   */
  create: async (user: Omit<User, 'id'>): Promise<User> => {
    const response = await axios.post(`${API_BASE_URL}/admin/users`, user);
    return response.data;
  },

  /**
   * Update an existing user.
   * @param id The user's ID.
   * @param user Partial user data to update.
   */
  update: async (id: number | string, user: Partial<User>): Promise<User> => {
    const response = await axios.put(`${API_BASE_URL}/users/${id}`, user);
    return response.data;
  },

  /**
   * Delete a user by their ID.
   * @param id The user's ID.
   */
  delete: async (id: number | string): Promise<void> => {
    await axios.delete(`${API_BASE_URL}/users/${id}`);
  },
};

export default userService;

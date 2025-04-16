// src/services/userService.ts
import axios from 'axios';

const API_BASE_URL = 'http://172.236.144.75:8080/api/user';

/**
 * User interface matching the backend User model.
 */
export interface User {
  id: number;
  username: string;
  email: string;
  password: string;
  role: string;
}

const userService = {
  /**
   * getAll
   * ------
   * Retrieves all users.
   * Endpoint: GET /users
   *
   * @returns A promise resolving to an array of User objects.
   */
  getAll: async (): Promise<User[]> => {
    const response = await axios.get(`${API_BASE_URL}/users`);
    return response.data;
  },

  /**
   * getById
   * -------
   * Retrieves a single user by their ID.
   * Endpoint: GET /users/{id}
   *
   * @param id - The user's ID.
   * @returns A promise resolving to the User object.
   */
  getById: async (id: number | string): Promise<User> => {
    const response = await axios.get(`${API_BASE_URL}/users/${id}`);
    return response.data;
  },

  /**
   * create
   * ------
   * Creates a new user.
   * Endpoint: POST /admin/users
   *
   * @param user - The user data (excluding the auto-generated id).
   * @returns A promise resolving to the newly created User object.
   */
  create: async (user: Omit<User, 'id'>): Promise<User> => {
    const response = await axios.post(`${API_BASE_URL}/admin/users`, user);
    return response.data;
  },

  /**
   * update
   * ------
   * Updates an existing user.
   * Endpoint: PUT /users/{id}
   *
   * @param id - The user's ID.
   * @param user - Partial user data to update.
   * @returns A promise resolving to the updated User object.
   */
  update: async (id: number | string, user: Partial<User>): Promise<User> => {
    const response = await axios.put(`${API_BASE_URL}/users/${id}`, user);
    return response.data;
  },

  /**
   * delete
   * ------
   * Deletes a user by their ID.
   * Endpoint: DELETE /users/{id}
   *
   * @param id - The user's ID.
   * @returns A promise that resolves when deletion is complete.
   */
  delete: async (id: number | string): Promise<void> => {
    await axios.delete(`${API_BASE_URL}/users/${id}`);
  },

  /**
   * isUser
   * ------
   * Validates user login credentials.
   * Endpoint: POST /login (adjust as needed)
   *
   * @param username - The user's username.
   * @param password - The user's raw password.
   * @returns A promise resolving to the user's role if credentials are valid;
   *          otherwise, returns "null" (as a string).
   */
  isUser: async (username: string, password: string): Promise<string> => {
    const response = await axios.post(`${API_BASE_URL}/login`, { "username": username, "password": password });
    return response.data;
  },
};

export default userService;

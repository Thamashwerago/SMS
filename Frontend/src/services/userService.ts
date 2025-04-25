// src/services/userService.ts
import axiosInstance from './axiosInstance';

/**
 * User interface matching the backend User model.
 */
export interface User {
  id: number;
  username: string;
  email: string;
  password: string;
  token: string;
  role: string;
}

export interface AddUser {
  id: number;
  username: string;
  email: string;
  password: string;
  role: string;
}

const userService = {
  /**
   * Retrieve all user records with pagination.
   * 
   * @param page - The page number (0-based index). Default is 0.
   * @param size - The number of records per page. Default is 100.
   * @returns A promise resolving to an array of User objects.
   * 
   * Assumes the backend returns a paginated result with a `content` property.
   */
  getAll: async (page: number = 0, size: number = 100): Promise<User[]> => {
    const response = await axiosInstance.get(`/user`, {
      params: { page, size },
    });
    // Assuming the backend response structure is a Page with a "content" array.
    return response.data.content;
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
    const response = await axiosInstance.get(`/user/${id}`);
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
  create: async (user: Omit<AddUser, 'id'>): Promise<AddUser> => {
    const response = await axiosInstance.post(`/user/signin`, user);
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
    const response = await axiosInstance.put(`/user/${id}`, user);
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
    await axiosInstance.delete(`/user/${id}`);
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
  isUser: async (username: string, password: string): Promise<User> => {
    const response = await axiosInstance.post(`/user/login`, { "username": username, "password": password });
    return response.data;
  },

  updatePassword: async (id: number | string, password: string): Promise<User> => {
    const response = await axiosInstance.put(`/user/${id}`, { password });
    return response.data;
  }
};

export default userService;

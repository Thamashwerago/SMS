/**
 * userService.ts
 * 
 * This module provides functions for interacting with the user-related endpoints of the backend API.
 * It uses Axios to perform HTTP requests and defines interfaces for User, LoginCredentials, and AuthResponse.
 */

import axios, { AxiosResponse } from "axios";

/**
 * Create an Axios instance with default configurations.
 * - baseURL: The base endpoint for the API.
 * - headers: Default headers for all requests.
 * - timeout: Maximum time (in milliseconds) before a request times out.
 */
const api = axios.create({
  baseURL: "https://api.example.com",
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 10000,
});

/**
 * User Interface
 * Defines the structure of a user object.
 */
export interface User {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  role: string;
}

/**
 * LoginCredentials Interface
 * Specifies the properties required for user login.
 */
export interface LoginCredentials {
  email: string;
  password: string;
}

/**
 * AuthResponse Interface
 * Represents the response received after an authentication request.
 */
export interface AuthResponse {
  role: string;
  token: string;
  user: User;
}

/**
 * loginUser
 * 
 * Sends a POST request to the /auth/login endpoint with the user's login credentials.
 * Returns a Promise that resolves to an AuthResponse containing user details and a JWT token.
 * 
 * @param credentials - The user's email and password.
 * @returns A Promise that resolves to the authentication response.
 */
export const loginUser = async (
  credentials: LoginCredentials
): Promise<AuthResponse> => {
  try {
    const response: AxiosResponse<AuthResponse> = await api.post("/auth/login", credentials);
    return response.data;
  } catch (error: unknown) {
    console.error("Error during login:", error);
    throw new Error("Unable to log in. Please check your credentials and try again.");
  }
};

/**
 * registerUser
 * 
 * Sends a POST request to the /auth/register endpoint with the new user's registration data.
 * Returns a Promise that resolves to an AuthResponse containing the created user details and a JWT token.
 * 
 * @param data - The registration data, including a password.
 * @returns A Promise that resolves to the authentication response.
 */
export const registerUser = async (
  data: Omit<User, "id" | "role"> & { password: string }
): Promise<AuthResponse> => {
  try {
    const response: AxiosResponse<AuthResponse> = await api.post("/auth/register", data);
    return response.data;
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      console.error("Error during registration:", error.response?.data || error.message);
    } else {
      console.error("Unexpected error during registration:", error);
    }
    throw new Error("Unable to register. Please try again later.");
  }
};

/**
 * getUserDetails
 * 
 * Sends a GET request to the /users/me endpoint to fetch details of the currently authenticated user.
 * The request includes an Authorization header with a bearer token.
 * 
 * @param token - The JWT token for authorization.
 * @returns A Promise that resolves to the user's details.
 */
export const getUserDetails = async (token: string): Promise<User> => {
  try {
    const response: AxiosResponse<User> = await api.get("/users/me", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      console.error("Error fetching user details:", error.response?.data || error.message);
    } else {
      console.error("Unexpected error fetching user details:", error);
    }
    throw new Error("Unable to fetch user details. Please try again later.");
  }
};

/**
 * updateUserDetails
 * 
 * Sends a PUT request to the /users/me endpoint to update the current user's details.
 * The request includes an Authorization header with a bearer token.
 * 
 * @param token - The JWT token for authorization.
 * @param data - A partial object containing the user fields to update.
 * @returns A Promise that resolves to the updated user details.
 */
export const updateUserDetails = async (
  token: string,
  data: Partial<Omit<User, "id" | "role">>
): Promise<User> => {
  try {
    const response: AxiosResponse<User> = await api.put("/users/me", data, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      console.error("Error updating user details:", error.response?.data || error.message);
    } else {
      console.error("Unexpected error updating user details:", error);
    }
    throw new Error("Unable to update user details. Please try again later.");
  }
};

/**
 * logoutUser
 * 
 * Sends a POST request to the /auth/logout endpoint to log out the current user.
 * The request includes an Authorization header with a bearer token.
 * 
 * @param token - The JWT token for authorization.
 * @returns A Promise that resolves when the user is successfully logged out.
 */
export const logoutUser = async (token: string): Promise<void> => {
  try {
    await api.post(
      "/auth/logout",
      {},
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      console.error("Error during logout:", error.response?.data || error.message);
    } else {
      console.error("Unexpected error during logout:", error);
    }
    throw new Error("Unable to log out. Please try again later.");
  }
};

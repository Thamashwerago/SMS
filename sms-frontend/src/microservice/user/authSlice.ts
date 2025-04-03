/* 
  authSlice.ts
  -------------
  This file defines the Redux slice for authentication management using Redux Toolkit.
  It includes asynchronous thunks for login and registration, and reducers to update and clear the authentication state.
*/

import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { loginUser, registerUser, AuthResponse, LoginCredentials, User } from './userService';

/* 
  AuthState Interface
  -------------------
  Defines the structure of the authentication state.
  - token: The JWT token used for authenticated API calls.
  - user: The currently authenticated user's details.
  - loading: Indicates if an auth-related request is in progress.
  - error: Contains any error messages from auth operations.
*/
interface AuthState {
  token: string | null;
  user: User | null;
  loading: boolean;
  error: string | null;
}

/*
  Retrieve the token from either localStorage or sessionStorage to support persistent authentication.
*/
const initialToken = localStorage.getItem('authToken') ?? sessionStorage.getItem('authToken');

/*
  initialState
  ------------
  The initial authentication state.
*/
const initialState: AuthState = {
  token: initialToken,
  user: null,
  loading: false,
  error: null,
};

/*
  login Thunk
  -----------
  Asynchronous thunk for logging in a user.
  It calls the loginUser API and returns the authentication response.
  On failure, a generic error message is returned.
*/
export const login = createAsyncThunk<AuthResponse, LoginCredentials>(
  'auth/login',
  async (credentials, thunkAPI) => {
    try {
      const response = await loginUser(credentials);
      return response;
    } catch (error: unknown) {
      console.error("Login error:", error instanceof Error ? error.message : error);
      return thunkAPI.rejectWithValue("Login failed. Please check your credentials and try again.");
    }
  }
);

/*
  register Thunk
  --------------
  Asynchronous thunk for registering a new user.
  It calls the registerUser API and returns the authentication response.
  On failure, a generic error message is returned.
*/
export const register = createAsyncThunk<AuthResponse, Omit<User, 'id' | 'role'> & { password: string }>(
  'auth/register',
  async (registrationData, thunkAPI) => {
    try {
      const response = await registerUser(registrationData);
      return response;
    } catch (error: unknown) {
      console.error("Registration error:", error instanceof Error ? error.message : error);
      return thunkAPI.rejectWithValue("Registration failed. Please try again later.");
    }
  }
);

/*
  authSlice
  ---------
  Defines the Redux slice for authentication.
  It handles asynchronous actions (login, register) via extraReducers and synchronous actions (logout, updateUser) via reducers.
*/
const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    /*
      logout Reducer
      ---------------
      Clears the authentication state and removes the auth token from both localStorage and sessionStorage.
    */
    logout(state) {
      state.token = null;
      state.user = null;
      state.error = null;
      localStorage.removeItem('authToken');
      sessionStorage.removeItem('authToken');
    },
    /*
      updateUser Reducer
      ------------------
      Updates the user details in the auth state, useful after profile updates.
    */
    updateUser(state, action: PayloadAction<User>) {
      state.user = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      // Handle pending state for login
      .addCase(login.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      // Handle fulfilled state for login
      .addCase(login.fulfilled, (state, action: PayloadAction<AuthResponse>) => {
        state.loading = false;
        state.token = action.payload.token;
        state.user = action.payload.user;
        localStorage.setItem('authToken', action.payload.token);
      })
      // Handle rejected state for login
      .addCase(login.rejected, (state, action) => {
        state.loading = false;
        state.error = typeof action.payload === 'string' ? action.payload : "Login failed.";
      })
      // Handle pending state for registration
      .addCase(register.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      // Handle fulfilled state for registration
      .addCase(register.fulfilled, (state, action: PayloadAction<AuthResponse>) => {
        state.loading = false;
        state.token = action.payload.token;
        state.user = action.payload.user;
        localStorage.setItem('authToken', action.payload.token);
      })
      // Handle rejected state for registration
      .addCase(register.rejected, (state, action) => {
        state.loading = false;
        state.error = typeof action.payload === 'string' ? action.payload : "Registration failed.";
      });
  },
});

/*
  Export the synchronous actions and the reducer.
*/
export const { logout, updateUser } = authSlice.actions;
export default authSlice.reducer;

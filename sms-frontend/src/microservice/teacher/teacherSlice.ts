// src/store/teacherSlice.ts

import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { Teacher, getTeacherById, updateTeacher } from './teacherService';

/**
 * TeacherState Interface
 *
 * Defines the shape of the teacher-related state.
 * - teacher: Contains teacher details; null if not loaded.
 * - loading: Indicates if an API request is in progress.
 * - error: Contains any error messages encountered during API operations.
 */
interface TeacherState {
  teacher: Teacher | null;
  loading: boolean;
  error: string | null;
}

/**
 * initialState
 *
 * Sets up the initial state for the teacher slice.
 */
const initialState: TeacherState = {
  teacher: null,
  loading: false,
  error: null,
};

/**
 * fetchTeacherDetails
 *
 * An asynchronous thunk that fetches the teacher details from the backend.
 * It retrieves the authentication token from localStorage and calls getTeacherById.
 *
 * Security Considerations:
 * - Ensures a valid token is present before making the API call.
 * - Returns a generic error message if the API call fails to avoid exposing sensitive information.
 *
 * @param teacherId - The unique ID of the teacher whose details are to be fetched.
 */
export const fetchTeacherDetails = createAsyncThunk<
  Teacher,
  number,
  { rejectValue: string }
>(
  'teacher/fetchTeacherDetails',
  async (teacherId, thunkAPI) => {
    // Retrieve the authentication token from localStorage.
    const token = localStorage.getItem('authToken');
    if (!token) {
      // Reject the thunk if the token is missing, preventing unauthorized API calls.
      return thunkAPI.rejectWithValue('Authentication token missing.');
    }
    try {
      // Securely fetch teacher details using the teacher service.
      const teacher = await getTeacherById(token, teacherId);
      return teacher;
    } catch (error: unknown) {
      if (error instanceof Error) {
        console.error('Error fetching teacher details:', error.message);
      } else {
        console.error('Unexpected error:', error);
      }
      return thunkAPI.rejectWithValue('Failed to fetch teacher details.');
    }
  }
);

/**
 * updateTeacherDetails
 *
 * An asynchronous thunk that updates the teacher's details.
 * It uses the authentication token for secure communication and calls updateTeacher with the provided data.
 *
 * Security Considerations:
 * - Verifies that a valid token exists before making the API call.
 * - Handles errors securely by returning generic error messages.
 *
 * @param teacherId - The unique ID of the teacher.
 * @param data - A partial payload containing fields to be updated.
 */
export const updateTeacherDetails = createAsyncThunk<
  Teacher,
  { teacherId: number; data: Partial<Teacher> },
  { rejectValue: string }
>(
  'teacher/updateTeacherDetails',
  async ({ teacherId, data }, thunkAPI) => {
    const token = localStorage.getItem('authToken');
    if (!token) {
      return thunkAPI.rejectWithValue('Authentication token missing.');
    }
    try {
      // Securely update teacher details using the teacher service.
      const updatedTeacher = await updateTeacher(token, teacherId, data);
      return updatedTeacher;
    } catch (error: unknown) {
      if (error instanceof Error) {
        console.error('Error updating teacher details:', error.message);
      } else {
        console.error('Unexpected error:', error);
      }
      return thunkAPI.rejectWithValue('Failed to update teacher details.');
    }
  }
);

/**
 * teacherSlice
 *
 * This Redux slice manages teacher-specific state.
 * It handles asynchronous operations (fetching and updating teacher details) via extraReducers.
 * Synchronous actions, such as clearing teacher data, are defined in reducers.
 *
 * Security & Design Considerations:
 * - Sensitive data is cleared upon logout or errors to prevent unauthorized access.
 * - State updates occur only after successful token-based API calls.
 */
const teacherSlice = createSlice({
  name: 'teacher',
  initialState,
  reducers: {
    /**
     * clearTeacher
     *
     * Synchronously clears teacher data from the state.
     * Useful for logout actions or when needing to reset the teacher data.
     */
    clearTeacher(state) {
      state.teacher = null;
      state.error = null;
      state.loading = false;
    },
  },
  extraReducers: (builder) => {
    // Handle asynchronous actions for fetching teacher details.
    builder
      .addCase(fetchTeacherDetails.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTeacherDetails.fulfilled, (state, action: PayloadAction<Teacher>) => {
        state.loading = false;
        state.teacher = action.payload;
      })
      .addCase(fetchTeacherDetails.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload ?? 'Failed to fetch teacher details.';
      });
      
    // Handle asynchronous actions for updating teacher details.
    builder
      .addCase(updateTeacherDetails.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateTeacherDetails.fulfilled, (state, action: PayloadAction<Teacher>) => {
        state.loading = false;
        state.teacher = action.payload;
      })
      .addCase(updateTeacherDetails.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload ?? 'Failed to update teacher details.';
      });
  },
});

// Export synchronous actions for use in components.
export const { clearTeacher } = teacherSlice.actions;

// Export the reducer to be included in the Redux store.
export default teacherSlice.reducer;

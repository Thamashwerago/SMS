// src/store/studentSlice.ts

import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { Student, getStudentById, updateStudent } from './studentService';

/**
 * StudentState Interface
 *
 * Defines the shape of the student-related state.
 * - student: Contains student details; null if not loaded.
 * - loading: Indicates if an API request is in progress.
 * - error: Stores any error messages encountered during API operations.
 */
interface StudentState {
  student: Student | null;
  loading: boolean;
  error: string | null;
}

/**
 * initialState
 *
 * Sets up the initial state for the student slice.
 * Initially, no student data is loaded.
 */
const initialState: StudentState = {
  student: null,
  loading: false,
  error: null,
};

/**
 * fetchStudentDetails
 *
 * An asynchronous thunk that fetches the student details from the backend.
 * It retrieves the authentication token from local storage and calls getStudentById.
 *
 * Security Considerations:
 * - Checks if a valid token is present before making the API call.
 * - Returns a generic error message if fetching fails.
 *
 * @param studentId - The unique ID of the student whose details are to be fetched.
 */
export const fetchStudentDetails = createAsyncThunk<
  Student,
  number,
  { rejectValue: string }
>(
  'student/fetchStudentDetails',
  async (studentId, thunkAPI) => {
    // Retrieve the token from localStorage
    const token = localStorage.getItem('authToken');
    if (!token) {
      // Reject if token is missing, preventing unauthorized API calls.
      return thunkAPI.rejectWithValue('Authentication token missing.');
    }
    try {
      const student = await getStudentById(token, studentId);
      return student;
    } catch (error: unknown) {
      if (error instanceof Error) {
        console.error("Error fetching student details:", error.message);
      } else {
        console.error("Error fetching student details:", error);
      }
      return thunkAPI.rejectWithValue('Failed to fetch student details.');
    }
  }
);

/**
 * updateStudentDetails
 *
 * An asynchronous thunk that updates the student's details.
 * It uses the token for secure communication and calls updateStudent with the provided data.
 *
 * Security Considerations:
 * - Ensures the token exists before updating.
 * - Handles errors securely by returning generic error messages.
 *
 * @param studentId - The unique ID of the student.
 * @param data - A partial payload containing the fields to be updated.
 */
export const updateStudentDetails = createAsyncThunk<
  Student,
  { studentId: number; data: Partial<Student> },
  { rejectValue: string }
>(
  'student/updateStudentDetails',
  async ({ studentId, data }, thunkAPI) => {
    const token = localStorage.getItem('authToken');
    if (!token) {
      return thunkAPI.rejectWithValue('Authentication token missing.');
    }
    try {
      const updatedStudent = await updateStudent(token, studentId, data);
      return updatedStudent;
    } catch (error: unknown) {
      if (error instanceof Error) {
        console.error("Error updating student details:", error.message);
      } else {
        console.error("Error updating student details:", error);
      }
      return thunkAPI.rejectWithValue('Failed to update student details.');
    }
  }
);

/**
 * studentSlice
 *
 * This Redux slice manages student-related state.
 * It handles asynchronous operations (fetching/updating student details) via extraReducers.
 * Synchronous actions, such as clearing student data, are defined in reducers.
 *
 * Security & Design Considerations:
 * - Sensitive data is securely managed by clearing state on logout or errors.
 * - State updates occur only after successful token-based API calls.
 */
const studentSlice = createSlice({
  name: 'student',
  initialState,
  reducers: {
    /**
     * clearStudent
     *
     * Synchronously clears student data from the state.
     * Useful for logout actions or when needing to reset the student data.
     */
    clearStudent(state) {
      state.student = null;
      state.error = null;
      state.loading = false;
    },
  },
  extraReducers: (builder) => {
    // Handle fetchStudentDetails asynchronous actions
    builder
      .addCase(fetchStudentDetails.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchStudentDetails.fulfilled, (state, action: PayloadAction<Student>) => {
        state.loading = false;
        state.student = action.payload;
      })
      .addCase(fetchStudentDetails.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload ?? 'Failed to fetch student details.';
      });

    // Handle updateStudentDetails asynchronous actions
    builder
      .addCase(updateStudentDetails.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateStudentDetails.fulfilled, (state, action: PayloadAction<Student>) => {
        state.loading = false;
        state.student = action.payload;
      })
      .addCase(updateStudentDetails.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload ?? 'Failed to update student details.';
      });
  },
});

// Export actions for use in components.
export const { clearStudent } = studentSlice.actions;

// Export the reducer to be included in the Redux store.
export default studentSlice.reducer;

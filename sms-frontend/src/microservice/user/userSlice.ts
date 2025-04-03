/*
  userSlice.ts
  ------------
  This file manages the user-related state in the Redux store using Redux Toolkit.
  It defines asynchronous thunks for fetching and updating user details and creates a slice
  that handles the associated actions and state transitions.
*/

import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { User, getUserDetails, updateUserDetails } from './userService';

/*
  UserState Interface
  -------------------
  Represents the state structure for user-related data:
    - user: The current user's details (or null if not loaded).
    - loading: A boolean flag to indicate if an API request is in progress.
    - error: A string for any error messages from API operations.
*/
interface UserState {
  user: User | null;
  loading: boolean;
  error: string | null;
}

/*
  initialState
  ------------
  The initial state for the user slice, with no user data loaded,
  no active API requests, and no error messages.
*/
const initialState: UserState = {
  user: null,
  loading: false,
  error: null,
};

/*
  getToken Function
  -----------------
  Retrieves the authentication token from localStorage or sessionStorage.
  This token is used to authenticate API calls.
*/
const getToken = (): string | null =>
  localStorage.getItem('authToken') ?? sessionStorage.getItem('authToken');

/*
  fetchUserDetails Thunk
  ----------------------
  Asynchronous thunk that fetches the current user's details using the stored auth token.
  If the token is missing, the thunk rejects with an error message.
*/
export const fetchUserDetails = createAsyncThunk<
  User,
  void,
  { rejectValue: string }
>(
  'user/fetchUserDetails',
  async (_, thunkAPI) => {
    const token = getToken();
    if (!token) return thunkAPI.rejectWithValue('Authentication token missing.');
    try {
      const user = await getUserDetails(token);
      return user;
    } catch (error: unknown) {
      console.error(
        "Error fetching user details:",
        error instanceof Error ? error.message : error
      );
      return thunkAPI.rejectWithValue('Failed to fetch user details.');
    }
  }
);

/*
  updateUser Thunk
  ----------------
  Asynchronous thunk that updates the current user's details.
  It sends the updated data to the backend using the stored auth token.
  If the token is missing or the update fails, the thunk rejects with an error message.
*/
export const updateUser = createAsyncThunk<
  User,
  Partial<Omit<User, 'id' | 'role'>>,
  { rejectValue: string }
>(
  'user/updateUser',
  async (data, thunkAPI) => {
    const token = getToken();
    if (!token) return thunkAPI.rejectWithValue('Authentication token missing.');
    try {
      const updatedUser = await updateUserDetails(token, data);
      return updatedUser;
    } catch (error: unknown) {
      console.error(
        "Error updating user details:",
        error instanceof Error ? error.message : error
      );
      return thunkAPI.rejectWithValue('Failed to update user details.');
    }
  }
);

/*
  userSlice
  ---------
  Creates the user slice which includes:
    - Reducers: For synchronous actions such as clearing user data.
    - Extra Reducers: For handling asynchronous thunks (fetchUserDetails and updateUser).
*/
const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    /*
      clearUser Reducer
      -----------------
      Clears the user data and resets loading and error states.
      This can be used, for example, on user logout.
    */
    clearUser(state) {
      state.user = null;
      state.error = null;
      state.loading = false;
    },
  },
  extraReducers: (builder) => {
    builder
      // Handle fetchUserDetails actions
      .addCase(fetchUserDetails.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUserDetails.fulfilled, (state, action: PayloadAction<User>) => {
        state.loading = false;
        state.user = action.payload;
      })
      .addCase(fetchUserDetails.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload ?? 'Failed to fetch user details.';
      })
      // Handle updateUser actions
      .addCase(updateUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateUser.fulfilled, (state, action: PayloadAction<User>) => {
        state.loading = false;
        state.user = action.payload;
      })
      .addCase(updateUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload ?? 'Failed to update user details.';
      });
  },
});

/*
  Export Actions and Reducer
  --------------------------
  Export the clearUser action for use in components and the reducer to be combined in the Redux store.
*/
export const { clearUser } = userSlice.actions;
export default userSlice.reducer;

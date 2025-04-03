// src/store/authSlice.ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface AuthState {
  token: string | null;
  role: string;
}

const initialState: AuthState = {
  token: null,
  role: '',
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setCredentials(state, action: PayloadAction<{ token: string; role: string }>) {
      state.token = action.payload.token;
      state.role = action.payload.role;
    },
    clearCredentials(state) {
      state.token = null;
      state.role = '';
    },
  },
});

export const { setCredentials, clearCredentials } = authSlice.actions;

export default authSlice.reducer;

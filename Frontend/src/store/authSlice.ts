// src/store/authSlice.ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface AuthState {
  token: string | null;
  role: string;
  rehydrated: boolean;
}

const initialState: AuthState = {
  token: null,
  role: '',
  rehydrated: false,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setCredentials(state, action: PayloadAction<{ token: string; role: string }>) {
      state.token = action.payload.token;
      state.role = action.payload.role;
      state.rehydrated = true;
    },
    clearCredentials(state) {
      state.token = null;
      state.role = '';
      state.rehydrated = true;
    },
  },
});

export const { setCredentials, clearCredentials } = authSlice.actions;
export default authSlice.reducer;
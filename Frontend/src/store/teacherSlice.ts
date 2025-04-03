// src/store/teacherSlice.ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface Teacher {
  id: string;
  name: string;
  email: string;
  department: string;
  status: string;
}

interface TeacherState {
  teachers: Teacher[];
  loading: boolean;
  error: string | null;
}

const initialState: TeacherState = {
  teachers: [],
  loading: false,
  error: null,
};

const teacherSlice = createSlice({
  name: 'teacher',
  initialState,
  reducers: {
    fetchTeachersStart(state) {
      state.loading = true;
      state.error = null;
    },
    fetchTeachersSuccess(state, action: PayloadAction<Teacher[]>) {
      state.teachers = action.payload;
      state.loading = false;
      state.error = null;
    },
    fetchTeachersFailure(state, action: PayloadAction<string>) {
      state.loading = false;
      state.error = action.payload;
    },
    addTeacher(state, action: PayloadAction<Teacher>) {
      state.teachers.push(action.payload);
    },
    updateTeacher(state, action: PayloadAction<Teacher>) {
      const index = state.teachers.findIndex(teacher => teacher.id === action.payload.id);
      if (index !== -1) {
        state.teachers[index] = action.payload;
      }
    },
    deleteTeacher(state, action: PayloadAction<string>) {
      state.teachers = state.teachers.filter(teacher => teacher.id !== action.payload);
    },
  },
});

export const {
  fetchTeachersStart,
  fetchTeachersSuccess,
  fetchTeachersFailure,
  addTeacher,
  updateTeacher,
  deleteTeacher,
} = teacherSlice.actions;

export default teacherSlice.reducer;

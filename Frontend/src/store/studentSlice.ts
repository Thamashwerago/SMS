// src/store/studentSlice.ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface Student {
  id: string;
  name: string;
  email: string;
  enrollment: string;
  status: string;
}

interface StudentState {
  students: Student[];
  loading: boolean;
  error: string | null;
}

const initialState: StudentState = {
  students: [],
  loading: false,
  error: null,
};

const studentSlice = createSlice({
  name: 'student',
  initialState,
  reducers: {
    fetchStudentsStart(state) {
      state.loading = true;
      state.error = null;
    },
    fetchStudentsSuccess(state, action: PayloadAction<Student[]>) {
      state.students = action.payload;
      state.loading = false;
      state.error = null;
    },
    fetchStudentsFailure(state, action: PayloadAction<string>) {
      state.loading = false;
      state.error = action.payload;
    },
    addStudent(state, action: PayloadAction<Student>) {
      state.students.push(action.payload);
    },
    updateStudent(state, action: PayloadAction<Student>) {
      const index = state.students.findIndex(student => student.id === action.payload.id);
      if (index !== -1) {
        state.students[index] = action.payload;
      }
    },
    deleteStudent(state, action: PayloadAction<string>) {
      state.students = state.students.filter(student => student.id !== action.payload);
    },
  },
});

export const {
  fetchStudentsStart,
  fetchStudentsSuccess,
  fetchStudentsFailure,
  addStudent,
  updateStudent,
  deleteStudent,
} = studentSlice.actions;

export default studentSlice.reducer;

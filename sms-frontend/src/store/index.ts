// src/store/index.ts

import { configureStore } from '@reduxjs/toolkit';
// Import your reducers from their respective slices.
import authReducer from '../microservice/user/authSlice';
import userReducer from '../microservice/user/userSlice';
import studentReducer from '../microservice/student/studentSlice';
import teacherReducer from '../microservice/teacher/teacherSlice';

// Configure the Redux store with your slices.
const store = configureStore({
  reducer: {
    auth: authReducer,
    user: userReducer,
    student: studentReducer,
    teacher: teacherReducer,
  },
});

// Export types for use throughout your application.
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;

import axios from "axios";

const API_URL = "http://localhost:8080/api"; // Update with your backend URL

// Create Axios instance with JWT support
const api = axios.create({
  baseURL: API_URL,
});

// Automatically attach token to requests if user is logged in
api.interceptors.request.use((config) => {
  const user = JSON.parse(localStorage.getItem("user"));
  if (user?.token) {
    config.headers.Authorization = `Bearer ${user.token}`;
  }
  return config;
}, (error) => Promise.reject(error));

// ---------------------- AUTHENTICATION ----------------------
export const login = (credentials) => api.post("/auth/login", credentials);

// ---------------------- STUDENT MANAGEMENT ----------------------
export const fetchStudents = () => api.get("/students");
export const getStudentById = (id) => api.get(`/students/${id}`);
export const addStudent = (studentData) => api.post("/students", studentData);
export const updateStudent = (id, studentData) => api.put(`/students/${id}`, studentData);
export const deleteStudent = (id) => api.delete(`/students/${id}`);

// ---------------------- FILE UPLOADS ----------------------
export const uploadProfilePicture = (id, formData) => 
  api.post(`/students/${id}/upload`, formData, { headers: { "Content-Type": "multipart/form-data" } });

export const importStudents = (formData) => 
  api.post("/students/import", formData, { headers: { "Content-Type": "multipart/form-data" } });

export const exportStudents = () => api.get("/students/export", { responseType: "blob" });

// ---------------------- AI PERFORMANCE PREDICTION ----------------------
export const getPredictions = () => api.post("/predict");


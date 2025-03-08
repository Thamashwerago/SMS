import axios from "axios";

const BASE_URL = "http://172.236.144.75:8081/api/teachers"; // Your backend URL

export const getTeachers = async () => {
    return axios.get(BASE_URL);
};

export const getTeacherById = async (id) => {
    return axios.get(`${BASE_URL}/${id}`);
};

export const createTeacher = async (teacher) => {
    return axios.post(BASE_URL, teacher);
};

export const updateTeacher = async (id, teacher) => {
    return axios.put(`${BASE_URL}/${id}`, teacher);
};

export const deleteTeacher = async (id) => {
    return axios.delete(`${BASE_URL}/${id}`);
};

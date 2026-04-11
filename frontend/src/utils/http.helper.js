// frontend/src/shared/utils/http.helper.js
import axios from 'axios';

export const http = axios.create({
    baseURL: 'http://localhost:3000/api', // Your backend URL
});

// Automatically attach JWT token from localStorage to every request
http.interceptors.request.use((config) => {
    const token = localStorage.getItem('token'); 
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});
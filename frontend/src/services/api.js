import axios from 'axios';

const API_BASE_URL = 'http://localhost:8080/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const authAPI = {
  signup: (userData) => api.post('/auth/signup', userData),
  login: (credentials) => api.post('/auth/login', credentials),
};

export default api;
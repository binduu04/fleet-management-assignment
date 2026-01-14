import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests automatically
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Auth APIs
export const authAPI = {
  login: (credentials) => api.post('/auth/login', credentials),
  register: (userData) => api.post('/auth/register', userData),
  getMe: () => api.get('/auth/me'),
};

// User APIs
export const userAPI = {
  getAll: () => api.get('/users'),
  getOne: (id) => api.get(`/users/${id}`),
  create: (userData) => api.post('/users', userData),
  update: (id, userData) => api.put(`/users/${id}`, userData),
  delete: (id) => api.delete(`/users/${id}`),
  getByRole: (role) => api.get(`/users/role/${role}`),
};

// Vehicle APIs
export const vehicleAPI = {
  getAll: () => api.get('/vehicles'),
  getOne: (id) => api.get(`/vehicles/${id}`),
  getMy: () => api.get('/vehicles/my/vehicles'),
  create: (vehicleData) => api.post('/vehicles', vehicleData),
  update: (id, vehicleData) => api.put(`/vehicles/${id}`, vehicleData),
  delete: (id) => api.delete(`/vehicles/${id}`),
  assign: (id, userId) => api.put(`/vehicles/${id}/assign`, { userId }),
};

// Service APIs
export const serviceAPI = {
  getAll: () => api.get('/services'),
  getOne: (id) => api.get(`/services/${id}`),
  getTechnicianServices: () => api.get('/services/technician/my-services'),
  getUserServices: () => api.get('/services/user/my-services'),
  getStats: () => api.get('/services/stats'),
  create: (serviceData) => api.post('/services', serviceData),
  update: (id, serviceData) => api.put(`/services/${id}`, serviceData),
  delete: (id) => api.delete(`/services/${id}`),
  updateStatus: (id, statusData) => api.put(`/services/${id}/status`, statusData),
};

export default api;

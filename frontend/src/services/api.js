import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// Crear instancia de axios con configuración optimizada
const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor para requests - agregar token automáticamente
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    console.error('Error en request:', error);
    return Promise.reject(error);
  }
);

// Interceptor para responses - manejo de errores global
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expirado o inválido
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    
    // Log de errores en desarrollo
    if (import.meta.env.DEV) {
      console.error('API Error:', error.response?.data || error.message);
    }
    
    return Promise.reject(error);
  }
);

// Servicios de API organizados por módulo
export const authAPI = {
  login: (credentials) => api.post('/auth/login', credentials),
  register: (userData) => api.post('/auth/register', userData),
  logout: () => api.post('/auth/logout'),
  refreshToken: () => api.post('/auth/refresh'),
  forgotPassword: (email) => api.post('/auth/forgot-password', { email }),
  resetPassword: (token, password) => api.post('/auth/reset-password', { token, password })
};

export const userAPI = {
  getProfile: () => api.get('/users/profile'),
  updateProfile: (data) => api.put('/users/profile', data),
  uploadAvatar: (formData) => api.post('/users/avatar', formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  }),
  deleteAccount: () => api.delete('/users/profile'),
  getUsers: (params) => api.get('/users', { params }),
  getUserById: (id) => api.get(`/users/${id}`)
};

export const symptomsAPI = {
  getSymptoms: (params) => api.get('/symptoms', { params }),
  createSymptom: (data) => api.post('/symptoms', data),
  updateSymptom: (id, data) => api.put(`/symptoms/${id}`, data),
  deleteSymptom: (id) => api.delete(`/symptoms/${id}`),
  getSymptomStats: (params) => api.get('/symptoms/stats', { params }),
  shareWithDoctor: (id, doctorId) => api.post(`/symptoms/${id}/share`, { doctorId })
};

export const appointmentsAPI = {
  getAppointments: (params) => api.get('/appointments', { params }),
  createAppointment: (data) => api.post('/appointments', data),
  updateAppointment: (id, data) => api.put(`/appointments/${id}`, data),
  deleteAppointment: (id) => api.delete(`/appointments/${id}`),
  getUpcoming: () => api.get('/appointments/upcoming')
};

export const motivationalAPI = {
  getContent: (params) => api.get('/motivational', { params }),
  createContent: (data) => api.post('/motivational', data),
  updateContent: (id, data) => api.put(`/motivational/${id}`, data),
  deleteContent: (id) => api.delete(`/motivational/${id}`),
  getDailyReflection: (date) => api.get(`/motivational/daily/${date}`),
  getStats: () => api.get('/motivational/stats')
};

export const stickersAPI = {
  getStickers: () => api.get('/stickers'),
  placeSticker: (data) => api.post('/stickers/place', data),
  removeSticker: (id) => api.delete(`/stickers/placed/${id}`),
  getPlacedStickers: (contentId) => api.get(`/stickers/placed/${contentId}`)
};

export const doctorAPI = {
  getPatients: () => api.get('/doctor-dragona/patients'),
  invitePatient: (email) => api.post('/doctor-dragona/invite', { email }),
  removePatient: (patientId) => api.delete(`/doctor-dragona/patients/${patientId}`),
  getQuestions: () => api.get('/doctor-questions'),
  answerQuestion: (id, answer) => api.put(`/doctor-questions/${id}`, { answer })
};

export const adminAPI = {
  getUsers: (params) => api.get('/admin/users', { params }),
  updateUser: (id, data) => api.put(`/admin/users/${id}`, data),
  deleteUser: (id) => api.delete(`/admin/users/${id}`),
  getStats: () => api.get('/admin/stats'),
  getSystemHealth: () => api.get('/admin/health')
};

// Utilidades
export const handleAPIError = (error) => {
  if (error.response) {
    return error.response.data?.message || 'Error del servidor';
  } else if (error.request) {
    return 'Error de conexión. Verifica tu conexión a internet.';
  } else {
    return 'Error inesperado. Intenta de nuevo.';
  }
};

export default api;


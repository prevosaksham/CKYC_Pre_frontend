import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor
api.interceptors.request.use(
  (config) => {
    const user = localStorage.getItem('user');
    if (user) {
      const { token } = JSON.parse(user);
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Only redirect on 401 for non-login endpoints
    // Don't redirect if it's a login failure - let the login page handle it
    const isLoginEndpoint = error.config?.url?.includes('/api/Login/Authenticate');
    if (error.response?.status === 401 && !isLoginEndpoint) {
      localStorage.removeItem('user');
      window.location.href = '/ckycform/login';
    }
    return Promise.reject(error);
  }
);

// Auth APIs
export const authAPI = {
  login: (username, password) =>
    api.post('/api/Login/Authenticate', { username, password: btoa(password) }),
  signup: (fullName, email, password) =>
    api.post('/api/Login/Signup', { fullName, email, password: btoa(password) }),
  logout: () => api.post('/api/Login/Logout'),
};

// Form APIs
export const formAPI = {
  getAll: () => api.get('/api/Dashboard/GetAllForms'),
  getById: (id) => api.get(`/api/Dashboard/GetFormDetails/${id}`),
  submit: (data) => api.post('/api/Home/SubmitForm', data),
  updateStatus: (id, status) =>
    api.post('/api/Dashboard/UpdateStatus', { id, status }),
  update: (id, data) => api.put(`/api/Home/UpdateForm/${id}`, data),
  delete: (id) => api.delete(`/api/Home/DeleteForm/${id}`),
};

// Dashboard APIs
export const dashboardAPI = {
  getStats: () => api.get('/api/Dashboard/GetStats'),
  getAllUsers: () => api.get('/api/Dashboard/GetAllUsers'),
  deleteUser: (id) => api.delete(`/api/Login/DeleteUser/${id}`),
  // Health Monitor
  getHealthConfigs: () => api.get('/api/Dashboard/GetHealthConfigs'),
  saveHealthConfig: (data) => api.post('/api/Dashboard/SaveHealthConfig', data),
  refreshHealth: (id) => api.get(`/api/Dashboard/RefreshHealth/${id}`),
  refreshAllHealth: () => api.get('/api/Dashboard/RefreshAllHealth'),
  deleteHealthConfig: (id) => api.delete(`/api/Dashboard/DeleteHealthConfig/${id}`),
};

export default api;

import axios from 'axios';

const api = axios.create({
  baseURL: 'https://readjourney.b.goit.study/api',
});

export const setAuthHeader = token => {
  api.defaults.headers.common.Authorization = `Bearer ${token}`;
  localStorage.setItem('token', token);
};

export const clearAuthHeader = () => {
  api.defaults.headers.common.Authorization = '';
  localStorage.removeItem('token');
};

api.interceptors.request.use(
  config => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  error => Promise.reject(error)
);

api.interceptors.response.use(
  response => response,
  error => {
    if (error.response?.status === 401) {
      clearAuthHeader();
    }
    return Promise.reject(error);
  }
);

export default api;

import axios from 'axios';

const api = axios.create({
  baseURL: 'https://mundosdetinta.duckdns.org/api',
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
});

// Adjunta el token de inicio de sesión automáticamente en cada petición que lo requiera
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;

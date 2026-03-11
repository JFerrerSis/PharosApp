import axios from 'axios';

const api = axios.create({
  // Al desplegar en la misma máquina, 'localhost' asegura que el origen sea el mismo
  baseURL: 'http://192.168.3.59:8000', 
  withCredentials: true, // INDISPENSABLE: Hace que el navegador adjunte las cookies at/rt solas
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // 🛑 VALIDACIÓN CLAVE: Si es la ruta de login, NO intentar refresh
    if (originalRequest.url.includes('/auth/login')) {
      return Promise.reject(error);
    }

    // Si el Access Token (at) venció, el servidor responderá 401
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        await api.post('/auth/refresh'); 
        return api(originalRequest);
      } catch (refreshError) {
        localStorage.removeItem('pharos_session_active');
        localStorage.removeItem('pharos_user');
        // Solo redirigir si no estamos ya en el login para evitar bucles
        if (window.location.pathname !== '/login') {
            window.location.href = '/login';
        }
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);
export default api;
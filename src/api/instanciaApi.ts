import axios from 'axios';

const api = axios.create({
  // Al desplegar en la misma máquina, 'localhost' asegura que el origen sea el mismo
  baseURL: 'http://localhost:8000', 
  withCredentials: true, // INDISPENSABLE: Hace que el navegador adjunte las cookies at/rt solas
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Si el Access Token (at) venció, el servidor responderá 401
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        // El frontend solo "toca" el endpoint, NO el token.
        // El navegador enviará la cookie 'rt' automáticamente en esta petición.
        await api.post('/auth/refresh'); 
        
        // Si el refresh tuvo éxito, el servidor ya envió nuevas cookies Set-Cookie.
        // Reintentamos la petición original, que ahora llevará el nuevo 'at' solo.
        return api(originalRequest);
      } catch (refreshError) {
        // Si el Refresh Token (rt) también venció o es inválido:
        localStorage.removeItem('pharos_session_active');
        localStorage.removeItem('pharos_user');
        window.location.href = '/login';
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export default api;
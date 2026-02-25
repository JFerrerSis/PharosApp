import axios from 'axios';

const api = axios.create({
  baseURL: 'http://192.168.17.69:3000/',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor para depurar errores de red en la consola
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.code === 'ECONNABORTED') {
      console.error('💥 Error: El servidor tardó demasiado en responder.');
    } else if (!error.response) {
      console.error('🌐 Error de Red: No se pudo conectar con 192.168.17.69. ¿Está el servidor encendido o el Firewall activo?');
    }
    return Promise.reject(error);
  }
);

export default api;
import axios from 'axios';
import { api } from '../config/axiosInstance';
import { authService } from '../service/auth.service';
import type { InternalAxiosRequestConfig, AxiosResponse } from 'axios';

export const setupInterceptors = () => {
  api.interceptors.response.use(
    async (response: AxiosResponse) => {
      const data = response.data;
      const config = response.config as InternalAxiosRequestConfig & { _retry?: boolean };

      // Detectamos el error específico de tu backend (ErrorHandlerToken)
      const errorMessage = data?.message || "";
      const isAuthError = errorMessage.includes("JWEDecryptionFailed") || errorMessage === "El token ha expirado";

      if (isAuthError) {
        // Si el error ocurre en el propio refresh o ya reintentamos, logout
        if (config.url?.includes('/auth/refresh') || config._retry) {
          console.error("🛑 Error crítico de token. Limpiando sesión.");
          authService.logout();
          return Promise.reject(data);
        }

        // Si es cualquier otra petición (como /farmacias), ejecutamos el refresh
        return handleRefresh(config);
      }

      return response;
    },
    async (error) => {
      const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean };
      
      // Manejo de 401 reales
      if (error.response?.status === 401 && !originalRequest._retry) {
        return handleRefresh(originalRequest);
      }
      return Promise.reject(error);
    }
  );
};

const handleRefresh = async (originalRequest: any) => {
  originalRequest._retry = true;
  try {
    const baseURL = import.meta.env.VITE_API_URL || 'http://localhost:8000';
    // USAR AXIOS BASE para que esta petición no pase por este interceptor de nuevo
    await axios.post(`${baseURL}/auth/refresh`, {}, { withCredentials: true });
    
    // Reintentamos la petición original con la nueva cookie
    return api(originalRequest);
  } catch (err) {
    authService.logout();
    return Promise.reject(err);
  }
};
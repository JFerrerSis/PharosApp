// src/api/service/auth.service.ts
import axios from 'axios'; // Importamos el axios base para romper el bucle
import { api } from '../config/axiosInstance';

interface UserProfile {
  id: number;
  username: string;
  role: string;
  sede: string; 
}

interface LoginResponse {
  message?: string;
  cause?: string;
  user?: UserProfile; 
}

// URL base para peticiones que deben saltarse los interceptores
const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

export const authService = {
  login: async (username: string, password: string, id_farmacia: number | string, farmacia: string): Promise<LoginResponse> => {
    const loginPayload = {
      username: username.trim(),
      password: password,
      farmacia_auth: {
        id_farmacia: Number(id_farmacia),
        farmacia: farmacia.toLowerCase()
      }
    };

    const response = await api.post<LoginResponse>('/auth/login', loginPayload);
    const data = response.data;

    if (response.status === 200 && data.user) {
      localStorage.setItem('pharos_session_active', 'true');

      const userData: UserProfile = {
        id: data.user.id,
        role: data.user.role,
        username: username.trim(),
        sede: farmacia.toUpperCase() 
      };

      localStorage.setItem('pharos_user', JSON.stringify(userData));
      return { ...data, user: userData }; 
    }
    
    throw response;
  },

  /**
   * Logout ajustado para romper bucles de interceptores
   */
  logout: async () => {
    // 1. Limpieza inmediata del estado local (Sincrónico)
    // Esto asegura que si el usuario refresca manualmente, ya no haya sesión.
    localStorage.removeItem('pharos_session_active');
    localStorage.removeItem('pharos_user');
    localStorage.clear(); 

    try {
      // 2. Notificar al backend usando axios base (NO la instancia 'api')
      // Si el token en la cookie es inválido (JWEDecryptionFailed), 
      // el servidor dará error pero NO activará el interceptor ni el bucle.
      await axios.post(`${BASE_URL}/auth/logout`, {}, { withCredentials: true });
    } catch (error) {
      console.warn("No se pudo notificar el cierre de sesión al servidor, pero la sesión local fue destruida.");
    } finally {
      // 3. Redirección forzada
      // Usamos replace para que el usuario no pueda volver atrás con el botón del navegador
      if (window.location.pathname !== '/login') {
        window.location.replace('/login');
      }
    }
  }
};
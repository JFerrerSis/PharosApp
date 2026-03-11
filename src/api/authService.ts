import api from './instanciaApi';

interface LoginResponse {
  message?: string;
  cause?: string;
  user?: {
    id: number;
    username: string;
    role: string;
  };
}

export const authService = {
  login: async (username: string, password: string, id_farmacia: number | string, farmacia: string): Promise<LoginResponse> => {
    try {
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

      // --- FILTRO DE SEGURIDAD PHAROS ---
      if (response.status === 200) {
        // SESIÓN VÁLIDA
        localStorage.setItem('pharos_session_active', 'true');
        localStorage.setItem('pharos_user', JSON.stringify(data.user));
        return data; // Devolvemos el objeto completo (incluyendo message de éxito)
      } 
      
      throw response; // Si no es 200, lanzamos la respuesta para caer en el catch

    } catch (error: any) {
      localStorage.removeItem('pharos_session_active');
      localStorage.removeItem('pharos_user');

      // Normalizamos el error para que siempre tenga la estructura del backend
      const errorData = error.response?.data || {
        message: "Error de Protocolo",
        cause: "No se pudo establecer conexión con el servidor Pharos."
      };

      // LANZAMOS UN OBJETO, NO UN STRING
      throw errorData; 
    }
    },
  logout: async () => {
    try {
      // Intentamos invalidar la sesión en el servidor (cookies/JWT)
      await api.post('/auth/logout');
    } catch (err) {
      console.error("Error al invalidar cookies en el servidor:", err);
    } finally {
      // --- CORRECCIÓN CRUCIAL ---
      // En lugar de localStorage.clear(), borramos solo lo relacionado a la sesión
      localStorage.removeItem('pharos_session_active');
      localStorage.removeItem('pharos_user');

      // El 'theme' se queda intacto en el navegador.

      // Redirigimos al login
      window.location.href = '/login';
    }
  }
};
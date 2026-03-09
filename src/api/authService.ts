import api from './instanciaApi';

interface LoginResponse {
  message?: string;
  user?: {
    id: number;
    username: string;
    role: string;
  };
}

export const authService = {
  login: async (
    username: string, 
    password: string, 
    id_farmacia: number | string, 
    farmacia: string
  ): Promise<LoginResponse> => {
    try {
      const loginPayload = {
        username: username.trim(),
        password: password,
        farmacia_auth: {
          id_farmacia: Number(id_farmacia),
          farmacia: farmacia.toLowerCase()
        }
      };

      // 1. Petición al backend. 
      // Al estar en el mismo dominio, 'withCredentials' en la instanciaApi
      // hará que el navegador guarde las cookies automáticamente.
      const response = await api.post<LoginResponse>('/auth/login', loginPayload);

      // 2. VALIDACIÓN BASADA EN RESPUESTA DEL SERVIDOR
      // Si el status es 200, el servidor confirmó que el usuario EXISTE.
      if (response.status === 200) {
        
        // Marcamos la sesión como activa en el front
        localStorage.setItem('pharos_session_active', 'true');
        
        if (response.data.user) {
          localStorage.setItem('pharos_user', JSON.stringify(response.data.user));
        }

        return response.data;
      } else {
        throw new Error('No se pudo validar la sesión.');
      }

    } catch (error: any) {
      // Si el usuario no existe o la clave es errónea, el servidor (Express)
      // debe devolver un error (401/404) que caerá aquí.
      localStorage.removeItem('pharos_session_active');
      localStorage.removeItem('pharos_user');

      const errorMsg = error.response?.data?.message || 'Usuario o clave incorrectos';
      throw new Error(errorMsg); 
    }
  },

  logout: async () => {
    try {
      // Es vital llamar al backend para que limpie las cookies del lado del servidor
      await api.post('/auth/logout');
    } catch (err) {
      console.error("Error al invalidar cookies");
    } finally {
      localStorage.clear();
      window.location.href = '/login';
    }
  }
};
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

      const response = await api.post<LoginResponse>('/auth/login', loginPayload);

      const data = response.data;
      const invalidMessages = ["no existe", "invalida", "incorrecto"];
      const hasErrorMessage = data.message && invalidMessages.some(m => data.message?.toLowerCase().includes(m));

      // --- FILTRO DE SEGURIDAD PHAROS ---
      if (response.status === 200) {
        if (hasErrorMessage || !data.user) {
          throw {
            isManualError: true,
            message: data.message || "Acceso Denegado: Credenciales no reconocidas en el sistema.",
            cause: data.cause || "El usuario no existe o no tiene permisos en esta sede."
          };
        }

        // SESIÓN VÁLIDA
        localStorage.setItem('pharos_session_active', 'true');
        localStorage.setItem('pharos_user', JSON.stringify(data.user));

        return data;
      } else {
        // Mensaje más técnico para estados inesperados
        throw new Error(`Respuesta anómala del servidor (Código: ${response.status}). No se pudo establecer la sesión.`);
      }

    } catch (error: any) {
      localStorage.removeItem('pharos_session_active');
      localStorage.removeItem('pharos_user');

      // 1. Manejo de error manual (el filtro de arriba)
      if (error.isManualError) {
        throw new Error(error.message);
      }

      // 2. Manejo de errores de red (Servidor Bun apagado o sin internet)
      if (error.code === 'ERR_NETWORK') {
        throw new Error('Fallo de Red: El servidor de PharosApp no responde. Verifica tu conexión o el estado del host.');
      }

      // 3. Manejo de errores HTTP específicos (401, 500, etc.)
      if (error.response) {
        const status = error.response.status;
        const serverMsg = error.response.data?.message;

        switch (status) {
          case 401:
            throw new Error(serverMsg || 'No autorizado: Usuario, clave o sede incorrectos.');
          case 404:
            throw new Error('Servicio no disponible: El endpoint de autenticación no fue localizado en el servidor.');
          case 500:
            throw new Error('Error Crítico: Fallo en el motor de base de datos (PostgreSQL/Prisma). Contacta a soporte.');
          default:
            throw new Error(serverMsg || `Error de Sistema (${status}): Intente nuevamente en unos minutos.`);
        }
      }

      // 4. Error genérico final
      throw new Error(error.message || 'Error crítico en el protocolo de autenticación.');
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
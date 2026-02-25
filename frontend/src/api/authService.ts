import api from './instanciaApi'; // Tu axios configurado
import type { Usuario, Farmacia, CreateUserDTO } from '../types/usuarios';

export const authService = {
  
  // --- SECCIÓN: AUTENTICACIÓN (LOGIN) ---
  login: async (codusuario: string, password_raw: string) => {
    const { data } = await api.post('/auth/login', { codusuario, password: password_raw });
    if (data.token) {
      localStorage.setItem('pharos_token', data.token);
      localStorage.setItem('pharos_user', JSON.stringify(data.user));
    }
    return data;
  },

  // --- SECCIÓN: GESTIÓN DE USUARIOS (TU MÓDULO) ---
  
  // 1. Obtener todos los usuarios para la tabla
  getUsuarios: async (): Promise<Usuario[]> => {
    const { data } = await api.get<Usuario[]>('/usuarios');
    return data;
  },

  // 2. Obtener las farmacias para los botones del modal
  getFarmacias: async (): Promise<Farmacia[]> => {
    const { data } = await api.get<Farmacia[]>('/farmacias');
    return data;
  },

  // 3. Crear el usuario (Afecta las 3 tablas en el backend)
  createUsuario: async (payload: CreateUserDTO): Promise<Usuario> => {
    const { data } = await api.post<Usuario>('/usuarios', payload);
    return data;
  },

  // 4. Eliminar/Revocar acceso
  deleteUsuario: async (codusuario: string): Promise<void> => {
    await api.delete(`/usuarios/${codusuario}`);
  }
};
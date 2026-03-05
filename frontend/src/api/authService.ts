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
    const { data } = await api.get<Usuario[]>('/auth/searchUser');
    return data;
  },

  // 2. Obtener las farmacias para los botones del modal
  getFarmacias: async (): Promise<Farmacia[]> => {
    const { data } = await api.get<Farmacia[]>('/farmacias');
    return data;
  },
// 3. Crear el usuario (Corregido: Apunta a /auth/register)
  createUsuario: async (payload: CreateUserDTO): Promise<Usuario> => {
    // Forzamos que codusuario sea un número para evitar el error "must be an integer"
    const formattedPayload = {
      ...payload,
      codusuario: Number(payload.codusuario), 
    };

    // Cambiado de '/usuarios' a '/auth/register' según tu instrucción
    const { data } = await api.post<Usuario>('/auth/register', formattedPayload);
    return data;
  },

  // ASEGÚRATE DE QUE ESTA FUNCIÓN ESTÉ AQUÍ DENTRO:
  deleteUsuario: async (codusuario: string | number): Promise<void> => {
    await api.delete(`/usuarios/${codusuario}`);
  }
};

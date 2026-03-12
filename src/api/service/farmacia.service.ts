import axios from 'axios';
import { api } from "../config/axiosInstance";

const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

export const farmaciaService = {
  /**
   * Obtiene las farmacias para el selector del Login.
   * Se usa axios base para evitar que el interceptor bloquee la carga
   * si hay cookies viejas o falta de token.
   */
  getFarmacias: async () => {
    try {
      // Usamos la librería axios directamente (sin interceptores)
      const { data } = await axios.get(`${BASE_URL}/farmacia/farmacias`, {
        withCredentials: true
      }); 
      
      // Estructura: data (axios) -> data (tu JSON) -> response (tu Array)
      return data?.data?.response || data?.response || [];

    } catch (error: any) {
      console.error("Error en getFarmacias (Public):", error.response?.data || error.message);
      return []; // Devolvemos array vacío para no romper el map() en el componente
    }
  },

  /**
   * Ejemplo de ruta protegida: Aquí sí usamos 'api'
   * porque el usuario ya debería estar dentro del sistema.
   */
  getMyFarmacias: async () => {
    try {
      const { data } = await api.get("/farmacia/my"); 
      return data?.data?.response || [];
    } catch (error: any) {
      console.error("Error en getMyFarmacias:", error.message);
      throw error;
    }
  },
};
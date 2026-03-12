// src/api/service/asistencia.service.ts
import { apitest } from "../config/axiosInstance";

// Definimos la interfaz basada en tu JSON para tener autocompletado (TS)
export interface Analista {
  id: number;
  nombre: string;
  codigo: string;
  cargo: string;
  localidad: string;
  localidad_codigo: string;
  qr_code: string;
  fecha_registro: string;
}

export const asistenciaService = {
  // GET /analistas
  getAnalistas: async (): Promise<Analista[]> => {
    try {
      const { data } = await apitest.get("/analistas");
      
      // Según tu JSON, la respuesta tiene la clave "analistas"
      return data?.analistas || [];
      
    } catch (error: any) {
      console.error("Error en asistenciaService (getAnalistas):", error.response?.data || error.message);
      throw error;
    }
  },

  // Ejemplo por si necesitas buscar uno solo en el futuro
  getAnalistaByCodigo: async (codigo: string): Promise<Analista | null> => {
    try {
      const { data } = await apitest.get(`/analistas/${codigo}`);
      return data || null;
    } catch (error) {
      return null;
    }
  }
};
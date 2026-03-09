// src/api/tasaService.ts
import api from './instanciaApi';
import { type  TasaCambio } from '../types/tasa';

export const getUltimaTasa = async (): Promise<TasaCambio> => {
  try {
    const response = await api.get<TasaCambio>('bcv/tasa');
    return response.data;
  } catch (error) {
    console.error("Servicio de Tasas: Error de comunicación.");
    // Objeto de emergencia para que el Layout no se quede en loading
    return {
      id: 0,
      dolar: "0.00",
      euro: "0.00",
      fecha: "N/A",
      created_at: ""
    };
  }
};
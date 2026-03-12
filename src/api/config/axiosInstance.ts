import axios from 'axios';

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8000',
  withCredentials: true,
  headers: { 'Content-Type': 'application/json' }
});

// --- CONFIGURACIÓN SEGUNDO BACKEND (Ej: Servicios Externos o Reportes) ---
export const apitest = axios.create({
  baseURL: import.meta.env.VITE_SECONDARY_API_URL || 'http://192.168.16.91:5001',
  withCredentials: false,
  headers: { 'Content-Type': 'application/json' }
});
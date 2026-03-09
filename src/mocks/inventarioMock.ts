// Agregamos la palabra "type" aquí
import type { Equipo } from '../types'; 

export const mockEquipos: Equipo[] = [
  { 
    id: 1, 
    categoria: 'PC', 
    marca: 'Dell', 
    modelo: 'Optiplex', 
    serial: 'DELL-001', 
    estado: 'EN_USO', 
    farmacia_id: 'F001', 
    caja_id: 1, 
    es_servidor: false 
  },
  { 
    id: 2, 
    categoria: 'MONITOR', 
    marca: 'HP', 
    modelo: 'V22', 
    serial: 'HP-990', 
    estado: 'EN_USO', 
    farmacia_id: 'F001', 
    caja_id: 1, 
    es_servidor: false 
  },
  { 
    id: 3, 
    categoria: 'PUNTO_VENTA', 
    marca: 'Verifone', 
    modelo: 'VX520', 
    serial: 'POS-001', 
    estado: 'EN_USO', 
    farmacia_id: 'F001', 
    caja_id: 2, 
    es_servidor: false, 
    banco: { id: 1, nombre: 'Banesco' } 
  }
];
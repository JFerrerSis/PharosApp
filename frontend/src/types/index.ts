// src/types/index.ts

export type Categoria = 'PC' | 'MONITOR' | 'IMPRESORA_FISCAL' | 'UPS' | 'PUNTO_VENTA' | 'SERVIDOR';
export type Estado = 'EN_USO' | 'RESPALDO' | 'DAÑADO' | 'REPARACION';

export interface Banco {
    id: number;
    nombre: string;
}

export interface Equipo {
    id: number;
    categoria: Categoria;
    marca: string;
    modelo: string;
    serial: string;
    anydesk_id?: string;
    banco?: Banco; // Solo si es PUNTO_VENTA
    estado: Estado;
    farmacia_id: string;
    caja_id?: number;
    respaldo_id?: number;
    es_servidor: boolean;
}

export interface Caja {
    id: number;
    nro_caja: number;
    farmacia_id: string;
    equipos: Equipo[];
}
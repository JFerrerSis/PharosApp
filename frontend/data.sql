-- ==========================================================
-- 1. TIPOS ENUM (Deben crearse antes que las tablas)
-- ==========================================================
CREATE TYPE estado_equipo AS ENUM ('EN_USO', 'RESPALDO', 'DAÑADO');
CREATE TYPE categoria_equipo AS ENUM ('PC', 'PUNTO_VENTA', 'MONITOR', 'IMPRESORA', 'MOUSE', 'TECLADO', 'OTRO');

-- ==========================================================
-- 2. TABLAS MAESTRAS (Independientes)
-- ==========================================================
CREATE TABLE farmacias (
    id_codigo_farmacia VARCHAR(10) PRIMARY KEY, -- Ej: 'F001'
    nombre VARCHAR(100) NOT NULL
);

CREATE TABLE bancos (
    id SERIAL PRIMARY KEY,
    nombre VARCHAR(50) UNIQUE NOT NULL -- Ej: 'Banesco', 'Mercantil'
);

-- ==========================================================
-- 3. TABLAS DE UBICACIÓN (Dependen de Farmacias)
-- ==========================================================
CREATE TABLE cajas (
    id SERIAL PRIMARY KEY,
    farmacia_id VARCHAR(10) REFERENCES farmacias(id_codigo_farmacia) ON DELETE CASCADE,
    nro_caja INTEGER NOT NULL,
    ip_v4 VARCHAR(15),
    anydesk_id VARCHAR(12),
    anydesk_clave VARCHAR(50),
    UNIQUE(farmacia_id, nro_caja)
);

CREATE TABLE respaldos (
    id SERIAL PRIMARY KEY,
    farmacia_id VARCHAR(10) REFERENCES farmacias (id_codigo_farmacia) ON DELETE CASCADE,
    descripcion VARCHAR(100) DEFAULT 'Cuarto de Datos'
);

-- ==========================================================
-- 4. TABLAS DE ACTIVOS (Equipos y POS)
-- ==========================================================
CREATE TABLE equipos (
    id SERIAL PRIMARY KEY,
    categoria categoria_equipo NOT NULL,
    marca VARCHAR(50),
    modelo VARCHAR(100),
    serial VARCHAR(100) UNIQUE NOT NULL,
    farmacia_id VARCHAR(10) REFERENCES farmacias (id_codigo_farmacia),
    caja_id INTEGER REFERENCES cajas (id),
    respaldo_id INTEGER REFERENCES respaldos (id),
    es_servidor BOOLEAN DEFAULT FALSE,
    estado estado_equipo DEFAULT 'RESPALDO',
    observaciones TEXT,
    anydesk_id VARCHAR(12) -- Añadido para que coincida con tu índice inferior
);

CREATE TABLE puntos_venta (
    id SERIAL PRIMARY KEY,
    banco_id INTEGER REFERENCES bancos(id) ON DELETE CASCADE,
    modelo VARCHAR(50),
    serial VARCHAR(100) UNIQUE NOT NULL,
    farmacia_id VARCHAR(10) REFERENCES farmacias (id_codigo_farmacia),
    caja_id INTEGER REFERENCES cajas (id),
    respaldo_id INTEGER REFERENCES respaldos (id),
    estado estado_equipo DEFAULT 'RESPALDO',
    observaciones TEXT,
    fecha_registro TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ==========================================================
-- 5. SEGURIDAD Y AUDITORÍA
-- ==========================================================
CREATE TABLE usuarios (
    id SERIAL PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    rol VARCHAR(20) CHECK (rol IN ('ADMIN', 'SOPORTE')),
    farmacia_id VARCHAR(10) REFERENCES farmacias (id_codigo_farmacia),
    activo BOOLEAN DEFAULT TRUE
);

CREATE TABLE historial (
    id SERIAL PRIMARY KEY,
    activo_id INTEGER NOT NULL,
    detalle_movimiento TEXT,
    usuario VARCHAR(50),
    fecha TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE snapshots_inventario (
    id SERIAL PRIMARY KEY,
    fecha_snapshot TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    farmacia_id VARCHAR(10) REFERENCES farmacias (id_codigo_farmacia),
    data_json JSONB,
    usuario_valida VARCHAR(50)
);

-- ==========================================================
-- 6. VISTAS (Necesaria para el procedimiento de Snapshot)
-- ==========================================================
CREATE OR REPLACE VIEW vista_tienda_actual AS
SELECT 
    e.id_codigo_farmacia, e.categoria, e.marca, e.modelo, e.serial, e.estado, c.nro_caja
FROM (SELECT farmacia_id as id_codigo_farmacia, categoria, marca, modelo, serial, estado, caja_id FROM equipos) e
LEFT JOIN cajas c ON e.caja_id = c.id;

-- ==========================================================
-- 7. LÓGICA: TRIGGERS Y PROCEDIMIENTOS
-- ==========================================================
CREATE OR REPLACE FUNCTION funcion_log_movimientos()
RETURNS TRIGGER AS $$
BEGIN
    IF (OLD.estado IS DISTINCT FROM NEW.estado OR 
        OLD.caja_id IS DISTINCT FROM NEW.caja_id OR 
        OLD.respaldo_id IS DISTINCT FROM NEW.respaldo_id OR
        OLD.es_servidor IS DISTINCT FROM NEW.es_servidor) THEN
        
        INSERT INTO historial (activo_id, detalle_movimiento, usuario)
        VALUES (
            NEW.id, 
            'MOVIMIENTO: Estado (' || OLD.estado || ' > ' || NEW.estado || '), ' ||
            'Ubicación: ' || 
            CASE 
                WHEN NEW.caja_id IS NOT NULL THEN 'Caja ' || (SELECT nro_caja FROM cajas WHERE id = NEW.caja_id)
                WHEN NEW.respaldo_id IS NOT NULL THEN 'Respaldo'
                WHEN NEW.es_servidor THEN 'Servidor'
                ELSE 'Sin ubicación'
            END,
            current_user
        );
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_movimientos_equipos
AFTER UPDATE ON equipos
FOR EACH ROW EXECUTE FUNCTION funcion_log_movimientos();

CREATE OR REPLACE PROCEDURE generar_snapshot_tienda(p_farmacia_id VARCHAR(10), p_usuario VARCHAR(50))
LANGUAGE plpgsql
AS $$
BEGIN
    INSERT INTO snapshots_inventario (farmacia_id, data_json, usuario_valida)
    VALUES (
        p_farmacia_id,
        (SELECT jsonb_agg(t) FROM (
            SELECT categoria, marca, modelo, serial, estado, nro_caja 
            FROM vista_tienda_actual 
            WHERE id_codigo_farmacia = p_farmacia_id
        ) t),
        p_usuario
    );
END;
$$;

-- ==========================================================
-- 8. ÍNDICES (Optimización)
-- ==========================================================
CREATE INDEX idx_pos_tid ON puntos_venta (terminal_id);
CREATE INDEX idx_equipos_farmacia ON equipos (farmacia_id);
CREATE INDEX idx_equipos_caja ON equipos (caja_id) WHERE caja_id IS NOT NULL;
CREATE INDEX idx_cajas_anydesk ON cajas (anydesk_id) WHERE anydesk_id IS NOT NULL;
CREATE INDEX idx_historial_activo ON historial (activo_id);
CREATE INDEX idx_historial_fecha ON historial (fecha DESC);
CREATE INDEX idx_equipos_serial ON equipos (serial);
CREATE INDEX idx_equipos_anydesk ON equipos (anydesk_id) WHERE anydesk_id IS NOT NULL;


-- ==========================================================
-- 9. INVENTARIO DE TÓNER E INSUMOS (SIMPLIFICADO)
-- ==========================================================

-- Definimos las áreas de la farmacia para asignar el insumo
CREATE TYPE area_farmacia AS ENUM ('FARMACIA', 'COSMETICOS', 'PISO DE VENTAS', 'ALMACEN', 'MISCELANEOS', 'NODO');

-- 1. Definimos el tipo ENUM para los estados de los tóners 🛠️
CREATE TYPE estado_toner AS ENUM ('EN_USO', 'GUARDADO', 'EN_MANTENIMIENTO');

-- 2. Creamos la tabla de tóners actualizada 📦
CREATE TABLE toners (
    id SERIAL PRIMARY KEY,
    modelo VARCHAR(50) NOT NULL, -- Ej: 'HP 58A', 'TN-660'
    compatibilidad TEXT,         -- Ej: 'HP LaserJet M404, M428'
    
    -- Estado del insumo (En lugar de stock)
    estado estado_toner DEFAULT 'GUARDADO',
    
    -- Ubicación y Relación con Farmacia
    farmacia_id VARCHAR(10) REFERENCES farmacias(id_codigo_farmacia) ON DELETE CASCADE,
    area_destino area_farmacia DEFAULT 'FARMACIA',
    ubicacion_estante VARCHAR(100), -- Ej: 'Gaveta A-12'
    
    observaciones TEXT,
    fecha_registro TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    ultima_actualizacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Índices para mantener la velocidad de búsqueda
CREATE INDEX idx_toners_farmacia ON toners (farmacia_id);
CREATE INDEX idx_toners_modelo ON toners (modelo);

-- Trigger para auto-actualizar la fecha de modificación
CREATE OR REPLACE FUNCTION update_toner_timestamp()
RETURNS TRIGGER AS $$
BEGIN
    NEW.ultima_actualizacion = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_update_toner_time
BEFORE UPDATE ON toners
FOR EACH ROW EXECUTE FUNCTION update_toner_timestamp();
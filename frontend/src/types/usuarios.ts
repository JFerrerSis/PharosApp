// --- TODO EN UN SOLO ARCHIVO ---

// 1. Lo que tienes en la tabla 'farmacias'
export interface Farmacia {
  id_codigo_farmacia: string; // Ej: '1701'
  nombre: string;              // Ej: 'MALL'
}

// 2. Lo que tienes en la tabla 'usuarios'
export interface Usuario {
  codusuario: string;     // La cédula
  nombre: string;         // El login
  email: string;
  rol: 'ADMIN' | 'SOPORTE';
  activo: boolean;
  // Este campo es "virtual": lo llenamos en el Backend haciendo un JOIN con la tabla intermedia
  farmacias_asignadas: Farmacia[]; 
}

// 3. Lo que necesitas para CREAR un usuario (Payload)
// Aquí enviamos los IDs de las farmacias que seleccionaste en los cuadritos del modal
export interface CreateUserDTO {
  codusuario: string;
  nombre: string;
  email: string;
  password_hash: string;
  rol: string;
  sedes_seleccionadas: string[]; // Ejemplo: ['0301', '1701']
}
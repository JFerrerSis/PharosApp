import asistenciaApi from './asistenciaApi'; 

export interface UserAttendance {
  id: number;
  nombre: string;
  qr_code: string;
  entrada: string | null;
  salida: string | null;
  manual: string;
  cargo?: string; 
  activo?: boolean;
}

export const attendanceService = {
  getAttendance: async (): Promise<any> => { // Cambiamos a any temporalmente para no chocar con la estructura de la fecha
    try {
      const response = await asistenciaApi.get('/get_users_with_attendance');
      
      // EL FIX: Tu JSON usa la llave "usuarios", no "users"
      // También retornamos response.data completo para que el componente maneje el objeto {fecha, usuarios}
      return response.data; 
      
    } catch (error) {
      console.error("Error en attendanceService:", error);
      throw error;
    }
  }
};
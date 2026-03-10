import axios from 'axios';

const asistenciaApi = axios.create({
  baseURL: 'http://192.168.16.88:5001',
  headers: {
    'Content-Type': 'application/json',
  },
});

// ESTA ES LA LÍNEA QUE FALTA:
export default asistenciaApi;
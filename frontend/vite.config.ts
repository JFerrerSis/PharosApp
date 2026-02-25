import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    host: '192.168.x.x', // Tu IP aquí
    port: 5173,
    strictPort: true, // Si el puerto está ocupado, da error en lugar de usar otro
  }
})
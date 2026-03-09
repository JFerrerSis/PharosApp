/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class', // <--- ESTO ES LO QUE FALTA PARA QUE EL BOTÓN FUNCIONE
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Personalización para un look de "Soporte Técnico Profesional"
        primary: {
          DEFAULT: '#0f172a', // Slate-900 (Sidebar)
          light: '#1e293b',
        },
        secondary: {
          DEFAULT: '#3b82f6', // Blue-500 (Botones/Acciones)
          hover: '#2563eb',
        },
        danger: '#ef4444', // Red-500 (Equipos dañados)
        success: '#22c55e', // Green-500 (Equipos en uso)
      },
      fontFamily: {
        mono: ['JetBrains Mono', 'ui-monospace', 'SFMono-Regular'],
      }
    },
  },
  plugins: [],
}
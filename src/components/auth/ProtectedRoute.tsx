import { Navigate, Outlet } from 'react-router-dom';

/**
 * ProtectedRoute: El guardián de las rutas de PharosApp.
 * Verifica que el usuario tenga una sesión activa antes de renderizar
 * cualquier vista interna del sistema.
 */
export const ProtectedRoute = () => {
  // 1. Buscamos el flag de sesión en el almacenamiento local
  // Este es el que seteamos en el 'authService.login'
  const isAuth = localStorage.getItem('pharos_session_active') === 'true';

  // 2. Si no está autenticado, lo redirigimos al login
  // Usamos 'replace' para que no pueda volver atrás con las flechas del navegador
  if (!isAuth) {
    return <Navigate to="/login" replace />;
  }

  // 3. Si está autenticado, renderizamos el componente hijo
  // 'Outlet' representa cualquier ruta que esté dentro de ProtectedRoute en App.tsx
  return <Outlet />;
};
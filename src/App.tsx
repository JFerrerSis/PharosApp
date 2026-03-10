import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { LoginPage } from './pages/Login';
import { MainLayout } from './components/layout/MainLayout';
import { EquiposPage } from './pages/equipos/Equipos';
import { CajasPage } from './pages/cajas/CajasPage';
import { Dashboard } from './pages/Dashboard';
import { PuntosVentaPage } from './pages/puntos/PuntosPage';
import { TonerPage } from './pages/toners/TonerPage';
import { NotFoundPage } from './pages/NotFound';
import { HistorialPage } from './pages/historial/HistorialPage';

// --- NUEVA IMPORTACIÓN DE SONNER ---
import { Toaster } from 'sonner';

// --- IMPORTACIONES DE ADMINISTRACIÓN ---
import { UserPage } from './pages/usuarios/UserPage';
import { FarmaciaPage } from './pages/farmacias/FarmaciaPage';
import { BancoPage } from './pages/bancos/BancoPage';

// --- IMPORTACIÓN DEL GUARDIÁN DE RUTAS ---
import { ProtectedRoute } from './components/auth/ProtectedRoute';

function App() {
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem('theme') || 'light';
  });

  useEffect(() => {
    localStorage.setItem('theme', theme);
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  return (
    <Router>
      <Toaster 
        theme={theme as 'light' | 'dark'} 
        richColors 
        position="top-right"
        closeButton 
      />

      <Routes>
        {/* RUTA PÚBLICA */}
        <Route path="/login" element={<LoginPage />} />

        {/* --- GRUPO DE RUTAS PROTEGIDAS --- */}
        <Route element={<ProtectedRoute />}>
          
          {/* Panel de Control */}
          <Route path="/dashboard" element={
            <MainLayout titulo="Panel de Control">
              <Dashboard />
            </MainLayout>
          } />

          {/* Inventario y Operaciones */}
          <Route path="/equipos" element={
            <MainLayout titulo="Gestión de Equipos">
              <EquiposPage />
            </MainLayout>
          } />

          <Route path="/cajas" element={
            <MainLayout titulo="Gestión de Cajas">
              <CajasPage />
            </MainLayout>
          } />

          <Route path="/puntos-venta" element={
            <MainLayout titulo="Gestión de Puntos de venta">
              <PuntosVentaPage />
            </MainLayout>
          } />

          <Route path="/toners" element={
            <MainLayout titulo="Gestión de Tóners">
              <TonerPage />
            </MainLayout>
          } />

          <Route path="/usuarios" element={
            <MainLayout titulo="Gestión de Usuarios">
              <UserPage />
            </MainLayout>
          } />

          <Route path="/farmacias" element={
            <MainLayout titulo="Gestión de Farmacias">
              <FarmaciaPage />
            </MainLayout>
          } />

          <Route path="/bancos" element={
            <MainLayout titulo="Gestión de Entidades Bancarias">
              <BancoPage />
            </MainLayout>
          } />

          <Route path="/historial" element={
            <MainLayout titulo="Historial de movimientos">
              <HistorialPage />
            </MainLayout>
          } />

        </Route> 
        {/* --- FIN DEL GRUPO PROTEGIDO --- */}

        {/* Redirecciones y Errores */}
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </Router>
  );
}

export default App;
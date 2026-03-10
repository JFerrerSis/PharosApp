import React, { useState } from 'react';
import { Sidebar } from './Sidebar';

interface MainLayoutProps {
  children: React.ReactNode;
  titulo?: string;
}

export const MainLayout: React.FC<MainLayoutProps> = ({ children, titulo }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('dashboard');

  return (
    <div className="flex h-screen bg-theme-main overflow-hidden transition-colors duration-300">
      
      {/* Sidebar - Mantiene la navegación lateral */}
      <div className={`
        fixed inset-y-0 left-0 z-50 transform 
        ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} 
        lg:relative lg:translate-x-0 transition-transform duration-300 ease-in-out
      `}>
        <Sidebar 
          activeTab={activeTab} 
          setActiveTab={setActiveTab} 
          onClose={() => setIsSidebarOpen(false)} 
        />
      </div>

      {/* Overlay para dispositivos móviles */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40 lg:hidden" 
          onClick={() => setIsSidebarOpen(false)} 
        />
      )}

      <main className="flex-1 flex flex-col min-w-0 overflow-hidden">
        
        {/* Header Superior Minimalista */}
        <header className="h-20 flex items-center justify-between px-8 border-b border-theme-border bg-theme-sidebar/80 backdrop-blur-xl z-30 transition-colors">
          
          <div className="flex items-center gap-4">
            {/* Botón de menú para móviles */}
            <button 
              onClick={() => setIsSidebarOpen(true)} 
              className="lg:hidden p-2 text-theme-sub hover:text-theme-text transition-colors"
            >
              <div className="w-6 h-0.5 bg-current mb-1" />
              <div className="w-6 h-0.5 bg-current mb-1" />
              <div className="w-6 h-0.5 bg-current" />
            </button>
            
            {/* Título de la página actual */}
            <h2 className="text-xl font-black text-theme-text uppercase tracking-wider">
              {titulo || 'Panel de Control'}
            </h2>
          </div>

          {/* Espacio derecho vacío (puedes usarlo luego para un buscador simple o dejarlo así) */}
          <div className="flex items-center gap-6">
            {/* No hay elementos de perfil aquí ahora */}
          </div>
        </header>

        {/* Contenedor del Contenido Principal */}
        <div className="flex-1 overflow-y-auto p-10 custom-scrollbar bg-theme-main text-theme-text">
          <div className="max-w-7xl mx-auto">
            {children}
          </div>
        </div>
      </main>
    </div>
  );
};
import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, Monitor, Store, 
  History, CreditCard, LogOut, 
  Droplets, Sun, Moon, Users, Landmark, Settings, ChevronDown 
} from 'lucide-react';

import logoMara from '../../assets/logo-maraplus.png';

interface SidebarProps {
  onClose?: () => void;
  activeTab?: string; 
  setActiveTab?: (id: string) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ onClose, setActiveTab }) => {
  const navigate = useNavigate();
  const location = useLocation();
  
  const [darkMode, setDarkMode] = useState(() => 
    document.documentElement.classList.contains('dark')
  );
  const [isConfigOpen, setIsConfigOpen] = useState(false);

  const menuItems = [
    { id: 'dashboard', icon: LayoutDashboard, label: 'Dashboard', path: '/dashboard' },
    { id: 'equipos', icon: Monitor, label: 'Equipos', path: '/equipos' },
    { id: 'cajas', icon: Store, label: 'Cajas', path: '/cajas' },
    { id: 'toners', icon: Droplets, label: 'Tóners', path: '/toners' },
    { id: 'puntos-venta', icon: CreditCard, label: 'Puntos De Venta', path: '/puntos-venta' },
    { id: 'usuarios', icon: Users, label: 'Usuarios', path: '/usuarios' },
    { id: 'farmacias', icon: Store, label: 'Farmacias', path: '/farmacias' },
    { id: 'bancos', icon: Landmark, label: 'Bancos', path: '/bancos' },
    { id: 'historial', icon: History, label: 'Historial', path: '/historial' },
  ];

  useEffect(() => {
    const currentItem = menuItems.find(item => item.path === location.pathname);
    if (currentItem && setActiveTab) {
      setActiveTab(currentItem.id);
    }
  }, [location.pathname]);

  const toggleTheme = () => {
    const isDark = document.documentElement.classList.toggle('dark');
    localStorage.setItem('theme', isDark ? 'dark' : 'light');
    setDarkMode(isDark);
  };

  const handleNavigation = (id: string, path: string) => {
    if (setActiveTab) setActiveTab(id);
    navigate(path);
    if (onClose) onClose(); 
  };

  return (
    <aside className="w-64 h-screen bg-theme-sidebar border-r border-theme-border flex flex-col relative shadow-2xl overflow-hidden transition-colors duration-300">
      
      {/* Luz ambiental */}
      <div className="absolute -top-24 -left-24 w-48 h-48 bg-theme-accent/10 blur-[100px] pointer-events-none hidden dark:block" />

      {/* Header / Logo */}
      <div className="p-6 pb-6 relative">
        <div className="flex flex-col items-center cursor-pointer" onClick={() => handleNavigation('dashboard', '/dashboard')}>
          <img 
            src={logoMara} 
            alt="Logo" 
            className="w-28 object-contain mb-3 dark:brightness-110 brightness-95 transition-all" 
          />
          <div className="text-center">
            <h1 className="text-lg font-black tracking-tighter text-theme-text uppercase">
              Pharos<span className="text-blue-500 font-light italic">App</span>
            </h1>
          </div>
        </div>
      </div>

      {/* Navegación Principal */}
      <nav className="flex-1 px-3 space-y-0.5 overflow-y-auto custom-scrollbar">
        <p className="px-3 text-[9px] font-bold text-theme-sub uppercase tracking-[0.2em] mb-2 opacity-50">Menú Principal</p>
        
        {menuItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <button
              key={item.id}
              onClick={() => handleNavigation(item.id, item.path)}
              className={`
                w-full flex items-center gap-3 px-3 py-2 rounded-xl transition-all duration-200 group
                ${isActive 
                  ? 'bg-blue-500/10 text-theme-accent border border-theme-accent/20' 
                  : 'text-theme-sub hover:bg-theme-card hover:text-theme-text'}
              `}
            >
              <item.icon size={14} className={isActive ? 'text-theme-accent' : 'opacity-70 group-hover:opacity-100'} />
              <span className={`text-[11px] ${isActive ? 'font-bold' : 'font-medium'}`}>{item.label}</span>
            </button>
          );
        })}

        {/* Sección de Configuración Desplegable */}
        <div className="pt-4 mt-4 border-t border-theme-border/50">
          <button
            onClick={() => setIsConfigOpen(!isConfigOpen)}
            className={`
              w-full flex items-center justify-between px-3 py-2 rounded-xl transition-all duration-200
              ${isConfigOpen ? 'text-theme-text bg-theme-card' : 'text-theme-sub hover:text-theme-text'}
            `}
          >
            <div className="flex items-center gap-3">
              <Settings size={14} className={isConfigOpen ? 'text-theme-accent' : 'opacity-70'} />
              <span className="text-[11px] font-medium">Configuración</span>
            </div>
            <ChevronDown size={12} className={`transition-transform duration-300 ${isConfigOpen ? 'rotate-180' : ''}`} />
          </button>

          {/* Opciones Desplegables */}
          <div className={`
            overflow-hidden transition-all duration-300 ease-in-out px-2
            ${isConfigOpen ? 'max-h-32 opacity-100 mt-1' : 'max-h-0 opacity-0'}
          `}>
            <button
              onClick={toggleTheme}
              className="w-full flex items-center gap-3 px-4 py-2 rounded-lg text-theme-sub hover:bg-theme-main/50 hover:text-theme-text transition-all group"
            >
              {darkMode ? <Sun size={13} className="group-hover:text-amber-400" /> : <Moon size={13} className="group-hover:text-blue-400" />}
              <span className="text-[10px] font-medium">Modo {darkMode ? 'Claro' : 'Oscuro'}</span>
            </button>

            <button
              onClick={() => navigate('/login')}
              className="w-full flex items-center gap-3 px-4 py-2 rounded-lg text-red-500/70 hover:bg-red-500/10 hover:text-red-500 transition-all"
            >
              <LogOut size={13} />
              <span className="text-[10px] font-medium">Cerrar Sesión</span>
            </button>
          </div>
        </div>
      </nav>

      {/* Footer Version */}
      <div className="p-4 flex flex-col items-center">
        <p className="text-[7px] font-bold text-theme-sub opacity-20 tracking-[0.4em] uppercase">
          v1.0.4-stable
        </p>
      </div>
    </aside>
  );
};
import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, Monitor, Store, 
  History, CreditCard, LogOut, 
  Droplets, Sun, Moon, Users, Landmark, Settings, ChevronDown, MapPin,CalendarCheck 
} from 'lucide-react';

import logoMara from '../../assets/Isotipo2.png';
import { authService } from '../../api/authService';

interface SidebarProps {
  onClose?: () => void;
  activeTab?: string; 
  setActiveTab?: (id: string) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ onClose, setActiveTab }) => {
  const navigate = useNavigate();
  const location = useLocation();
  
  // --- LÓGICA DE PERSISTENCIA DE TEMA CORREGIDA ---
  const [darkMode, setDarkMode] = useState(() => {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) return savedTheme === 'dark';
    return document.documentElement.classList.contains('dark');
  });

  const [isConfigOpen, setIsConfigOpen] = useState(false);
  const [user, setUser] = useState({ username: 'Usuario', sede: 'Sede Central' });

  // Sincronizar cambios de tema con el DOM y LocalStorage
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [darkMode]);

  useEffect(() => {
    const sessionUser = localStorage.getItem('pharos_user');
    if (sessionUser) {
      try {
        const parsed = JSON.parse(sessionUser);
        setUser({
          username: parsed.username || 'Usuario',
          sede: parsed.sede || 'Sede Central'
        });
      } catch (e) {
        console.error("Error al cargar datos de sidebar");
      }
    }
  }, []);

  const menuItems = [
    { id: 'dashboard', icon: LayoutDashboard, label: 'Dashboard', path: '/dashboard' },
    { id: 'equipos', icon: Monitor, label: 'Equipos', path: '/equipos' },
    { id: 'asistencia', icon: CalendarCheck, label: 'Asistencia', path: '/asistencia' },
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
  }, [location.pathname, setActiveTab]);

  const toggleTheme = () => {
    setDarkMode(!darkMode); // El useEffect se encarga del resto
  };

  const handleLogout = async () => {
    try {
      await authService.logout();
    } catch (error) {
      console.error("Error al cerrar sesión");
    }
  };

  const handleNavigation = (id: string, path: string) => {
    if (setActiveTab) setActiveTab(id);
    navigate(path);
    if (onClose) onClose(); 
  };

  return (
    <aside className="w-64 h-screen bg-theme-sidebar border-r border-theme-border flex flex-col relative shadow-2xl overflow-hidden transition-colors duration-300">
      
      <div className="absolute -top-24 -left-24 w-48 h-48 bg-theme-accent/10 blur-[100px] pointer-events-none hidden dark:block" />

      {/* Header */}
      <div className="p-6 relative">
        <div className="flex items-center gap-3 cursor-pointer group" onClick={() => handleNavigation('dashboard', '/dashboard')}>
          <div className="relative">
            <img src={logoMara} alt="Logo" className="w-10 h-10 object-contain dark:brightness-110 brightness-95 transition-transform duration-500 group-hover:scale-110" />
            <div className="absolute inset-0 bg-theme-accent/20 blur-xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
          </div>
          <div className="flex flex-col justify-center">
            <h1 className="text-xl font-black tracking-tighter text-theme-text uppercase leading-none">
              Pharos<span className="text-blue-500 font-light italic">App</span>
            </h1>
            <span className="text-[7px] font-bold text-theme-sub tracking-[0.3em] uppercase opacity-40">Core System</span>
          </div>
        </div>
      </div>

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

        <div className="pt-4 mt-4 border-t border-theme-border/50">
          
          <div className="mx-2 mb-4 p-3 rounded-2xl bg-gradient-to-br from-theme-card to-theme-main/20 border border-theme-border/50 shadow-sm relative overflow-hidden group">
            <div className="absolute -right-2 -bottom-2 opacity-5 group-hover:opacity-10 transition-opacity">
               <MapPin size={40} />
            </div>

            <div className="relative z-10 flex flex-col gap-2">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <span className="text-[10px] font-black text-theme-text uppercase tracking-tight truncate">
                  {user.username}
                </span>
              </div>

              <div className="flex items-center gap-1.5 px-2 py-1 rounded-lg bg-theme-accent/10 border border-theme-accent/20 w-fit">
                <MapPin size={10} className="text-theme-accent" />
                <span className="text-[8px] font-black text-theme-accent uppercase tracking-[0.1em]">
                  {user.sede}
                </span>
              </div>
            </div>
          </div>

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

          <div className={`
            overflow-hidden transition-all duration-300 ease-in-out px-2
            ${isConfigOpen ? 'max-h-40 opacity-100 mt-1' : 'max-h-0 opacity-0'}
          `}>
            <button
              onClick={toggleTheme}
              className="w-full flex items-center gap-3 px-4 py-2 rounded-lg text-theme-sub hover:bg-theme-main/50 hover:text-theme-text transition-all group"
            >
              {darkMode ? <Sun size={13} className="group-hover:text-amber-400" /> : <Moon size={13} className="group-hover:text-blue-400" />}
              <span className="text-[10px] font-medium">Modo {darkMode ? 'Claro' : 'Oscuro'}</span>
            </button>

            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-3 px-4 py-2 rounded-lg text-red-500/70 hover:bg-red-500/10 hover:text-red-500 transition-all"
            >
              <LogOut size={13} />
              <span className="text-[10px] font-medium">Cerrar Sesión</span>
            </button>
          </div>
        </div>
      </nav>

      <div className="p-4 flex flex-col items-center">
        <p className="text-[7px] font-bold text-theme-sub opacity-20 tracking-[0.4em] uppercase">
          v1.0.4-stable
        </p>
      </div>
    </aside>
  );
};
import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, Monitor, Store, History, CreditCard, LogOut, 
  Droplets, Sun, Moon, Users, Landmark, Settings, ChevronDown, 
  MapPin, CalendarCheck, ChevronLeft, Menu, Loader2
} from 'lucide-react';
import logoMara from '../../assets/Isotipo2.png';
import { authService } from '../../api/authService';

interface SidebarProps {
  onClose?: () => void;
  setActiveTab?: (id: string) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ onClose, setActiveTab }) => {
  const navigate = useNavigate();
  const location = useLocation();
  
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isConfigOpen, setIsConfigOpen] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  
  const [darkMode, setDarkMode] = useState(() => {
    const savedTheme = localStorage.getItem('theme');
    return savedTheme ? savedTheme === 'dark' : document.documentElement.classList.contains('dark');
  });

  const [user, setUser] = useState({ username: 'Usuario', sede: 'Sede Central' });

  // Lógica de Logout con animación de pantalla completa
  const handleLogout = async () => {
    setIsLoggingOut(true);
    // Bloqueamos el scroll del sitio mientras cierra
    document.body.style.overflow = 'hidden';
    
    setTimeout(() => {
      document.body.style.overflow = 'auto';
      authService.logout();
      navigate('/login');
    }, 1000); // 1 segundo para que la barra de carga se aprecie
  };

  useEffect(() => {
    const root = document.documentElement;
    if (darkMode) {
      root.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      root.classList.remove('dark');
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
      } catch (e) { console.error("Error loading sidebar data"); }
    }
  }, []);

  const sections = [
    {
      title: 'Operaciones',
      items: [
        { id: 'dashboard', icon: LayoutDashboard, label: 'Dashboard', path: '/dashboard' },
        { id: 'equipos', icon: Monitor, label: 'Equipos', path: '/equipos' },
        { id: 'toners', icon: Droplets, label: 'Tóners', path: '/toners' },
        { id: 'asistencia', icon: CalendarCheck, label: 'Asistencia', path: '/asistencia' },
      ]
    },
    {
      title: 'Administración',
      items: [
        { id: 'usuarios', icon: Users, label: 'Usuarios', path: '/usuarios' },
        { id: 'farmacias', icon: Store, label: 'Farmacias', path: '/farmacias' },
        { id: 'puntos-venta', icon: CreditCard, label: 'Puntos de Venta', path: '/puntos-venta' },
        { id: 'bancos', icon: Landmark, label: 'Bancos', path: '/bancos' },
        { id: 'historial', icon: History, label: 'Historial', path: '/historial' },
      ]
    }
  ];

  const handleNavigation = (id: string, path: string) => {
    if (setActiveTab) setActiveTab(id);
    navigate(path);
    if (onClose) onClose(); 
  };

  return (
    <>
      {/* 🖥️ OVERLAY GLOBAL: Ocupa toda la ventana del navegador */}
      {isLoggingOut && (
        <div className="fixed inset-0 w-screen h-screen z-[9999] flex flex-col items-center justify-center bg-[#050505]/95 backdrop-blur-md animate-in fade-in duration-300">
          
          {/* Efecto de Scanlines (Cyber-Tech) */}
          <div className="absolute inset-0 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.1)_50%),linear-gradient(90deg,rgba(0,184,160,0.03),rgba(0,184,160,0.01),rgba(0,184,160,0.03))] bg-[length:100%_3px,3px_100%] pointer-events-none opacity-50" />
          
          <div className="relative flex flex-col items-center gap-8">
            <div className="relative">
              <Loader2 size={48} className="text-theme-accent animate-spin" />
              <div className="absolute inset-0 bg-theme-accent blur-2xl opacity-30 animate-pulse" />
            </div>
            
            <div className="text-center space-y-3">
              <h2 className="text-white text-xs font-black uppercase tracking-[0.8em] animate-pulse">
                Shutdown
              </h2>
              <div className="flex flex-col items-center gap-1">
                <p className="text-theme-accent text-[8px] font-bold uppercase tracking-[0.3em] opacity-60">
                  Terminando sesión de {user.username}
                </p>
                <span className="text-[6px] text-theme-sub font-black uppercase tracking-widest opacity-30 italic">
                  Pharos System Protocol • Maracaibo
                </span>
              </div>
            </div>

            {/* Barra de progreso técnica */}
            <div className="w-56 h-[1px] bg-white/10 rounded-full overflow-hidden relative">
              <div className="absolute inset-0 bg-theme-accent/10 blur-[2px]" />
              <div className="h-full bg-theme-accent shadow-[0_0_12px_#00B8A0] animate-[progress-fast_0.9s_ease-in-out_forwards]" />
            </div>
          </div>
        </div>
      )}

      {/* 📟 SIDEBAR CONTAINER */}
      <aside className={`
        relative h-screen bg-theme-sidebar border-r border-theme-border flex flex-col 
        transition-all duration-500 ease-in-out shadow-2xl z-40
        ${isCollapsed ? 'w-20' : 'w-64'}
      `}>
        
        {/* Botón de Colapso */}
        <button 
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="absolute -right-3 top-10 bg-theme-accent text-white rounded-full p-1 shadow-lg z-50 hover:scale-110 transition-transform hidden md:block"
        >
          {isCollapsed ? <Menu size={12} /> : <ChevronLeft size={12} />}
        </button>

        {/* Header / Logo */}
        <div className={`p-6 mb-2 transition-all duration-300 ${isCollapsed ? 'items-center px-4' : ''}`}>
          <div className="flex items-center gap-3 cursor-pointer group" onClick={() => handleNavigation('dashboard', '/dashboard')}>
            <div className="relative shrink-0">
              <img src={logoMara} alt="Logo" className="w-10 h-10 object-contain dark:brightness-110 group-hover:rotate-12 transition-transform duration-500" />
              <div className="absolute inset-0 bg-theme-accent/20 blur-xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
            {!isCollapsed && (
              <div className="flex flex-col animate-in fade-in duration-500">
                <h1 className="text-xl font-black tracking-tighter text-theme-text uppercase leading-none">
                  Pharos<span className="text-theme-accent font-light italic ml-1">App</span>
                </h1>
                <span className="text-[7px] font-bold text-theme-sub tracking-[0.3em] uppercase opacity-40">Core System</span>
              </div>
            )}
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-3 space-y-6 overflow-y-auto overflow-x-hidden custom-scrollbar">
          {sections.map((section, idx) => (
            <div key={idx} className="space-y-1">
              {!isCollapsed && (
                <p className="px-3 text-[9px] font-black text-theme-sub uppercase tracking-[0.2em] mb-2 opacity-50 animate-in slide-in-from-left-2">
                  {section.title}
                </p>
              )}
              {section.items.map((item) => {
                const isActive = location.pathname === item.path;
                return (
                  <button
                    key={item.id}
                    onClick={() => handleNavigation(item.id, item.path)}
                    title={isCollapsed ? item.label : ''}
                    className={`
                      w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-300 group relative
                      ${isActive 
                        ? 'bg-theme-accent/10 text-theme-accent shadow-[inset_0_0_10px_rgba(0,184,160,0.05)]' 
                        : 'text-theme-sub hover:bg-theme-card hover:text-theme-text'}
                    `}
                  >
                    <item.icon size={18} className={`${isActive ? 'text-theme-accent' : 'opacity-70 group-hover:opacity-100'} transition-colors`} />
                    {!isCollapsed && (
                      <span className={`text-[11px] whitespace-nowrap transition-opacity ${isActive ? 'font-bold' : 'font-medium'}`}>
                        {item.label}
                      </span>
                    )}
                    {isActive && (
                      <div className="absolute left-0 w-1 h-5 bg-theme-accent rounded-r-full shadow-[0_0_8px_#00B8A0]" />
                    )}
                  </button>
                );
              })}
            </div>
          ))}
        </nav>

        {/* Footer Area */}
        <div className="p-3 mt-auto space-y-2 border-t border-theme-border/50 bg-theme-main/20">
          {!isCollapsed && (
            <div className="p-3 rounded-2xl bg-theme-card/50 border border-theme-border/30 mb-2">
              <div className="flex items-center gap-2 mb-1.5">
                <div className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]" />
                <span className="text-[10px] font-black text-theme-text uppercase truncate">{user.username}</span>
              </div>
              <div className="flex items-center gap-1.5 text-theme-accent">
                <MapPin size={10} />
                <span className="text-[8px] font-bold uppercase tracking-wider">{user.sede}</span>
              </div>
            </div>
          )}

          <button
            onClick={() => setIsConfigOpen(!isConfigOpen)}
            className={`w-full flex items-center justify-between px-3 py-2 rounded-xl transition-colors ${isConfigOpen ? 'bg-theme-card text-theme-text' : 'text-theme-sub hover:text-theme-text'}`}
          >
            <div className="flex items-center gap-3">
              <Settings size={18} className={isConfigOpen ? 'text-theme-accent' : 'opacity-70'} />
              {!isCollapsed && <span className="text-[11px] font-medium">Configuración</span>}
            </div>
            {!isCollapsed && <ChevronDown size={12} className={`transition-transform ${isConfigOpen ? 'rotate-180' : ''}`} />}
          </button>

          <div className={`overflow-hidden transition-all duration-300 ${isConfigOpen ? 'max-h-32 opacity-100' : 'max-h-0 opacity-0'}`}>
            <button onClick={() => setDarkMode(!darkMode)} className="w-full flex items-center gap-3 px-4 py-2 text-theme-sub hover:text-theme-text transition-all group">
              {darkMode ? <Sun size={14} className="group-hover:text-amber-400" /> : <Moon size={14} className="group-hover:text-blue-400" />}
              {!isCollapsed && <span className="text-[10px] font-medium">Modo {darkMode ? 'Claro' : 'Oscuro'}</span>}
            </button>
            <button onClick={handleLogout} className="w-full flex items-center gap-3 px-4 py-2 text-red-500/70 hover:text-red-500 transition-all group">
              <LogOut size={14} className="group-hover:-translate-x-1 transition-transform" />
              {!isCollapsed && <span className="text-[10px] font-medium">Salir del Sistema</span>}
            </button>
          </div>

          {!isCollapsed && (
            <p className="text-center text-[7px] font-bold text-theme-sub opacity-20 tracking-[0.4em] pt-2">
              V1.0.4-STABLE
            </p>
          )}
        </div>
      </aside>
    </>
  );
};
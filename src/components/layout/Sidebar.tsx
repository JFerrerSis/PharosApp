import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, Monitor, Store, History, CreditCard, LogOut, 
  Droplets, Sun, Moon, Users, Landmark, Settings, ChevronDown, 
  MapPin, CalendarCheck, ChevronLeft, Menu, Loader2, ShieldCheck
} from 'lucide-react';
import logoMara from '../../assets/Isotipo2.png';
import { authService } from '../../api/service/auth.service';

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

  // 👤 Estado inicial con valores por defecto
  const [user, setUser] = useState({ username: 'Cargando...', sede: 'Buscando sede...' });

  const handleLogout = async () => {
    setIsLoggingOut(true);
    document.body.style.overflow = 'hidden';
    try {
      await authService.logout();
      navigate('/login');
    } catch (error) {
      console.error("Error al cerrar sesión:", error);
    } finally {
      document.body.style.overflow = 'auto';
    }
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

  // 🔄 Carga de datos sincronizada con authService
  useEffect(() => {
    const sessionData = localStorage.getItem('pharos_user');
    if (sessionData) {
      try {
        const parsed = JSON.parse(sessionData);
        // Usamos la estructura definida en nuestro servicio
        setUser({
          username: parsed.username || 'Usuario',
          sede: parsed.sede || 'Sede no asignada'
        });
      } catch (e) { 
        console.error("Error al parsear datos de sesión Pharos"); 
      }
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
      {/* 🎬 Overlay de Shutdown (Cierre de Sesión) */}
      {isLoggingOut && (
        <div className="fixed inset-0 w-screen h-screen z-[9999] flex flex-col items-center justify-center bg-[#050505]/95 backdrop-blur-md">
          <div className="absolute inset-0 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.1)_50%),linear-gradient(90deg,rgba(0,184,160,0.03),rgba(0,184,160,0.01),rgba(0,184,160,0.03))] bg-[length:100%_3px,3px_100%] pointer-events-none opacity-50" />
          <div className="relative flex flex-col items-center gap-8">
            <Loader2 size={48} className="text-theme-accent animate-spin" />
            <div className="text-center space-y-3">
              <h2 className="text-white text-xs font-black uppercase tracking-[0.8em] animate-pulse">Shutdown</h2>
              <p className="text-theme-accent text-[8px] font-bold uppercase tracking-[0.3em] opacity-60">Terminando sesión de {user.username}</p>
            </div>
          </div>
        </div>
      )}

      <aside className={`relative h-screen bg-theme-sidebar border-r border-theme-border flex flex-col transition-all duration-500 ease-in-out shadow-2xl z-40 ${isCollapsed ? 'w-20' : 'w-64'}`}>
        
        <button onClick={() => setIsCollapsed(!isCollapsed)} className="absolute -right-3 top-10 bg-theme-accent text-white rounded-full p-1 shadow-lg z-50 hover:scale-110 transition-transform hidden md:block">
          {isCollapsed ? <Menu size={12} /> : <ChevronLeft size={12} />}
        </button>

        <div className={`p-6 mb-2 transition-all duration-300 ${isCollapsed ? 'items-center px-4' : ''}`}>
          <div className="flex items-center gap-3 cursor-pointer group" onClick={() => handleNavigation('dashboard', '/dashboard')}>
            <img src={logoMara} alt="Logo" className="w-10 h-10 object-contain group-hover:rotate-12 transition-transform duration-500" />
            {!isCollapsed && (
              <div className="flex flex-col">
                <h1 className="text-xl font-black tracking-tighter text-theme-text uppercase leading-none">Pharos<span className="text-theme-accent font-light italic ml-1">App</span></h1>
                <span className="text-[7px] font-bold text-theme-sub tracking-[0.3em] uppercase opacity-40">Core System</span>
              </div>
            )}
          </div>
        </div>

        <nav className="flex-1 px-3 space-y-6 overflow-y-auto custom-scrollbar">
          {sections.map((section, idx) => (
            <div key={idx} className="space-y-1">
              {!isCollapsed && <p className="px-3 text-[9px] font-black text-theme-sub uppercase tracking-[0.2em] mb-2 opacity-50">{section.title}</p>}
              {section.items.map((item) => {
                const isActive = location.pathname === item.path;
                return (
                  <button key={item.id} onClick={() => handleNavigation(item.id, item.path)} className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-300 group relative ${isActive ? 'bg-theme-accent/10 text-theme-accent shadow-[inset_0_0_10px_rgba(0,184,160,0.05)]' : 'text-theme-sub hover:bg-theme-card hover:text-theme-text'}`}>
                    <item.icon size={18} className={`${isActive ? 'text-theme-accent' : 'opacity-70'} transition-colors`} />
                    {!isCollapsed && <span className={`text-[11px] whitespace-nowrap ${isActive ? 'font-bold' : 'font-medium'}`}>{item.label}</span>}
                    {isActive && <div className="absolute left-0 w-1 h-5 bg-theme-accent rounded-r-full shadow-[0_0_8px_#00B8A0]" />}
                  </button>
                );
              })}
            </div>
          ))}
        </nav>

        <div className="p-3 mt-auto space-y-2 border-t border-theme-border/50 bg-theme-main/20">
          
          {/* 👤 CUADRO DE PERFIL CON DATA DINÁMICA */}
          {!isCollapsed && (
            <div className="relative p-4 rounded-2xl bg-gradient-to-br from-theme-card to-theme-main border border-theme-accent/20 mb-3 shadow-lg group overflow-hidden">
              <div className="absolute top-0 right-0 p-1 opacity-10 group-hover:opacity-20 transition-opacity">
                <ShieldCheck size={40} className="text-theme-accent" />
              </div>
              
              <div className="relative z-10 flex flex-col gap-2">
                <div className="space-y-0.5">
                  <p className="text-[8px] font-black text-theme-accent uppercase tracking-[0.2em] opacity-80 italic">Sesión Autorizada</p>
                  <h2 className="text-[13px] font-black text-theme-text uppercase tracking-tight truncate">
                    {user.username}
                  </h2>
                </div>

                <div className="h-[1px] w-full bg-gradient-to-r from-theme-accent/40 to-transparent" />

                <div className="flex items-center gap-2">
                  <div className="p-2 rounded-lg bg-theme-accent/10 border border-theme-accent/20">
                    <MapPin size={14} className="text-theme-accent" />
                  </div>
                  <div className="flex flex-col min-w-0">
                    <span className="text-[11px] font-black text-theme-text uppercase tracking-tighter leading-none truncate">
                      {user.sede}
                    </span>
                    <span className="text-[7px] font-bold text-theme-sub uppercase tracking-[0.1em] opacity-60">Ubicación Actual</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          <button onClick={() => setIsConfigOpen(!isConfigOpen)} className={`w-full flex items-center justify-between px-3 py-2 rounded-xl transition-colors ${isConfigOpen ? 'bg-theme-card text-theme-text' : 'text-theme-sub hover:text-theme-text'}`}>
            <div className="flex items-center gap-3">
              <Settings size={18} className={isConfigOpen ? 'text-theme-accent' : 'opacity-70'} />
              {!isCollapsed && <span className="text-[11px] font-medium">Configuración</span>}
            </div>
            {!isCollapsed && <ChevronDown size={12} className={`transition-transform ${isConfigOpen ? 'rotate-180' : ''}`} />}
          </button>

          <div className={`overflow-hidden transition-all duration-300 ${isConfigOpen ? 'max-h-32 opacity-100' : 'max-h-0 opacity-0'}`}>
            <button onClick={() => setDarkMode(!darkMode)} className="w-full flex items-center gap-3 px-4 py-2 text-theme-sub hover:text-theme-text transition-all">
              {darkMode ? <Sun size={14} className="text-amber-400" /> : <Moon size={14} className="text-blue-400" />}
              {!isCollapsed && <span className="text-[10px] font-medium">Modo {darkMode ? 'Claro' : 'Oscuro'}</span>}
            </button>
            <button onClick={handleLogout} className="w-full flex items-center gap-3 px-4 py-2 text-red-500/70 hover:text-red-500 transition-all">
              <LogOut size={14} />
              {!isCollapsed && <span className="text-[10px] font-bold uppercase">Cerrar Sesión</span>}
            </button>
          </div>
        </div>
      </aside>
    </>
  );
};
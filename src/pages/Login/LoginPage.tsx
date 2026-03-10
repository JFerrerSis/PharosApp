import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, Eye, EyeOff, Loader2, Activity, CheckCircle2, Building2, ChevronDown } from 'lucide-react';
import { toast } from 'sonner';

// Importamos el servicio de autenticación ajustado para cookies
import { authService } from '../../api/authService';

import fondoImg from '../../assets/fondo.jpg';
import logoMara from '../../assets/Logo-maraplus.png';

export const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // --- LÓGICA DE PERSISTENCIA AÑADIDA ---
  const [isDark, setIsDark] = useState(() => {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) return savedTheme === 'dark';
    return document.documentElement.classList.contains('dark');
  });

  // ESTADOS DEL FORMULARIO
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [idFarmacia, setIdFarmacia] = useState<number>(1);
  const [nombreFarmacia, setNombreFarmacia] = useState('rubio');

  const [welcomeMessage, setWelcomeMessage] = useState<string | null>(null);

  useEffect(() => {
    // Sincronizar la clase del documento con el estado al cargar y cambiar
    if (isDark) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }

    const observer = new MutationObserver(() => {
      const currentDark = document.documentElement.classList.contains('dark');
      if (currentDark !== isDark) setIsDark(currentDark);
    });

    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });
    return () => observer.disconnect();
  }, [isDark]); // Escuchamos cambios en isDark
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // 1. Validación básica de campos vacíos
    if (!username.trim() || !password) {
      toast.error('Campos obligatorios', {
        description: 'Por favor, ingresa tu usuario y contraseña.',
      });
      return;
    }

    setIsLoading(true);

    try {
      // 2. Intento de Login enviando la data del SELECT
      const response = await authService.login(
        username.trim(),
        password,
        idFarmacia, // Viene del estado del select
        nombreFarmacia // Viene del texto del select (rubio, etc)
      );

      // Si llegamos aquí, el backend devolvió 200 OK y las cookies ya están en el navegador
      if (response) {
        setWelcomeMessage(`¡Bienvenido, ${username}!`);

        // Guardamos la sesión activa en localStorage para el AuthGuard
        localStorage.setItem('pharos_session_active', 'true');
        localStorage.setItem('pharos_user', JSON.stringify({
          username: username,
          sede: nombreFarmacia
        }));

        toast.success('Acceso Autorizado', {
          description: `Sede: ${nombreFarmacia.toUpperCase()} conectada.`,
          duration: 3000,
        });

        setTimeout(() => {
          setIsLoading(false);
          navigate('/dashboard', { replace: true });
        }, 2200);
      }

    } catch (err: any) {
      setIsLoading(false);

      // VALIDACIÓN CRUCIAL: 
      // Si el backend lanza DataDoNotExistsExceptionInfra, llegará aquí como un 404 o 401.
      const status = err.response?.status;
      let errorMsg = 'Error interno del servidor.';

      if (status === 404) {
        errorMsg = 'El usuario no existe en nuestro sistema.';
      } else if (status === 401) {
        errorMsg = 'Contraseña incorrecta o el usuario no pertenece a esta sede.';
      } else if (status === 403) {
        errorMsg = 'No tienes permisos para acceder a esta terminal.';
      }

      toast.error('Fallo de Autenticación', {
        description: errorMsg,
      });

      setPassword(''); // Limpiamos clave por seguridad
    }
  };

  return (
    <div className="relative min-h-screen w-full flex items-center justify-center antialiased overflow-hidden bg-theme-main transition-colors duration-500">

      {/* FONDO */}
      <div
        className="absolute inset-0 z-0 transition-all duration-700"
        style={{
          backgroundImage: isDark
            ? `linear-gradient(to bottom, rgba(15, 23, 42, 0.9), rgba(15, 23, 42, 0.96)), url(${fondoImg})`
            : `linear-gradient(to bottom, rgba(255, 255, 255, 0.92), rgba(255, 255, 255, 0.96)), url(${fondoImg})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      />

      {/* OVERLAY ÉXITO */}
      {welcomeMessage && (
        <div className="absolute inset-0 z-50 flex items-center justify-center bg-theme-main/60 backdrop-blur-xl p-6 animate-in fade-in duration-500">
          <div className="flex flex-col items-center text-center gap-6 bg-theme-sidebar border border-theme-accent/30 p-10 rounded-[3rem] shadow-2xl animate-in zoom-in duration-500 max-w-md">
            <div className="w-20 h-20 bg-emerald-500/20 rounded-full flex items-center justify-center animate-bounce">
              <CheckCircle2 className="text-emerald-500" size={40} />
            </div>
            <div className="space-y-2">
              <h2 className="text-2xl font-black text-theme-text uppercase tracking-tighter italic">{welcomeMessage}</h2>
              <p className="text-theme-sub text-[10px] font-bold uppercase tracking-[0.4em]">Sincronizando Terminal</p>
            </div>
            <div className="w-48 bg-theme-border h-1.5 rounded-full overflow-hidden">
              <div className="bg-emerald-500 h-full animate-[progress_2s_linear]" style={{ width: '100%' }} />
            </div>
          </div>
        </div>
      )}

      {/* FORMULARIO */}
      <div className={`relative z-10 w-full max-w-md p-10 bg-theme-sidebar/80 rounded-[3rem] shadow-2xl border border-theme-border backdrop-blur-2xl transition-all duration-700 ${welcomeMessage ? 'opacity-0 scale-95 pointer-events-none' : 'opacity-100 scale-100'}`}>

        <div className="flex flex-col items-center mb-10 text-center">
          <img src={logoMara} alt="Logo Maraplus" className="h-16 mb-6 object-contain dark:brightness-125" />
          <div className="space-y-1">
            <h1 className="text-3xl font-black tracking-tighter text-theme-text italic uppercase">
              PHAROS<span className="text-theme-accent font-light not-italic">APP</span>
            </h1>
            <div className="flex items-center justify-center gap-2">
              <div className="w-1.5 h-1.5 bg-theme-accent rounded-full animate-pulse shadow-[0_0_8px_var(--color-theme-accent)]" />
              <p className="text-[10px] font-black text-theme-sub uppercase tracking-[0.4em]">Autenticación Centralizada</p>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="space-y-2">
            <label className="text-[10px] font-black text-theme-sub ml-1 uppercase tracking-[0.2em]">Usuario</label>
            <div className="relative group">
              <input
                type="text"
                required
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="ej: hltig141"
                className="w-full px-6 py-4 bg-theme-main/50 border border-theme-border rounded-2xl outline-none focus:border-theme-accent/50 focus:ring-4 focus:ring-theme-accent/5 transition-all text-sm text-theme-text"
              />
              <User size={16} className="absolute right-5 top-1/2 -translate-y-1/2 text-theme-sub group-focus-within:text-theme-accent transition-colors" />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-black text-theme-sub ml-1 uppercase tracking-[0.2em]">Clave</label>
            <div className="relative group">
              <input
                type={showPassword ? "text" : "password"}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full px-6 py-4 bg-theme-main/50 border border-theme-border rounded-2xl outline-none focus:border-theme-accent/50 focus:ring-4 focus:ring-theme-accent/5 transition-all text-sm text-theme-text"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-5 top-1/2 -translate-y-1/2 text-theme-sub hover:text-theme-text transition-colors"
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

<div className="space-y-2">
  <label className="text-[10px] font-black text-theme-sub ml-1 uppercase tracking-[0.2em] opacity-70 group-focus-within:opacity-100 transition-opacity">
    Sede / Sucursal
  </label>
  <div className="relative group">
    {/* Icono de fondo/decorativo */}
    <div className="absolute left-4 top-1/2 -translate-y-1/2 transition-colors duration-300">
        <Building2 
          size={18} 
          className="text-theme-sub/40 group-focus-within:text-theme-accent group-hover:text-theme-sub transition-colors" 
        />
    </div>

    <select
      required
      value={idFarmacia}
      onChange={(e) => {
        const val = Number(e.target.value);
        const text = e.target.options[e.target.selectedIndex].text;
        setIdFarmacia(val);
        setNombreFarmacia(text);
      }}
      className="w-full bg-theme-sidebar/50 border border-theme-border/50 text-theme-text text-[11px] font-bold rounded-2xl py-3.5 pl-12 pr-10 appearance-none cursor-pointer outline-none transition-all duration-300 hover:bg-theme-main hover:border-theme-accent/30 focus:border-theme-accent focus:ring-4 focus:ring-theme-accent/5 shadow-sm"
    >
      <option value="" disabled className="bg-theme-sidebar text-theme-sub">Selecciona una sede</option>
      <option value={1} className="bg-theme-sidebar py-2">RUBIO</option>
      <option value={2} className="bg-theme-sidebar py-2">AV10</option>
      <option value={3} className="bg-theme-sidebar py-2">FUENTE</option>
    </select>

    {/* Indicador de flecha personalizado */}
    <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-theme-sub/30 group-focus-within:text-theme-accent transition-transform duration-300 group-focus-within:rotate-180">
      <ChevronDown size={14} strokeWidth={3} />
    </div>

    {/* Efecto de brillo inferior al hacer focus */}
    <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-0 h-[2px] bg-theme-accent transition-all duration-500 group-focus-within:w-full rounded-full" />
  </div>
</div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full h-14 bg-theme-text text-theme-main font-black rounded-2xl flex items-center justify-center transition-all duration-300 hover:bg-theme-accent hover:text-white hover:shadow-lg hover:shadow-theme-accent/20 disabled:opacity-50 mt-8 group"
          >
            {isLoading ? (
              <Loader2 size={20} className="animate-spin" />
            ) : (
              <div className="flex items-center gap-3">
                <span className="text-[11px] font-black uppercase tracking-[0.2em]">Ingresar</span>
                <Activity size={14} className="opacity-40 group-hover:opacity-100" />
              </div>
            )}
          </button>
        </form>

        <footer className="mt-12 text-center border-t border-theme-border pt-6">
          <p className="text-[9px] font-black text-theme-sub uppercase tracking-[0.5em] opacity-50">
            Jferrer &copy; 2026
          </p>
        </footer>
      </div>
    </div>
  );
};
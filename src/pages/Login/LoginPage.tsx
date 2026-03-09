import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, Eye, EyeOff, Loader2, Activity, CheckCircle2, Building2 } from 'lucide-react';
import { toast } from 'sonner';

// Importamos el servicio de autenticación ajustado para cookies
import { authService } from '../../api/authService';

import fondoImg from '../../assets/fondo.jpg';
import logoMara from '../../assets/Logo-maraplus.png';

export const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isDark, setIsDark] = useState(() => document.documentElement.classList.contains('dark'));

  // ESTADOS DEL FORMULARIO
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [idFarmacia, setIdFarmacia] = useState<number>(1);
  const [nombreFarmacia, setNombreFarmacia] = useState('rubio');

  const [welcomeMessage, setWelcomeMessage] = useState<string | null>(null);

  useEffect(() => {
    setIsDark(document.documentElement.classList.contains('dark'));
    const observer = new MutationObserver(() => {
      setIsDark(document.documentElement.classList.contains('dark'));
    });
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });
    return () => observer.disconnect();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!username.trim() || !password) {
      toast.error('Campos obligatorios', {
        description: 'Por favor, ingresa tu usuario y contraseña.',
      });
      return;
    }

    setIsLoading(true);

    try {
      // 1. Intento de Login (El backend inyectará las cookies at/rt)
      const response = await authService.login(
        username.trim(),
        password,
        idFarmacia,
        nombreFarmacia
      );

      // 2. Validación: Si no hubo error en el catch, el status fue 200 OK.
      // Ya no buscamos "response.token" porque está en la cookie.
      if (response) {
        setWelcomeMessage(`¡Bienvenido, ${username}!`);

        toast.success('Acceso Autorizado', {
          description: `Sede: ${nombreFarmacia.toUpperCase()} conectada.`,
          duration: 3000,
        });

        // 3. Redirección al Dashboard
        setTimeout(() => {
          setIsLoading(false);
          navigate('/dashboard', { replace: true });
        }, 2200);

      } else {
        throw new Error('No se pudo validar la sesión.');
      }

    } catch (err: any) {
      setIsLoading(false);
      
      // Capturamos el error real o el mensaje de "Datos incorrectos"
      const errorMsg = err.response?.data?.message || 'Usuario, clave o sede incorrectos.';

      toast.error('Error de Autenticación', {
        description: errorMsg,
      });

      setPassword('');
      console.error("Fallo de acceso:", err);
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
            <label className="text-[10px] font-black text-theme-sub ml-1 uppercase tracking-[0.2em]">Sede</label>
            <div className="relative group">
              <select
                required
                value={idFarmacia}
                onChange={(e) => {
                  const val = Number(e.target.value);
                  setIdFarmacia(val);
                  setNombreFarmacia(e.target.options[e.target.selectedIndex].text.toLowerCase());
                }}
                className="w-full px-6 py-4 bg-theme-main/50 border border-theme-border rounded-2xl outline-none focus:border-theme-accent/50 focus:ring-4 focus:ring-theme-accent/5 transition-all text-sm text-theme-text appearance-none cursor-pointer"
              >
                <option value={1}>Rubio</option>
                <option value={2}>San Cristóbal</option>
                <option value={3}>Maracaibo</option>
              </select>
              <Building2 size={16} className="absolute right-5 top-1/2 -translate-y-1/2 text-theme-sub pointer-events-none group-focus-within:text-theme-accent" />
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
                <span className="text-[11px] font-black uppercase tracking-[0.2em]">Autenticar Terminal</span>
                <Activity size={14} className="opacity-40 group-hover:opacity-100" />
              </div>
            )}
          </button>
        </form>

        <footer className="mt-12 text-center border-t border-theme-border pt-6">
          <p className="text-[9px] font-black text-theme-sub uppercase tracking-[0.5em] opacity-50">
            MARAPLUS GROUP &copy; 2026
          </p>
        </footer>
      </div>
    </div>
  );
};
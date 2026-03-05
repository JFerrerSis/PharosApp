import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, Eye, EyeOff, Loader2, Activity, CheckCircle2 } from 'lucide-react';

// Solo importamos toast, Toaster ya no es necesario aquí
import { toast } from 'sonner';

import fondoImg from '../../assets/fondo.jpg';
import logoMara from '../../assets/logo-maraplus.png';

export const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isDark, setIsDark] = useState(() => document.documentElement.classList.contains('dark'));

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
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
    setIsLoading(true);

    try {
      // SIMULACIÓN DE ÉXITO
      if (username.toLowerCase() === 'jferrer' && password === '123456') {
        setWelcomeMessage(`¡Bienvenido, ${username}!`);

        // Mensaje de éxito global
        toast.success('Acceso Autorizado', {
          description: 'Sincronizando sus permisos de usuario...', // <-- Aquí completamos la descripción
          duration: 2000, // Opcional: que dure 4 segundos
        });

        setTimeout(() => {
          setIsLoading(false);
          navigate('/dashboard');
        }, 2200);
      } else {
        throw new Error('Credenciales incorrectas');
      }

    } catch (err: any) {
      setIsLoading(false);

      // Mensaje de error global
      toast.error('Error de Autenticación', {
        description: err.message || 'El usuario o la clave no coinciden.',
      });
    }
  };

  return (
    <div className="relative min-h-screen w-full flex items-center justify-center antialiased overflow-hidden bg-theme-main transition-colors duration-500">

      {/* FONDO DINÁMICO */}
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

      {/* OVERLAY DE BIENVENIDA */}
      {welcomeMessage && (
        <div className="absolute inset-0 z-50 flex items-center justify-center bg-theme-main/60 backdrop-blur-xl p-6 transition-all duration-500">
          <div className="flex flex-col items-center text-center gap-6 bg-theme-sidebar border border-theme-accent/30 p-10 rounded-[3rem] shadow-2xl animate-in zoom-in duration-500 max-w-md">
            <div className="w-20 h-20 bg-emerald-500/20 rounded-full flex items-center justify-center animate-bounce">
              <CheckCircle2 className="text-emerald-500" size={40} />
            </div>
            <div className="space-y-2">
              <h2 className="text-2xl font-black text-theme-text uppercase tracking-tighter italic">{welcomeMessage}</h2>
              <p className="text-theme-sub text-[10px] font-bold uppercase tracking-[0.4em]">Sincronizando Sedes Autorizadas</p>
            </div>
            <div className="w-48 bg-theme-border h-1.5 rounded-full overflow-hidden">
              <div className="bg-emerald-500 h-full animate-[progress_2s_linear]" style={{ width: '100%' }} />
            </div>
          </div>
        </div>
      )}

      {/* CARD DE LOGIN */}
      <div className={`relative z-10 w-full max-w-md p-10 bg-theme-sidebar/80 rounded-[3rem] shadow-2xl border border-theme-border backdrop-blur-2xl transition-all duration-700 ${welcomeMessage ? 'opacity-0 scale-90' : 'opacity-100 scale-100'}`}>

        <div className="flex flex-col items-center mb-10 text-center">
          <img src={logoMara} alt="Logo" className="h-16 mb-6 object-contain dark:brightness-125" />
          <div className="space-y-1">
            <h1 className="text-3xl font-black tracking-tighter text-theme-text italic uppercase">
              PHAROS<span className="text-theme-accent font-light not-italic">APP</span>
            </h1>
            <div className="flex items-center justify-center gap-2">
              <div className="w-1.5 h-1.5 bg-theme-accent rounded-full animate-pulse shadow-[0_0_8px_var(--color-theme-accent)]" />
              <p className="text-[10px] font-black text-theme-sub uppercase tracking-[0.4em]">Control de Acceso Central</p>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="space-y-2">
            <label className="text-[10px] font-black text-theme-sub ml-1 uppercase tracking-[0.2em]">Cédula o Usuario</label>
            <div className="relative group">
              <input
                type="text"
                required
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="ej: 30643489"
                className="w-full px-6 py-4 bg-theme-main/50 border border-theme-border rounded-2xl outline-none focus:border-theme-accent/50 focus:ring-4 focus:ring-theme-accent/5 transition-all text-sm text-theme-text"
              />
              <User size={16} className="absolute right-5 top-1/2 -translate-y-1/2 text-theme-sub group-focus-within:text-theme-accent transition-colors" />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-black text-theme-sub ml-1 uppercase tracking-[0.2em]">Clave de Acceso</label>
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
                className="absolute right-5 top-1/2 -translate-y-1/2 text-theme-sub hover:text-theme-text"
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
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
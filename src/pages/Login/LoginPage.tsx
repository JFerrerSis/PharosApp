import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, Eye, EyeOff, Loader2, Activity, CheckCircle2, Building2, ChevronDown } from 'lucide-react';
import { toast } from 'sonner';

import { authService } from '../../api/service/auth.service';
import { farmaciaService } from '../../api/service/farmacia.service'; 
import fondoImg from '../../assets/fondo.jpg';
import logoMara from '../../assets/Logo-maraplus.png';

// Interfaz actualizada para coincidir con tu JSON del backend
interface Farmacia {
  id: number;
  some_code: string;
  name_farmcia: string;
}

export const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isErrorShake, setIsErrorShake] = useState(false);

  // --- ESTADOS PARA SEDES DINÁMICAS ---
  const [farmacias, setFarmacias] = useState<Farmacia[]>([]);
  const [isLoadingFarmacias, setIsLoadingFarmacias] = useState(true);

  const [isDark, setIsDark] = useState(() => {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) return savedTheme === 'dark';
    return document.documentElement.classList.contains('dark');
  });

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [idFarmacia, setIdFarmacia] = useState<number | string>('');
  const [nombreFarmacia, setNombreFarmacia] = useState('');
  const [welcomeMessage, setWelcomeMessage] = useState<string | null>(null);

  const isFormInvalid = !username.trim() || !password || idFarmacia === '';

useEffect(() => {
  const cargarSedes = async () => {
    setIsLoadingFarmacias(true);
    const data = await farmaciaService.getFarmacias();
    setFarmacias(data); // Ya viene como array limpio desde el service
    setIsLoadingFarmacias(false);
  };
  cargarSedes();
}, []);
  useEffect(() => {
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
  }, [isDark]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isFormInvalid) return;

    setIsLoading(true);

    try {
      const sanitizedUsername = username.trim().toLowerCase();
      
      const response = await authService.login(
        sanitizedUsername, 
        password, 
        Number(idFarmacia), 
        nombreFarmacia
      );

      setWelcomeMessage(`¡Bienvenido, ${username.trim()}!`);

      toast.success(response.message || 'Acceso Autorizado', {
        description: response.cause || `Sesión iniciada en ${nombreFarmacia}.`,
        duration: 3000,
      });

      setTimeout(() => {
        setIsLoading(false);
        navigate('/dashboard', { replace: true });
      }, 2500);

    } catch (err: any) {
      setIsLoading(false);
      setIsErrorShake(true);
      setTimeout(() => setIsErrorShake(false), 500);

      const errorTitle = err.message || 'Error de Autenticación';
      const errorDescription = err.cause || 'No se pudo conectar con el servidor.';

      toast.error(errorTitle, {
        description: errorDescription,
        duration: 5000,
      });

      setPassword('');
    }
  };

  return (
    <div className="relative min-h-screen w-full flex items-center justify-center antialiased overflow-hidden bg-theme-main transition-colors duration-500 py-6">

      <div
        className="absolute inset-0 z-0 transition-all duration-700"
        style={{
          backgroundImage: isDark
            ? `linear-gradient(to bottom, rgba(2, 6, 23, 0.75), rgba(2, 6, 23, 0.9)), url(${fondoImg})`
            : `linear-gradient(to bottom, rgba(15, 23, 42, 0.5), rgba(15, 23, 42, 0.8)), url(${fondoImg})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      />

      {welcomeMessage && (
        <div className="absolute inset-0 z-50 flex items-center justify-center bg-theme-main/60 backdrop-blur-xl p-6">
          <div className="flex flex-col items-center text-center gap-6 bg-theme-sidebar border border-theme-accent/30 p-10 rounded-[2.5rem] shadow-[0_0_50px_rgba(0,184,160,0.15)] animate-in zoom-in duration-300 max-w-sm">
            <div className="w-16 h-16 bg-emerald-500/20 rounded-full flex items-center justify-center animate-bounce shadow-[0_0_20px_rgba(16,185,129,0.3)]">
              <CheckCircle2 className="text-emerald-500" size={32} />
            </div>
            <div className="space-y-2">
              <h2 className="text-xl font-black text-theme-text uppercase tracking-tighter italic leading-tight">
                {welcomeMessage}
              </h2>
              <div className="flex flex-col items-center gap-1.5">
                <span className="text-theme-accent text-[10px] font-black uppercase tracking-[0.2em] px-3 py-1 bg-theme-accent/10 rounded-full border border-theme-accent/20">
                  SEDE {nombreFarmacia}
                </span>
                <p className="text-theme-sub text-[8px] font-bold uppercase tracking-[0.3em] opacity-40 pt-4 border-t border-theme-border/50 w-full mt-2">
                  Sincronizando Terminal
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className={`relative z-10 w-full max-w-[380px] mx-4 p-8 bg-theme-sidebar/85 rounded-[2rem] shadow-2xl border border-theme-border backdrop-blur-2xl transition-all duration-700 ${isErrorShake ? 'animate-shake' : 'animate-in slide-in-from-bottom-4'} ${welcomeMessage ? 'opacity-0 scale-95 pointer-events-none' : 'opacity-100 scale-100'}`}>

        <div className="absolute top-6 right-8 flex gap-1">
          <div className={`w-1 h-1 rounded-full transition-all duration-300 ${username ? 'bg-theme-accent animate-pulse shadow-[0_0_5px_var(--color-theme-accent)]' : 'bg-theme-border'}`} />
          <div className={`w-1 h-1 rounded-full transition-all duration-300 ${password ? 'bg-theme-accent animate-pulse shadow-[0_0_5px_var(--color-theme-accent)]' : 'bg-theme-border'}`} />
          <div className={`w-1 h-1 rounded-full transition-all duration-300 ${idFarmacia ? 'bg-theme-accent animate-pulse shadow-[0_0_5px_var(--color-theme-accent)]' : 'bg-theme-border'}`} />
        </div>

        <div className="flex flex-col items-center mb-8 text-center">
          <img src={logoMara} alt="Logo Maraplus" className="h-12 mb-4 object-contain" />
          <div className="space-y-0.5">
            <h1 className="text-2xl font-black tracking-tighter text-theme-text italic uppercase">
              PHAROS<span className="text-theme-accent font-light not-italic">APP</span>
            </h1>
            <p className="text-[9px] font-black text-theme-sub uppercase tracking-[0.3em]">Terminal v1.0</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4" autoComplete="off">
          <input type="password" style={{ display: 'none' }} tabIndex={-1} autoComplete="new-password" />

          {/* Input Usuario */}
          <div className="space-y-1.5 group">
            <label className="text-[9px] font-black text-theme-sub ml-1 uppercase tracking-widest">Usuario</label>
            <div className="relative">
              <input
                type="text"
                required
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                autoComplete="new-password"
                className="w-full px-5 py-3.5 bg-theme-main/50 border border-theme-border rounded-xl outline-none focus:border-theme-accent/50 focus:ring-4 focus:ring-theme-accent/5 transition-all text-xs text-theme-text"
              />
              <User size={14} className="absolute right-4 top-1/2 -translate-y-1/2 text-theme-sub/50" />
            </div>
          </div>

          {/* Input Clave */}
          <div className="space-y-1.5 group">
            <label className="text-[9px] font-black text-theme-sub ml-1 uppercase tracking-widest">Clave</label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="new-password"
                className="w-full px-5 py-3.5 bg-theme-main/50 border border-theme-border rounded-xl outline-none focus:border-theme-accent/50 focus:ring-4 focus:ring-theme-accent/5 transition-all text-xs text-theme-text"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-theme-sub/50 hover:text-theme-accent transition-colors"
              >
                {showPassword ? <EyeOff size={14} /> : <Eye size={14} />}
              </button>
            </div>
          </div>

          {/* SELECT DE SEDES DINÁMICO AJUSTADO */}
          <div className="space-y-1.5">
            <label className="text-[9px] font-black text-theme-sub ml-1 uppercase tracking-widest">Sede</label>
            <div className="relative">
              <select
                required
                value={idFarmacia}
                disabled={isLoadingFarmacias}
                onChange={(e) => {
                  const val = e.target.value === "" ? "" : Number(e.target.value);
                  const text = e.target.options[e.target.selectedIndex].text;
                  setIdFarmacia(val);
                  setNombreFarmacia(text);
                }}
                className={`w-full bg-theme-sidebar/50 border border-theme-border/50 text-theme-text text-[10px] font-bold rounded-xl py-3 pl-10 pr-10 appearance-none outline-none transition-all ${
                  isLoadingFarmacias ? 'cursor-wait opacity-50' : 'cursor-pointer hover:bg-theme-main hover:border-theme-accent/30 focus:border-theme-accent'
                }`}
              >
                <option value="" disabled>
                  {isLoadingFarmacias ? 'SINCRONIZANDO...' : 'SELECCIONAR SEDE...'}
                </option>
                {farmacias.map((f) => (
                  <option key={f.id} value={f.id} className="bg-slate-900 text-white">
                    {f.some_code} - {f.name_farmcia.toUpperCase()}
                  </option>
                ))}
              </select>
              <Building2 size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-theme-sub/40" />
              {isLoadingFarmacias ? (
                <Loader2 size={12} className="absolute right-4 top-1/2 -translate-y-1/2 animate-spin text-theme-accent" />
              ) : (
                <ChevronDown size={12} className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-theme-sub/30" />
              )}
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading || isFormInvalid || isLoadingFarmacias}
            className={`w-full h-12 font-black rounded-xl flex items-center justify-center transition-all duration-300 mt-6 active:scale-[0.97] 
              ${(isLoading || isFormInvalid || isLoadingFarmacias)
                ? 'bg-theme-border/30 text-theme-sub cursor-not-allowed opacity-50'
                : 'bg-theme-text text-theme-main hover:bg-theme-accent hover:text-white shadow-lg'
              }`}
          >
            {isLoading ? (
              <Loader2 size={18} className="animate-spin" />
            ) : (
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-black uppercase tracking-widest">Ingresar</span>
                <Activity size={12} className="opacity-40" />
              </div>
            )}
          </button>
        </form>

        <footer className="mt-8 text-center border-t border-theme-border/50 pt-4">
          <p className="text-[8px] font-black text-theme-sub uppercase tracking-[0.4em] opacity-40">
            Powered By jferrer & Midnight Studio &copy; 2026
          </p>
        </footer>
      </div>
    </div>
  );
};
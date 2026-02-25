import { useNavigate } from 'react-router-dom';
import { ArrowLeft, ShieldAlert } from 'lucide-react';
import logoMara from '../assets/Logo-maraplus.png'; 
import fondoPremium from '../assets/fondo.jpg'; 

export const NotFoundPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen w-full bg-[#020617] flex flex-col items-center overflow-hidden relative font-sans selection:bg-blue-500/30">
      
      {/* 🌌 CAPA 0: FONDO CINEMÁTICO */}
      <div className="absolute inset-0 z-0">
        <img 
          src={fondoPremium} 
          alt="Background" 
          className="w-full h-full object-cover scale-110 blur-[2px] opacity-10" 
        />
        {/* Ajustado: Eliminación de espacios en el gradiente arbitrario */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,#020617_80%)]" />
      </div>

      {/* 🧩 CAPA 1: MARCA DE AGUA (404) */}
      <div className="absolute inset-0 z-10 flex items-center justify-center select-none pointer-events-none">
        {/* Ajustado: text-white/2 */}
        <h1 className="text-[25vw] font-black text-white/2 leading-none tracking-tighter">
          404
        </h1>
      </div>

      {/* 🏷️ CAPA 2: BRANDING SUPERIOR */}
      <header className="relative z-40 w-full flex justify-center py-12">
        <div className="group transition-all duration-700 hover:tracking-widest">
          <img 
            src={logoMara} 
            alt="MaraPlus Logo" 
            className="h-16 md:h-20 object-contain drop-shadow-[0_0_40px_rgba(59,130,246,0.1)] opacity-90 transition-opacity hover:opacity-100" 
          />
        </div>
      </header>

      {/* 📦 CAPA 3: MÓDULO CENTRAL */}
      {/* Ajustado: flex-grow -> grow */}
      <main className="relative z-40 grow flex items-center justify-center w-full px-6">
        {/* Ajustado: max-w-[500px] -> max-w-125 */}
        <div className="w-full max-w-125 group">
          <div className="relative bg-slate-900/40 backdrop-blur-3xl border border-white/5 p-8 md:p-12 rounded-[4rem] shadow-[0_30px_100px_-20px_rgba(0,0,0,0.5)] transition-all duration-500 group-hover:border-blue-500/20 group-hover:bg-slate-900/60">
            
            <div className="flex justify-center mb-8">
              <div className="p-4 rounded-full bg-blue-500/5 border border-blue-500/10 text-blue-500/40 group-hover:text-blue-500 group-hover:scale-110 transition-all duration-500">
                <ShieldAlert size={32} strokeWidth={1} />
              </div>
            </div>

            <div className="text-center space-y-6">
              <div className="space-y-2">
                <h2 className="text-blue-500 text-[10px] font-black uppercase tracking-[0.8em] pl-[0.8em]">
                  Acceso Restringido
                </h2>
                <h3 className="text-white text-3xl font-light tracking-tight">
                  Página no encontrada
                </h3>
              </div>

              {/* Ajustado: max-w-[300px] -> max-w-75 */}
              <p className="text-slate-400/60 text-sm font-light leading-relaxed max-w-75 mx-auto">
                El protocolo de navegación no pudo resolver la dirección solicitada en el servidor central.
              </p>

              <div className="pt-4">
                <button 
                  onClick={() => navigate('/dashboard')}
                  className="w-full py-5 px-8 rounded-full bg-white text-[#020617] font-bold text-xs uppercase tracking-[0.2em] flex items-center justify-center gap-3 transition-all duration-300 hover:bg-blue-600 hover:text-white hover:-translate-y-1 active:scale-95 shadow-xl hover:shadow-blue-600/20"
                >
                  <ArrowLeft size={16} />
                  Regresar al Sistema
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* 🏷️ CAPA 4: FOOTER ESTRUCTURAL */}
      <footer className="relative z-40 w-full py-10 flex flex-col items-center gap-4">
        <div className="flex items-center gap-3 opacity-20 group cursor-default">
          {/* Ajustado: h-[1px] -> h-px */}
          <div className="h-px w-8 bg-slate-500 transition-all group-hover:w-16" />
          <span className="text-[9px] font-bold text-slate-400 tracking-[0.5em] uppercase">
            MaraPlus // Core System 2026
          </span>
          {/* Ajustado: h-[1px] -> h-px */}
          <div className="h-px w-8 bg-slate-500 transition-all group-hover:w-16" />
        </div>
      </footer>

      {/* Decoración: Luces de Profundidad (Ajustado: w-200, h-200, /3) */}
      <div className="absolute top-[-10%] right-[-5%] w-200 h-200 bg-blue-600/3 rounded-full blur-[150px] pointer-events-none" />
      <div className="absolute bottom-[-10%] left-[-5%] w-200 h-200 bg-emerald-600/3 rounded-full blur-[150px] pointer-events-none" />
    </div>
  );
};
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, ShieldAlert } from 'lucide-react';
import logoMara from '../assets/Logo-maraplus.png'; 
import fondoPremium from '../assets/fondo.jpg'; 

export const NotFoundPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen w-full bg-theme-main text-theme-text flex flex-col items-center overflow-hidden relative font-sans selection:bg-theme-accent/20 transition-colors duration-300">
      
      {/* 🌌 FONDO: Imagen con superposición de color del tema */}
      <div className="absolute inset-0 z-0 opacity-30 dark:opacity-10">
        <img 
          src={fondoPremium} 
          alt="Background" 
          className="w-full h-full object-cover" 
        />
        {/* Superposición sólida para asegurar contraste */}
        <div className="absolute inset-0 bg-theme-main mix-blend-multiply" />
      </div>

      {/* 🧩 CAPA 1: MARCA DE AGUA 404 (Minimalista) */}
      <div className="absolute inset-0 z-10 flex items-center justify-center select-none pointer-events-none">
        <h1 className="text-[30vw] font-black leading-none tracking-tighter text-theme-text opacity-5">
          404
        </h1>
      </div>

      {/* 🏷️ CAPA 2: BRANDING SUPERIOR */}
      <header className="relative z-40 w-full flex justify-center py-10">
        <img 
          src={logoMara} 
          alt="MaraPlus Logo" 
          className="h-12 md:h-14 object-contain opacity-90 dark:brightness-125" 
        />
      </header>

      {/* 📦 CAPA 3: MÓDULO CENTRAL */}
      <main className="relative z-40 grow flex items-center justify-center w-full px-6">
        <div className="w-full max-w-md">
          {/* Tarjeta: Fondo sólido con borde sutil en lugar de blur complejo */}
          <div className="relative bg-theme-main/80 dark:bg-theme-sidebar/80 backdrop-blur-sm border border-theme-border rounded-3xl p-8 md:p-10 shadow-2xl">
            
            {/* Ícono */}
            <div className="flex justify-center mb-6">
              <div className="p-3 rounded-full bg-theme-accent/10 text-theme-accent">
                <ShieldAlert size={36} strokeWidth={1.5} />
              </div>
            </div>

            <div className="text-center space-y-4">
              <div className="space-y-1">
                <h2 className="text-theme-accent text-xs font-bold uppercase tracking-[0.3em]">
                  Error de Sistema
                </h2>
                <h3 className="text-theme-text text-5xl font-extrabold tracking-tighter">
                  404
                </h3>
                <p className="text-theme-text text-lg font-medium">
                  Página no encontrada
                </p>
              </div>

              <p className="text-theme-sub text-sm leading-relaxed max-w-sm mx-auto">
                El protocolo de navegación no pudo resolver la dirección solicitada en el servidor central de PharosAPP.
              </p>

              <div className="pt-6">
                <button 
                  onClick={() => navigate('/dashboard')}
                  className="w-full py-3.5 px-6 rounded-full bg-theme-text text-theme-main font-bold text-xs uppercase tracking-[0.2em] flex items-center justify-center gap-3 transition-all duration-200 hover:bg-theme-accent hover:text-white active:scale-95 shadow-md"
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
      <footer className="relative z-40 w-full py-8 flex flex-col items-center">
        <span className="text-[10px] font-bold text-theme-text/50 tracking-[0.2em] uppercase">
          MARAPLUS GROUP // 2026
        </span>
      </footer>
    </div>
  );
};
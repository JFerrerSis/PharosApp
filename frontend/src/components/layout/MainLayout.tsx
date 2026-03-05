import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Sidebar } from './Sidebar';
import { getUltimaTasa } from '../../api/tasaService';
import { RefreshCcw } from 'lucide-react';
import { type TasaCambio } from '../../types/tasa';
import { toast } from 'sonner';

interface MainLayoutProps {
  children: React.ReactNode;
  titulo?: string;
}

export const MainLayout: React.FC<MainLayoutProps> = ({ children, titulo }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [tasa, setTasa] = useState<TasaCambio | null>(null);
  const [loading, setLoading] = useState(true);
  
  // Ref para comparar tasas
  const prevTasaRef = useRef<TasaCambio | null>(null);

  const userProfile = {
    username: "jferrer",
    role: "Administrador",
    initials: "JF"
  };

  const formatValue = (value: string | number | undefined | null) => {
    if (value === undefined || value === null) return "0,00";
    try {
      const stringValue = String(value).replace(/[^\d.,]/g, '').replace(',', '.');
      const num = parseFloat(stringValue);
      return isNaN(num) 
        ? "0,00" 
        : num.toLocaleString('de-DE', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
    } catch (e) {
      return "0,00";
    }
  };

  // ✅ Función de recarga mejorada para manejar todos los escenarios
  const handleRefreshTasa = useCallback(async (isManual = false) => {
    setLoading(true);
    try {
      const data = await getUltimaTasa();
      
      // Escenario A: No se obtuvo respuesta del API
      if (!data) {
        throw new Error("No se obtuvieron datos");
      }

      // Comparar con la tasa anterior
      const hasChanged = 
        !prevTasaRef.current ||
        data.dolar !== prevTasaRef.current.dolar ||
        data.euro !== prevTasaRef.current.euro;

      setTasa(data);
      prevTasaRef.current = data; // Actualizar el ref
      
      if (isManual) {
        // Escenario B: Éxito y cambio
        if (hasChanged) {
          toast.success("Tasas de cambio actualizadas");
        } 
        // Escenario C: Éxito pero no hubo cambio en los valores
        else {
          toast.info("Tasas al día", {
            description: "No hay nuevos valores del BCV."
          });
        }
      }
    } catch (error) {
      console.error("Error al recargar la tasa:", error);
      
      // Escenario D: Error técnico o de conexión
      if (isManual) {
        toast.error("Error al actualizar", {
          description: "No se pudo conectar con el servidor."
        });
      }
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    handleRefreshTasa(false); 
    const interval = setInterval(() => handleRefreshTasa(false), 30 * 60 * 1000);
    return () => clearInterval(interval);
  }, [handleRefreshTasa]);

  return (
    <div className="flex h-screen bg-theme-main overflow-hidden transition-colors duration-300">
      
      {/* Sidebar */}
      <div className={`
        fixed inset-y-0 left-0 z-50 transform 
        ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} 
        lg:relative lg:translate-x-0 transition-transform duration-300 ease-in-out
      `}>
        <Sidebar 
          activeTab={activeTab} 
          setActiveTab={setActiveTab} 
          onClose={() => setIsSidebarOpen(false)} 
        />
      </div>

      {isSidebarOpen && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40 lg:hidden" onClick={() => setIsSidebarOpen(false)} />
      )}

      <main className="flex-1 flex flex-col min-w-0 overflow-hidden">
        
        {/* Header Superior */}
        <header className="h-20 flex items-center justify-between px-8 border-b border-theme-border bg-theme-sidebar/80 backdrop-blur-xl z-30 transition-colors">
          <div className="flex items-center gap-4">
            <button onClick={() => setIsSidebarOpen(true)} className="lg:hidden p-2 text-theme-sub hover:text-theme-text transition-colors">
              <div className="w-6 h-0.5 bg-current mb-1" />
              <div className="w-6 h-0.5 bg-current mb-1" />
              <div className="w-6 h-0.5 bg-current" />
            </button>
            
            <h2 className="text-xl font-black text-theme-text uppercase tracking-wider">
              {titulo || 'Panel de Control'}
            </h2>
          </div>

          <div className="flex items-center gap-6">
            
            {/* 💹 CONTENEDOR DE TASAS */}
            <div className="hidden lg:flex items-center gap-6 border-r border-theme-border pr-6">
              
              {/* Tasa Dólar */}
              <div className="flex flex-col items-end group">
                <span className="text-[9px] font-black text-theme-accent uppercase tracking-[0.15em] leading-none mb-1 opacity-90">
                  Dólar BCV
                </span>
                <div className="flex items-baseline gap-1">
                  <span className="text-[10px] font-bold text-theme-sub italic opacity-50">Bs.</span>
                  <span className={`text-lg font-mono font-black text-theme-text leading-none transition-all ${loading ? 'animate-pulse opacity-30' : 'opacity-100'}`}>
                    {loading ? "---" : formatValue(tasa?.dolar)}
                  </span>
                </div>
              </div>

              <div className="h-8 w-1px bg-theme-border/40 rotate-12" />

              {/* Tasa Euro */}
              <div className="flex flex-col items-end group">
                <span className="text-[9px] font-black text-blue-500 uppercase tracking-[0.15em] leading-none mb-1 opacity-90">
                  Euro BCV
                </span>
                <div className="flex items-baseline gap-1">
                  <span className="text-[10px] font-bold text-theme-sub italic opacity-50">Bs.</span>
                  <span className={`text-lg font-mono font-black text-theme-text leading-none transition-all ${loading ? 'animate-pulse opacity-30' : 'opacity-100'}`}>
                    {loading ? "---" : formatValue(tasa?.euro)}
                  </span>
                </div>
              </div>

              {/* 🔄 BOTÓN DE ACTUALIZACIÓN FUNCIONAL */}
              <button 
                onClick={() => handleRefreshTasa(true)}
                disabled={loading}
                className="ml-2 p-1.5 rounded-lg hover:bg-theme-main/50 text-theme-sub/30 hover:text-theme-accent transition-all active:scale-90 disabled:opacity-50"
                title={loading ? "Actualizando..." : `Última actualización: ${tasa?.fecha || 'N/A'}`}
              >
                <RefreshCcw 
                  size={14} 
                  className={`${loading ? 'animate-spin' : 'hover:rotate-180 transition-transform duration-500'} ${(!tasa && !loading) ? 'text-red-500' : ''}`} 
                />
              </button>
            </div>

            {/* Perfil */}
            <div className="flex items-center gap-3 pl-2">
              <div className="hidden md:flex flex-col items-end">
                <span className="text-[11px] font-black text-theme-text uppercase tracking-tighter">
                  {userProfile.username}
                </span>
                <span className="text-[9px] text-theme-sub font-bold uppercase tracking-widest opacity-60">
                  {userProfile.role}
                </span>
              </div>
              
              <div className="relative group cursor-pointer">
                <div className="w-11 h-11 rounded-2xl bg-theme-main border border-theme-border flex items-center justify-center text-[12px] font-bold text-theme-text group-hover:border-theme-accent transition-all duration-500 shadow-inner">
                   <span className="relative z-10">{userProfile.initials}</span>
                </div>
                <div className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 bg-emerald-500 border-2 border-theme-sidebar rounded-full shadow-lg" />
              </div>
            </div>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto p-10 custom-scrollbar bg-theme-main text-theme-text">
          <div className="max-w-7xl mx-auto">
            {children}
          </div>
        </div>
      </main>
    </div>
  );
};
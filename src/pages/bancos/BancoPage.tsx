import React, { useState, useMemo } from 'react';
import { 
  Plus, Search, Landmark, X, 
  Trash2, Edit3, Hash,
 Filter, Activity, Save, 
  ShieldCheck, Globe
} from 'lucide-react';

// Interfaz técnica sincronizada
interface Banco {
  codbanco: string; // [PK] character varying(10)
  nombre: string;   // character varying(50)
}

export const BancoPage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);

  // Datos reales basados en tu captura
  const [bancos] = useState<Banco[]>([
    { codbanco: '0102', nombre: 'BANCO DE VENEZUELA' },
    { codbanco: '0105', nombre: 'BANCO MERCANTIL' },
    { codbanco: '0108', nombre: 'PROVINCIAL' },
    { codbanco: '0114', nombre: 'BANCARIBE' },
    { codbanco: '0134', nombre: 'BANESCO' },
    { codbanco: '0172', nombre: 'BANCAMIGA' },
  ]);

  // 🧠 Filtrado dinámico
  const filteredBancos = useMemo(() => {
    return bancos.filter(b => 
      b.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
      b.codbanco.includes(searchTerm)
    );
  }, [searchTerm, bancos]);

  return (
    <div className="space-y-6 animate-in fade-in duration-500 max-w-400 mx-auto p-4">
      
      {/* 🔍 HEADER AVANZADO (V4) */}
      <div className="bg-theme-sidebar/40 p-5 rounded-4xl border border-theme-border/50 shadow-xl backdrop-blur-xl flex flex-col gap-4">
        <div className="flex flex-col lg:flex-row justify-between items-center gap-4">
          <div className="relative w-full lg:w-110 group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-theme-sub group-focus-within:text-theme-accent transition-colors" size={18} />
            <input 
              type="text" 
              placeholder="Buscar por código bancario o nombre..." 
              className="w-full bg-theme-main/40 border border-theme-border rounded-2xl py-3 pl-12 pr-6 text-sm text-theme-text outline-none focus:border-theme-accent/50 transition-all shadow-inner"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <button 
            onClick={() => setShowModal(true)}
            className="w-full lg:w-auto group bg-theme-text text-theme-main px-6 py-3 rounded-xl font-black text-[10px] uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-theme-accent hover:text-white transition-all shadow-md active:scale-95"
          >
            <Plus size={16} className="group-hover:rotate-90 transition-transform duration-500" /> 
            <span>Añadir Entidad</span>
          </button>
        </div>

        <div className="flex flex-wrap items-center gap-3 border-t border-theme-border/20 pt-3">
          <div className="flex items-center gap-2 text-theme-sub mr-2">
            <Filter size={14} />
            <span className="text-[9px] font-black uppercase tracking-widest">Sistema:</span>
          </div>
          <div className="bg-theme-main/30 px-3 py-1.5 rounded-lg border border-theme-border/50 text-[9px] font-black text-theme-sub uppercase tracking-widest flex items-center gap-2">
            <ShieldCheck size={12} className="text-emerald-500" />
            Banca Nacional <span className="text-theme-text ml-1">Venezuela</span>
          </div>
          <span className="ml-auto text-[9px] font-black text-theme-sub uppercase tracking-widest opacity-60">
            Total: {filteredBancos.length} Bancos
          </span>
        </div>
      </div>

      {/* 🏛️ GRID DE BANCOS (ESTILO CARDS V4) */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {filteredBancos.map((b) => (
          <div key={b.codbanco} className="bg-theme-sidebar/40 border border-theme-border/50 rounded-4xl p-6 shadow-lg hover:border-theme-accent/30 transition-all group backdrop-blur-sm relative overflow-hidden flex flex-col justify-between min-h-180px">
            
            <div className="relative z-10">
              <div className="flex justify-between items-start mb-4">
                <div className="w-14 h-14 bg-theme-main border border-theme-border rounded-2xl flex items-center justify-center text-theme-accent shadow-inner group-hover:scale-105 transition-transform duration-500">
                  <Landmark size={28} />
                </div>
                <div className="text-right">
                  <div className="flex items-center justify-end gap-1 text-theme-sub mb-0.5 opacity-60">
                    <Hash size={10} />
                    <span className="text-[8px] font-black uppercase tracking-widest">Código Swift/IBAN</span>
                  </div>
                  <span className="text-lg font-mono font-black text-theme-text">{b.codbanco}</span>
                </div>
              </div>

              <div>
                <h3 className="text-xl font-black text-theme-text tracking-tighter uppercase italic leading-none group-hover:text-theme-accent transition-colors">
                  {b.nombre}
                </h3>
                <div className="flex items-center gap-2 mt-2">
                  <Globe size={12} className="text-theme-accent/50" />
                  <span className="text-[9px] font-black text-theme-sub uppercase tracking-widest">Institución Financiera</span>
                </div>
              </div>
            </div>

            {/* 🛠️ ACCIONES INTEGRADAS */}
            <div className="flex items-center justify-between mt-6 pt-4 border-t border-theme-border/20 relative z-10">
              <div className="flex items-center gap-1">
                <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_8px_rgba(16,185,129,0.5)]" />
                <span className="text-[8px] font-black text-theme-sub uppercase tracking-widest ml-1">Conexión Activa</span>
              </div>
              <div className="flex gap-2">
                <button className="p-2.5 bg-theme-main/60 border border-theme-border text-theme-sub hover:text-theme-accent hover:border-theme-accent/30 rounded-xl transition-all shadow-sm">
                  <Edit3 size={14} />
                </button>
                <button className="p-2.5 bg-theme-main/60 border border-theme-border text-theme-sub hover:text-red-500 hover:border-red-500/30 rounded-xl transition-all shadow-sm">
                  <Trash2 size={14} />
                </button>
              </div>
            </div>

            {/* Decoración de fondo (ADN del diseño) */}
            <Activity className="absolute -right-4 -top-4 text-theme-accent/5 group-hover:text-theme-accent/10 transition-colors duration-700" size={120} />
          </div>
        ))}
      </div>

      {/* 🛠️ MODAL DE REGISTRO (Estilo V4) */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-in fade-in zoom-in duration-300">
          <div className="absolute inset-0 bg-theme-main/80 backdrop-blur-md" onClick={() => setShowModal(false)} />
          
          <div className="relative w-full max-w-lg bg-theme-sidebar border border-theme-border rounded-[3rem] shadow-2xl overflow-hidden p-10">
            <button onClick={() => setShowModal(false)} className="absolute top-8 right-8 text-theme-sub hover:text-theme-text transition-all p-2 bg-theme-main rounded-full border border-theme-border shadow-inner">
              <X size={18} />
            </button>

            <div className="flex flex-col items-center mb-10 text-center">
              <div className="p-5 bg-theme-accent/10 rounded-2rem text-theme-accent mb-4 shadow-inner">
                <Landmark size={36} />
              </div>
              <h2 className="text-2xl font-black text-theme-text uppercase tracking-tighter italic leading-none">Nueva Entidad</h2>
              <p className="text-theme-sub text-[9px] uppercase font-black tracking-[0.3em] mt-3 opacity-60">Configuración de Maestro Bancario</p>
            </div>
            
            <form className="space-y-5" onSubmit={(e) => e.preventDefault()}>
              <div className="space-y-1.5">
                <label className="text-[9px] font-black text-theme-sub uppercase tracking-[0.2em] ml-3">Código Institucional (PK)</label>
                <div className="relative">
                  <Hash className="absolute left-5 top-1/2 -translate-y-1/2 text-theme-sub group-focus-within:text-theme-accent transition-colors" size={16} />
                  <input 
                    type="text" 
                    className="w-full bg-theme-main border border-theme-border rounded-2xl p-4 pl-12 text-sm text-theme-text outline-none focus:border-theme-accent/50 font-mono tracking-widest shadow-inner" 
                    placeholder="0134" 
                    maxLength={4} 
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-[9px] font-black text-theme-sub uppercase tracking-[0.2em] ml-3">Nombre de la Institución</label>
                <input 
                  type="text" 
                  className="w-full bg-theme-main border border-theme-border rounded-2xl p-4 text-sm text-theme-text outline-none focus:border-theme-accent/50 uppercase font-black shadow-inner" 
                  placeholder="Ej: BANESCO" 
                />
              </div>

              <div className="p-5 bg-theme-main/30 rounded-3xl border border-theme-border/50 flex items-center gap-4">
                <ShieldCheck size={20} className="text-emerald-500 shrink-0" />
                <p className="text-[10px] text-theme-sub font-bold leading-relaxed uppercase tracking-widest italic opacity-80">
                  Esta entidad se utilizará para la conciliación bancaria y registros de pagos en el sistema.
                </p>
              </div>

              <button type="submit" className="w-full mt-4 bg-theme-text text-theme-main font-black py-5 rounded-2xl text-[10px] uppercase tracking-[0.3em] shadow-xl hover:bg-theme-accent hover:text-white transition-all active:scale-95 flex items-center justify-center gap-2">
                <Save size={16} /> Registrar Entidad
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
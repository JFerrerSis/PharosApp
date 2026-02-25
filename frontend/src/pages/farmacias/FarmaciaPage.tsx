import React, { useState, useMemo } from 'react';
import { 
  Plus, Search, Store, 
  Edit3, Trash2, X, 
  Building2, Filter, Fingerprint,
  CheckCircle2, Activity, MapPin, Save
} from 'lucide-react';

// Interfaz ajustada a la DB (PostgreSQL)
interface Farmacia {
  id_codigo_farmacia: string; 
  nombre: string;
  rif: string;
  estado: 'ACTIVA' | 'INACTIVA' | 'MANTENIMIENTO';
}

export const FarmaciaPage: React.FC = () => {
  const [showModal, setShowModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterEstado, setFilterEstado] = useState<'ALL' | 'ACTIVA' | 'INACTIVA'>('ALL');

  // Datos de ejemplo
  const [farmacias, setFarmacias] = useState<Farmacia[]>([
    { id_codigo_farmacia: '1701', nombre: 'MARAPLUS MALL DELICIAS', rif: 'J-50465745-0', estado: 'ACTIVA' },
    { id_codigo_farmacia: '0301', nombre: 'FARMA LA FUENTE BELLAS ARTES', rif: 'J-50447189-5', estado: 'ACTIVA' },
    { id_codigo_farmacia: '0201', nombre: 'PRINCIPAL NORTE', rif: 'J-50447189-5', estado: 'INACTIVA' },
  ]);

  // 🧠 LÓGICA DE FILTRADO (Consistente con Puntos de Venta)
  const filteredFarmacias = useMemo(() => {
    return farmacias.filter(f => {
      const matchesSearch = 
        f.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
        f.id_codigo_farmacia.includes(searchTerm) ||
        f.rif.includes(searchTerm);
      const matchesEstado = filterEstado === 'ALL' || f.estado === filterEstado;
      return matchesSearch && matchesEstado;
    });
  }, [searchTerm, filterEstado, farmacias]);

  return (
    <div className="space-y-6 animate-in fade-in duration-500 max-w-400 mx-auto p-4">
      
      {/* 🔍 HEADER UNIFICADO (V4) */}
      <div className="bg-theme-sidebar/40 p-5 rounded-4xl border border-theme-border/50 shadow-xl backdrop-blur-xl flex flex-col gap-4">
        <div className="flex flex-col lg:flex-row justify-between items-center gap-4">
          <div className="relative w-full lg:w-110 group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-theme-sub group-focus-within:text-theme-accent transition-colors" size={18} />
            <input 
              type="text" 
              placeholder="Buscar por código, nombre o RIF..." 
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
            <span>Registrar Sede</span>
          </button>
        </div>

        <div className="flex flex-wrap items-center gap-3 border-t border-theme-border/20 pt-3">
          <div className="flex items-center gap-2 text-theme-sub mr-2">
            <Filter size={14} />
            <span className="text-[9px] font-black uppercase tracking-widest">Estado:</span>
          </div>
          <div className="flex bg-theme-main/30 p-1 rounded-xl border border-theme-border/50">
            {(['ALL', 'ACTIVA', 'INACTIVA'] as const).map((s) => (
              <button
                key={s}
                onClick={() => setFilterEstado(s)}
                className={`px-3 py-1.5 rounded-lg text-[9px] font-black transition-all ${
                  filterEstado === s ? 'bg-theme-text text-theme-main shadow-sm' : 'text-theme-sub hover:text-theme-text'
                }`}
              >
                {s === 'ALL' ? 'TODAS' : s}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* 🏥 GRID DE SEDES (ESTILO PUNTOS DE VENTA) */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        {filteredFarmacias.map((f) => (
          <div key={f.id_codigo_farmacia} className="bg-theme-sidebar/40 border border-theme-border/50 rounded-4xl p-6 shadow-lg hover:border-theme-accent/30 transition-all group backdrop-blur-sm relative overflow-hidden">
            
            <div className="flex flex-col md:flex-row gap-6 relative z-10">
              {/* Bloque Izquierdo: Visual & ID */}
              <div className="flex flex-col items-center gap-4 min-w-140px">
                <div className={`w-24 h-24 rounded-3xl flex items-center justify-center border-2 border-dashed transition-all group-hover:scale-105 duration-500 ${
                  f.estado === 'ACTIVA' ? 'bg-theme-accent/5 border-theme-accent/20 text-theme-accent shadow-[0_0_20px_rgba(var(--accent),0.1)]' : 'bg-red-500/5 border-red-500/20 text-red-500'
                }`}>
                  <Store size={40} />
                </div>
                <div className="text-center bg-theme-main/50 p-3 rounded-2xl border border-theme-border w-full shadow-inner">
                  <div className="flex items-center justify-center gap-1 text-theme-sub mb-1 opacity-60">
                    <Building2 size={12} />
                    <span className="text-[9px] font-black uppercase tracking-widest">Cod. Sede</span>
                  </div>
                  <span className="text-xl font-mono font-black text-theme-text">{f.id_codigo_farmacia}</span>
                </div>
              </div>

              {/* Bloque Derecho: Detalles */}
              <div className="flex-1 space-y-4">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-2xl font-black text-theme-text tracking-tighter uppercase italic leading-none">{f.nombre}</h3>
                    <div className="flex items-center gap-2 mt-2">
                      <MapPin size={12} className="text-theme-accent" />
                      <span className="text-[10px] font-black text-theme-sub uppercase tracking-tighter">Región Zulia / Maracaibo</span>
                    </div>
                  </div>
                  <span className={`px-4 py-1.5 rounded-full text-[9px] font-black tracking-widest border ${
                    f.estado === 'ACTIVA' ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20' : 'bg-red-500/10 text-red-500 border-red-500/20'
                  }`}>
                    {f.estado}
                  </span>
                </div>

                <div className="grid grid-cols-1 gap-3 bg-theme-main/40 p-4 rounded-3xl border border-theme-border shadow-inner">
                  <div className="space-y-1">
                    <span className="text-[8px] font-black text-theme-sub uppercase flex items-center gap-1 opacity-60">
                      <Fingerprint size={10} /> Registro Fiscal (RIF)
                    </span>
                    <p className="text-xs font-mono font-bold text-theme-text">{f.rif}</p>
                  </div>
                </div>

                <div className="flex items-center gap-4 text-theme-sub">
                  <div className="flex items-center gap-1">
                    <CheckCircle2 size={12} className="text-emerald-500" />
                    <span className="text-[9px] font-black uppercase tracking-widest">Sede Homologada</span>
                  </div>
                </div>

                {/* 🛠️ ACCIONES */}
                <div className="flex gap-2 pt-2">
                  <button className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-theme-main/60 border border-theme-border text-[9px] font-black text-theme-sub hover:text-theme-accent hover:border-theme-accent/30 rounded-xl transition-all uppercase tracking-widest group/btn shadow-sm">
                    <Edit3 size={12} className="group-hover/btn:rotate-12 transition-transform" />
                    Configurar
                  </button>
                  <button 
                    onClick={() => setFarmacias(farmacias.filter(item => item.id_codigo_farmacia !== f.id_codigo_farmacia))}
                    className="p-2.5 bg-theme-main/60 border border-theme-border text-theme-sub hover:text-red-500 hover:border-red-500/30 rounded-xl transition-all shadow-sm"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            </div>

            {/* Decoración de fondo */}
            <Activity className="absolute -right-6 -top-6 text-theme-accent/5 group-hover:text-theme-accent/10 transition-colors duration-700" size={140} />
          </div>
        ))}
      </div>

      {/* 📥 MODAL REGISTRO (V4) */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-in fade-in zoom-in duration-300">
          <div className="absolute inset-0 bg-theme-main/80 backdrop-blur-md" onClick={() => setShowModal(false)} />
          
          <div className="relative w-full max-w-2xl bg-theme-sidebar border border-theme-border rounded-4xl shadow-2xl overflow-hidden overflow-y-auto max-h-[90vh]">
            <div className="p-6 border-b border-theme-border flex justify-between items-center bg-theme-main/20">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-theme-accent text-white rounded-xl flex items-center justify-center shadow-lg shadow-theme-accent/20">
                  <Plus size={20} />
                </div>
                <h2 className="text-xl font-black text-theme-text uppercase tracking-tighter italic leading-none">Nueva Sede Maraplus</h2>
              </div>
              <button onClick={() => setShowModal(false)} className="p-2 hover:bg-theme-main rounded-full text-theme-sub transition-colors"><X size={20} /></button>
            </div>

            <form className="p-8 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-1 col-span-1">
                  <label className="text-[9px] font-black text-theme-sub uppercase ml-2 tracking-widest">ID Sede</label>
                  <input required type="text" placeholder="Ej: 1701" className="w-full bg-theme-main/50 border border-theme-border rounded-2xl py-3 px-4 text-sm text-theme-text outline-none focus:border-theme-accent transition-all shadow-inner font-mono" />
                </div>
                <div className="space-y-1 col-span-2">
                  <label className="text-[9px] font-black text-theme-sub uppercase ml-2 tracking-widest">Razón Social / Nombre</label>
                  <input required type="text" placeholder="Ej: Farmacia Maraplus..." className="w-full bg-theme-main/50 border border-theme-border rounded-2xl py-3 px-4 text-sm text-theme-text outline-none focus:border-theme-accent transition-all shadow-inner" />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[9px] font-black text-theme-sub uppercase ml-2 tracking-widest">RIF Fiscal</label>
                <div className="relative group">
                  <Fingerprint className="absolute left-4 top-1/2 -translate-y-1/2 text-theme-sub group-focus-within:text-theme-accent" size={18} />
                  <input required type="text" placeholder="J-50000000-0" className="w-full bg-theme-main/50 border border-theme-border rounded-2xl py-3 pl-12 pr-4 text-sm text-theme-text outline-none focus:border-theme-accent transition-all font-mono shadow-inner" />
                </div>
              </div>

              <div className="p-5 bg-theme-main/30 rounded-3xl border border-theme-border/50 flex items-center gap-4">
                <CheckCircle2 size={24} className="text-emerald-500 shrink-0" />
                <p className="text-[10px] text-theme-sub font-bold leading-relaxed uppercase tracking-widest italic opacity-80">
                  Al registrar esta sede, se habilitará la gestión fiscal y de terminales de punto de venta asociados.
                </p>
              </div>

              <div className="flex gap-3 pt-2">
                <button type="button" onClick={() => setShowModal(false)} className="flex-1 bg-theme-main border border-theme-border text-theme-sub py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest">Cancelar</button>
                <button type="submit" className="flex-1 bg-theme-text text-theme-main py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-theme-accent hover:text-white transition-all shadow-xl">
                  <Save size={16} /> Confirmar Sede
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
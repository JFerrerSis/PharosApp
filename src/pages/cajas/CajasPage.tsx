import React, { useState, useMemo } from 'react';
import { 
  Monitor, Plus, Search, Copy, Globe, 
  Edit2, Trash2, X, Key,
  LayoutGrid, List, Activity,
  Filter, MapPin, Hash
} from 'lucide-react';

// --- INTERFACES ---
interface Caja {
  id: number;
  farmacia_id: string;
  nro_caja: number;
  ip_v4: string;
  anydesk_id: string;
  anydesk_clave: string;
  estado: 'ONLINE' | 'OFFLINE' | 'MANTENIMIENTO';
  categoria: 'COMPUTADOR' | 'IMPRESORA' | 'RED';
}

export const CajasPage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  
  const [filtroCategoria, setFiltroCategoria] = useState('TODOS');
  const [filtroEstado, setFiltroEstado] = useState('TODOS');

  // Datos de ejemplo
  const [cajas] = useState<Caja[]>([
    { 
      id: 1, 
      farmacia_id: '1701', 
      nro_caja: 1, 
      ip_v4: '192.168.17.10', 
      anydesk_id: '123456789', 
      anydesk_clave: 'clave123',
      estado: 'ONLINE',
      categoria: 'COMPUTADOR'
    },
    { 
      id: 2, 
      farmacia_id: '1805', 
      nro_caja: 2, 
      ip_v4: '192.168.20.15', 
      anydesk_id: '987654321', 
      anydesk_clave: 'admin456',
      estado: 'OFFLINE',
      categoria: 'COMPUTADOR'
    }
  ]);

  const filteredCajas = useMemo(() => {
    return cajas.filter(c => {
      const matchesSearch = c.farmacia_id.includes(searchTerm) || 
                            c.ip_v4.includes(searchTerm) ||
                            c.anydesk_id.includes(searchTerm);
      
      const matchesCat = filtroCategoria === 'TODOS' || c.categoria === filtroCategoria;
      const matchesEstado = filtroEstado === 'TODOS' || c.estado === filtroEstado;
      
      return matchesSearch && matchesCat && matchesEstado;
    });
  }, [searchTerm, cajas, filtroCategoria, filtroEstado]);

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500 max-w-400 mx-auto p-4">
      
      {/* 🔍 HEADER COMPACTO Y FILTRADO */}
      <div className="bg-theme-sidebar/40 p-5 rounded-4xl border border-theme-border/50 shadow-xl backdrop-blur-xl flex flex-col gap-4">
        <div className="flex flex-col lg:flex-row justify-between items-center gap-4">
          <div className="relative w-full lg:w-110 group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-theme-sub group-focus-within:text-theme-accent transition-colors" size={18} />
            <input 
              type="text" 
              placeholder="Buscar por Sede, IP o AnyDesk..." 
              className="w-full bg-theme-main/40 border border-theme-border rounded-2xl py-3 pl-12 pr-6 text-sm text-theme-text outline-none focus:border-theme-accent/50 transition-all shadow-inner"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div className="flex items-center gap-3 w-full lg:w-auto">
             <div className="flex bg-theme-main/30 p-1 rounded-xl border border-theme-border/50">
                <button onClick={() => setViewMode('grid')} className={`p-2 rounded-lg transition-all ${viewMode === 'grid' ? 'bg-theme-text text-theme-main' : 'text-theme-sub'}`}><LayoutGrid size={16}/></button>
                <button onClick={() => setViewMode('list')} className={`p-2 rounded-lg transition-all ${viewMode === 'list' ? 'bg-theme-text text-theme-main' : 'text-theme-sub'}`}><List size={16}/></button>
             </div>
            <button 
              onClick={() => setShowModal(true)}
              className="flex-1 group relative overflow-hidden bg-theme-text text-theme-main px-6 py-3 rounded-xl font-black text-[10px] uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-theme-accent hover:text-white transition-all shadow-md active:scale-95"
            >
              <Plus size={16} className="group-hover:rotate-90 transition-transform duration-500" /> 
              <span>Nueva Terminal</span>
            </button>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3 border-t border-theme-border/20 pt-3">
          <div className="flex items-center gap-2 text-theme-sub mr-2">
            <Filter size={14} />
            <span className="text-[9px] font-black uppercase tracking-widest">Filtros:</span>
          </div>

          <div className="flex bg-theme-main/30 p-1 rounded-xl border border-theme-border/50">
            {['TODOS', 'COMPUTADOR', 'IMPRESORA', 'RED'].map((cat) => (
              <button
                key={cat}
                onClick={() => setFiltroCategoria(cat)}
                className={`px-3 py-1.5 rounded-lg text-[9px] font-black transition-all ${filtroCategoria === cat ? 'bg-theme-text text-theme-main shadow-sm' : 'text-theme-sub hover:text-theme-text'}`}
              >
                {cat === 'TODOS' ? 'CATEGORÍAS' : cat}
              </button>
            ))}
          </div>

          <div className="flex bg-theme-main/30 p-1 rounded-xl border border-theme-border/50">
            {['TODOS', 'ONLINE', 'OFFLINE', 'MANTENIMIENTO'].map((est) => (
              <button
                key={est}
                onClick={() => setFiltroEstado(est)}
                className={`px-3 py-1.5 rounded-lg text-[9px] font-black transition-all ${filtroEstado === est ? 'bg-theme-text text-theme-main shadow-sm' : 'text-theme-sub hover:text-theme-text'}`}
              >
                {est === 'TODOS' ? 'ESTADOS' : est}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* 📋 GRID DE CAJAS */}
      <div className={viewMode === 'grid' ? "grid grid-cols-1 xl:grid-cols-2 gap-4" : "flex flex-col gap-4"}>
        {filteredCajas.map((caja) => (
          <div key={caja.id} className="bg-theme-sidebar/40 border border-theme-border/50 rounded-4xl p-6 hover:border-theme-accent/30 transition-all group relative overflow-hidden backdrop-blur-sm shadow-lg">
            <div className="flex gap-6 relative z-10">
              <div className="flex flex-col items-center gap-2">
                <div className="w-16 h-16 rounded-3xl bg-theme-main/60 text-theme-accent flex items-center justify-center border border-theme-border/50 transition-all group-hover:scale-105 shadow-inner">
                  <Monitor size={28} />
                </div>
                <div className="flex flex-col items-center">
                  <span className="text-[8px] font-black text-theme-sub uppercase opacity-50 italic">Caja</span>
                  <span className="font-mono text-[14px] font-black text-theme-text tracking-widest">{String(caja.nro_caja).padStart(2, '0')}</span>
                </div>
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-xl font-black text-theme-text uppercase italic tracking-tighter leading-none truncate">
                      SEDE <span className="text-theme-accent not-italic font-medium">{caja.farmacia_id}</span>
                    </h3>
                    <div className="flex gap-2 mt-2">
                        <span className="inline-block text-[8px] font-black text-theme-sub uppercase tracking-widest bg-theme-main/50 border border-theme-border px-2 py-1 rounded-lg">
                        {caja.categoria}
                        </span>
                        <div className="flex items-center gap-1.5 px-2 py-1 bg-theme-main/50 border border-theme-border rounded-lg">
                            <Globe size={10} className="text-theme-sub"/>
                            <span className="text-[9px] font-mono font-bold text-theme-text">{caja.ip_v4}</span>
                        </div>
                    </div>
                  </div>
                  <span className={`px-3 py-1 rounded-lg text-[9px] font-black tracking-widest border ${
                    caja.estado === 'ONLINE' ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20 animate-pulse' : 
                    caja.estado === 'OFFLINE' ? 'bg-red-500/10 text-red-500 border-red-500/20' :
                    'bg-amber-500/10 text-amber-500 border-amber-500/20'
                  }`}>
                    {caja.estado}
                  </span>
                </div>

                {/* Info AnyDesk con el diseño de Activos */}
                <div className="grid grid-cols-2 gap-3 bg-theme-main/40 p-4 rounded-3xl border border-theme-border/40 shadow-inner">
                  <div className="flex flex-col gap-0.5">
                    <div className="flex items-center justify-between">
                        <span className="text-[8px] font-black text-theme-sub uppercase opacity-60 italic">AnyDesk ID</span>
                        <button onClick={() => copyToClipboard(caja.anydesk_id)} className="text-theme-sub hover:text-theme-accent transition-colors"><Copy size={10}/></button>
                    </div>
                    <span className="text-sm font-mono font-black text-theme-text">{caja.anydesk_id.replace(/\B(?=(\d{3})+(?!\d))/g, " ")}</span>
                  </div>
                  <div className="flex flex-col gap-0.5 border-l border-theme-border/50 pl-4">
                    <span className="text-[8px] font-black text-theme-sub uppercase opacity-60 italic">Passkey</span>
                    <span className="text-xs font-black text-emerald-500/80 font-mono tracking-widest">{caja.anydesk_clave}</span>
                  </div>
                </div>

                <div className="mt-4 flex justify-end gap-2">
                    <button className="p-2.5 bg-theme-main/50 hover:bg-theme-accent hover:text-white rounded-xl text-theme-sub transition-all active:scale-90 shadow-sm border border-theme-border/50">
                      <Edit2 size={14} />
                    </button>
                    <button className="p-2.5 bg-theme-main/50 hover:bg-red-500/10 hover:text-red-500 rounded-xl text-theme-sub transition-all active:scale-90 shadow-sm border border-theme-border/50">
                      <Trash2 size={14} />
                    </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* 🚀 MODAL DE REGISTRO ESTILO EQUIPOS */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-theme-main/80 backdrop-blur-md animate-in fade-in zoom-in duration-300">
          <div className="bg-theme-sidebar border border-theme-border/50 w-full max-w-xl rounded-5xl p-8 shadow-2xl relative flex flex-col max-h-[90vh]">
            
            <div className="flex justify-between items-center mb-6">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-theme-accent/10 rounded-2xl text-theme-accent shadow-inner">
                  <Monitor size={24} />
                </div>
                <div>
                  <h2 className="text-xl font-black text-theme-text uppercase italic tracking-tighter leading-none">Nueva Terminal</h2>
                  <p className="text-[9px] font-bold text-theme-sub uppercase tracking-widest mt-1">Punto de Venta / Acceso Remoto</p>
                </div>
              </div>
              <button onClick={() => setShowModal(false)} className="text-theme-sub hover:text-theme-text transition-colors p-2 bg-theme-main/50 rounded-full">
                <X size={20} />
              </button>
            </div>

            <form className="space-y-4 overflow-y-auto pr-2 custom-scrollbar" onSubmit={(e) => e.preventDefault()}>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-[9px] font-black text-theme-sub uppercase tracking-widest ml-1">Farmacia ID</label>
                  <div className="relative">
                    <MapPin size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-theme-sub" />
                    <input type="text" className="w-full bg-theme-main/50 border border-theme-border rounded-xl p-3 pl-11 text-sm text-theme-text outline-none focus:border-theme-accent/50" placeholder="Ej: 1701" />
                  </div>
                </div>
                <div className="space-y-1.5">
                  <label className="text-[9px] font-black text-theme-sub uppercase tracking-widest ml-1">Número de Caja</label>
                  <div className="relative">
                    <Hash size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-theme-sub" />
                    <input type="number" className="w-full bg-theme-main/50 border border-theme-border rounded-xl p-3 pl-11 text-sm text-theme-text outline-none focus:border-theme-accent/50" placeholder="Ej: 01" />
                  </div>
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-[9px] font-black text-theme-sub uppercase tracking-widest ml-1">Dirección IP Local</label>
                <div className="relative">
                  <Globe size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-theme-sub" />
                  <input type="text" className="w-full bg-theme-main/50 border border-theme-border rounded-xl p-3 pl-11 text-sm text-theme-text outline-none focus:border-theme-accent/50 font-mono" placeholder="192.168.x.x" />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-[9px] font-black text-theme-sub uppercase tracking-widest ml-1">AnyDesk ID</label>
                  <div className="relative">
                    <Activity size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-theme-sub" />
                    <input type="text" className="w-full bg-theme-main/50 border border-theme-border rounded-xl p-3 pl-11 text-sm text-theme-text outline-none focus:border-theme-accent/50 font-mono" placeholder="987 654 321" />
                  </div>
                </div>
                <div className="space-y-1.5">
                  <label className="text-[9px] font-black text-theme-sub uppercase tracking-widest ml-1">Password</label>
                  <div className="relative">
                    <Key size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-theme-sub" />
                    <input type="text" className="w-full bg-theme-main/50 border border-theme-border rounded-xl p-3 pl-11 text-sm text-theme-text outline-none focus:border-theme-accent/50 font-mono" placeholder="********" />
                  </div>
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-[9px] font-black text-theme-sub uppercase tracking-widest ml-1">Estado Inicial</label>
                <select className="w-full bg-theme-main/50 border border-theme-border rounded-xl p-3 text-sm text-theme-text outline-none focus:border-theme-accent/50 appearance-none cursor-pointer">
                  <option value="ONLINE">ONLINE / DISPONIBLE</option>
                  <option value="OFFLINE">OFFLINE / DESCONECTADO</option>
                  <option value="MANTENIMIENTO">MANTENIMIENTO</option>
                </select>
              </div>

              <button type="submit" className="w-full bg-theme-text text-theme-main font-black py-4 rounded-2xl text-[11px] uppercase tracking-widest shadow-xl hover:bg-theme-accent hover:text-white transition-all active:scale-95">
                Registrar Caja en Sistema
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
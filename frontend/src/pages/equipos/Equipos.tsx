import React, { useState, useMemo } from 'react';
import { 
  Monitor, Search, Plus, Cpu, 
  Settings, Trash2, MapPin, 
  Server, Filter, X,
  LayoutGrid, Hash, MessageSquare
} from 'lucide-react';

// --- INTERFACES ---
interface Equipo {
  id: number;
  categoria: string;
  marca: string;
  modelo: string;
  serial: string;
  farmacia_id: string;
  caja_id: number | null;
  es_servidor: boolean;
  estado: string;
  observaciones: string;
}

export const EquiposPage: React.FC = () => {
  const [showModal, setShowModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCat, setFilterCat] = useState<'ALL' | 'COMPUTADOR' | 'IMPRESORA' | 'RED'>('ALL');
  const [filterEstado, setFilterEstado] = useState<'ALL' | 'OPERATIVO' | 'FALLA' | 'MANTENIMIENTO'>('ALL');

  const [equipos] = useState<Equipo[]>([
    {
      id: 1,
      categoria: 'COMPUTADOR',
      marca: 'DELL',
      modelo: 'OPTIPLEX 3050',
      serial: 'MXL123456',
      farmacia_id: '1701',
      caja_id: 1,
      es_servidor: false,
      estado: 'OPERATIVO',
      observaciones: 'Equipo asignado a facturación principal'
    },
    {
      id: 2,
      categoria: 'RED',
      marca: 'MIKROTIK',
      modelo: 'RB1100AHx4',
      serial: 'SN-998877',
      farmacia_id: '0301',
      caja_id: null,
      es_servidor: true,
      estado: 'MANTENIMIENTO',
      observaciones: 'Router principal de la sede'
    }
  ]);

  const filteredEquipos = useMemo(() => {
    return equipos.filter(e => {
      const matchesSearch = 
        e.serial.toLowerCase().includes(searchTerm.toLowerCase()) || 
        e.marca.toLowerCase().includes(searchTerm.toLowerCase()) ||
        e.modelo.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCat = filterCat === 'ALL' || e.categoria === filterCat;
      const matchesEstado = filterEstado === 'ALL' || e.estado === filterEstado;
      
      return matchesSearch && matchesCat && matchesEstado;
    });
  }, [searchTerm, filterCat, filterEstado, equipos]);

  return (
    <div className="space-y-6 animate-in fade-in duration-500 max-w-400 mx-auto p-4">
      
      {/* 🔍 HEADER COMPACTO */}
      <div className="bg-theme-sidebar/40 p-5 rounded-4xl border border-theme-border/50 shadow-xl backdrop-blur-xl flex flex-col gap-4">
        <div className="flex flex-col lg:flex-row justify-between items-center gap-4">
          <div className="relative w-full lg:w-110 group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-theme-sub group-focus-within:text-theme-accent transition-colors" size={18} />
            <input 
              type="text" 
              placeholder="Buscar por serial, marca o modelo..." 
              className="w-full bg-theme-main/40 border border-theme-border rounded-2xl py-3 pl-12 pr-6 text-sm text-theme-text outline-none focus:border-theme-accent/50 transition-all shadow-inner"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <button 
            onClick={() => setShowModal(true)}
            className="group relative overflow-hidden bg-theme-text text-theme-main px-6 py-3 rounded-xl font-black text-[10px] uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-theme-accent hover:text-white transition-all shadow-md active:scale-95"
          >
            <Plus size={16} className="group-hover:rotate-90 transition-transform duration-500" /> 
            <span>Nuevo Activo</span>
          </button>
        </div>

        <div className="flex flex-wrap items-center gap-3 border-t border-theme-border/20 pt-3">
          <div className="flex items-center gap-2 text-theme-sub mr-2">
            <Filter size={14} />
            <span className="text-[9px] font-black uppercase tracking-widest">Filtros:</span>
          </div>

          <div className="flex bg-theme-main/30 p-1 rounded-xl border border-theme-border/50">
            {(['ALL', 'COMPUTADOR', 'IMPRESORA', 'RED'] as const).map((c) => (
              <button
                key={c}
                onClick={() => setFilterCat(c)}
                className={`px-3 py-1.5 rounded-lg text-[9px] font-black transition-all ${
                  filterCat === c ? 'bg-theme-text text-theme-main shadow-sm' : 'text-theme-sub hover:text-theme-text'
                }`}
              >
                {c === 'ALL' ? 'CATEGORÍAS' : c}
              </button>
            ))}
          </div>

          <div className="flex bg-theme-main/30 p-1 rounded-xl border border-theme-border/50">
            {(['ALL', 'OPERATIVO', 'FALLA', 'MANTENIMIENTO'] as const).map((s) => (
              <button
                key={s}
                onClick={() => setFilterEstado(s)}
                className={`px-3 py-1.5 rounded-lg text-[9px] font-black transition-all ${
                  filterEstado === s ? 'bg-theme-text text-theme-main shadow-sm' : 'text-theme-sub hover:text-theme-text'
                }`}
              >
                {s === 'ALL' ? 'ESTADOS' : s}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* 📋 GRID DE EQUIPOS */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
        {filteredEquipos.map((eq) => (
          <div key={eq.id} className="bg-theme-sidebar/40 border border-theme-border/50 rounded-4xl p-6 hover:border-theme-accent/30 transition-all group relative overflow-hidden backdrop-blur-sm shadow-lg">
            <div className="flex gap-6 relative z-10">
              <div className="flex flex-col items-center gap-2">
                <div className={`w-16 h-16 rounded-3xl flex items-center justify-center border border-theme-border/50 transition-all group-hover:scale-105 shadow-inner ${eq.es_servidor ? 'bg-purple-500/10 text-purple-500 border-purple-500/20' : 'bg-theme-main/60 text-theme-accent'}`}>
                  {eq.es_servidor ? <Server size={28} /> : <Monitor size={28} />}
                </div>
                <div className="flex flex-col items-center">
                  <span className="text-[8px] font-black text-theme-sub uppercase opacity-50">ID</span>
                  <span className="font-mono text-[10px] font-black text-theme-text tracking-widest">#{String(eq.id).padStart(4, '0')}</span>
                </div>
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-xl font-black text-theme-text uppercase italic tracking-tighter leading-none truncate">
                      {eq.marca} <span className="text-theme-accent not-italic font-medium">{eq.modelo}</span>
                    </h3>
                    <span className="inline-block mt-2 text-[8px] font-black text-theme-sub uppercase tracking-widest bg-theme-main/50 border border-theme-border px-2 py-1 rounded-lg">
                      {eq.categoria}
                    </span>
                  </div>
                  <span className={`px-3 py-1 rounded-lg text-[9px] font-black tracking-widest border ${
                    eq.estado === 'OPERATIVO' ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20' : 
                    eq.estado === 'FALLA' ? 'bg-red-500/10 text-red-500 border-red-500/20' :
                    'bg-amber-500/10 text-amber-500 border-amber-500/20'
                  }`}>
                    {eq.estado}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-3 bg-theme-main/40 p-4 rounded-3xl border border-theme-border/40 shadow-inner">
                  <div className="flex flex-col gap-0.5">
                    <span className="text-[8px] font-black text-theme-sub uppercase opacity-60">Serial</span>
                    <span className="text-xs font-mono font-black text-theme-text truncate">{eq.serial}</span>
                  </div>
                  <div className="flex flex-col gap-0.5 border-l border-theme-border/50 pl-4">
                    <span className="text-[8px] font-black text-theme-sub uppercase opacity-60">Sede</span>
                    <span className="text-xs font-black uppercase text-theme-text">F-{eq.farmacia_id}</span>
                  </div>
                </div>

                <div className="mt-4 flex justify-between items-center">
                  <p className="text-[10px] text-theme-sub italic truncate max-w-6/10">
                    "{eq.observaciones}"
                  </p>
                  <div className="flex gap-2">
                    <button className="p-2.5 bg-theme-main/50 hover:bg-theme-accent hover:text-white rounded-xl text-theme-sub transition-all active:scale-90 shadow-sm">
                      <Settings size={16} />
                    </button>
                    <button className="p-2.5 bg-theme-main/50 hover:bg-red-500/10 hover:text-red-500 rounded-xl text-theme-sub transition-all active:scale-90 shadow-sm">
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* 🚀 MODAL COMPLETO Y MEJORADO */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-theme-main/80 backdrop-blur-md animate-in fade-in zoom-in duration-300">
          <div className="bg-theme-sidebar border border-theme-border/50 w-full max-w-xl rounded-5xl p-8 shadow-2xl relative flex flex-col max-h-[90vh]">
            
            {/* Header Modal */}
            <div className="flex justify-between items-center mb-6">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-theme-accent/10 rounded-2xl text-theme-accent shadow-inner">
                  <LayoutGrid size={24} />
                </div>
                <div>
                  <h2 className="text-xl font-black text-theme-text uppercase italic tracking-tighter leading-none">Registrar Activo</h2>
                  <p className="text-[9px] font-bold text-theme-sub uppercase tracking-widest mt-1">Inventario de Hardware</p>
                </div>
              </div>
              <button onClick={() => setShowModal(false)} className="text-theme-sub hover:text-theme-text transition-colors p-2 bg-theme-main/50 rounded-full">
                <X size={20} />
              </button>
            </div>

            {/* Formulario con Scroll */}
            <form className="space-y-4 overflow-y-auto pr-2 custom-scrollbar" onSubmit={(e) => e.preventDefault()}>
              
              {/* Categoría y Estado */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-[9px] font-black text-theme-sub uppercase tracking-widest ml-1">Categoría</label>
                  <select className="w-full bg-theme-main/50 border border-theme-border rounded-xl p-3 text-sm text-theme-text outline-none focus:border-theme-accent/50 appearance-none cursor-pointer">
                    <option value="COMPUTADOR">COMPUTADOR</option>
                    <option value="IMPRESORA">IMPRESORA</option>
                    <option value="RED">EQUIPO DE RED</option>
                  </select>
                </div>
                <div className="space-y-1.5">
                  <label className="text-[9px] font-black text-theme-sub uppercase tracking-widest ml-1">Estado</label>
                  <select className="w-full bg-theme-main/50 border border-theme-border rounded-xl p-3 text-sm text-theme-text outline-none focus:border-theme-accent/50 appearance-none cursor-pointer">
                    <option value="OPERATIVO">OPERATIVO</option>
                    <option value="FALLA">EN FALLA</option>
                    <option value="MANTENIMIENTO">MANTENIMIENTO</option>
                  </select>
                </div>
              </div>

              {/* Marca y Modelo */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-[9px] font-black text-theme-sub uppercase tracking-widest ml-1">Marca</label>
                  <input type="text" className="w-full bg-theme-main/50 border border-theme-border rounded-xl p-3 text-sm text-theme-text outline-none focus:border-theme-accent/50 shadow-inner" placeholder="Ej: HP, Dell..." />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[9px] font-black text-theme-sub uppercase tracking-widest ml-1">Modelo</label>
                  <input type="text" className="w-full bg-theme-main/50 border border-theme-border rounded-xl p-3 text-sm text-theme-text outline-none focus:border-theme-accent/50 shadow-inner" placeholder="Ej: LaserJet Pro..." />
                </div>
              </div>

              {/* Serial Number */}
              <div className="space-y-1.5">
                <label className="text-[9px] font-black text-theme-sub uppercase tracking-widest ml-1">Serial Number</label>
                <div className="relative">
                  <Cpu size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-theme-sub" />
                  <input type="text" className="w-full bg-theme-main/50 border border-theme-border rounded-xl p-3 pl-11 text-sm text-theme-text outline-none focus:border-theme-accent/50 font-mono" placeholder="S/N: ABC123XYZ" />
                </div>
              </div>

              {/* Ubicación: Farmacia y Caja */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-[9px] font-black text-theme-sub uppercase tracking-widest ml-1">Farmacia ID</label>
                  <div className="relative">
                    <MapPin size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-theme-sub" />
                    <input type="text" className="w-full bg-theme-main/50 border border-theme-border rounded-xl p-3 pl-11 text-sm text-theme-text outline-none focus:border-theme-accent/50" placeholder="Ej: 0301" />
                  </div>
                </div>
                <div className="space-y-1.5">
                  <label className="text-[9px] font-black text-theme-sub uppercase tracking-widest ml-1">Nº Caja (Opcional)</label>
                  <div className="relative">
                    <Hash size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-theme-sub" />
                    <input type="number" className="w-full bg-theme-main/50 border border-theme-border rounded-xl p-3 pl-11 text-sm text-theme-text outline-none focus:border-theme-accent/50" placeholder="Ej: 1" />
                  </div>
                </div>
              </div>

              {/* Toggle Servidor */}
              <div className="flex items-center justify-between bg-theme-main/30 p-4 rounded-2xl border border-theme-border/50">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-purple-500/10 rounded-lg text-purple-500">
                    <Server size={18} />
                  </div>
                  <span className="text-[10px] font-black text-theme-text uppercase italic tracking-tighter">¿Definir como Servidor?</span>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" className="sr-only peer" />
                  <div className="w-11 h-6 bg-theme-main border border-theme-border rounded-full peer peer-checked:after:translate-x-full peer-checked:bg-theme-accent after:content-[''] after:absolute after:top-2px after:left-2px after:bg-theme-sub after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:after:bg-white shadow-inner"></div>
                </label>
              </div>

              {/* Observaciones */}
              <div className="space-y-1.5">
                <label className="text-[9px] font-black text-theme-sub uppercase tracking-widest ml-1">Observaciones</label>
                <div className="relative">
                  <MessageSquare size={16} className="absolute left-4 top-4 text-theme-sub" />
                  <textarea className="w-full bg-theme-main/50 border border-theme-border rounded-2xl p-3 pl-11 text-xs text-theme-text outline-none focus:border-theme-accent/50 min-h-80px resize-none" placeholder="Detalles técnicos, ubicación física específica..."></textarea>
                </div>
              </div>
              
              {/* Botón Guardar */}
              <button type="submit" className="w-full bg-theme-text text-theme-main font-black py-4 rounded-2xl text-[11px] uppercase tracking-widest shadow-xl hover:bg-theme-accent hover:text-white transition-all active:scale-95">
                Guardar Activo en Inventario
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
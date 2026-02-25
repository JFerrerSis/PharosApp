import React, { useState, useMemo } from 'react';
import { 
  Droplets, Search, Plus, MapPin, 
  Archive, Edit3, Trash2,
  Layout, Bookmark, Calendar, Filter, X,
  Save, Info
} from 'lucide-react';

// --- INTERFACES ---
interface Toner {
  id: number;
  modelo: string;
  compatibilidad: string;
  estado: 'DISPONIBLE' | 'EN_USO' | 'AGOTADO' | 'DAÑADO';
  farmacia_id: string;
  area_destino: string;
  ubicacion_estante: string;
  observaciones: string;
  fecha_registro: string;
}

export const TonerPage: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterEstado, setFilterEstado] = useState<'ALL' | 'DISPONIBLE' | 'EN_USO' | 'AGOTADO' | 'DAÑADO'>('ALL');
  const [filterSede, setFilterSede] = useState('ALL');

  // Estado de la lista de tóners
  const [toners, setToners] = useState<Toner[]>([
    {
      id: 1,
      modelo: 'HP 48A (CF248A)',
      compatibilidad: 'HP LaserJet Pro M15/M28 series',
      estado: 'DISPONIBLE',
      farmacia_id: '1701',
      area_destino: 'ADMINISTRACION',
      ubicacion_estante: 'PASILLO A - NIVEL 2',
      observaciones: 'Tóner original nuevo',
      fecha_registro: '2026-02-20'
    }
  ]);

  // Manejador para agregar nuevo tóner (Simulado)
  const handleAddToner = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    
    const newToner: Toner = {
      id: Date.now(),
      modelo: formData.get('modelo') as string,
      compatibilidad: formData.get('compatibilidad') as string,
      estado: formData.get('estado') as any,
      farmacia_id: formData.get('farmacia_id') as string,
      area_destino: formData.get('area_destino') as string,
      ubicacion_estante: formData.get('ubicacion_estante') as string,
      observaciones: '',
      fecha_registro: new Date().toISOString().split('T')[0]
    };

    setToners([newToner, ...toners]); // Usamos setToners aquí
    setIsModalOpen(false);
  };

  const getStatusColor = (estado: string) => {
    switch (estado) {
      case 'DISPONIBLE': return 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20';
      case 'EN_USO': return 'bg-blue-500/10 text-blue-500 border-blue-500/20';
      case 'AGOTADO': return 'bg-red-500/10 text-red-500 border-red-500/20';
      case 'DAÑADO': return 'bg-amber-500/10 text-amber-500 border-amber-500/20';
      default: return 'bg-theme-sub/10 text-theme-sub border-theme-border';
    }
  };

  const filteredToners = useMemo(() => {
    return toners.filter(t => {
      const matchesSearch = 
        t.modelo.toLowerCase().includes(searchTerm.toLowerCase()) || 
        t.ubicacion_estante.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesEstado = filterEstado === 'ALL' || t.estado === filterEstado;
      const matchesSede = filterSede === 'ALL' || t.farmacia_id === filterSede;
      return matchesSearch && matchesEstado && matchesSede;
    });
  }, [searchTerm, filterEstado, filterSede, toners]);

  return (
    <div className="relative space-y-6 animate-in fade-in duration-500 max-w-400 mx-auto p-4">
      
      {/* 🔍 HEADER CON BUSCADOR Y FILTROS */}
      <div className="bg-theme-sidebar/40 p-5 rounded-4xl border border-theme-border/50 shadow-xl backdrop-blur-xl flex flex-col gap-4">
        <div className="flex flex-col lg:flex-row justify-between items-center gap-4">
          <div className="relative w-full lg:w-110 group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-theme-sub group-focus-within:text-theme-accent transition-colors" size={18} />
            <input 
              type="text" 
              placeholder="Buscar por modelo o estante..." 
              className="w-full bg-theme-main/40 border border-theme-border rounded-2xl py-3 pl-12 pr-6 text-sm text-theme-text outline-none focus:border-theme-accent/50 transition-all shadow-inner"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <button 
            onClick={() => setIsModalOpen(true)}
            className="w-full lg:w-auto group bg-theme-text text-theme-main px-6 py-3 rounded-xl font-black text-[10px] uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-theme-accent hover:text-white transition-all shadow-md active:scale-95"
          >
            <Plus size={16} className="group-hover:rotate-90 transition-transform duration-500" /> 
            <span>Nuevo Ingreso</span>
          </button>
        </div>

        <div className="flex flex-wrap items-center gap-3 border-t border-theme-border/20 pt-3">
            <div className="flex items-center gap-2 text-theme-sub mr-2">
                <Filter size={14} />
                <span className="text-[9px] font-black uppercase tracking-widest">Filtros:</span>
            </div>

            {/* Filtro de Estados */}
            <div className="flex bg-theme-main/30 p-1 rounded-xl border border-theme-border/50">
                {(['ALL', 'DISPONIBLE', 'EN_USO', 'AGOTADO'] as const).map((s) => (
                <button
                    key={s}
                    onClick={() => setFilterEstado(s)}
                    className={`px-3 py-1.5 rounded-lg text-[9px] font-black transition-all ${
                    filterEstado === s ? 'bg-theme-text text-theme-main shadow-sm' : 'text-theme-sub hover:text-theme-text'
                    }`}
                >
                    {s === 'ALL' ? 'TODOS' : s}
                </button>
                ))}
            </div>

            {/* Filtro de Sedes - AQUÍ USAMOS setFilterSede */}
            <div className="flex bg-theme-main/30 p-1 rounded-xl border border-theme-border/50">
                {['ALL', '1701', '0301'].map((sede) => (
                <button
                    key={sede}
                    onClick={() => setFilterSede(sede)} // ¡Arreglado!
                    className={`px-3 py-1.5 rounded-lg text-[9px] font-black transition-all ${
                    filterSede === sede ? 'bg-theme-text text-theme-main shadow-sm' : 'text-theme-sub hover:text-theme-text'
                    }`}
                >
                    {sede === 'ALL' ? 'SEDES' : `F-${sede}`}
                </button>
                ))}
            </div>
        </div>
      </div>

      {/* 📊 GRID DE TARJETAS */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredToners.map((toner) => (
          <div key={toner.id} className="bg-theme-sidebar/40 border border-theme-border/50 rounded-4xl p-6 shadow-lg hover:border-theme-accent/30 transition-all group backdrop-blur-sm relative overflow-hidden animate-in fade-in slide-in-from-bottom-2 duration-300">
             {/* Header de la Tarjeta */}
             <div className="flex justify-between items-start mb-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-theme-main/60 rounded-2xl flex items-center justify-center border border-theme-border shadow-inner text-theme-accent group-hover:scale-110 transition-transform">
                  <Droplets size={24} />
                </div>
                <div>
                  <h3 className="text-xl font-black text-theme-text tracking-tighter uppercase italic leading-none">{toner.modelo}</h3>
                  <span className={`inline-block px-2 py-0.5 rounded-md text-[8px] font-black tracking-[0.2em] mt-2 border ${getStatusColor(toner.estado)}`}>
                    {toner.estado}
                  </span>
                </div>
              </div>
              <div className="flex gap-1">
                <button className="p-2 text-theme-sub hover:text-theme-accent transition-colors bg-theme-main/30 rounded-lg"><Edit3 size={14}/></button>
                <button 
                  onClick={() => setToners(toners.filter(t => t.id !== toner.id))}
                  className="p-2 text-theme-sub hover:text-red-500 transition-colors bg-theme-main/30 rounded-lg"
                >
                  <Trash2 size={14}/>
                </button>
              </div>
            </div>

            <div className="space-y-3">
              <div className="p-4 bg-theme-main/40 rounded-3xl border border-theme-border/40 shadow-inner space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-theme-sub">
                    <Bookmark size={14} />
                    <span className="text-[10px] font-black uppercase opacity-60">Compatibilidad</span>
                  </div>
                  <span className="text-[11px] font-bold text-theme-text text-right max-w-140px truncate">{toner.compatibilidad}</span>
                </div>
                <div className="h-px bg-theme-border/30 w-full" />
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-theme-sub">
                    <Layout size={14} />
                    <span className="text-[10px] font-black uppercase opacity-60">Área Destino</span>
                  </div>
                  <span className="text-[11px] font-bold text-theme-accent uppercase">{toner.area_destino}</span>
                </div>
              </div>

              <div className="p-4 bg-theme-accent/5 rounded-3xl border border-theme-accent/10 relative overflow-hidden group/loc transition-colors hover:bg-theme-accent/10">
                <div className="flex items-center gap-3 relative z-10">
                  <div className="p-2 bg-theme-accent text-white rounded-xl shadow-lg">
                    <MapPin size={14} />
                  </div>
                  <div>
                    <span className="text-[9px] font-black text-theme-sub uppercase block leading-none mb-1 opacity-70 italic">Ubicación Estante</span>
                    <span className="text-xs font-mono font-black text-theme-text uppercase tracking-tight">{toner.ubicacion_estante}</span>
                  </div>
                </div>
                <Archive className="absolute -right-2 -bottom-2 text-theme-accent/5 transition-transform group-hover/loc:scale-110" size={64} />
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-theme-border/20 flex items-center justify-between text-theme-sub">
              <div className="flex items-center gap-2 text-[9px] font-black uppercase tracking-widest"><Calendar size={14} className="opacity-50"/> {toner.fecha_registro}</div>
              <div className="text-[10px] font-black uppercase bg-theme-main/50 px-2 py-0.5 rounded-md border border-theme-border">Sede {toner.farmacia_id}</div>
            </div>
          </div>
        ))}
      </div>

      {/* 📥 MODAL DE REGISTRO */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-in fade-in zoom-in duration-300">
          <div className="absolute inset-0 bg-theme-main/80 backdrop-blur-md" onClick={() => setIsModalOpen(false)} />
          
          <div className="relative w-full max-w-2xl bg-theme-sidebar border border-theme-border rounded-4xl shadow-2xl overflow-hidden overflow-y-auto max-h-[90vh]">
            <div className="p-6 border-b border-theme-border flex justify-between items-center bg-theme-main/20">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-theme-accent text-white rounded-xl flex items-center justify-center shadow-lg shadow-theme-accent/20">
                  <Plus size={20} />
                </div>
                <h2 className="text-xl font-black text-theme-text uppercase tracking-tighter italic leading-none">Nuevo Registro</h2>
              </div>
              <button onClick={() => setIsModalOpen(false)} className="p-2 hover:bg-theme-main rounded-full text-theme-sub transition-colors"><X size={20} /></button>
            </div>

            <form onSubmit={handleAddToner} className="p-8 space-y-6">
              <div className="space-y-4">
                <div className="flex items-center gap-2 text-theme-accent mb-2">
                  <Info size={14} />
                  <span className="text-[10px] font-black uppercase tracking-[0.2em]">Detalles Técnicos</span>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-[9px] font-black text-theme-sub uppercase ml-2 tracking-widest">Modelo del Tóner</label>
                    <input name="modelo" required type="text" placeholder="Ej: HP 48A" className="w-full bg-theme-main/50 border border-theme-border rounded-2xl py-3 px-4 text-sm text-theme-text outline-none focus:border-theme-accent transition-all" />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[9px] font-black text-theme-sub uppercase ml-2 tracking-widest">Estado Inicial</label>
                    <select name="estado" className="w-full bg-theme-main/50 border border-theme-border rounded-2xl py-3 px-4 text-sm text-theme-text outline-none focus:border-theme-accent transition-all">
                      <option value="DISPONIBLE">DISPONIBLE</option>
                      <option value="EN_USO">EN USO</option>
                      <option value="AGOTADO">AGOTADO</option>
                    </select>
                  </div>
                </div>
                <div className="space-y-1">
                    <label className="text-[9px] font-black text-theme-sub uppercase ml-2 tracking-widest">Equipos Compatibles</label>
                    <input name="compatibilidad" required type="text" placeholder="Ej: LaserJet M15w..." className="w-full bg-theme-main/50 border border-theme-border rounded-2xl py-3 px-4 text-sm text-theme-text outline-none focus:border-theme-accent transition-all" />
                </div>
              </div>

              <div className="p-5 bg-theme-main/30 rounded-3xl border border-theme-border/50 space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-[9px] font-black text-theme-sub uppercase ml-2 tracking-widest">Sede / Farmacia</label>
                    <input name="farmacia_id" required type="text" placeholder="Ej: 1701" className="w-full bg-theme-sidebar border border-theme-border rounded-xl py-3 px-4 text-sm text-theme-text outline-none focus:border-theme-accent shadow-inner" />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[9px] font-black text-theme-sub uppercase ml-2 tracking-widest">Área Destino</label>
                    <input name="area_destino" required type="text" placeholder="Ej: Caja 1" className="w-full bg-theme-sidebar border border-theme-border rounded-xl py-3 px-4 text-sm text-theme-text outline-none focus:border-theme-accent shadow-inner" />
                  </div>
                </div>
                <div className="space-y-1">
                  <label className="text-[9px] font-black text-theme-sub uppercase ml-2 tracking-widest">Ubicación Física</label>
                  <input name="ubicacion_estante" required type="text" placeholder="Ej: Pasillo A" className="w-full bg-theme-sidebar border border-theme-border rounded-xl py-3 px-4 text-sm text-theme-text outline-none focus:border-theme-accent shadow-inner" />
                </div>
              </div>

              <div className="flex gap-3 pt-2">
                <button type="button" onClick={() => setIsModalOpen(false)} className="flex-1 bg-theme-main border border-theme-border text-theme-sub py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest">Cancelar</button>
                <button type="submit" className="flex-1 bg-theme-text text-theme-main py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-theme-accent hover:text-white transition-all shadow-xl">
                  <Save size={16} /> Registrar Tóner
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
import React, { useState, useEffect, useMemo } from 'react';
import { 
  Plus, Search, Store, 
  Edit3, Trash2,
   Fingerprint,
  Activity, MapPin, Loader2, Navigation, X
} from 'lucide-react';
import { toast } from 'sonner';
import { farmaciaService } from '../../api/service/farmacia.service';

interface Farmacia {
  id: number;
  some_code: string;    
  name_farmcia: string; 
  rif: string;
  direccion: string;
}

export const FarmaciaPage: React.FC = () => {
  // --- ESTADOS ---
  const [showModal, setShowModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [farmacias, setFarmacias] = useState<Farmacia[]>([]);
  
  // Estados para el Modal
  const [selectedFarmacia, setSelectedFarmacia] = useState<Farmacia | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  // --- CARGA DE DATOS ---
  const cargarFarmacias = async () => {
    try {
      setIsLoading(true);
      const response = await farmaciaService.getFarmacias();
      const dataLimpia = response?.data?.response || (Array.isArray(response) ? response : []);
      setFarmacias(dataLimpia);
    } catch (error: any) {
      toast.error("Error de Sincronización", {
        description: "No se pudieron obtener las sedes desde el servidor Pharos."
      });
      setFarmacias([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    cargarFarmacias();
  }, []);

  // --- LÓGICA DE MODAL ---
  const handleOpenCreate = () => {
    setSelectedFarmacia(null);
    setShowModal(true);
  };

  const handleOpenEdit = (f: Farmacia) => {
    setSelectedFarmacia(f);
    setShowModal(true);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    
    // Objeto listo para enviar cuando tengas los endpoints
    const payload = {
      some_code: formData.get('some_code'),
      name_farmcia: formData.get('name_farmcia'),
      rif: formData.get('rif'),
      direccion: formData.get('direccion'),
    };

    setIsSaving(true);
    
    // Simulamos la llamada al API
    setTimeout(() => {
      console.log("Payload enviado:", payload);
      toast.info("Acción simulada", { 
        description: selectedFarmacia ? "Se enviaría un PUT al servidor." : "Se enviaría un POST al servidor." 
      });
      setIsSaving(false);
      setShowModal(false);
    }, 1000);
  };

  // --- FILTRADO ---
  const filteredFarmacias = useMemo(() => {
    return farmacias.filter(f => {
      const search = searchTerm.toLowerCase();
      return (
        f.name_farmcia.toLowerCase().includes(search) ||
        f.some_code.toLowerCase().includes(search) ||
        f.rif.toLowerCase().includes(search) ||
        f.direccion?.toLowerCase().includes(search)
      );
    });
  }, [searchTerm, farmacias]);

  return (
    <div className="space-y-6 animate-in fade-in duration-500 max-w-7xl mx-auto p-4 relative">
      
      {/* 🔍 HEADER CON BUSCADOR */}
      <div className="bg-theme-sidebar/40 p-5 rounded-4xl border border-theme-border/50 shadow-xl backdrop-blur-xl flex flex-col gap-4">
        <div className="flex flex-col lg:flex-row justify-between items-center gap-4">
          <div className="relative w-full lg:w-110 group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-theme-sub group-focus-within:text-theme-accent transition-colors" size={18} />
            <input 
              type="text" 
              placeholder="Buscar por código, nombre, RIF o dirección..." 
              className="w-full bg-theme-main/40 border border-theme-border rounded-2xl py-3 pl-12 pr-6 text-sm text-theme-text outline-none focus:border-theme-accent/50 transition-all shadow-inner"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div className="flex gap-2 w-full lg:w-auto">
             <button 
              onClick={cargarFarmacias}
              className="p-3 bg-theme-main/50 border border-theme-border rounded-xl text-theme-sub hover:text-theme-accent transition-all active:scale-95"
              title="Recargar datos"
            >
              <Activity size={18} className={isLoading ? 'animate-spin text-theme-accent' : ''} />
            </button>
            <button 
              onClick={handleOpenCreate}
              className="flex-1 lg:w-auto group bg-theme-text text-theme-main px-6 py-3 rounded-xl font-black text-[10px] uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-theme-accent hover:text-white transition-all shadow-md active:scale-95"
            >
              <Plus size={16} /> 
              <span>Registrar Sede</span>
            </button>
          </div>
        </div>
      </div>

      {/* 🏥 GRID DE SEDES */}
      {isLoading ? (
        <div className="flex flex-col items-center justify-center py-32 gap-4">
          <Loader2 size={48} className="animate-spin text-theme-accent opacity-50" />
          <p className="text-[10px] font-black text-theme-sub uppercase tracking-[0.4em] animate-pulse">Sincronizando Sedes...</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
          {filteredFarmacias.map((f) => (
            <div key={f.id} className="bg-theme-sidebar/40 border border-theme-border/50 rounded-4xl p-6 shadow-lg hover:border-theme-accent/30 transition-all group backdrop-blur-sm relative overflow-hidden">
              <div className="flex flex-col md:flex-row gap-6 relative z-10">
                <div className="flex flex-col items-center gap-4 min-w-[140px]">
                  <div className="w-24 h-24 rounded-3xl flex items-center justify-center bg-theme-accent/5 border-2 border-dashed border-theme-accent/20 text-theme-accent shadow-inner transition-all group-hover:scale-105 duration-500">
                    <Store size={40} />
                  </div>
                  <div className="text-center bg-theme-main/50 p-3 rounded-2xl border border-theme-border w-full shadow-inner">
                    <span className="text-xl font-mono font-black text-theme-text tracking-tighter">{f.some_code}</span>
                  </div>
                </div>

                <div className="flex-1 space-y-4">
                  <div className="flex justify-between items-start">
                    <div className="max-w-[70%]">
                      <h3 className="text-2xl font-black text-theme-text tracking-tighter uppercase italic leading-none truncate">{f.name_farmcia}</h3>
                      <div className="flex items-start gap-2 mt-2">
                        <MapPin size={14} className="text-theme-accent shrink-0 mt-0.5" />
                        <span className="text-[10px] font-black text-theme-sub uppercase tracking-tighter leading-tight italic">
                          {f.direccion || 'DIRECCIÓN NO REGISTRADA'}
                        </span>
                      </div>
                    </div>
                    <span className="px-4 py-1.5 rounded-full text-[9px] font-black tracking-widest border bg-emerald-500/10 text-emerald-500 border-emerald-500/20">
                      ACTIVA
                    </span>
                  </div>

                  <div className="bg-theme-main/40 p-4 rounded-3xl border border-theme-border shadow-inner">
                      <span className="text-[8px] font-black text-theme-sub uppercase flex items-center gap-1 opacity-60">
                        <Fingerprint size={10} /> RIF FISCAL
                      </span>
                      <p className="text-xs font-mono font-bold text-theme-text">{f.rif || 'J-00000000-0'}</p>
                  </div>

                  <div className="flex gap-2 pt-2">
                    <button 
                      onClick={() => handleOpenEdit(f)}
                      className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-theme-main/60 border border-theme-border text-[9px] font-black text-theme-sub hover:text-theme-accent hover:border-theme-accent/30 rounded-xl transition-all uppercase tracking-widest group/btn shadow-sm"
                    >
                      <Edit3 size={12} /> Modificar
                    </button>
                    <button className="p-2.5 bg-theme-main/60 border border-theme-border text-theme-sub hover:text-red-500 hover:border-red-500/30 rounded-xl transition-all shadow-sm">
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              </div>
              <Navigation className="absolute -right-6 -bottom-6 text-theme-accent/5 group-hover:text-theme-accent/10 transition-colors duration-700 pointer-events-none" size={140} />
            </div>
          ))}
        </div>
      )}

      {/* --- MODAL DE REGISTRO / EDICIÓN --- */}
      {showModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-theme-main/90 backdrop-blur-md animate-in fade-in duration-300">
          <div className="bg-theme-sidebar border border-theme-border w-full max-w-lg rounded-4xl p-8 shadow-2xl relative overflow-hidden">
            {/* Decoración Cyber */}
            <div className="absolute -top-24 -right-24 w-48 h-48 bg-theme-accent/10 rounded-full blur-3xl pointer-events-none" />
            
            <button 
              onClick={() => setShowModal(false)}
              className="absolute top-6 right-6 text-theme-sub hover:text-theme-accent transition-colors z-50"
            >
              <X size={24} />
            </button>

            <div className="relative z-10">
              <h2 className="text-3xl font-black text-theme-text italic uppercase tracking-tighter mb-8 flex items-center gap-3">
                <Store className="text-theme-accent" />
                {selectedFarmacia ? 'Actualizar Sede' : 'Registrar Sede'}
              </h2>

              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-[10px] font-black text-theme-sub uppercase tracking-widest ml-2">Código Sede</label>
                    <input name="some_code" defaultValue={selectedFarmacia?.some_code} required className="w-full bg-theme-main/60 border border-theme-border rounded-2xl p-4 text-theme-text outline-none focus:border-theme-accent/50 transition-all shadow-inner" placeholder="P-001" />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-black text-theme-sub uppercase tracking-widest ml-2">RIF Fiscal</label>
                    <input name="rif" defaultValue={selectedFarmacia?.rif} required className="w-full bg-theme-main/60 border border-theme-border rounded-2xl p-4 text-theme-text outline-none focus:border-theme-accent/50 transition-all shadow-inner" placeholder="J-00000000-0" />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-black text-theme-sub uppercase tracking-widest ml-2">Nombre de la Sede</label>
                  <input name="name_farmcia" defaultValue={selectedFarmacia?.name_farmcia} required className="w-full bg-theme-main/60 border border-theme-border rounded-2xl p-4 text-theme-text outline-none focus:border-theme-accent/50 transition-all shadow-inner" placeholder="Farmacia Principal" />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-black text-theme-sub uppercase tracking-widest ml-2">Dirección Física</label>
                  <textarea name="direccion" defaultValue={selectedFarmacia?.direccion} required className="w-full bg-theme-main/60 border border-theme-border rounded-2xl p-4 text-theme-text outline-none focus:border-theme-accent/50 transition-all shadow-inner min-h-[100px] resize-none" placeholder="Av. Principal..." />
                </div>

                <div className="flex gap-3 pt-4">
                  <button type="button" onClick={() => setShowModal(false)} className="flex-1 py-4 rounded-2xl font-black uppercase text-[11px] tracking-widest text-theme-sub border border-theme-border hover:bg-theme-main/50 transition-all">
                    Descartar
                  </button>
                  <button type="submit" disabled={isSaving} className="flex-2 bg-theme-text text-theme-main py-4 rounded-2xl font-black uppercase text-[11px] tracking-[0.2em] hover:bg-theme-accent hover:text-white transition-all shadow-lg flex items-center justify-center gap-2">
                    {isSaving ? <Loader2 className="animate-spin" size={18} /> : 'Guardar Sede'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Empty State */}
      {!isLoading && filteredFarmacias.length === 0 && (
        <div className="text-center py-32 bg-theme-sidebar/20 rounded-4xl border-2 border-dashed border-theme-border/50">
          <div className="flex flex-col items-center gap-4 opacity-40">
            <Store size={48} className="text-theme-sub" />
            <p className="text-theme-sub text-xs font-black uppercase tracking-[0.3em]">Red de sedes vacía</p>
          </div>
        </div>
      )}
    </div>
  );
};
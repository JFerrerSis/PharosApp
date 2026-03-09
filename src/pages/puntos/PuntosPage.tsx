import React, { useState, useMemo } from 'react';
import {
    CreditCard, Search, Plus, Building2,
    Hash, Activity, Edit2, X, Save,
    Calendar, Info, Landmark, Filter, Trash2
} from 'lucide-react';

// --- INTERFACES ---
interface PuntoVenta {
    terminal_id: string;      
    modelo: string;           
    serial: string;           
    farmacia_id: string;      
    caja_id: number | null;   
    banco_cod: string;        
    estado: 'EN_USO' | 'DISPONIBLE' | 'DAÑADO' | 'EN_REPARACION';
    observaciones: string;    
    fecha_registro: string;   
}

export const PuntosVentaPage: React.FC = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [filterEstado, setFilterEstado] = useState<'ALL' | 'EN_USO' | 'DISPONIBLE' | 'DAÑADO'>('ALL');
    const [isModalOpen, setIsModalOpen] = useState(false);

    // Datos de ejemplo
    const [puntos, setPuntos] = useState<PuntoVenta[]>([
        {
            terminal_id: 'SN87452100',
            modelo: 'PAX A920',
            serial: 'SN87452100',
            farmacia_id: '1701',
            caja_id: 1,
            banco_cod: '0134', 
            estado: 'EN_USO',
            observaciones: 'Equipo en Caja Principal',
            fecha_registro: '2026-02-20'
        },
        {
            terminal_id: 'PP20240506',
            modelo: 'NEW POS 8210',
            serial: 'PP20240506',
            farmacia_id: '1701',
            caja_id: 2,
            banco_cod: '0102', 
            estado: 'DAÑADO',
            observaciones: 'Pantalla rota, requiere servicio',
            fecha_registro: '2026-02-20'
        }
    ]);

    // Lógica de filtrado
    const filteredPuntos = useMemo(() => {
        return puntos.filter(p => {
            const matchesSearch = 
                p.terminal_id.toLowerCase().includes(searchTerm.toLowerCase()) || 
                p.modelo.toLowerCase().includes(searchTerm.toLowerCase()) ||
                p.banco_cod.includes(searchTerm);
            const matchesEstado = filterEstado === 'ALL' || p.estado === filterEstado;
            return matchesSearch && matchesEstado;
        });
    }, [searchTerm, filterEstado, puntos]);

    const getStatusStyles = (estado: string) => {
        switch (estado) {
            case 'EN_USO': return 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20';
            case 'DISPONIBLE': return 'bg-blue-500/10 text-blue-500 border-blue-500/20';
            case 'DAÑADO': return 'bg-red-500/10 text-red-500 border-red-500/20';
            case 'EN_REPARACION': return 'bg-amber-500/10 text-amber-500 border-amber-500/20';
            default: return 'bg-theme-sub/10 text-theme-sub border-theme-border';
        }
    };

    return (
        <div className="space-y-6 animate-in fade-in duration-500 max-w-400 mx-auto p-4">

            {/* 🔍 HEADER UNIFICADO (V4) */}
            <div className="bg-theme-sidebar/40 p-5 rounded-4xl border border-theme-border/50 shadow-xl backdrop-blur-xl flex flex-col gap-4">
                <div className="flex flex-col lg:flex-row justify-between items-center gap-4">
                    <div className="relative w-full lg:w-110 group">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-theme-sub group-focus-within:text-theme-accent transition-colors" size={18} />
                        <input
                            type="text"
                            placeholder="Buscar por Terminal ID, Modelo o Banco..."
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
                        <span>Registrar Punto</span>
                    </button>
                </div>

                <div className="flex flex-wrap items-center gap-3 border-t border-theme-border/20 pt-3">
                    <div className="flex items-center gap-2 text-theme-sub mr-2">
                        <Filter size={14} />
                        <span className="text-[9px] font-black uppercase tracking-widest">Filtros:</span>
                    </div>
                    <div className="flex bg-theme-main/30 p-1 rounded-xl border border-theme-border/50">
                        {(['ALL', 'EN_USO', 'DISPONIBLE', 'DAÑADO'] as const).map((s) => (
                            <button
                                key={s}
                                onClick={() => setFilterEstado(s)}
                                className={`px-3 py-1.5 rounded-lg text-[9px] font-black transition-all ${
                                    filterEstado === s ? 'bg-theme-text text-theme-main shadow-sm' : 'text-theme-sub hover:text-theme-text'
                                }`}
                            >
                                {s === 'ALL' ? 'TODOS' : s.replace('_', ' ')}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {/* 🏧 GRID DE TERMINALES */}
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
                {filteredPuntos.map((punto) => (
                    <div key={punto.terminal_id} className="bg-theme-sidebar/40 border border-theme-border/50 rounded-4xl p-6 shadow-lg hover:border-theme-accent/30 transition-all group backdrop-blur-sm relative overflow-hidden">
                        
                        <div className="flex flex-col md:flex-row gap-6 relative z-10">
                            {/* Bloque Izquierdo: Visual & Banco */}
                            <div className="flex flex-col items-center gap-4 min-w-140px">
                                <div className={`w-24 h-24 rounded-3xl flex items-center justify-center border-2 border-dashed transition-all group-hover:scale-105 duration-500 ${
                                    punto.estado === 'EN_USO' ? 'bg-theme-accent/5 border-theme-accent/20 text-theme-accent shadow-[0_0_20px_rgba(var(--accent),0.1)]' : 'bg-red-500/5 border-red-500/20 text-red-500'
                                }`}>
                                    <CreditCard size={40} />
                                </div>
                                <div className="text-center bg-theme-main/50 p-3 rounded-2xl border border-theme-border w-full shadow-inner">
                                    <div className="flex items-center justify-center gap-1 text-theme-sub mb-1 opacity-60">
                                        <Landmark size={12} />
                                        <span className="text-[9px] font-black uppercase tracking-widest">Cod. Banco</span>
                                    </div>
                                    <span className="text-xl font-mono font-black text-theme-text">{punto.banco_cod}</span>
                                </div>
                            </div>

                            {/* Bloque Derecho: Detalles */}
                            <div className="flex-1 space-y-4">
                                <div className="flex justify-between items-start">
                                    <div>
                                        <h3 className="text-2xl font-black text-theme-text tracking-tighter uppercase italic leading-none">{punto.modelo}</h3>
                                        <div className="flex items-center gap-2 mt-2">
                                            <span className="text-[10px] font-black bg-theme-main border border-theme-border px-3 py-1 rounded-lg text-theme-accent uppercase tracking-tighter">
                                                SERIAL:  {punto.terminal_id}
                                            </span>
                                        </div>
                                    </div>
                                    <span className={`px-4 py-1.5 rounded-full text-[9px] font-black tracking-widest border ${getStatusStyles(punto.estado)}`}>
                                        {punto.estado.replace('_', ' ')}
                                    </span>
                                </div>

                                <div className="grid grid-cols-2 gap-3 bg-theme-main/40 p-4 rounded-3xl border border-theme-border shadow-inner">
                                    <div className="space-y-1">
                                        <span className="text-[8px] font-black text-theme-sub uppercase flex items-center gap-1 opacity-60">
                                            <Hash size={10} /> Serial S/N
                                        </span>
                                        <p className="text-xs font-mono font-bold text-theme-text truncate">{punto.serial}</p>
                                    </div>
                                    <div className="space-y-1 border-l border-theme-border/50 pl-4">
                                        <span className="text-[8px] font-black text-theme-sub uppercase flex items-center gap-1 opacity-60">
                                            <Building2 size={10} /> Ubicación
                                        </span>
                                        <p className="text-xs font-bold text-theme-text uppercase tracking-tighter">S-{punto.farmacia_id} | CAJA {punto.caja_id || 'N/A'}</p>
                                    </div>
                                </div>

                                <div className="flex items-center gap-4 text-theme-sub">
                                    <div className="flex items-center gap-1">
                                        <Calendar size={12} className="opacity-50" />
                                        <span className="text-[9px] font-black uppercase">{punto.fecha_registro}</span>
                                    </div>
                                    <div className="flex items-center gap-1 flex-1 min-w-0">
                                        <Info size={12} className="opacity-50" />
                                        <span className="text-[10px] italic truncate font-medium opacity-80">"{punto.observaciones}"</span>
                                    </div>
                                </div>

                                {/* 🛠️ ACCIONES */}
                                <div className="flex gap-2 pt-2">
                                    <button className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-theme-main/60 border border-theme-border text-[9px] font-black text-theme-sub hover:text-theme-accent hover:border-theme-accent/30 rounded-xl transition-all uppercase tracking-widest group/btn shadow-sm">
                                        <Edit2 size={12} className="group-hover/btn:rotate-12 transition-transform" />
                                        Editar
                                    </button>
                                    <button 
                                        onClick={() => setPuntos(puntos.filter(p => p.terminal_id !== punto.terminal_id))}
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
            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-in fade-in zoom-in duration-300">
                    <div className="absolute inset-0 bg-theme-main/80 backdrop-blur-md" onClick={() => setIsModalOpen(false)} />
                    
                    <div className="relative w-full max-w-2xl bg-theme-sidebar border border-theme-border rounded-4xl shadow-2xl overflow-hidden overflow-y-auto max-h-[90vh]">
                        <div className="p-6 border-b border-theme-border flex justify-between items-center bg-theme-main/20">
                            <div className="flex items-center gap-4">
                                <div className="w-10 h-10 bg-theme-accent text-white rounded-xl flex items-center justify-center shadow-lg shadow-theme-accent/20">
                                    <Plus size={20} />
                                </div>
                                <h2 className="text-xl font-black text-theme-text uppercase tracking-tighter italic leading-none">Registrar Terminal POS</h2>
                            </div>
                            <button onClick={() => setIsModalOpen(false)} className="p-2 hover:bg-theme-main rounded-full text-theme-sub transition-colors"><X size={20} /></button>
                        </div>

                        <form className="p-8 space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-1">
                                    <label className="text-[9px] font-black text-theme-sub uppercase ml-2 tracking-widest">Terminal ID (PK)</label>
                                    <input required type="text" placeholder="Ej: SN87452100" className="w-full bg-theme-main/50 border border-theme-border rounded-2xl py-3 px-4 text-sm text-theme-text outline-none focus:border-theme-accent transition-all shadow-inner" />
                                </div>
                                <div className="space-y-1">
                                    <label className="text-[9px] font-black text-theme-sub uppercase ml-2 tracking-widest">Código Banco</label>
                                    <input required type="text" placeholder="Ej: 0134" className="w-full bg-theme-main/50 border border-theme-border rounded-2xl py-3 px-4 text-sm text-theme-text outline-none focus:border-theme-accent transition-all shadow-inner" />
                                </div>
                                <div className="space-y-1">
                                    <label className="text-[9px] font-black text-theme-sub uppercase ml-2 tracking-widest">Modelo Equipo</label>
                                    <input required type="text" placeholder="Ej: PAX A920" className="w-full bg-theme-main/50 border border-theme-border rounded-2xl py-3 px-4 text-sm text-theme-text outline-none focus:border-theme-accent transition-all shadow-inner" />
                                </div>
                                <div className="space-y-1">
                                    <label className="text-[9px] font-black text-theme-sub uppercase ml-2 tracking-widest">Serial (S/N)</label>
                                    <input required type="text" placeholder="Número de serie" className="w-full bg-theme-main/50 border border-theme-border rounded-2xl py-3 px-4 text-sm text-theme-text outline-none focus:border-theme-accent transition-all shadow-inner" />
                                </div>
                            </div>

                            <div className="p-5 bg-theme-main/30 rounded-3xl border border-theme-border/50 grid grid-cols-2 gap-4">
                                <div className="space-y-1">
                                    <label className="text-[9px] font-black text-theme-sub uppercase ml-2 tracking-widest">Sede Farmacia</label>
                                    <input required type="text" placeholder="Ej: 1701" className="w-full bg-theme-sidebar border border-theme-border rounded-xl py-3 px-4 text-sm text-theme-text outline-none focus:border-theme-accent shadow-inner" />
                                </div>
                                <div className="space-y-1">
                                    <label className="text-[9px] font-black text-theme-sub uppercase ml-2 tracking-widest">Nro. Caja</label>
                                    <input type="number" placeholder="Ej: 1" className="w-full bg-theme-sidebar border border-theme-border rounded-xl py-3 px-4 text-sm text-theme-text outline-none focus:border-theme-accent shadow-inner" />
                                </div>
                            </div>

                            <div className="flex gap-3 pt-2">
                                <button type="button" onClick={() => setIsModalOpen(false)} className="flex-1 bg-theme-main border border-theme-border text-theme-sub py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest">Cancelar</button>
                                <button type="submit" className="flex-1 bg-theme-text text-theme-main py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-theme-accent hover:text-white transition-all shadow-xl">
                                    <Save size={16} /> Guardar Terminal
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};
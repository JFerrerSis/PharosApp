import React, { useState, useMemo } from 'react';
import { 
   Search, User, 
  Clock, Box, Activity, Filter,
  Download,
  CalendarDays,  ChevronRight
} from 'lucide-react';

// Interfaz sincronizada con PostgreSQL
interface Historial {
  id: number;           // [PK] integer
  activo_id: number;    // integer
  detalle_movimiento: string; // text
  usuario: string;      // character varying(50)
  fecha: string;        // timestamp without time zone
}

export const HistorialPage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<'ALL' | 'SISTEMA' | 'USUARIO'>('ALL');

  // Datos de ejemplo
  const [logs] = useState<Historial[]>([
    { 
      id: 1, 
      activo_id: 45, 
      detalle_movimiento: 'CAMBIO DE UBICACIÓN: BODEGA A CAJA 1', 
      usuario: 'joferrer', 
      fecha: '2026-02-20 14:30:00' 
    },
    { 
      id: 2, 
      activo_id: 12, 
      detalle_movimiento: 'MANTENIMIENTO PREVENTIVO COMPLETADO', 
      usuario: 'admin_soporte', 
      fecha: '2026-02-20 11:15:22' 
    }
  ]);

  // Lógica de filtrado unificada
  const filteredLogs = useMemo(() => {
    return logs.filter(log => {
      const matchesSearch = 
        log.detalle_movimiento.toLowerCase().includes(searchTerm.toLowerCase()) ||
        log.usuario.toLowerCase().includes(searchTerm.toLowerCase()) ||
        log.activo_id.toString().includes(searchTerm);
      
      const matchesType = filterType === 'ALL' || 
        (filterType === 'SISTEMA' ? log.usuario.includes('admin') : !log.usuario.includes('admin'));

      return matchesSearch && matchesType;
    });
  }, [searchTerm, filterType, logs]);

  return (
    <div className="space-y-6 animate-in fade-in duration-500 max-w-400 mx-auto p-4">
      
      {/* 🔍 HEADER UNIFICADO (V4) - IGUAL A SEDES Y BANCOS */}
      <div className="bg-theme-sidebar/40 p-5 rounded-4xl border border-theme-border/50 shadow-xl backdrop-blur-xl flex flex-col gap-4">
        <div className="flex flex-col lg:flex-row justify-between items-center gap-4">
          <div className="relative w-full lg:w-110 group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-theme-sub group-focus-within:text-theme-accent transition-colors" size={18} />
            <input 
              type="text" 
              placeholder="Buscar por ID, operador o evento..." 
              className="w-full bg-theme-main/40 border border-theme-border rounded-2xl py-3 pl-12 pr-6 text-sm text-theme-text outline-none focus:border-theme-accent/50 transition-all shadow-inner"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <button 
            className="w-full lg:w-auto group bg-theme-text text-theme-main px-6 py-3 rounded-xl font-black text-[10px] uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-theme-accent hover:text-white transition-all shadow-md active:scale-95"
          >
            <Download size={16} /> 
            <span>Exportar Logs</span>
          </button>
        </div>

        <div className="flex flex-wrap items-center gap-3 border-t border-theme-border/20 pt-3">
          <div className="flex items-center gap-2 text-theme-sub mr-2">
            <Filter size={14} />
            <span className="text-[9px] font-black uppercase tracking-widest">Filtrar Origen:</span>
          </div>
          <div className="flex bg-theme-main/30 p-1 rounded-xl border border-theme-border/50">
            {(['ALL', 'SISTEMA', 'USUARIO'] as const).map((s) => (
              <button
                key={s}
                onClick={() => setFilterType(s)}
                className={`px-3 py-1.5 rounded-lg text-[9px] font-black transition-all ${
                  filterType === s ? 'bg-theme-text text-theme-main shadow-sm' : 'text-theme-sub hover:text-theme-text'
                }`}
              >
                {s === 'ALL' ? 'TODOS' : s}
              </button>
            ))}
          </div>
          <div className="h-4 w-1px bg-theme-border mx-2" />
          <button className="flex items-center gap-2 text-[9px] font-black text-theme-sub uppercase tracking-widest hover:text-theme-accent transition-colors">
            <CalendarDays size={14} />
            Seleccionar Fecha
          </button>
        </div>
      </div>

      {/* 📋 TABLA DE HISTORIAL (Consistente con ADN V4) */}
      <div className="bg-theme-sidebar/40 border border-theme-border/50 rounded-4xl overflow-hidden shadow-2xl backdrop-blur-sm relative">
        <div className="overflow-x-auto relative z-10">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-theme-main/60 border-b border-theme-border">
                <th className="px-6 py-5 text-[10px] font-black text-theme-sub uppercase tracking-[0.2em]">
                   Ref. Log
                </th>
                <th className="px-6 py-5 text-[10px] font-black text-theme-sub uppercase tracking-[0.2em]">ID Activo</th>
                <th className="px-6 py-5 text-[10px] font-black text-theme-sub uppercase tracking-[0.2em]">Evento / Detalle Operativo</th>
                <th className="px-6 py-5 text-[10px] font-black text-theme-sub uppercase tracking-[0.2em]">Operador</th>
                <th className="px-6 py-5 text-[10px] font-black text-theme-sub uppercase tracking-[0.2em] text-right">Marca Temporal</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-theme-border/30">
              {filteredLogs.map((log) => (
                <tr key={log.id} className="hover:bg-theme-accent/5 transition-all group cursor-default">
                  <td className="px-6 py-5">
                    <span className="font-mono text-[11px] text-theme-accent font-black opacity-70 italic">#{log.id.toString().padStart(4, '0')}</span>
                  </td>
                  <td className="px-6 py-5">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-theme-main rounded-lg flex items-center justify-center border border-theme-border shadow-inner group-hover:border-theme-accent/30 transition-colors">
                        <Box size={14} className="text-theme-sub group-hover:text-theme-accent" />
                      </div>
                      <span className="font-mono text-xs font-black text-theme-text tracking-widest">
                        {log.activo_id}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-5">
                    <div className="flex flex-col max-w-md">
                      <span className="text-[11px] font-black text-theme-text uppercase leading-tight group-hover:text-theme-accent transition-colors tracking-tight italic">
                        {log.detalle_movimiento}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-5">
                    <div className="flex items-center gap-2 px-3 py-1.5 bg-theme-main/50 border border-theme-border rounded-xl w-fit shadow-sm group-hover:border-theme-accent/20 transition-all">
                      <User size={12} className="text-theme-accent" />
                      <span className="text-[10px] font-black text-theme-text uppercase tracking-tighter">
                        {log.usuario}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-5 text-right">
                    <div className="flex flex-col items-end">
                      <div className="flex items-center justify-end gap-1.5 text-[11px] font-mono font-black text-theme-text">
                        <Clock size={12} className="text-theme-accent/50" />
                        {log.fecha.split(' ')[0]}
                      </div>
                      <span className="text-[9px] text-theme-sub font-black uppercase tracking-widest opacity-60 mt-1">{log.fecha.split(' ')[1]}</span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Decoración de fondo */}
        <Activity className="absolute -right-10 -bottom-10 text-theme-accent/5 pointer-events-none" size={240} />
      </div>

      {/* 💡 FOOTER ESTATAL */}
      <div className="flex items-center justify-between px-4">
        <div className="flex items-center gap-2">
           <div className="w-2 h-2 rounded-full bg-theme-accent animate-pulse" />
           <span className="text-[9px] font-black text-theme-sub uppercase tracking-[0.2em]">Modo Auditoría Activo</span>
        </div>
        <div className="flex items-center gap-2 text-[9px] font-black text-theme-sub uppercase tracking-widest">
           Mostrando {filteredLogs.length} eventos registrados
           <ChevronRight size={10} className="text-theme-accent" />
        </div>
      </div>
    </div>
  );
};
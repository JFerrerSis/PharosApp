import React, { useState } from 'react';
import { 
  Cpu, Monitor, CreditCard, Plus, 
  Search, Filter, Activity, 
  Layers, Smartphone, LayoutGrid,
  CheckCircle2
} from 'lucide-react';
import { mockEquipos } from '../mocks/inventarioMock';
import type { Equipo } from '../types';

// Sub-componente de tarjeta de equipo optimizado V4 con Indicador de Estado mejorado
const EquipmentCard = ({ label, serial, icon: Icon, active }: any) => (
  <div className={`
    relative overflow-hidden group p-4 rounded-1.5rem border transition-all duration-500
    ${active 
      ? 'bg-theme-main/40 border-theme-border/50 shadow-inner' 
      : 'bg-transparent border-dashed border-theme-border/30'}
  `}>
    <div className="flex items-center justify-between relative z-10">
      <div className="flex items-center gap-4">
        <div className={`
          p-3 rounded-2xl transition-all duration-500
          ${active 
            ? 'bg-theme-accent text-white shadow-lg shadow-theme-accent/20 rotate-0 group-hover:rotate-6' 
            : 'bg-theme-sidebar text-theme-sub/30'}
        `}>
          <Icon size={18} />
        </div>
        <div className="flex flex-col">
          <span className="text-[9px] font-black text-theme-sub uppercase tracking-[0.2em] leading-none mb-1.5 opacity-60">
            {label}
          </span>
          <div className="flex items-center gap-2">
            <span className={`text-xs font-mono font-black tracking-widest ${active ? 'text-theme-text' : 'text-theme-sub/20 italic'}`}>
              {serial || 'S/N ASIGNADO'}
            </span>
            {/* ✨ ESTADO MEJORADO: Ahora es un tag técnico, no un punto feo */}
            {active && (
              <div className="flex items-center gap-1 bg-emerald-500/10 border border-emerald-500/20 px-1.5 py-0.5 rounded-md">
                <div className="w-1 h-1 rounded-full bg-emerald-500 animate-pulse" />
                <span className="text-[7px] font-black text-emerald-500 tracking-tighter uppercase">Live</span>
              </div>
            )}
          </div>
        </div>
      </div>
      
      {/* Icono de validación sutil en el borde derecho */}
      {active && (
        <CheckCircle2 size={14} className="text-emerald-500/40 group-hover:text-emerald-500/80 transition-colors" />
      )}
    </div>
    
    {/* Efecto de barrido de luz al hacer hover */}
    <div className="absolute inset-0 bg-linear-to-r from-transparent via-white/5 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
  </div>
);

export const Dashboard: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const cajas = [1, 2, 3, 4, 5, 6];

  return (
    <div className="space-y-8 animate-in fade-in duration-500 max-w-400 mx-auto p-4">
      
      {/* 🔍 HEADER UNIFICADO */}
      <div className="bg-theme-sidebar/40 p-6 rounded-4xl border border-theme-border/50 shadow-xl backdrop-blur-xl flex flex-col gap-5">
        <div className="flex flex-col lg:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-4 w-full lg:w-auto">
            <div className="w-12 h-12 bg-theme-accent text-white rounded-2xl flex items-center justify-center shadow-lg shadow-theme-accent/30">
              <LayoutGrid size={24} />
            </div>
            <div>
              <h2 className="text-2xl font-black text-theme-text uppercase tracking-tighter italic leading-none">Status de Terminales</h2>
              <p className="text-[9px] text-theme-sub font-black uppercase tracking-[0.2em] mt-1 opacity-70">
                Farmacia <span className="text-theme-accent">F001</span> • Maracaibo
              </p>
            </div>
          </div>

          <div className="relative w-full lg:w-110 group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-theme-sub group-focus-within:text-theme-accent transition-colors" size={18} />
            <input 
              type="text" 
              placeholder="Buscar por Caja, Serial o Banco..." 
              className="w-full bg-theme-main/40 border border-theme-border rounded-2xl py-3.5 pl-12 pr-6 text-sm text-theme-text outline-none focus:border-theme-accent/50 transition-all shadow-inner"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <button className="w-full lg:w-auto group bg-theme-text text-theme-main px-8 py-3.5 rounded-2xl font-black text-[10px] uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-theme-accent hover:text-white transition-all shadow-xl active:scale-95 cursor-pointer">
            <Plus size={18} className="group-hover:rotate-90 transition-transform duration-500" /> 
            <span>Nuevo Registro</span>
          </button>
        </div>

        <div className="flex flex-wrap items-center gap-3 border-t border-theme-border/20 pt-4">
          <div className="flex items-center gap-2 text-theme-sub mr-2">
            <Filter size={14} />
            <span className="text-[9px] font-black uppercase tracking-widest">Vista:</span>
          </div>
          <div className="flex bg-theme-main/30 p-1 rounded-xl border border-theme-border/50">
            {['GRILLA', 'LISTADO', 'MAPA'].map((s) => (
              <button key={s} className={`px-4 py-1.5 rounded-lg text-[9px] font-black transition-all ${s === 'GRILLA' ? 'bg-theme-text text-theme-main shadow-sm' : 'text-theme-sub'}`}>
                {s}
              </button>
            ))}
          </div>
          <div className="ml-auto flex items-center gap-4">
             <div className="flex items-center gap-2 text-[9px] font-black text-theme-sub uppercase">
               <div className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)] animate-pulse" />
               Equipos Online: 18
             </div>
          </div>
        </div>
      </div>

      {/* 🖥️ GRID DE CAJAS */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8 text-theme-text">
        {cajas.map((nro) => {
          const eqCaja = mockEquipos.filter((e: Equipo) => e.caja_id === nro);
          const pc = eqCaja.find(e => e.categoria === 'PC');
          const mon = eqCaja.find(e => e.categoria === 'MONITOR');
          const pos = eqCaja.find(e => e.categoria === 'PUNTO_VENTA');

          return (
            <div key={nro} className="group bg-theme-sidebar/40 backdrop-blur-md border border-theme-border/50 rounded-[3rem] p-8 shadow-2xl hover:border-theme-accent/40 transition-all duration-700 relative overflow-hidden flex flex-col justify-between h-full">
              
              <div className="relative z-10">
                <div className="flex justify-between items-start mb-8">
                  <div className="flex flex-col">
                    <div className="flex items-center gap-2 mb-1">
                      <Layers size={12} className="text-theme-accent" />
                      <span className="text-[10px] font-black text-theme-sub uppercase tracking-[0.2em] opacity-60">Terminal POS</span>
                    </div>
                    <h3 className="text-3xl font-black text-theme-text tracking-tighter italic uppercase leading-none">Caja {nro}</h3>
                  </div>
                  <div className="px-4 py-2 bg-theme-main/60 rounded-2xl text-[11px] font-mono font-black text-theme-accent border border-theme-border shadow-inner">
                    C-{nro.toString().padStart(3, '0')}
                  </div>
                </div>

                <div className="space-y-3">
                  <EquipmentCard label="Unidad de Procesamiento" serial={pc?.serial} icon={Cpu} active={!!pc} />
                  <EquipmentCard label="Interfaz de Salida" serial={mon?.serial} icon={Monitor} active={!!mon} />
                  
                  {pos ? (
                    <div className="relative group/pos mt-6 p-6 bg-theme-text rounded-2rem shadow-2xl overflow-hidden transition-all duration-500 hover:scale-[1.02] border border-theme-border/10">
                      <div className="relative z-10 flex justify-between items-center text-theme-main">
                        <div>
                          <p className="text-[9px] font-black uppercase tracking-[0.2em] mb-1 opacity-60">
                            {pos.banco?.nombre || 'ENTIDAD BANCARIA'}
                          </p>
                          <p className="text-xl font-mono font-black tracking-tight italic uppercase">{pos.serial}</p>
                        </div>
                        <div className="p-3 bg-theme-main/10 rounded-2xl backdrop-blur-md border border-theme-main/10">
                          <CreditCard size={24} className="text-theme-main" />
                        </div>
                      </div>
                      <div className="absolute inset-0 bg-linear-to-tr from-theme-accent/20 to-transparent opacity-0 group-hover/pos:opacity-100 transition-opacity duration-500" />
                    </div>
                  ) : (
                    <button className="w-full mt-6 flex flex-col items-center justify-center gap-2 p-8 border-2 border-dashed border-theme-border/30 rounded-2rem text-theme-sub hover:border-theme-accent hover:text-theme-accent hover:bg-theme-accent/5 transition-all group/btn cursor-pointer">
                      <div className="w-10 h-10 rounded-full bg-theme-main border border-theme-border flex items-center justify-center group-hover/btn:scale-110 transition-transform shadow-inner">
                        <Plus size={20} className="group-hover/btn:rotate-90 transition-transform duration-500" />
                      </div>
                      <span className="text-[10px] font-black uppercase tracking-[0.2em]">Asignar Punto</span>
                    </button>
                  )}
                </div>
              </div>

              {/* Decoración ADN V4 mejor posicionada */}
              <Activity className="absolute -right-12 -top-12 text-theme-accent/5 group-hover:text-theme-accent/10 transition-colors duration-1000 rotate-12" size={220} />
              
              <div className="mt-8 pt-4 border-t border-theme-border/20 flex justify-between items-center relative z-10">
                <div className="flex items-center gap-2">
                  <Smartphone size={12} className="text-theme-sub opacity-40" />
                  <span className="text-[9px] font-black text-theme-sub/40 uppercase tracking-widest">Hardware Homologado</span>
                </div>
                <button className="text-[9px] font-black text-theme-accent uppercase hover:underline transition-all hover:tracking-widest">Configurar</button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
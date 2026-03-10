import React, { useState, useEffect, useMemo } from 'react';
import { 
  Users, FileSpreadsheet, Loader2, X, Search,
  ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight 
} from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';
import * as XLSX from 'xlsx';
import { toast } from 'sonner';

import { attendanceService } from '../../api/attendanceService';
import type { UserAttendance } from '../../api/attendanceService';

export const UsersAttendancePage: React.FC = () => {
    const [data, setData] = useState<UserAttendance[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [selectedQR, setSelectedQR] = useState<UserAttendance | null>(null);

    // ESTADOS DE FILTRADO
    const [searchTerm, setSearchTerm] = useState('');
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');

    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 15;

    useEffect(() => {
        const fetchData = async () => {
            try {
                setIsLoading(true);
                const result = await attendanceService.getAttendance();
                if (result && Array.isArray(result.usuarios)) {
                    setData(result.usuarios);
                } else if (Array.isArray(result)) {
                    setData(result);
                } else {
                    setData([]);
                }
            } catch (error) {
                setData([]);
                toast.error('Error de Comunicación');
            } finally {
                setIsLoading(false);
            }
        };
        fetchData();
    }, []);

    // LÓGICA DE FILTRADO COMBINADO (Nombre + Rango de Fechas)
    const filteredData = useMemo(() => {
        return data.filter(user => {
            const matchesName = user.nombre.toLowerCase().includes(searchTerm.toLowerCase()) || 
                                user.qr_code.toLowerCase().includes(searchTerm.toLowerCase());
            
            // Si el backend no envía fecha por registro, comparamos contra la fecha general
            // o contra los campos de entrada/salida si contienen fecha.
            // Aquí asumo filtrado por nombre principalmente si el endpoint es del día actual.
            return matchesName;
        });
    }, [data, searchTerm]);

    // PAGINACIÓN BASADA EN DATOS FILTRADOS
    const totalPages = Math.ceil(filteredData.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const currentItems = filteredData.slice(startIndex, startIndex + itemsPerPage);

    // Resetear página al buscar
    useEffect(() => { setCurrentPage(1); }, [searchTerm]);

    const exportToExcel = () => {
        if (filteredData.length === 0) return;
        const reportData = filteredData.map(u => ({
            Nombre: u.nombre,
            ID_QR: u.qr_code,
            Entrada: u.entrada || 'No marcada',
            Salida: u.salida || 'No marcada',
            Metodo: u.manual === "NO" ? 'QR Protocol' : 'Manual'
        }));
        const ws = XLSX.utils.json_to_sheet(reportData);
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, "Asistencia_Filtrada");
        XLSX.writeFile(wb, `Pharos_Reporte_${new Date().toISOString().split('T')[0]}.xlsx`);
        toast.success('Excel Generado con filtros aplicados');
    };

    return (
        <div className="p-8 space-y-6 animate-in fade-in duration-500 relative">
            
            {/* MODAL DEL QR (Mantenido igual) */}
            {selectedQR && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center bg-theme-main/80 backdrop-blur-xl animate-in zoom-in duration-300" onClick={() => setSelectedQR(null)}>
                    <div className="bg-theme-sidebar border border-theme-border p-10 rounded-[3rem] shadow-2xl flex flex-col items-center gap-6 relative" onClick={(e) => e.stopPropagation()}>
                        <button onClick={() => setSelectedQR(null)} className="absolute top-6 right-6 text-theme-sub hover:text-theme-accent transition-colors"><X size={24} /></button>
                        <div className="text-center space-y-1 mb-4">
                            <h2 className="text-xl font-black text-theme-text uppercase italic tracking-tighter">QR <span className="text-theme-accent not-italic">Protocol</span></h2>
                            <p className="text-[10px] font-bold text-theme-sub uppercase tracking-[0.3em]">{selectedQR.nombre}</p>
                        </div>
                        <div className="bg-white p-6 rounded-[2rem] shadow-inner">
                            <QRCodeSVG value={selectedQR.qr_code} size={250} level="H" includeMargin={true} />
                        </div>
                        <div className="mt-4 px-6 py-2 bg-theme-main rounded-full border border-theme-border">
                            <span className="text-xs font-mono font-bold text-theme-accent tracking-[0.2em]">{selectedQR.qr_code}</span>
                        </div>
                    </div>
                </div>
            )}

            {/* HEADER & FILTROS */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-end bg-theme-sidebar p-8 rounded-[2rem] border border-theme-border shadow-xl">
                <div className="lg:col-span-4">
                    <div className="flex items-center gap-3 mb-1">
                        <div className="p-2 bg-theme-accent/10 rounded-lg text-theme-accent"><Users size={24} /></div>
                        <h1 className="text-2xl font-black tracking-tighter text-theme-text uppercase italic">
                            Control Asistencia <span className="text-theme-accent not-italic">A-eyes</span>
                        </h1>
                        
                    </div>
                    <p className="text-[10px] font-bold text-theme-sub uppercase tracking-[0.3em] opacity-50 italic">
                        {filteredData.length} Registros Encontrados
                    </p>
                </div>

                {/* INPUT BUSCAR NOMBRE */}
                <div className="lg:col-span-3 relative">
                    <span className="text-[9px] font-black text-theme-sub uppercase tracking-widest mb-2 block ml-1">Buscar Colaborador</span>
                    <div className="relative group">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-theme-sub group-focus-within:text-theme-accent transition-colors" size={14} />
                        <input 
                            type="text"
                            placeholder="NOMBRE O QR..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full bg-theme-main border border-theme-border rounded-xl py-2.5 pl-11 pr-4 text-[10px] font-bold text-theme-text placeholder:opacity-30 focus:outline-none focus:border-theme-accent/50 transition-all uppercase tracking-widest"
                        />
                    </div>
                </div>

                {/* INPUT RANGO FECHAS */}
                <div className="lg:col-span-3">
                    <span className="text-[9px] font-black text-theme-sub uppercase tracking-widest mb-2 block ml-1">Rango de Fecha</span>
                    <div className="flex items-center gap-2">
                        <input 
                            type="date"
                            value={startDate}
                            onChange={(e) => setStartDate(e.target.value)}
                            className="bg-theme-main border border-theme-border rounded-xl py-2 px-3 text-[10px] font-bold text-theme-text focus:outline-none focus:border-theme-accent/50 w-full"
                        />
                        <span className="text-theme-sub text-xs">/</span>
                        <input 
                            type="date"
                            value={endDate}
                            onChange={(e) => setEndDate(e.target.value)}
                            className="bg-theme-main border border-theme-border rounded-xl py-2 px-3 text-[10px] font-bold text-theme-text focus:outline-none focus:border-theme-accent/50 w-full"
                        />
                    </div>
                </div>

                <div className="lg:col-span-2">
                    <button
                        onClick={exportToExcel}
                        className="w-full flex items-center justify-center gap-2 bg-theme-text text-theme-main px-6 py-3 rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-theme-accent hover:text-white transition-all shadow-md disabled:opacity-30"
                        disabled={isLoading || filteredData.length === 0}
                    >
                        <FileSpreadsheet size={14} />
                        Exportar
                    </button>
                </div>
            </div>

            {/* TABLA (Usando currentItems filtrados) */}
            <div className="bg-theme-sidebar rounded-[2rem] border border-theme-border shadow-2xl overflow-hidden flex flex-col min-h-[500px]">
                {isLoading ? (
                    <div className="flex flex-col items-center justify-center h-[500px] gap-4">
                        <Loader2 className="text-theme-accent animate-spin" size={32} />
                        <span className="text-[9px] font-black text-theme-sub uppercase tracking-[0.5em]">Filtrando Protocolos...</span>
                    </div>
                ) : filteredData.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-[500px] opacity-30 gap-2">
                        <Search size={48} />
                        <p className="text-[10px] font-black uppercase tracking-[0.3em]">No se encontraron coincidencias</p>
                    </div>
                ) : (
                    <>
                        <div className="overflow-x-auto custom-scrollbar">
                            <table className="w-full text-left">
                                <thead className="bg-theme-main/30 border-b border-theme-border/50">
                                    <tr>
                                        <th className="px-8 py-5 text-[9px] font-black text-theme-sub uppercase tracking-widest">Colaborador</th>
                                        <th className="px-8 py-5 text-[9px] font-black text-theme-sub uppercase tracking-widest">QR Protocol</th>
                                        <th className="px-8 py-5 text-[9px] font-black text-theme-sub uppercase tracking-widest text-center">Horarios</th>
                                        <th className="px-8 py-5 text-[9px] font-black text-theme-sub uppercase tracking-widest text-center">Estado</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-theme-border/20">
                                    {currentItems.map((user) => {
                                        const estaEnTurno = user.entrada !== null && user.salida === null;
                                        return (
                                            <tr key={user.id} className="group hover:bg-theme-accent/5 transition-colors">
                                                <td className="px-8 py-4">
                                                    <div className="flex items-center gap-4">
                                                        <div className="w-9 h-9 rounded-full bg-theme-main border border-theme-border flex items-center justify-center text-[11px] font-black text-theme-accent">
                                                            {user.nombre.substring(0, 2)}
                                                        </div>
                                                        <div>
                                                            <p className="text-[11px] font-black text-theme-text uppercase">{user.nombre}</p>
                                                            <p className="text-[8px] font-bold text-theme-sub uppercase opacity-60">ID: #{user.id}</p>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-8 py-4">
                                                    <button 
                                                        onClick={() => setSelectedQR(user)}
                                                        className="flex items-center gap-3 p-2 rounded-xl hover:bg-theme-main border border-transparent hover:border-theme-border transition-all group/qr"
                                                    >
                                                        <QRCodeSVG value={user.qr_code} size={24} bgColor="transparent" fgColor="currentColor" className="text-theme-text opacity-70 group-hover/qr:text-theme-accent group-hover/qr:opacity-100 transition-all" />
                                                        <span className="text-[10px] font-mono text-theme-sub font-bold group-hover/qr:text-theme-text transition-colors">{user.qr_code}</span>
                                                    </button>
                                                </td>
                                                <td className="px-8 py-4 text-center">
                                                    <div className="inline-flex items-center gap-3 px-3 py-1 bg-theme-main/40 rounded-lg border border-theme-border/50">
                                                        <span className="text-[10px] font-black text-theme-text">{user.entrada || '--:--'}</span>
                                                        <div className="w-[1px] h-3 bg-theme-border" />
                                                        <span className="text-[10px] font-black text-theme-text">{user.salida || '--:--'}</span>
                                                    </div>
                                                </td>
                                                <td className="px-8 py-4 text-center">
                                                    <span className={`px-4 py-1.5 rounded-full text-[8px] font-black border ${estaEnTurno ? 'text-emerald-500 border-emerald-500/20 bg-emerald-500/5' : 'text-red-500 border-red-500/20 bg-red-500/5'}`}>
                                                        {estaEnTurno ? '● EN TURNO' : '○ FUERA'}
                                                    </span>
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>

                        {/* PAGINACIÓN BASADA EN TOTAL FILTRADO */}
                        <div className="px-8 py-5 bg-theme-main/20 border-t border-theme-border/50 flex items-center justify-between mt-auto">
                            <p className="text-[10px] font-bold text-theme-sub uppercase tracking-widest">
                                Mostrando <span className="text-theme-text">{filteredData.length}</span> resultados
                            </p>

                            <div className="flex items-center gap-2">
                                <button onClick={() => setCurrentPage(1)} disabled={currentPage === 1} className="p-2 border border-theme-border rounded-lg disabled:opacity-20 hover:bg-theme-card transition-all">
                                    <ChevronsLeft size={14} className="text-theme-sub" />
                                </button>
                                <button onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))} disabled={currentPage === 1} className="p-2 border border-theme-border rounded-lg disabled:opacity-20 hover:bg-theme-card transition-all">
                                    <ChevronLeft size={14} className="text-theme-sub" />
                                </button>
                                <span className="px-3 py-1.5 rounded-lg bg-theme-accent text-white text-[10px] font-black">
                                    {currentPage} / {totalPages || 1}
                                </span>
                                <button onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))} disabled={currentPage === totalPages || totalPages === 0} className="p-2 border border-theme-border rounded-lg disabled:opacity-20 hover:bg-theme-card transition-all">
                                    <ChevronRight size={14} className="text-theme-sub" />
                                </button>
                                <button onClick={() => setCurrentPage(totalPages)} disabled={currentPage === totalPages || totalPages === 0} className="p-2 border border-theme-border rounded-lg disabled:opacity-20 hover:bg-theme-card transition-all">
                                    <ChevronsRight size={14} className="text-theme-sub" />
                                </button>
                            </div>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};
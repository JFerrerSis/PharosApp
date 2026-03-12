import React, { useState, useEffect, useMemo } from 'react';
import { 
  Users, FileSpreadsheet, Loader2, X, Search,
  ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight,
  MapPin, Briefcase, Calendar, Fingerprint
} from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';
import * as XLSX from 'xlsx';
import { toast } from 'sonner';
import { asistenciaService, type Analista } from '../../api/service/asistencia.service';export const UsersAttendancePage: React.FC = () => {
    const [data, setData] = useState<Analista[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    
    // Estados para Modales
    const [selectedAnalista, setSelectedAnalista] = useState<Analista | null>(null);
    const [showQR, setShowQR] = useState<Analista | null>(null);

    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;

    useEffect(() => {
        const fetchData = async () => {
            try {
                setIsLoading(true);
                const result = await asistenciaService.getAnalistas();
                setData(result);
            } catch (error) {
                toast.error('Error de Comunicación con el servidor de analistas');
            } finally {
                setIsLoading(false);
            }
        };
        fetchData();
    }, []);

    const filteredData = useMemo(() => {
        return data.filter(u => 
            u.nombre.toLowerCase().includes(searchTerm.toLowerCase()) || 
            u.codigo.includes(searchTerm) ||
            u.localidad.toLowerCase().includes(searchTerm.toLowerCase())
        );
    }, [data, searchTerm]);

    const totalPages = Math.ceil(filteredData.length / itemsPerPage);
    const currentItems = filteredData.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

    const exportToExcel = () => {
        const report = filteredData.map(u => ({
            Nombre: u.nombre,
            Código: u.codigo,
            Cargo: u.cargo,
            Localidad: u.localidad,
            Registro: new Date(u.fecha_registro).toLocaleString()
        }));
        const ws = XLSX.utils.json_to_sheet(report);
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, "Analistas");
        XLSX.writeFile(wb, "Reporte_Analistas_Pharos.xlsx");
    };

    return (
        <div className="p-8 space-y-6 animate-in fade-in duration-500 max-w-7xl mx-auto">
            
            {/* --- MODAL DE DETALLE COMPLETO --- */}
            {selectedAnalista && (
                <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-theme-main/90 backdrop-blur-md animate-in fade-in duration-300">
                    <div className="bg-theme-sidebar border border-theme-border w-full max-w-2xl rounded-[3rem] p-10 shadow-2xl relative overflow-hidden">
                        <div className="absolute top-0 left-0 w-full h-2 bg-theme-accent"></div>
                        <button onClick={() => setSelectedAnalista(null)} className="absolute top-8 right-8 text-theme-sub hover:text-theme-accent transition-colors">
                            <X size={24} />
                        </button>

                        <div className="flex flex-col md:flex-row gap-8 items-center md:items-start">
                            <div className="w-32 h-32 rounded-3xl bg-theme-accent/10 flex items-center justify-center text-theme-accent border-2 border-theme-accent/20">
                                <Users size={60} />
                            </div>
                            
                            <div className="flex-1 space-y-6 text-center md:text-left">
                                <div>
                                    <h2 className="text-3xl font-black text-theme-text uppercase italic tracking-tighter leading-none">{selectedAnalista.nombre}</h2>
                                    <span className="text-theme-accent font-black text-[10px] tracking-[0.3em] uppercase">Status: Verificado</span>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="bg-theme-main/50 p-4 rounded-2xl border border-theme-border">
                                        <p className="text-[8px] font-black text-theme-sub uppercase tracking-widest mb-1 flex items-center gap-2"><Briefcase size={10}/> Cargo</p>
                                        <p className="text-xs font-bold text-theme-text">{selectedAnalista.cargo}</p>
                                    </div>
                                    <div className="bg-theme-main/50 p-4 rounded-2xl border border-theme-border">
                                        <p className="text-[8px] font-black text-theme-sub uppercase tracking-widest mb-1 flex items-center gap-2"><MapPin size={10}/> Localidad</p>
                                        <p className="text-xs font-bold text-theme-text">{selectedAnalista.localidad} ({selectedAnalista.localidad_codigo})</p>
                                    </div>
                                    <div className="bg-theme-main/50 p-4 rounded-2xl border border-theme-border">
                                        <p className="text-[8px] font-black text-theme-sub uppercase tracking-widest mb-1 flex items-center gap-2"><Fingerprint size={10}/> Código ID</p>
                                        <p className="text-xs font-mono font-bold text-theme-text">{selectedAnalista.codigo}</p>
                                    </div>
                                    <div className="bg-theme-main/50 p-4 rounded-2xl border border-theme-border">
                                        <p className="text-[8px] font-black text-theme-sub uppercase tracking-widest mb-1 flex items-center gap-2"><Calendar size={10}/> Registro</p>
                                        <p className="text-xs font-bold text-theme-text">{new Date(selectedAnalista.fecha_registro).toLocaleDateString()}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* --- MODAL QR (REDUCIDO) --- */}
            {showQR && (
                <div className="fixed inset-0 z-[120] flex items-center justify-center bg-theme-main/60 backdrop-blur-sm animate-in zoom-in duration-300" onClick={() => setShowQR(null)}>
                    <div className="bg-white p-8 rounded-[3rem] shadow-2xl flex flex-col items-center gap-4" onClick={e => e.stopPropagation()}>
                        <QRCodeSVG value={showQR.qr_code} size={200} />
                        <span className="text-[10px] font-mono font-black text-slate-400">{showQR.qr_code}</span>
                    </div>
                </div>
            )}

            {/* --- HEADER --- */}
            <div className="bg-theme-sidebar p-8 rounded-[2.5rem] border border-theme-border shadow-xl flex flex-col md:flex-row justify-between items-center gap-6">
                <div>
                    <h1 className="text-3xl font-black tracking-tighter text-theme-text uppercase italic">
                        Analistas <span className="text-theme-accent not-italic">A-Eyes</span>
                    </h1>
                    <p className="text-[10px] font-bold text-theme-sub uppercase tracking-[0.4em] opacity-50">Base de Datos de Protocolo</p>
                </div>

                <div className="flex gap-4 w-full md:w-auto">
                    <div className="relative flex-1 md:w-80 group">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-theme-sub group-focus-within:text-theme-accent transition-colors" size={16} />
                        <input 
                            type="text"
                            placeholder="BUSCAR ANALISTA O LOCALIDAD..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full bg-theme-main border border-theme-border rounded-2xl py-3 pl-12 pr-4 text-[10px] font-black text-theme-text focus:outline-none focus:border-theme-accent/50 transition-all uppercase tracking-widest shadow-inner"
                        />
                    </div>
                    <button onClick={exportToExcel} className="p-4 bg-theme-text text-theme-main rounded-2xl hover:bg-theme-accent hover:text-white transition-all shadow-lg active:scale-95">
                        <FileSpreadsheet size={20} />
                    </button>
                </div>
            </div>

            {/* --- TABLA --- */}
            <div className="bg-theme-sidebar rounded-[2.5rem] border border-theme-border shadow-2xl overflow-hidden min-h-[600px] flex flex-col">
                {isLoading ? (
                    <div className="flex-1 flex flex-col items-center justify-center gap-4">
                        <Loader2 className="text-theme-accent animate-spin" size={40} />
                        <span className="text-[10px] font-black text-theme-sub uppercase tracking-[0.5em]">Sincronizando Analistas...</span>
                    </div>
                ) : (
                    <>
                        <div className="overflow-x-auto">
                            <table className="w-full text-left">
                                <thead className="bg-theme-main/30 border-b border-theme-border/50">
                                    <tr>
                                        <th className="px-10 py-6 text-[10px] font-black text-theme-sub uppercase tracking-widest">Información Personal</th>
                                        <th className="px-10 py-6 text-[10px] font-black text-theme-sub uppercase tracking-widest">Cargo & Nivel</th>
                                        <th className="px-10 py-6 text-[10px] font-black text-theme-sub uppercase tracking-widest">Localidad Asignada</th>
                                        <th className="px-10 py-6 text-[10px] font-black text-theme-sub uppercase tracking-widest text-center">Acciones</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-theme-border/10">
                                    {currentItems.map((analista) => (
                                        <tr 
                                            key={analista.id} 
                                            className="group hover:bg-theme-accent/[0.02] transition-colors cursor-pointer"
                                            onClick={() => setSelectedAnalista(analista)}
                                        >
                                            <td className="px-10 py-5">
                                                <div className="flex items-center gap-5">
                                                    <div className="w-12 h-12 rounded-2xl bg-theme-main flex items-center justify-center text-theme-accent border border-theme-border font-black text-sm">
                                                        {analista.nombre.substring(0, 2)}
                                                    </div>
                                                    <div>
                                                        <p className="text-sm font-black text-theme-text uppercase tracking-tighter group-hover:text-theme-accent transition-colors">{analista.nombre}</p>
                                                        <p className="text-[9px] font-mono text-theme-sub font-bold">ID: {analista.codigo}</p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-10 py-5">
                                                <div className="flex flex-col">
                                                    <span className="text-[10px] font-black text-theme-text uppercase">{analista.cargo}</span>
                                                    <span className="text-[9px] font-bold text-theme-sub uppercase opacity-50 tracking-tighter">Nivel Operativo</span>
                                                </div>
                                            </td>
                                            <td className="px-10 py-5">
                                                <div className="flex items-center gap-2">
                                                    <MapPin size={12} className="text-theme-accent" />
                                                    <span className="text-[10px] font-black text-theme-text uppercase italic">{analista.localidad}</span>
                                                </div>
                                            </td>
                                            <td className="px-10 py-5 text-center" onClick={e => e.stopPropagation()}>
                                                <button 
                                                    onClick={() => setShowQR(analista)}
                                                    className="p-3 bg-theme-main rounded-xl border border-theme-border text-theme-sub hover:text-theme-accent hover:border-theme-accent/30 transition-all shadow-sm group/qr"
                                                >
                                                    <QRCodeSVG value={analista.qr_code} size={20} className="opacity-50 group-hover/qr:opacity-100" />
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        {/* --- PAGINACIÓN --- */}
                        <div className="mt-auto px-10 py-6 border-t border-theme-border/50 flex items-center justify-between">
                            <p className="text-[10px] font-black text-theme-sub uppercase tracking-widest">
                                <span className="text-theme-text">{filteredData.length}</span> Analistas en red
                            </p>
                            <div className="flex items-center gap-2">
                                <button onClick={() => setCurrentPage(1)} disabled={currentPage === 1} className="p-2 border border-theme-border rounded-xl disabled:opacity-20 hover:bg-theme-main transition-all">
                                    <ChevronsLeft size={16} />
                                </button>
                                <button onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))} disabled={currentPage === 1} className="p-2 border border-theme-border rounded-xl disabled:opacity-20 hover:bg-theme-main transition-all">
                                    <ChevronLeft size={16} />
                                </button>
                                <span className="px-4 py-2 bg-theme-text text-theme-main rounded-xl text-[10px] font-black italic">
                                    {currentPage} / {totalPages || 1}
                                </span>
                                <button onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))} disabled={currentPage === totalPages} className="p-2 border border-theme-border rounded-xl disabled:opacity-20 hover:bg-theme-main transition-all">
                                    <ChevronRight size={16} />
                                </button>
                                <button onClick={() => setCurrentPage(totalPages)} disabled={currentPage === totalPages} className="p-2 border border-theme-border rounded-xl disabled:opacity-20 hover:bg-theme-main transition-all">
                                    <ChevronsRight size={16} />
                                </button>
                            </div>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};
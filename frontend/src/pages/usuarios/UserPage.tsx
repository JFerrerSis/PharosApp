import React, { useState, useMemo, useEffect } from 'react';
import {
  Plus, Search, ShieldCheck, X, Trash2, UserCog, Eye, EyeOff,
  MapPin, Filter, Save, Loader2
} from 'lucide-react';

import type { Usuario, Farmacia, CreateUserDTO } from '../../types/usuarios';
import { authService } from '../../api/authService';

export const UserPage: React.FC = () => {
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);
  const [farmaciasDB, setFarmaciasDB] = useState<Farmacia[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  const [showModal, setShowModal] = useState(false);
  const [showPass, setShowPass] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterRol, setFilterRol] = useState<'ALL' | 'ADMIN' | 'SOPORTE'>('ALL');
  const [filterStatus, setFilterStatus] = useState<'ALL' | 'ACTIVE' | 'INACTIVE'>('ALL');

  const [formData, setFormData] = useState<CreateUserDTO>({
    codusuario: '',
    nombre: '',
    email: '',
    password_hash: '',
    rol: 'SOPORTE',
    sedes_seleccionadas: []
  });

  const loadInitialData = async () => {
    try {
      setIsLoading(true);
      const [users, branches] = await Promise.all([
        authService.getUsuarios(),
        authService.getFarmacias()
      ]);
      setUsuarios(users);
      setFarmaciasDB(branches);
    } catch (error) {
      console.error("Error al sincronizar con el Backend");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => { loadInitialData(); }, []);

  const handleCreateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.sedes_seleccionadas.length === 0) {
      alert("Debes asignar al menos una sede de la lista.");
      return;
    }
    try {
      setIsSaving(true);
      await authService.createUsuario(formData);
      await loadInitialData();
      setShowModal(false);
      resetForm();
    } catch (error) {
      alert("Error al intentar guardar el registro en PharosDB.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (codusuario: string) => {
    if (!confirm(`¿Está seguro de revocar acceso al ID: ${codusuario}?`)) return;
    try {
      await authService.deleteUsuario(codusuario);
      setUsuarios(prev => prev.filter(u => u.codusuario !== codusuario));
    } catch (error) {
      alert("No se pudo completar la eliminación.");
    }
  };

  const toggleSede = (id: string) => {
    setFormData(prev => ({
      ...prev,
      sedes_seleccionadas: prev.sedes_seleccionadas.includes(id)
        ? prev.sedes_seleccionadas.filter(s => s !== id)
        : [...prev.sedes_seleccionadas, id]
    }));
  };

  const resetForm = () => {
    setFormData({ codusuario: '', nombre: '', email: '', password_hash: '', rol: 'SOPORTE', sedes_seleccionadas: [] });
  };

  const filteredUsers = useMemo(() => {
    return usuarios.filter(u => {
      const matchesSearch = u.nombre.toLowerCase().includes(searchTerm.toLowerCase()) || u.codusuario.includes(searchTerm);
      const matchesRol = filterRol === 'ALL' || u.rol === filterRol;
      const matchesStatus = filterStatus === 'ALL' || (filterStatus === 'ACTIVE' ? u.activo : !u.activo);
      return matchesSearch && matchesRol && matchesStatus;
    });
  }, [searchTerm, filterRol, filterStatus, usuarios]);

  return (
     <div className="space-y-6 max-w-1400px mx-auto p-4 animate-in fade-in duration-500 transform scale-[0.98] origin-top">

      {/* 🔍 HEADER */}
      <div className="bg-theme-sidebar/40 p-5 rounded-[2.5rem] border border-theme-border/50 shadow-2xl backdrop-blur-xl flex flex-col gap-4">
        <div className="flex flex-col lg:flex-row justify-between items-center gap-4">
          <div className="relative w-full lg:w-450px group">
            <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-theme-sub" size={18} />
            <input
              type="text"
              placeholder="Buscar por cédula o nombre..."
              className="w-full bg-theme-main/40 border border-theme-border rounded-xl py-3.5 pl-12 pr-6 text-sm text-theme-text outline-none focus:border-theme-accent/40 shadow-inner"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <button
            onClick={() => { resetForm(); setShowModal(true); }}
            className="w-full lg:w-auto bg-theme-text text-theme-main px-6 py-3.5 rounded-xl font-black text-[11px] uppercase tracking-widest flex items-center justify-center gap-3 hover:bg-theme-accent hover:text-white transition-all shadow-xl active:scale-95"
          >
            <Plus size={18} /> Nuevo Acceso
          </button>
        </div>

        <div className="flex flex-wrap items-center gap-4 border-t border-theme-border/20 pt-4">
          <div className="flex items-center gap-2 text-theme-sub mr-2">
            <Filter size={14} className="opacity-50" />
            <span className="text-[9px] font-black uppercase tracking-widest italic">Filtros:</span>
          </div>

          {/* Filtro por Rol */}
          <div className="flex bg-theme-main/40 p-1 rounded-lg border border-theme-border/40">
            {(['ALL', 'ADMIN', 'SOPORTE'] as const).map((r) => (
              <button key={r} onClick={() => setFilterRol(r)}
                className={`px-3 py-1.5 rounded-md text-[9px] font-black transition-all ${filterRol === r ? 'bg-theme-text text-theme-main shadow-md' : 'text-theme-sub hover:text-theme-text'}`}>
                {r === 'ALL' ? 'TODOS' : r}
              </button>
            ))}
          </div>

          {/* ✅ NUEVO: Filtro por status */}
          <div className="flex bg-theme-main/40 p-1 rounded-lg border border-theme-border/40">
            {(['ALL', 'ACTIVE', 'INACTIVE'] as const).map((s) => (
              <button key={s} onClick={() => setFilterStatus(s)}
                className={`px-3 py-1.5 rounded-md text-[9px] font-black transition-all ${filterStatus === s ? 'bg-theme-accent text-white shadow-md' : 'text-theme-sub hover:text-theme-text'}`}>
                {s === 'ALL' ? 'ESTADO' : s === 'ACTIVE' ? 'ACTIVOS' : 'REVOCADOS'}
              </button>
            ))}
          </div>

          <div className="ml-auto flex items-center gap-2 bg-theme-accent/5 border border-theme-accent/10 px-3 py-1.5 rounded-lg">
            <div className="w-1 h-1 rounded-full bg-theme-accent animate-pulse" />
            <span className="text-[9px] font-black text-theme-accent uppercase tracking-widest">
              Registros: {filteredUsers.length}
            </span>
          </div>
        </div>
      </div>

      {/* 📊 DATA TABLE */}
      <div className="bg-theme-sidebar/30 border border-theme-border/50 rounded-[2.5rem] overflow-hidden shadow-2xl backdrop-blur-sm">
        <div className="overflow-x-auto">
          {isLoading ? (
            <div className="flex flex-col items-center py-24 gap-4">
              <Loader2 className="animate-spin text-theme-accent" size={32} />
              <p className="text-[9px] font-black uppercase text-theme-sub tracking-[0.4em]">Sincronizando...</p>
            </div>
          ) : (
            <table className="w-full text-left">
              <thead>
                <tr className="bg-theme-main/60 border-b border-theme-border/50">
                  <th className="px-8 py-5 text-[9px] font-black text-theme-sub uppercase tracking-[0.2em]">Usuario</th>
                  <th className="px-8 py-5 text-[9px] font-black text-theme-sub uppercase tracking-[0.2em]">Sedes</th>
                  <th className="px-8 py-5 text-[9px] font-black text-theme-sub uppercase tracking-[0.2em] text-center">Estatus</th>
                  <th className="px-8 py-5 text-[9px] font-black text-theme-sub uppercase tracking-[0.2em] text-center">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-theme-border/10">
                {filteredUsers.length > 0 ? filteredUsers.map((u) => (
                  <tr key={u.codusuario} className="hover:bg-theme-accent/5 transition-all group">
                    <td className="px-8 py-5">
                      <div className="flex items-center gap-4">
                        <div className="w-11 h-11 rounded-xl bg-theme-main/80 border border-theme-border flex items-center justify-center text-theme-accent shadow-inner group-hover:bg-theme-accent group-hover:text-white transition-colors">
                          <ShieldCheck size={22} />
                        </div>
                        <div className="flex flex-col">
                          <span className="font-mono text-[9px] font-black text-theme-accent/70 uppercase leading-none mb-1">ID: {u.codusuario}</span>
                          <p className="text-base font-black text-theme-text uppercase italic tracking-tight">{u.nombre}</p>
                          <span className="text-[10px] text-theme-sub font-medium">{u.email}</span>
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-5">
                      <div className="flex flex-wrap gap-1.5 max-w-280px">
                        {u.farmacias_asignadas?.map((sede) => (
                          <span key={sede.id_codigo_farmacia} className="flex items-center gap-1.5 bg-theme-main/50 border border-theme-border/60 text-theme-text text-[9px] px-2.5 py-1 rounded-md font-black">
                            <MapPin size={8} className="text-theme-accent" /> {sede.nombre}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td className="px-8 py-5 text-center">
                      <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full border ${u.activo ? 'border-emerald-500/20 text-emerald-500 bg-emerald-500/5' : 'border-red-500/20 text-red-500 bg-red-500/5'}`}>
                        <span className="text-[8px] font-black uppercase tracking-widest">{u.activo ? '● Activo' : '○ Revocado'}</span>
                      </div>
                    </td>
                    <td className="px-8 py-5 text-center">
                      <div className="flex items-center justify-center gap-1">
                        <button className="p-2.5 text-theme-sub hover:text-theme-accent transition-all"><UserCog size={16} /></button>
                        <button onClick={() => handleDelete(u.codusuario)} className="p-2.5 text-theme-sub hover:text-red-500 transition-all"><Trash2 size={16} /></button>
                      </div>
                    </td>
                  </tr>
                )) : (
                  <tr>
                    <td colSpan={4} className="px-10 py-16 text-center text-theme-sub font-black uppercase opacity-20 tracking-widest text-lg italic">
                      Sin registros en PharosDB
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {/* 📥 MODAL */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-6 backdrop-blur-sm">
          <div className="absolute inset-0 bg-theme-main/80" onClick={() => setShowModal(false)} />

          <div className="relative bg-theme-sidebar border border-theme-border w-full max-w-xl rounded-[3rem] p-8 shadow-2xl overflow-y-auto max-h-[90vh] animate-in zoom-in duration-300">
            <div className="flex justify-between items-start mb-6">
              <h2 className="text-2xl font-black text-theme-text uppercase italic leading-none">Nueva Credencial</h2>
              <button onClick={() => setShowModal(false)} className="p-1.5 hover:bg-theme-main rounded-full text-theme-sub"><X size={18} /></button>
            </div>

            <form onSubmit={handleCreateUser} className="space-y-5">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input required placeholder="Cédula" className="w-full bg-theme-main/60 border border-theme-border rounded-xl p-4 text-xs text-theme-text outline-none focus:border-theme-accent"
                  value={formData.codusuario} onChange={e => setFormData({ ...formData, codusuario: e.target.value })} />
                <input required placeholder="Alias" className="w-full bg-theme-main/60 border border-theme-border rounded-xl p-4 text-xs text-theme-text outline-none focus:border-theme-accent"
                  value={formData.nombre} onChange={e => setFormData({ ...formData, nombre: e.target.value })} />
              </div>

              <input required type="email" placeholder="E-mail" className="w-full bg-theme-main/60 border border-theme-border rounded-xl p-4 text-xs text-theme-text outline-none focus:border-theme-accent"
                value={formData.email} onChange={e => setFormData({ ...formData, email: e.target.value })} />

              <div className="relative">
                <input required type={showPass ? "text" : "password"} placeholder="Contraseña" className="w-full bg-theme-main/60 border border-theme-border rounded-xl p-4 text-xs text-theme-text outline-none focus:border-theme-accent"
                  value={formData.password_hash} onChange={e => setFormData({ ...formData, password_hash: e.target.value })} />
                <button type="button" onClick={() => setShowPass(!showPass)} className="absolute right-4 top-1/2 -translate-y-1/2 text-theme-sub">
                  {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>

              <div className="p-5 bg-theme-main/40 rounded-2xl border border-theme-border/50 space-y-3">
                <label className="text-[9px] font-black text-theme-sub uppercase tracking-widest block ml-1">Sedes Autorizadas</label>
                <div className="grid grid-cols-2 gap-2">
                  {farmaciasDB.map(f => (
                    <button
                      key={f.id_codigo_farmacia}
                      type="button"
                      onClick={() => toggleSede(f.id_codigo_farmacia)}
                      className={`flex flex-col p-3 rounded-xl border transition-all text-left ${formData.sedes_seleccionadas.includes(f.id_codigo_farmacia)
                          ? 'bg-theme-accent border-theme-accent text-white shadow-lg'
                          : 'bg-theme-sidebar border-theme-border text-theme-sub hover:border-theme-accent/30'
                        }`}
                    >
                      <span className="text-[8px] font-black uppercase opacity-60">ID: {f.id_codigo_farmacia}</span>
                      <span className="text-[10px] font-black uppercase truncate">{f.nombre}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex gap-3 pt-2">
                {/* BOTÓN DESCARTAR CON EFECTO REFINADO */}
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="flex-1 bg-transparent border border-theme-border/60 text-theme-sub py-4 rounded-xl font-black text-[10px] uppercase tracking-widest transition-all hover:bg-red-500/10 hover:border-red-500/40 hover:text-red-500 hover:-translate-x-1 active:scale-95"
                >
                  Descartar
                </button>
                <button
                  type="submit"
                  disabled={isSaving}
                  className="flex-[1.5] bg-theme-text text-theme-main py-4 rounded-xl font-black text-[10px] uppercase tracking-widest flex items-center justify-center gap-3 hover:bg-theme-accent hover:text-white transition-all shadow-xl disabled:opacity-50"
                >
                  {isSaving ? <Loader2 className="animate-spin" size={16} /> : <><Save size={16} /> Guardar</>}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
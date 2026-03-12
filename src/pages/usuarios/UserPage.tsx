import React, { useState, useMemo, useEffect } from 'react';
// 1. IMPORTANTE: Solo importamos toast, ya no necesitamos Toaster aquí
import { toast } from 'sonner';
import {
  Plus, Search, ShieldCheck, X, Trash2, UserCog, Eye, EyeOff,
  MapPin, Filter, Save, Loader2, Fingerprint
} from 'lucide-react';

import type { Usuario, Farmacia, CreateUserDTO } from '../../types/usuarios';
import { authService } from '../../api/service/auth.service';

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

  const [formData, setFormData] = useState<Omit<CreateUserDTO, 'email'>>({
    codusuario: 0,
    nombre: '',
    password_hash: '',
    rol: 'SOPORTE',
    sedes_seleccionadas: []
  });

  // Eliminamos el useEffect que detectaba el tema aquí, ya que el Toaster en App.tsx se encarga de eso globalmente.

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
      toast.error("Error de Sincronización", { 
        description: "No se pudo conectar con PharosDB para obtener los datos." 
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => { loadInitialData(); }, []);

  const handleCreateUser = async (e: React.FormEvent) => {
    e.preventDefault();

    // --- VALIDACIONES ---
    if (formData.codusuario <= 0) {
      toast.warning("ID Inválido", { description: "La Cédula debe ser un número válido." });
      return;
    }
    if (formData.nombre.trim().length < 3) {
      toast.warning("Nombre muy corto", { description: "Debe tener al menos 3 caracteres." });
      return;
    }
    if (formData.password_hash.length < 6) {
      toast.error("Seguridad insuficiente", { description: "La contraseña requiere mínimo 6 caracteres." });
      return;
    }
    if (formData.sedes_seleccionadas.length === 0) {
      toast.info("Acceso restringido", { description: "Selecciona al menos una sede." });
      return;
    }

    try {
      setIsSaving(true);
      await authService.createUsuario({
        ...formData,
        codusuario: Number(formData.codusuario)
      } as CreateUserDTO);

      toast.success("Acceso Autorizado", { 
        description: `Usuario ${formData.nombre} registrado con éxito.` 
      });
      
      await loadInitialData();
      setShowModal(false);
      resetForm();
    } catch (error: any) {
      const status = error.response?.status;
      if (status === 409) {
        toast.error("Usuario duplicado", { description: "Esta Cédula ya existe en la base de datos." });
      } else {
        toast.error("Error crítico", { description: "No se pudo registrar en PharosDB." });
      }
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (codusuario: string | number) => {
    // Usamos el toast de acción que ya tenías, ahora se verá centrado según tu App.tsx
    toast.error(`¿Revocar acceso al ID ${codusuario}?`, {
      description: "Esta acción inhabilitará las credenciales del usuario.",
      action: {
        label: 'Revocar Acceso',
        onClick: async () => {
          try {
            await authService.deleteUsuario(codusuario.toString());
            setUsuarios(prev => prev.filter(u => u.codusuario !== codusuario));
            toast.success("Acceso revocado correctamente.");
          } catch (error) {
            toast.error("Error al revocar", { description: "No se pudo completar la acción en el servidor." });
          }
        },
      },
    });
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
    setFormData({ codusuario: 0, nombre: '', password_hash: '', rol: 'SOPORTE', sedes_seleccionadas: [] });
    setShowPass(false);
  };

  const filteredUsers = useMemo(() => {
    return usuarios.filter(u => {
      const matchesSearch = u.nombre.toLowerCase().includes(searchTerm.toLowerCase()) || u.codusuario.toString().includes(searchTerm);
      const matchesRol = filterRol === 'ALL' || u.rol.toUpperCase() === filterRol;
      const matchesStatus = filterStatus === 'ALL' || (filterStatus === 'ACTIVE' ? u.activo : !u.activo);
      return matchesSearch && matchesRol && matchesStatus;
    });
  }, [searchTerm, filterRol, filterStatus, usuarios]);

  return (
    <div className="space-y-6 max-w-1400px mx-auto p-4 animate-in fade-in duration-500 transform scale-[0.98] origin-top">
      
      {/* 2. ELIMINADO: El componente <Toaster /> ya no va aquí. 
          Las alertas ahora las maneja el Toaster global de App.tsx */}

      {/* 🔍 HEADER & FILTERS */}
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

          <div className="flex bg-theme-main/40 p-1 rounded-lg border border-theme-border/40">
            {(['ALL', 'ADMIN', 'SOPORTE'] as const).map((r) => (
              <button key={r} onClick={() => setFilterRol(r)}
                className={`px-3 py-1.5 rounded-md text-[9px] font-black transition-all ${filterRol === r ? 'bg-theme-text text-theme-main shadow-md' : 'text-theme-sub hover:text-theme-text'}`}>
                {r === 'ALL' ? 'TODOS' : r}
              </button>
            ))}
          </div>

          <div className="flex bg-theme-main/40 p-1 rounded-lg border border-theme-border/40">
            {(['ALL', 'ACTIVE', 'INACTIVE'] as const).map((s) => (
              <button key={s} onClick={() => setFilterStatus(s)}
                className={`px-3 py-1.5 rounded-md text-[9px] font-black transition-all ${filterStatus === s ? 'bg-theme-accent text-white shadow-md' : 'text-theme-sub hover:text-theme-text'}`}>
                {s === 'ALL' ? 'ESTADO' : s === 'ACTIVE' ? 'ACTIVOS' : 'REVOCADOS'}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* 📊 TABLA DE USUARIOS */}
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
                  <th className="px-8 py-5 text-[9px] font-black text-theme-sub uppercase tracking-[0.2em]">Identificación</th>
                  <th className="px-8 py-5 text-[9px] font-black text-theme-sub uppercase tracking-[0.2em]">Usuario / Perfil</th>
                  <th className="px-8 py-5 text-[9px] font-black text-theme-sub uppercase tracking-[0.2em]">Sedes Asignadas</th>
                  <th className="px-8 py-5 text-[9px] font-black text-theme-sub uppercase tracking-[0.2em] text-center">Estado</th>
                  <th className="px-8 py-5 text-[9px] font-black text-theme-sub uppercase tracking-[0.2em] text-center">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-theme-border/10">
                {filteredUsers.length > 0 ? filteredUsers.map((u) => (
                  <tr key={u.codusuario} className="hover:bg-theme-accent/5 transition-all group">
                    <td className="px-8 py-5">
                      <div className="flex items-center gap-3">
                        <Fingerprint size={14} className="text-theme-accent/50" />
                        <span className="font-mono text-sm font-bold text-theme-text italic">
                          {u.codusuario}
                        </span>
                      </div>
                    </td>
                    <td className="px-8 py-5">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-xl bg-theme-main border border-theme-border flex items-center justify-center text-theme-accent shadow-inner group-hover:scale-110 transition-transform">
                          <ShieldCheck size={20} />
                        </div>
                        <div className="flex flex-col">
                          <p className="text-sm font-black text-theme-text uppercase italic leading-none mb-1">{u.nombre}</p>
                          <span className="text-[8px] w-fit px-1.5 py-0.5 rounded bg-theme-accent/10 text-theme-accent font-black uppercase tracking-widest">{u.rol}</span>
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-5">
                      <div className="flex flex-wrap gap-1.5 max-w-400px">
                        {u.farmacias_asignadas?.map((sede) => (
                          <span key={sede.id_codigo_farmacia} className="flex items-center gap-1.5 bg-theme-main/50 border border-theme-border/60 text-theme-text text-[9px] px-2.5 py-1 rounded-md font-black hover:border-theme-accent/50 transition-colors">
                            <MapPin size={8} className="text-theme-accent" /> {sede.nombre}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td className="px-8 py-5 text-center">
                      <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full border ${u.activo ? 'border-emerald-500/20 text-emerald-500 bg-emerald-500/5' : 'border-red-500/20 text-red-500 bg-red-500/5'}`}>
                        <div className={`w-1 h-1 rounded-full ${u.activo ? 'bg-emerald-500 animate-pulse' : 'bg-red-500'}`} />
                        <span className="text-[8px] font-black uppercase tracking-widest">{u.activo ? 'Activo' : 'Revocado'}</span>
                      </div>
                    </td>
                    <td className="px-8 py-5 text-center">
                      <div className="flex items-center justify-center gap-1">
                        <button className="p-2.5 text-theme-sub hover:text-theme-accent transition-all hover:bg-theme-main rounded-lg"><UserCog size={16} /></button>
                        <button onClick={() => handleDelete(u.codusuario)} className="p-2.5 text-theme-sub hover:text-red-500 transition-all hover:bg-red-500/10 rounded-lg"><Trash2 size={16} /></button>
                      </div>
                    </td>
                  </tr>
                )) : (
                  <tr>
                    <td colSpan={5} className="px-10 py-20 text-center">
                      <p className="text-theme-sub font-black uppercase opacity-20 tracking-[0.5em] text-xl italic">Sin registros en PharosDB</p>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {/* 📥 MODAL DE NUEVO REGISTRO */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-6 backdrop-blur-md">
          <div className="absolute inset-0 bg-theme-main/80" onClick={() => !isSaving && setShowModal(false)} />

          <div className="relative bg-theme-sidebar border border-theme-border w-full max-w-xl rounded-[3rem] p-10 shadow-[0_0_50px_rgba(0,0,0,0.5)] overflow-y-auto max-h-[90vh] animate-in zoom-in duration-300">
            <div className="flex justify-between items-center mb-8">
              <div>
                <h2 className="text-2xl font-black text-theme-text uppercase italic leading-none">Nueva Credencial</h2>
                <p className="text-[10px] text-theme-sub uppercase tracking-widest mt-2 font-bold">Registro de acceso institucional</p>
              </div>
              <button
                onClick={() => setShowModal(false)}
                disabled={isSaving}
                className="p-3 hover:bg-theme-main rounded-2xl text-theme-sub transition-colors disabled:opacity-20"
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleCreateUser} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-[9px] font-black text-theme-sub uppercase ml-2 tracking-widest">Cédula (ID)</label>
                  <div className="relative">
                    <Fingerprint className={`absolute left-4 top-1/2 -translate-y-1/2 transition-colors ${formData.codusuario > 0 ? 'text-theme-accent' : 'text-theme-sub/50'}`} size={16} />
                    <input
                      required
                      type="number"
                      placeholder="Ej: 30284565"
                      className="w-full bg-theme-main border border-theme-border rounded-2xl py-4 pl-12 pr-4 text-sm text-theme-text outline-none focus:border-theme-accent transition-all shadow-inner"
                      value={formData.codusuario === 0 ? '' : formData.codusuario}
                      onChange={e => setFormData({ ...formData, codusuario: Number(e.target.value) })}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-[9px] font-black text-theme-sub uppercase ml-2 tracking-widest">Nombre Completo</label>
                  <div className="relative">
                    <UserCog className={`absolute left-4 top-1/2 -translate-y-1/2 transition-colors ${formData.nombre.length > 2 ? 'text-theme-accent' : 'text-theme-sub/50'}`} size={16} />
                    <input
                      required
                      type="text"
                      placeholder="Ej: Juan Pérez"
                      className="w-full bg-theme-main border border-theme-border rounded-2xl py-4 pl-12 pr-4 text-sm text-theme-text outline-none focus:border-theme-accent transition-all shadow-inner"
                      value={formData.nombre}
                      onChange={e => setFormData({ ...formData, nombre: e.target.value })}
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-[9px] font-black text-theme-sub uppercase ml-2 tracking-widest">Contraseña (Mín. 6)</label>
                  <div className="relative">
                    <input
                      required
                      minLength={6}
                      type={showPass ? "text" : "password"}
                      placeholder="••••••••"
                      className={`w-full bg-theme-main border rounded-2xl py-4 px-5 text-sm text-theme-text outline-none transition-all shadow-inner ${formData.password_hash.length >= 6 ? 'border-emerald-500/30' : 'border-theme-border focus:border-theme-accent'}`}
                      value={formData.password_hash}
                      onChange={e => setFormData({ ...formData, password_hash: e.target.value })}
                    />
                    <button type="button" onClick={() => setShowPass(!showPass)} className="absolute right-4 top-1/2 -translate-y-1/2 text-theme-sub hover:text-theme-accent transition-colors">
                      {showPass ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-[9px] font-black text-theme-sub uppercase ml-2 tracking-widest">Rol Institucional</label>
                  <select
                    className="w-full bg-theme-main border border-theme-border rounded-2xl py-4 px-5 text-sm text-theme-text outline-none focus:border-theme-accent transition-all appearance-none cursor-pointer"
                    value={formData.rol}
                    onChange={e => setFormData({ ...formData, rol: e.target.value as 'ADMIN' | 'SOPORTE' })}
                  >
                    <option value="SOPORTE">SOPORTE TIENDA</option>
                    <option value="ADMIN">SOPORTE BORIQUEÑA</option>
                  </select>
                </div>
              </div>

              <div className={`p-6 bg-theme-main/40 rounded-[2.5rem] border transition-all space-y-4 ${formData.sedes_seleccionadas.length > 0 ? 'border-theme-border/50' : 'border-red-500/20'}`}>
                <div className="flex justify-between items-center">
                  <label className="text-[9px] font-black text-theme-sub uppercase tracking-widest ml-1">Sedes Autorizadas</label>
                  <span className={`text-[8px] font-black px-2 py-0.5 rounded ${formData.sedes_seleccionadas.length > 0 ? 'text-theme-accent bg-theme-accent/10' : 'text-red-500 bg-red-500/10'}`}>
                    {formData.sedes_seleccionadas.length > 0 ? `Asignadas: ${formData.sedes_seleccionadas.length}` : 'Selección Obligatoria'}
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  {farmaciasDB.map(f => (
                    <button
                      key={f.id_codigo_farmacia}
                      type="button"
                      onClick={() => toggleSede(f.id_codigo_farmacia)}
                      className={`flex flex-col p-4 rounded-2xl border transition-all text-left group ${formData.sedes_seleccionadas.includes(f.id_codigo_farmacia)
                        ? 'bg-theme-accent border-theme-accent text-white shadow-lg'
                        : 'bg-theme-sidebar border-theme-border text-theme-sub hover:border-theme-accent/30'
                        }`}
                    >
                      <span className={`text-[8px] font-black uppercase mb-1 ${formData.sedes_seleccionadas.includes(f.id_codigo_farmacia) ? 'text-white/60' : 'opacity-40'}`}>ID: {f.id_codigo_farmacia}</span>
                      <span className="text-xs font-black uppercase truncate italic">{f.nombre}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex gap-4 pt-4">
                <button
                  type="button"
                  disabled={isSaving}
                  onClick={() => setShowModal(false)}
                  className="flex-1 bg-theme-main border border-theme-border text-theme-sub py-4 rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] transition-all hover:text-red-500 active:scale-95 disabled:opacity-50"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={isSaving}
                  className="flex-2 bg-theme-text text-theme-main py-4 rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] flex items-center justify-center gap-3 hover:bg-theme-accent hover:text-white transition-all shadow-xl disabled:opacity-50 active:scale-95"
                >
                  {isSaving ? (
                    <>
                      <Loader2 className="animate-spin" size={18} />
                      Procesando...
                    </>
                  ) : (
                    <>
                      <Save size={18} />
                      Autorizar Acceso
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
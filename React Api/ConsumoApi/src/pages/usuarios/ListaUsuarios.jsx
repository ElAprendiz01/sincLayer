import React, { useState, useEffect } from "react";
import { usuarioService } from "../../services/usuarioService";
import {
  User,
  Shield,
  Search,
  Edit,
  Trash2,
  UserPlus,
  X,
  Save,
  Lock,
  Fingerprint,
} from "lucide-react";
import Swal from "sweetalert2";

const ListaUsuarios = () => {
  const [usuarios, setUsuarios] = useState([]);
  const [busqueda, setBusqueda] = useState("");
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);

  // Estado inicial robusto para evitar errores de componentes controlados
  const estadoInicial = {
    id_Usuario: 0,
    usuario: "",
    contrasena: "",
    id_Rol: "",
    id_Estado: 3, // Estado 'Activo' por defecto
    id_Persona: "",
    forzarRecuperacion: false,
  };

  const [formData, setFormData] = useState(estadoInicial);

  const cargarDatos = async () => {
    setLoading(true);
    try {
      const data = await usuarioService.listar();
      setUsuarios(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Error al sincronizar con NexaCore:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    cargarDatos();
  }, []);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : (value ?? ""),
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      let res;
      if (formData.id_Usuario === 0) {
        res = await usuarioService.crear(formData);
      } else {
        res = await usuarioService.actualizar(formData);
      }

      if (res.ok) {
        Swal.fire({
          title: "¡Éxito!",
          text: res.message,
          icon: "success",
          background: "#0f172a",
          color: "#fff",
        });
        setShowModal(false);
        cargarDatos();
      }
    } catch (error) {
      Swal.fire("Error de Transacción", error.message, "error");
    }
  };

  // Lógica de eliminación sincronizada con tu Sp_EliminarUsuario
  const handleEliminar = (id) => {
    Swal.fire({
      title: "¿Eliminar acceso?",
      text: "El registro será marcado como inactivo en la base de datos.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#ef4444",
      cancelButtonColor: "#334155",
      confirmButtonText: "Sí, desactivar",
      cancelButtonText: "Cancelar",
      background: "#0f172a",
      color: "#fff",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await usuarioService.eliminar(id);

          // Filtro optimista: Lo quitamos de la lista local inmediatamente
          setUsuarios((prev) => prev.filter((u) => u.id_Usuario !== id));

          Swal.fire({
            title: "Desactivado",
            text: "El usuario ya no aparecerá en el listado activo.",
            icon: "success",
            background: "#0f172a",
            color: "#fff",
          });
        } catch (error) {
          Swal.fire("Error", "No se pudo eliminar el registro", "error");
        }
      }
    });
  };

  const abrirModal = (u = null) => {
    if (u) {
      setFormData({
        ...u,
        contrasena: "", // Seguridad: No cargar la clave actual
      });
    } else {
      setFormData(estadoInicial);
    }
    setShowModal(true);
  };

  return (
    <div className="min-h-screen bg-slate-950 p-8 text-slate-200">
      <div className="max-w-7xl mx-auto flex justify-between items-center mb-8">
        <h1 className="text-2xl font-black flex items-center gap-2">
          <Shield className="text-blue-500" /> NEXACORE: GESTIÓN DE ACCESOS
        </h1>
        <button
          onClick={() => abrirModal()}
          className="bg-blue-600 hover:bg-blue-500 px-4 py-2 rounded-lg font-bold flex items-center gap-2 transition-transform active:scale-95"
        >
          <UserPlus size={18} /> Nuevo Acceso
        </button>
      </div>

      {/* Panel de Búsqueda */}
      <div className="max-w-7xl mx-auto mb-6 relative">
        <Search className="absolute left-3 top-3 text-slate-500" size={18} />
        <input
          type="text"
          placeholder="Buscar usuario por nombre..."
          className="w-full bg-slate-900 border border-slate-800 p-3 pl-10 rounded-xl outline-none focus:border-blue-500"
          value={busqueda}
          onChange={(e) => setBusqueda(e.target.value)}
        />
      </div>

      {/* Tabla con Filtrado de Borrado Lógico */}
      <div className="max-w-7xl mx-auto bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-2xl">
        <table className="w-full text-left">
          <thead className="bg-slate-800/50 text-slate-400 text-xs uppercase font-bold">
            <tr>
              <th className="p-4">Usuario</th>
              <th className="p-4">Rol</th>
              <th className="p-4">Estado</th>
              <th className="p-4 text-center">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td
                  colSpan="4"
                  className="p-10 text-center animate-pulse text-slate-500 font-mono"
                >
                  Cargando módulos...
                </td>
              </tr>
            ) : (
              usuarios
                .filter(
                  (u) =>
                    u.usuario.toLowerCase().includes(busqueda.toLowerCase()) &&
                    u.id_Estado === 3, // CRÍTICO: No mostramos usuarios con estado 4 (Eliminados)
                )
                .map((u) => (
                  <tr
                    key={u.id_Usuario}
                    className="border-t border-slate-800 hover:bg-slate-800/30 transition-colors"
                  >
                    <td className="p-4 font-medium text-white">{u.usuario}</td>
                    <td className="p-4 italic text-blue-400">
                      {u.rol || "N/A"}
                    </td>
                    <td className="p-4">
                      <span className="px-2 py-1 rounded text-[10px] font-bold bg-emerald-500/10 text-emerald-500 uppercase">
                        Activo
                      </span>
                    </td>
                    <td className="p-4 flex justify-center gap-4">
                      <button
                        onClick={() => abrirModal(u)}
                        className="text-slate-400 hover:text-white transition-colors"
                      >
                        <Edit size={18} />
                      </button>
                      <button
                        onClick={() => handleEliminar(u.id_Usuario)}
                        className="text-slate-400 hover:text-red-500 transition-colors"
                      >
                        <Trash2 size={18} />
                      </button>
                    </td>
                  </tr>
                ))
            )}
            {!loading &&
              usuarios.filter((u) => u.id_Estado === 3).length === 0 && (
                <tr>
                  <td
                    colSpan="4"
                    className="p-10 text-center text-slate-600 italic"
                  >
                    No hay registros activos para mostrar.
                  </td>
                </tr>
              )}
          </tbody>
        </table>
      </div>

      {/* Modal NexaCore UI */}
      {showModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl w-full max-w-md shadow-2xl animate-in fade-in zoom-in duration-200">
            <div className="flex justify-between items-center mb-6 border-b border-slate-800 pb-4">
              <h2 className="text-xl font-bold text-white uppercase tracking-tighter">
                {formData.id_Usuario === 0
                  ? "Crear Nueva Identidad"
                  : "Modificar Credenciales"}
              </h2>
              <button onClick={() => setShowModal(false)}>
                <X className="text-slate-500 hover:text-white" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {formData.id_Usuario === 0 && (
                <div>
                  <label className="text-[10px] text-slate-500 font-bold uppercase mb-1 block">
                    ID Persona
                  </label>
                  <div className="relative">
                    <Fingerprint
                      className="absolute left-3 top-3 text-slate-600"
                      size={18}
                    />
                    <input
                      type="number"
                      name="id_Persona"
                      value={formData.id_Persona || ""}
                      onChange={handleChange}
                      className="w-full bg-slate-950 border border-slate-800 p-3 pl-10 rounded-xl outline-none focus:border-blue-500"
                      required
                    />
                  </div>
                </div>
              )}

              <div>
                <label className="text-[10px] text-slate-500 font-bold uppercase mb-1 block">
                  Usuario
                </label>
                <div className="relative">
                  <User
                    className="absolute left-3 top-3 text-slate-600"
                    size={18}
                  />
                  <input
                    name="usuario"
                    value={formData.usuario || ""}
                    onChange={handleChange}
                    autoComplete="username"
                    className="w-full bg-slate-950 border border-slate-800 p-3 pl-10 rounded-xl outline-none focus:border-blue-500"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="text-[10px] text-slate-500 font-bold uppercase mb-1 block">
                  Password
                </label>
                <div className="relative">
                  <Lock
                    className="absolute left-3 top-3 text-slate-600"
                    size={18}
                  />
                  <input
                    type="password"
                    name="contrasena"
                    value={formData.contrasena || ""}
                    onChange={handleChange}
                    autoComplete="new-password"
                    placeholder={
                      formData.id_Usuario !== 0
                        ? "Nueva contraseña (opcional)"
                        : "Clave del sistema"
                    }
                    className="w-full bg-slate-950 border border-slate-800 p-3 pl-10 rounded-xl outline-none focus:border-blue-500"
                    required={formData.id_Usuario === 0}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-[10px] text-slate-500 font-bold uppercase mb-1 block">
                    Rol
                  </label>
                  <select
                    name="id_Rol"
                    value={formData.id_Rol || ""}
                    onChange={handleChange}
                    className="w-full bg-slate-950 border border-slate-800 p-3 rounded-xl outline-none focus:border-blue-500"
                    required
                  >
                    <option value="">Elegir...</option>
                    <option value="2">Admin</option>
                    <option value="3">Cliente</option>
                  </select>
                </div>
                <div>
                  <label className="text-[10px] text-slate-500 font-bold uppercase mb-1 block">
                    Estado
                  </label>
                  <select
                    name="id_Estado"
                    value={formData.id_Estado}
                    onChange={handleChange}
                    className="w-full bg-slate-950 border border-slate-800 p-3 rounded-xl outline-none focus:border-blue-500"
                  >
                    <option value="3">Activo</option>
                    <option value="4">Inactivo</option>
                  </select>
                </div>
              </div>

              <button
                type="submit"
                className="w-full bg-blue-600 hover:bg-blue-500 text-white font-black py-4 rounded-xl mt-4 flex items-center justify-center gap-2 shadow-lg transition-transform active:scale-95"
              >
                <Save size={20} /> GUARDAR
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ListaUsuarios;

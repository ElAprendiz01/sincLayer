import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Search, Plus, X, Save, ArrowLeft, User, AlertCircle, Edit, Trash2, ShieldCheck, ShieldAlert
} from "lucide-react";
import {
  getPersonas,
  insertarPersona,
  editarPersona,
  eliminarPersona,
  buscarPersonas,
} from "./../../services/datospersonalesService";
import "../../styles/datospersonales.css";
import { useToast } from "../../components/ToastContext";

const ListarDatosPersonales = () => {
  const navigate = useNavigate();
  const { showToast } = useToast();

  // --- CONTROL DE ACCESO NEXACORE ---
  const userRole = localStorage.getItem("userRole")?.toLowerCase();
  const isAdmin = userRole === "admin";

  const [lista, setLista] = useState([]);
  const [busqueda, setBusqueda] = useState("");
  const [mostrarModal, setMostrarModal] = useState(false);
  const [mensajeApi, setMensajeApi] = useState("");
  const [cargando, setCargando] = useState(false);
  const [confirmarBorrado, setConfirmarBorrado] = useState({ abierto: false, id: null });

  const userIdLogueado = parseInt(localStorage.getItem("userId") || "0");

  const estadoInicial = {
    id_Persona: null,
    primer_Nombre: "",
    segundo_Nombre: "",
    primer_Apellido: "",
    segundo_Apellido: "",
    genero: 9,
    tipo_DNI: 12,
    fecha_Nacimiento: "",
    dni: "",
    id_Creador: userIdLogueado,
  };

  const [formData, setFormData] = useState(estadoInicial);

  const fetchPersonas = async () => {
    setCargando(true);
    try {
      const res = await getPersonas();
      const datos = res.data || (Array.isArray(res) ? res : []);
      setLista(datos);
      setMensajeApi(datos.length === 0 ? "No hay registros disponibles" : "");
    } catch (error) {
      showToast("Error de conexión con el servidor", "error");
    } finally {
      setCargando(false);
    }
  };

  const handleBusqueda = async (e) => {
    const valor = e.target.value;
    setBusqueda(valor);
    if (valor.trim() === "") {
      fetchPersonas();
    } else {
      try {
        const res = await buscarPersonas(valor);
        const datos = res.data || (Array.isArray(res) ? res : []);
        setLista(datos);
      } catch (error) {
        setLista([]);
      }
    }
  };

  const handleGuardar = async (e) => {
    e.preventDefault();
    if (!isAdmin) return; // Bloqueo de seguridad

    try {
      let res;
      if (formData.id_Persona) {
        res = await editarPersona(formData.id_Persona, {
          ...formData,
          id_Modificador: userIdLogueado,
        });
        showToast(res.msj || "Actualizado correctamente", "success");
      } else {
        const { id_Persona, ...datosInsertar } = formData;
        res = await insertarPersona(datosInsertar);
        showToast(res.msj || "Registrado con éxito", "success");
      }
      setMostrarModal(false);
      setFormData(estadoInicial);
      fetchPersonas();
    } catch (error) {
      const mensajeError = error.response?.data?.msj || "Error al procesar la solicitud";
      showToast(mensajeError, "error");
    }
  };

  const abrirConfirmacion = (id) => {
    if (!isAdmin) return;
    setConfirmarBorrado({ abierto: true, id: id });
  };

  const ejecutarEliminacion = async () => {
    if (!isAdmin) return;
    try {
      const res = await eliminarPersona(confirmarBorrado.id, userIdLogueado);
      showToast(res.msj || "Eliminado correctamente", "warning");
      fetchPersonas();
    } catch (error) {
      showToast(error.response?.data?.msj || "Error al eliminar", "error");
    } finally {
      setConfirmarBorrado({ abierto: false, id: null });
    }
  };

  const prepararEdicion = (persona) => {
    if (!isAdmin) return;
    setFormData({
      id_Persona: persona.id_Persona,
      primer_Nombre: persona.primer_Nombre || "",
      segundo_Nombre: persona.segundo_Nombre || "",
      primer_Apellido: persona.primer_Apellido || "",
      segundo_Apellido: persona.segundo_Apellido || "",
      genero: persona.genero || 9,
      tipo_DNI: persona.tipo_DNI || 12,
      fecha_Nacimiento: persona.fecha_Nacimiento ? persona.fecha_Nacimiento.split('T')[0] : "",
      dni: persona.dni || "",
    });
    setMostrarModal(true);
  };

  useEffect(() => {
    fetchPersonas();
  }, []);

  return (
    <div className="cat-page">
      <div className="cat-header">
        <div className="header-left">
          <button className="btn-back" onClick={() => navigate("/admin")}>
            <ArrowLeft size={20} />
          </button>
          <div>
            <h1>Gestión de Datos Personales</h1>
            <p className={`role-badge ${isAdmin ? 'admin' : 'readonly'}`}>
              {isAdmin ? <ShieldCheck size={14} /> : <ShieldAlert size={14} />}
              {isAdmin ? "Acceso Total" : "Modo Consulta"}
            </p>
          </div>
        </div>

        <div className="search-container">
          <input
            className="search-input"
            type="text"
            placeholder="Buscar por nombre o DNI..."
            value={busqueda}
            onChange={handleBusqueda}
          />
        </div>

        {/* Solo el admin puede ver el botón de "Nuevo Registro" */}
        {isAdmin && (
          <button
            className="btn-main"
            onClick={() => { setFormData(estadoInicial); setMostrarModal(true); }}
          >
            <Plus size={18} /> Nuevo Registro
          </button>
        )}
      </div>

      <div className="cat-grid">
        {cargando ? (
          <div className="no-data">Sincronizando con NexaCore...</div>
        ) : lista.length > 0 ? (
          lista.map((p) => (
            <div key={p.id_Persona} className="cat-card">
              <div className="card-info">
                <span className="card-type">ID: {p.id_Persona}</span>
                <span className="status-pill">ACTIVO</span>
              </div>

              <h2 className="card-title">
                {`${p.primer_Nombre} ${p.primer_Apellido}`}
              </h2>

              <div className="audit-box">
                <div className="audit-label">Identificación (DNI):</div>
                <div className="audit-value">{p.dni}</div>
              </div>

              {/* Botones de acción: Solo visibles para Admin */}
              {isAdmin && (
                <div className="card-actions">
                  <button className="btn-edit" onClick={() => prepararEdicion(p)}>
                    <Edit size={16} /> Editar
                  </button>
                  <button className="btn-del" onClick={() => abrirConfirmacion(p.id_Persona)}>
                    <Trash2 size={16} /> Borrar
                  </button>
                </div>
              )}
            </div>
          ))
        ) : (
          <div className="no-data">
            <AlertCircle size={40} style={{ marginBottom: '10px', opacity: 0.5 }} />
            <p>{mensajeApi || "No se encontraron registros"}</p>
          </div>
        )}
      </div>

      {/* MODAL DE FORMULARIO (Protección doble) */}
      {mostrarModal && isAdmin && (
        <div className="modal-overlay">
          <div className="cat-form-card modal-content-fix">
            <div className="modal-header">
              <div className="modal-title-box">
                <User size={20} color="#38bdf8" />
                <h3>{formData.id_Persona ? "Actualizar Datos" : "Nuevo Registro"}</h3>
              </div>
              <X className="close-icon" onClick={() => setMostrarModal(false)} />
            </div>

            <form onSubmit={handleGuardar} className="form-layout">
              <div className="input-group">
                <label>Nombres</label>
                <div className="flex-row">
                  <input type="text" placeholder="Primer Nombre" value={formData.primer_Nombre} onChange={(e) => setFormData({ ...formData, primer_Nombre: e.target.value })} required />
                  <input type="text" placeholder="Segundo Nombre" value={formData.segundo_Nombre} onChange={(e) => setFormData({ ...formData, segundo_Nombre: e.target.value })} />
                </div>
              </div>

              <div className="input-group">
                <label>Apellidos</label>
                <div className="flex-row">
                  <input type="text" placeholder="Primer Apellido" value={formData.primer_Apellido} onChange={(e) => setFormData({ ...formData, primer_Apellido: e.target.value })} required />
                  <input type="text" placeholder="Segundo Apellido" value={formData.segundo_Apellido} onChange={(e) => setFormData({ ...formData, segundo_Apellido: e.target.value })} />
                </div>
              </div>

              <div className="flex-row">
                <div className="input-group flex-1">
                  <label>Género</label>
                  <select
                    value={formData.genero}
                    onChange={(e) => setFormData({ ...formData, genero: parseInt(e.target.value) })}
                    className="custom-select"
                  >
                    <option value={9}>Masculino</option>
                    <option value={10}>Femenino</option>
                  </select>
                </div>

                <div className="input-group flex-1">
                  <label>Tipo de ID</label>
                  <select
                    value={formData.tipo_DNI}
                    onChange={(e) => setFormData({ ...formData, tipo_DNI: parseInt(e.target.value) })}
                    className="custom-select"
                  >
                    <option value={12}>Cédula</option>
                    <option value={13}>Pasaporte</option>
                    <option value={14}>Partida Nacimiento</option>
                  </select>
                </div>
              </div>

              <div className="input-group">
                <label>Fecha de Nacimiento</label>
                <input type="date" value={formData.fecha_Nacimiento} onChange={(e) => setFormData({ ...formData, fecha_Nacimiento: e.target.value })} required />
              </div>

              <div className="input-group">
                <label>Documento de Identidad (DNI)</label>
                <input type="text" placeholder="Ingrese número" value={formData.dni} onChange={(e) => setFormData({ ...formData, dni: e.target.value })} required />
              </div>

              <div className="card-actions-modal">
                <button type="button" className="btn-cancel" onClick={() => setMostrarModal(false)}>Cancelar</button>
                <button type="submit" className="btn-main flex-2">
                  <Save size={18} /> {formData.id_Persona ? "Guardar Cambios" : "Registrar"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL DE CONFIRMACIÓN DE ELIMINACIÓN */}
      {confirmarBorrado.abierto && isAdmin && (
        <div className="modal-overlay">
          <div className="modal-confirm-card">
            <div className="confirm-icon-box">
              <AlertCircle size={32} color="#ef4444" />
              <h3>¿Confirmar eliminación?</h3>
              <p>Estás a punto de borrar este registro. Esta acción es irreversible.</p>
            </div>

            <div className="btn-confirm-group">
              <button className="btn-confirm-no" onClick={() => setConfirmarBorrado({ abierto: false, id: null })}>
                No, cancelar
              </button>
              <button className="btn-confirm-yes" onClick={ejecutarEliminacion}>
                Sí, eliminar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ListarDatosPersonales;
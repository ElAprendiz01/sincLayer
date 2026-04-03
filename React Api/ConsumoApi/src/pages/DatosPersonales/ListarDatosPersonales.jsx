import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Search, Plus, X, Save, ArrowLeft, User, AlertCircle, Edit, Trash2, Calendar, Fingerprint
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
  const [lista, setLista] = useState([]);
  const [busqueda, setBusqueda] = useState("");
  const [mostrarModal, setMostrarModal] = useState(false);
  const [mensajeApi, setMensajeApi] = useState("");
  const [cargando, setCargando] = useState(false);

  // --- ESTADO PARA EL MODAL DE BORRADO ---
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
      if (res.codigo === 200 || Array.isArray(res)) {
        setLista(datos);
        setMensajeApi(datos.length === 0 ? "No hay registros disponibles" : "");
      }
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
    setConfirmarBorrado({ abierto: true, id: id });
  };

  // Corregido: El nombre de la función debe coincidir con el del botón
  const ejecutarEliminacion = async () => {
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
          <h1>Gestión de Datos Personales</h1>
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

        <button
          className="btn-main"
          onClick={() => { setFormData(estadoInicial); setMostrarModal(true); }}
        >
          <Plus size={18} /> Nuevo Registro
        </button>
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

              <div className="audit-box" style={{ marginBottom: '15px', background: '#0f172a', padding: '12px', borderRadius: '8px', border: '1px solid #334155' }}>
                <div style={{ fontSize: '0.7rem', color: '#94a3b8', textTransform: 'uppercase', marginBottom: '4px' }}>Identificación (DNI):</div>
                <div style={{ color: '#38bdf8', fontWeight: 'bold', fontSize: '1rem' }}>{p.dni}</div>
              </div>

              <div className="card-actions">
                <button className="btn-edit" onClick={() => prepararEdicion(p)}>
                  <Edit size={16} /> Editar
                </button>
                <button className="btn-del" onClick={() => abrirConfirmacion(p.id_Persona)}>
                  <Trash2 size={16} /> Borrar
                </button>
              </div>
            </div>
          ))
        ) : (
          <div className="no-data">
            <AlertCircle size={40} style={{ marginBottom: '10px', opacity: 0.5 }} />
            <p>{mensajeApi || "No se encontraron registros"}</p>
          </div>
        )}
      </div>

      {/* MODAL DE FORMULARIO */}
      {mostrarModal && (
        <div className="modal-overlay">
          <div className="cat-form-card" style={{ flexDirection: 'column', maxWidth: '550px', alignItems: 'stretch' }}>
            <div className="modal-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', borderBottom: '1px solid #334155', paddingBottom: '10px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <User size={20} color="#38bdf8" />
                <h3 style={{ color: 'white', margin: 0 }}>{formData.id_Persona ? "Actualizar Datos" : "Nuevo Registro"}</h3>
              </div>
              <X className="close-icon" onClick={() => setMostrarModal(false)} style={{ cursor: 'pointer', color: '#94a3b8' }} />
            </div>

            <form onSubmit={handleGuardar} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
              <div className="input-group">
                <label>Nombres</label>
                <div style={{ display: 'flex', gap: '10px' }}>
                  <input type="text" placeholder="Primer Nombre" value={formData.primer_Nombre} onChange={(e) => setFormData({ ...formData, primer_Nombre: e.target.value })} required />
                  <input type="text" placeholder="Segundo Nombre" value={formData.segundo_Nombre} onChange={(e) => setFormData({ ...formData, segundo_Nombre: e.target.value })} />
                </div>
              </div>

              <div className="input-group">
                <label>Apellidos</label>
                <div style={{ display: 'flex', gap: '10px' }}>
                  <input type="text" placeholder="Primer Apellido" value={formData.primer_Apellido} onChange={(e) => setFormData({ ...formData, primer_Apellido: e.target.value })} required />
                  <input type="text" placeholder="Segundo Apellido" value={formData.segundo_Apellido} onChange={(e) => setFormData({ ...formData, segundo_Apellido: e.target.value })} />
                </div>
              </div>

              <div style={{ display: 'flex', gap: '15px' }}>
                <div className="input-group" style={{ flex: 1 }}>
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

                <div className="input-group" style={{ flex: 1 }}>
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

              <div className="card-actions" style={{ marginTop: '10px' }}>
                <button type="button" className="btn-cancel" onClick={() => setMostrarModal(false)}>Cancelar</button>
                <button type="submit" className="btn-main" style={{ flex: 2 }}>
                  <Save size={18} /> {formData.id_Persona ? "Guardar Cambios" : "Registrar"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL DE CONFIRMACIÓN DE ELIMINACIÓN */}
      {confirmarBorrado.abierto && (
        <div className="modal-overlay">
          <div className="modal-confirm-card">
            <div style={{ marginBottom: '20px' }}>
              <div style={{
                background: 'rgba(239, 68, 68, 0.1)',
                width: '60px', height: '60px',
                borderRadius: '50%', display: 'flex',
                alignItems: 'center', justifyContent: 'center',
                margin: '0 auto 15px'
              }}>
                <AlertCircle size={32} color="#ef4444" />
              </div>
              <h3 style={{ color: 'white', fontSize: '1.4rem', margin: '0 0 10px' }}>
                ¿Confirmar eliminación?
              </h3>
              <p style={{ color: '#94a3b8', fontSize: '0.95rem', lineHeight: '1.5' }}>
                Estás a punto de borrar este registro de <strong>NexaCore</strong>.
                Esta acción no se puede deshacer.
              </p>
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
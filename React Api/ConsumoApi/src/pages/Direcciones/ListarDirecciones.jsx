import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Search, Plus, X, Save, ArrowLeft, MapPin, AlertCircle, Edit, Trash2, ShieldCheck, ShieldAlert
} from "lucide-react";
import {
  getDirecciones,
  insertarDireccion,
  editarDireccion,
  eliminarDireccion,
  filtrarDireccionPorPersona,
} from "./../../services/direccionService";
import "../../styles/datospersonales.css"; 
import { useToast } from "../../components/ToastContext";

const ListarDirecciones = () => {
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
    id_direccion: 0,
    id_Persona: "",
    ciudad: "",
    barrio: "",
    calle: "",
    id_Creador: userIdLogueado,
    forzarRecuperacion: false
  };

  const [formData, setFormData] = useState(estadoInicial);

  const fetchDirecciones = async () => {
    setCargando(true);
    try {
      const res = await getDirecciones();
      const datos = res.data || [];
      setLista(datos);
      setMensajeApi(datos.length === 0 ? "No hay direcciones registradas" : "");
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
      fetchDirecciones();
    } else {
      try {
        const res = await filtrarDireccionPorPersona(valor);
        setLista(res.data || []);
      } catch (error) {
        setLista([]);
      }
    }
  };

  const handleGuardar = async (e) => {
    e.preventDefault();
    if (!isAdmin) return; // Bloqueo de seguridad NexaCore

    try {
      const datosAEnviar = {
        id_direccion: formData.id_direccion,
        id_Persona: parseInt(formData.id_Persona),
        ciudad: formData.ciudad,
        barrio: formData.barrio,
        calle: formData.calle,
        forzarRecuperacion: formData.forzarRecuperacion
      };

      if (formData.id_direccion > 0) {
        await editarDireccion(formData.id_direccion, {
          ...datosAEnviar,
          id_Modificador: userIdLogueado,
        });
        showToast("Dirección actualizada correctamente", "success");
      } else {
        await insertarDireccion({
          ...datosAEnviar,
          id_Creador: userIdLogueado
        });
        showToast("Dirección registrada con éxito", "success");
      }
      setMostrarModal(false);
      setFormData(estadoInicial);
      fetchDirecciones();
    } catch (error) {
      const msj = error.response?.data?.msj || "Error al procesar la solicitud";
      showToast(msj, "error");
    }
  };

  const ejecutarEliminacion = async () => {
    if (!isAdmin) return;
    try {
      await eliminarDireccion(confirmarBorrado.id, userIdLogueado);
      showToast("Dirección desactivada", "warning");
      fetchDirecciones();
    } catch (error) {
      showToast("Error al eliminar la dirección", "error");
    } finally {
      setConfirmarBorrado({ abierto: false, id: null });
    }
  };

  const prepararEdicion = (d) => {
    if (!isAdmin) return;
    setFormData({
      id_direccion: d.id_direccion,
      id_Persona: d.id_Persona,
      ciudad: d.ciudad || "",
      barrio: d.barrio || "",
      calle: d.calle || "",
      id_Creador: d.id_Creador,
      forzarRecuperacion: false
    });
    setMostrarModal(true);
  };

  useEffect(() => {
    fetchDirecciones();
  }, []);

  return (
    <div className="cat-page">
      <div className="cat-header">
        <div className="header-left">
          <button className="btn-back" onClick={() => navigate("/admin")}>
            <ArrowLeft size={20} />
          </button>
          <div>
            <h1>Gestión de Direcciones</h1>
            <p className={`role-badge ${isAdmin ? 'admin' : 'readonly'}`}>
              {isAdmin ? <ShieldCheck size={14} /> : <ShieldAlert size={14} />}
              {isAdmin ? "Acceso de Edición" : "Modo Lectura"}
            </p>
          </div>
        </div>

        <div className="search-container">
          <Search size={18} className="search-icon-inside" />
          <input
            className="search-input"
            type="number"
            placeholder="ID Persona..."
            value={busqueda}
            onChange={handleBusqueda}
          />
        </div>

        {isAdmin && (
          <button className="btn-main" onClick={() => { setFormData(estadoInicial); setMostrarModal(true); }}>
            <Plus size={18} /> Nueva Dirección
          </button>
        )}
      </div>

      <div className="cat-grid">
        {cargando ? (
          <div className="no-data">Consultando base de datos...</div>
        ) : lista.length > 0 ? (
          lista.map((d) => (
            <div key={d.id_direccion} className="cat-card">
              <div className="card-info">
                <span className="card-type">PERSONA REF: #{d.id_Persona}</span>
                <span className="status-pill">SINCRONIZADO</span>
              </div>

              <h2 className="card-title">{d.nombre_persona} {d.apellido}</h2>
              
              <div className="audit-box" style={{ background: '#0f172a', border: '1px solid #1e293b', padding: '12px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#38bdf8', marginBottom: '8px' }}>
                  <MapPin size={16} />
                  <span style={{ fontWeight: 'bold', fontSize: '0.85rem' }}>UBICACIÓN REGISTRADA</span>
                </div>
                <div style={{ color: '#f8fafc', fontSize: '0.95rem', lineHeight: '1.4' }}>
                  <strong>{d.ciudad}</strong>, {d.barrio}<br/>
                  <small style={{ color: '#94a3b8' }}>{d.calle}</small>
                </div>
              </div>

              {isAdmin && (
                <div className="card-actions">
                  <button className="btn-edit" onClick={() => prepararEdicion(d)}><Edit size={16} /> Editar</button>
                  <button className="btn-del" onClick={() => setConfirmarBorrado({ abierto: true, id: d.id_direccion })}><Trash2 size={16} /></button>
                </div>
              )}
            </div>
          ))
        ) : (
          <div className="no-data">
            <AlertCircle size={40} style={{ opacity: 0.3, marginBottom: '10px' }} />
            <p>{mensajeApi || "Sin resultados"}</p>
          </div>
        )}
      </div>

      {/* MODAL: Solo accesible para Admin */}
      {mostrarModal && isAdmin && (
        <div className="modal-overlay">
          <div className="cat-form-card" style={{ maxWidth: '500px', width: '95%' }}>
            <div className="modal-header">
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <MapPin size={20} color="#38bdf8" />
                <h3>{formData.id_direccion ? "Actualizar Dirección" : "Nuevo Registro de Dirección"}</h3>
              </div>
              <X className="close-icon" onClick={() => setMostrarModal(false)} />
            </div>

            <form onSubmit={handleGuardar} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
              <div className="input-group">
                <label>Vincular a ID Persona</label>
                <input 
                    type="number" 
                    value={formData.id_Persona} 
                    onChange={(e) => setFormData({ ...formData, id_Persona: e.target.value })} 
                    disabled={!!formData.id_direccion}
                    placeholder="Ingrese ID de la persona"
                    required 
                />
              </div>

              <div className="input-group">
                <label>Ciudad</label>
                <input type="text" placeholder="Ej: Managua" value={formData.ciudad} onChange={(e) => setFormData({ ...formData, ciudad: e.target.value })} required />
              </div>

              <div className="input-group">
                <label>Barrio / Zona</label>
                <input type="text" placeholder="Ej: Linda Vista" value={formData.barrio} onChange={(e) => setFormData({ ...formData, barrio: e.target.value })} required />
              </div>

              <div className="input-group">
                <label>Dirección Exacta</label>
                <textarea 
                  rows="2"
                  style={{ background: '#0f172a', border: '1px solid #1e293b', color: 'white', borderRadius: '4px', padding: '10px' }}
                  value={formData.calle} 
                  onChange={(e) => setFormData({ ...formData, calle: e.target.value })} 
                  required 
                />
              </div>

              <div className="card-actions" style={{ marginTop: '10px' }}>
                <button type="button" className="btn-cancel" onClick={() => setMostrarModal(false)}>Cancelar</button>
                <button type="submit" className="btn-main" style={{ flex: 2 }}>
                  <Save size={18} /> {formData.id_direccion ? "Guardar Cambios" : "Registrar Dirección"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL BORRADO */}
      {confirmarBorrado.abierto && isAdmin && (
        <div className="modal-overlay">
          <div className="modal-confirm-card">
            <AlertCircle size={32} color="#ef4444" style={{ margin: '0 auto 15px', display: 'block' }} />
            <h3 style={{ textAlign: 'center' }}>¿Eliminar Ubicación?</h3>
            <p style={{ color: '#94a3b8', textAlign: 'center' }}>El registro dejará de estar disponible en NexaCore.</p>
            <div className="btn-confirm-group">
              <button className="btn-confirm-no" onClick={() => setConfirmarBorrado({ abierto: false, id: null })}>Volver</button>
              <button className="btn-confirm-yes" onClick={ejecutarEliminacion}>Confirmar</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ListarDirecciones;
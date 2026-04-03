import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Search, Plus, X, Save, ArrowLeft, MapPin, AlertCircle, Edit, Trash2, User
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
    try {
      // Limpiamos el objeto para enviar solo lo que el SP espera
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
    try {
      await eliminarDireccion(confirmarBorrado.id, userIdLogueado);
      showToast("Dirección eliminada correctamente", "warning");
      fetchDirecciones();
    } catch (error) {
      showToast("Error al eliminar la dirección", "error");
    } finally {
      setConfirmarBorrado({ abierto: false, id: null });
    }
  };

  const prepararEdicion = (d) => {
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
          <h1>Gestión de Direcciones</h1>
        </div>

        <div className="search-container">
          <input
            className="search-input"
            type="number"
            placeholder="Buscar por ID Persona..."
            value={busqueda}
            onChange={handleBusqueda}
          />
        </div>

        <button className="btn-main" onClick={() => { setFormData(estadoInicial); setMostrarModal(true); }}>
          <Plus size={18} /> Nueva Dirección
        </button>
      </div>

      <div className="cat-grid">
        {cargando ? (
          <div className="no-data">Sincronizando con NexaCore...</div>
        ) : lista.length > 0 ? (
          lista.map((d) => (
            <div key={d.id_direccion} className="cat-card">
              <div className="card-info">
                <span className="card-type">Persona ID: {d.id_Persona}</span>
                <span className="status-pill">{d.estado || 'ACTIVO'}</span>
              </div>

              <h2 className="card-title">{d.nombre_persona} {d.apellido}</h2>
              
              <div className="audit-box" style={{ background: '#0d1117', border: '1px solid #30363d' }}>
                <div style={{ fontSize: '0.8rem', color: '#58a6ff', marginBottom: '5px' }}>📍 Ubicación:</div>
                <div style={{ color: '#f0f6fc', fontSize: '0.9rem' }}>
                    {d.ciudad}, {d.barrio}<br/>
                    <small style={{ color: '#8b949e' }}>{d.calle}</small>
                </div>
              </div>

              <div className="card-actions">
                <button className="btn-edit" onClick={() => prepararEdicion(d)}><Edit size={16} /> Editar</button>
                <button className="btn-del" onClick={() => setConfirmarBorrado({ abierto: true, id: d.id_direccion })}><Trash2 size={16} /> Borrar</button>
              </div>
            </div>
          ))
        ) : (
          <div className="no-data">
            <AlertCircle size={40} style={{ opacity: 0.5 }} />
            <p>{mensajeApi}</p>
          </div>
        )}
      </div>

      {mostrarModal && (
        <div className="modal-overlay">
          <div className="cat-form-card" style={{ maxWidth: '500px', width: '90%' }}>
            <div className="modal-header">
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <MapPin size={20} color="#58a6ff" />
                <h3 style={{ color: 'white' }}>{formData.id_direccion ? "Editar Ubicación" : "Registrar Dirección"}</h3>
              </div>
              <X className="close-icon" onClick={() => setMostrarModal(false)} />
            </div>

            <form onSubmit={handleGuardar} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
              <div className="input-group">
                <label>ID Persona</label>
                <input 
                    type="number" 
                    value={formData.id_Persona} 
                    onChange={(e) => setFormData({ ...formData, id_Persona: e.target.value })} 
                    disabled={!!formData.id_direccion}
                    required 
                />
              </div>

              <div className="input-group">
                <label>Ciudad</label>
                <input type="text" value={formData.ciudad} onChange={(e) => setFormData({ ...formData, ciudad: e.target.value })} required />
              </div>

              <div className="input-group">
                <label>Barrio</label>
                <input type="text" value={formData.barrio} onChange={(e) => setFormData({ ...formData, barrio: e.target.value })} required />
              </div>

              <div className="input-group">
                <label>Calle / Referencia</label>
                <input type="text" value={formData.calle} onChange={(e) => setFormData({ ...formData, calle: e.target.value })} required />
              </div>

              <div className="card-actions">
                <button type="button" className="btn-cancel" onClick={() => setMostrarModal(false)}>Cancelar</button>
                <button type="submit" className="btn-main" style={{ flex: 2 }}>
                  <Save size={18} /> {formData.id_direccion ? "Actualizar" : "Guardar"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL BORRADO */}
      {confirmarBorrado.abierto && (
        <div className="modal-overlay">
          <div className="modal-confirm-card">
            <AlertCircle size={32} color="#f85149" style={{ margin: '0 auto 15px', display: 'block' }} />
            <h3 style={{ color: 'white', textAlign: 'center' }}>¿Eliminar esta dirección?</h3>
            <p style={{ color: '#8b949e', textAlign: 'center' }}>Esta acción desactivará el registro en NexaCore.</p>
            <div className="btn-confirm-group">
              <button className="btn-confirm-no" onClick={() => setConfirmarBorrado({ abierto: false, id: null })}>Cancelar</button>
              <button className="btn-confirm-yes" onClick={ejecutarEliminacion}>Eliminar</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ListarDirecciones;
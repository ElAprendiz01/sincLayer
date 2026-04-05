import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { 
  Search, Plus, X, Save, ArrowLeft, Calendar, AlertCircle, Edit, Trash2, User 
} from "lucide-react";
import { 
  getPrestamos, 
  insertarPrestamo, 
  editarPrestamo, 
  eliminarPrestamo, 
  buscarPrestamosPorUsuario 
} from "../../services/prestamosService";
import ListarLibros from "../Libros/ListarLibros"; 
import "../../styles/datospersonales.css";
import { useToast } from "../../components/ToastContext";

// Agregamos la prop esCliente para reutilizar el componente
const ListarPrestamos = ({ esCliente = false }) => {
  const navigate = useNavigate();
  const { showToast } = useToast();
  const [lista, setLista] = useState([]);
  const [busquedaId, setBusquedaId] = useState("");
  const [mostrarModal, setMostrarModal] = useState(false);
  const [mostrarConsultaLibros, setMostrarConsultaLibros] = useState(false);
  const [cargando, setCargando] = useState(false);
  const [confirmarBorrado, setConfirmarBorrado] = useState({ abierto: false, id: null });

  const userIdLogueado = parseInt(localStorage.getItem("userId") || "0");

  const estadoInicial = {
    id_Prestamo: null,
    id_Usuario_Cliente: userIdLogueado, 
    id_Libro: "",
    fecha_Vencimiento: "",
    observaciones: "",
    id_Creador: userIdLogueado,
    id_Estado: 3
  };

  const [formData, setFormData] = useState(estadoInicial);

  useEffect(() => {
    // Si es cliente, forzamos la búsqueda por su propio ID
    if (esCliente) {
      fetchPrestamosCliente();
    } else {
      const filtrar = async () => {
        if (busquedaId.trim() === "") {
          fetchPrestamos();
          return;
        }
        setCargando(true);
        try {
          const res = await buscarPrestamosPorUsuario(busquedaId);
          setLista(res.data || []);
        } catch (error) {
          setLista([]);
        } finally { setCargando(false); }
      };
      const delay = setTimeout(filtrar, 500);
      return () => clearTimeout(delay);
    }
  }, [busquedaId, esCliente]);

  const fetchPrestamos = async () => {
    setCargando(true);
    try {
      const res = await getPrestamos();
      setLista(res.data || []);
    } catch (error) {
      showToast("Error al cargar préstamos", "error");
    } finally { setCargando(false); }
  };

  // Función específica para que el cliente solo vea lo suyo
  const fetchPrestamosCliente = async () => {
    setCargando(true);
    try {
      const res = await buscarPrestamosPorUsuario(userIdLogueado);
      setLista(res.data || []);
    } catch (error) {
      setLista([]);
    } finally { setCargando(false); }
  };

  const handleGuardar = async (e) => {
    e.preventDefault();
    try {
      if (formData.id_Prestamo) {
        const payloadActualizacion = {
          id_Prestamo: formData.id_Prestamo,
          id_Modificador: userIdLogueado,
          id_Estado: formData.id_Estado
        };
        await editarPrestamo(formData.id_Prestamo, payloadActualizacion);
        showToast("Estado actualizado", "success");
      } else {
        await insertarPrestamo(formData);
        showToast("Préstamo registrado", "success");
      }
      setMostrarModal(false);
      esCliente ? fetchPrestamosCliente() : fetchPrestamos();
    } catch (error) {
      showToast(error.response?.data?.msj || "Error en la operación", "error");
    }
  };

  const ejecutarEliminacion = async () => {
    try {
      await eliminarPrestamo(confirmarBorrado.id, userIdLogueado);
      showToast("Préstamo eliminado", "warning");
      fetchPrestamos();
    } catch (error) { showToast("No se pudo eliminar", "error"); }
    finally { setConfirmarBorrado({ abierto: false, id: null }); }
  };

  const prepararEdicion = (p) => {
    setFormData({
      id_Prestamo: p.id_Prestamo,
      id_Usuario_Cliente: p.id_Usuario_Cliente,
      id_Libro: p.id_Libro || "",
      fecha_Vencimiento: p.fecha_Vencimiento ? p.fecha_Vencimiento.split('T')[0] : "",
      observaciones: p.observaciones || "",
      id_Estado: p.id_Estado || 3
    });
    setMostrarModal(true);
  };

  return (
    <div className="cat-page">
      <div className="cat-header">
        <div className="header-left">
          <button className="btn-back" onClick={() => navigate(-1)}><ArrowLeft size={20} /></button>
          <h1>{esCliente ? "Mis Préstamos" : "Gestión de Préstamos"}</h1>
        </div>

        {/* El buscador solo aparece si NO es cliente (el admin busca a otros) */}
        {!esCliente && (
          <div className="search-container" style={{ flex: 1, margin: '0 20px' }}>
            <Search className="search-icon-inside" size={18} />
            <input 
              className="search-input" 
              placeholder="Buscar por ID de Usuario..." 
              value={busquedaId} 
              onChange={(e) => setBusquedaId(e.target.value)} 
            />
          </div>
        )}

        <button className="btn-main" onClick={() => { setFormData(estadoInicial); setMostrarModal(true); }}>
          <Plus size={18} /> Solicitar Nuevo
        </button>
      </div>

      <div className="cat-grid">
        {cargando ? (
          <div className="no-data">Cargando préstamos...</div>
        ) : lista.length > 0 ? (
          lista.map((p) => (
            <div key={p.id_Prestamo} className="cat-card">
              <div className="card-info">
                <span className="card-type">Folio: #{p.id_Prestamo}</span>
                <span className={`status-pill ${p.estado?.toLowerCase()}`}>{p.estado}</span>
              </div>
              <h2 className="card-title">{p.libro || "Libro no especificado"}</h2>
              <div className="audit-box">
                <div className="audit-row">
                  <User size={14} />
                  <span className="audit-label">Cliente:</span>
                  <span className="audit-user">{p.nombre_Cliente}</span>
                </div>
                <div className="audit-row">
                  <Calendar size={14} />
                  <span className="audit-label">Vence:</span>
                  <span className="audit-user">{new Date(p.fecha_Vencimiento).toLocaleDateString()}</span>
                </div>
              </div>

              {/* SOLO MOSTRAR ACCIONES SI NO ES CLIENTE */}
              {!esCliente && (
                <div className="card-actions">
                  <button className="btn-edit" onClick={() => prepararEdicion(p)}><Edit size={16} /> Editar</button>
                  <button className="btn-del" onClick={() => setConfirmarBorrado({ abierto: true, id: p.id_Prestamo })}><Trash2 size={16} /> Borrar</button>
                </div>
              )}
            </div>
          ))
        ) : (
          <div className="no-results-container">
            <AlertCircle size={48} color="#666" />
            <p>{esCliente ? "Aún no tienes préstamos registrados." : "No se encontraron préstamos."}</p>
          </div>
        )}
      </div>

      {/* El modal de formulario se mantiene igual para permitir "Nuevo Préstamo" */}
      {mostrarModal && (
        <div className="modal-overlay" style={{ zIndex: 1000 }}>
          <div className="cat-form-card" style={{ maxWidth: '500px', display: 'flex', flexDirection: 'column' }}>
            <div className="modal-header">
              <h3>{formData.id_Prestamo ? "Detalles del Préstamo" : "Nueva Solicitud"}</h3>
              <X className="close-icon" onClick={() => setMostrarModal(false)} />
            </div>
            
            <form onSubmit={handleGuardar} className="form-main">
              {!formData.id_Prestamo ? (
                <>
                  <div className="form-section">
                    <label>ID LIBRO</label>
                    <div style={{ display: 'flex', gap: '8px' }}>
                      <input 
                        type="number" 
                        placeholder="ID del libro"
                        style={{ flex: 1 }}
                        value={formData.id_Libro} 
                        onChange={(e) => setFormData({...formData, id_Libro: e.target.value})} 
                        required 
                      />
                      <button 
                        type="button" 
                        className="btn-edit"
                        onClick={() => setMostrarConsultaLibros(true)}
                        style={{ padding: '0 15px', height: '45px', backgroundColor: '#3b82f6', color: 'white', border: 'none' }}
                      >
                        <Search size={18} />
                      </button>
                    </div>
                  </div>

                  <div className="form-section">
                    <label>FECHA VENCIMIENTO</label>
                    <input 
                      type="date" 
                      className="full-input"
                      value={formData.fecha_Vencimiento} 
                      onChange={(e) => setFormData({...formData, fecha_Vencimiento: e.target.value})} 
                      required
                    />
                  </div>

                  <div className="form-section">
                    <label>OBSERVACIONES</label>
                    <textarea 
                      placeholder="¿Por qué necesitas este libro?"
                      className="full-input"
                      style={{ minHeight: '80px' }}
                      value={formData.observaciones} 
                      onChange={(e) => setFormData({...formData, observaciones: e.target.value})}
                    />
                  </div>
                </>
              ) : (
                <div className="form-section">
                  <label>ESTADO ACTUAL</label>
                  <p className="status-pill active" style={{textAlign: 'center', padding: '10px'}}>{formData.id_Estado === 3 ? "ACTIVO" : "EN PROCESO"}</p>
                </div>
              )}

              <div className="modal-footer">
                <button type="button" className="btn-cancelar" onClick={() => setMostrarModal(false)}>
                  Cerrar
                </button>
                {!formData.id_Prestamo && (
                  <button type="submit" className="btn-guardar-pro">
                    <Save size={18} /> Confirmar Solicitud
                  </button>
                )}
              </div>
            </form>
          </div>
        </div>
      )}

      {/* BUSCADOR DE LIBROS (Reutilizado) */}
      {mostrarConsultaLibros && (
        <div className="modal-overlay" style={{ zIndex: 2000 }}>
          <div className="cat-form-card" style={{ maxWidth: '90%', width: '900px', height: '80vh', overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
            <div className="modal-header">
              <h3>Selecciona un Libro</h3>
              <button className="btn-del" onClick={() => setMostrarConsultaLibros(false)}>Cerrar</button>
            </div>
            <div style={{ flex: 1, overflowY: 'auto', padding: '10px' }}>
              <ListarLibros soloLectura={true} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ListarPrestamos;
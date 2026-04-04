import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { 
  Search, Plus, X, Save, ArrowLeft, Calendar, AlertCircle, Edit, Trash2, User, BookOpen 
} from "lucide-react";
import { 
  getPrestamos, 
  insertarPrestamo, 
  editarPrestamo, 
  eliminarPrestamo, 
  buscarPrestamosPorUsuario 
} from "../../services/prestamosService";
import "../../styles/datospersonales.css";
import { useToast } from "../../components/ToastContext";

const ListarPrestamos = () => {
  const navigate = useNavigate();
  const { showToast } = useToast();
  const [lista, setLista] = useState([]);
  const [busquedaId, setBusquedaId] = useState("");
  const [mostrarModal, setMostrarModal] = useState(false);
  const [cargando, setCargando] = useState(false);
  const [confirmarBorrado, setConfirmarBorrado] = useState({ abierto: false, id: null });

  const userIdLogueado = parseInt(localStorage.getItem("userId") || "0");

  const estadoInicial = {
    id_Prestamo: null,
    id_Usuario_Cliente: "", 
    id_Libro: "",
    fecha_Vencimiento: "",
    observaciones: "",
    id_Creador: userIdLogueado,
    id_Estado: 3
  };

  const [formData, setFormData] = useState(estadoInicial);

  useEffect(() => {
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
  }, [busquedaId]);

  const fetchPrestamos = async () => {
    setCargando(true);
    try {
      const res = await getPrestamos();
      setLista(res.data || []);
    } catch (error) {
      showToast("Error al cargar préstamos", "error");
    } finally { setCargando(false); }
  };

  const handleGuardar = async (e) => {
    e.preventDefault();
    try {
      if (formData.id_Prestamo) {
        await editarPrestamo(formData.id_Prestamo, { ...formData, id_Modificador: userIdLogueado });
        showToast("Préstamo actualizado", "success");
      } else {
        await insertarPrestamo(formData);
        showToast("Préstamo registrado", "success");
      }
      setMostrarModal(false);
      fetchPrestamos();
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
          <button className="btn-back" onClick={() => navigate("/admin")}><ArrowLeft size={20} /></button>
          <h1>Gestión de Préstamos</h1>
        </div>

        <div className="search-container" style={{ flex: 1, margin: '0 20px' }}>
          <Search className="search-icon-inside" size={18} />
          <input 
            className="search-input" 
            placeholder="Buscar por ID de Usuario..." 
            value={busquedaId} 
            onChange={(e) => setBusquedaId(e.target.value)} 
          />
        </div>

        <button className="btn-main" onClick={() => { setFormData(estadoInicial); setMostrarModal(true); }}>
          <Plus size={18} /> Nuevo Préstamo
        </button>
      </div>

      <div className="cat-grid">
        {cargando ? (
          <div className="no-data">Cargando préstamos...</div>
        ) : lista.length > 0 ? (
          lista.map((p) => (
            <div key={p.id_Prestamo} className="cat-card">
              <div className="card-info">
                <span className="card-type">ID: #{p.id_Prestamo}</span>
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
              <div className="card-actions">
                <button className="btn-edit" onClick={() => prepararEdicion(p)}><Edit size={16} /> Editar</button>
                <button className="btn-del" onClick={() => setConfirmarBorrado({ abierto: true, id: p.id_Prestamo })}><Trash2 size={16} /> Borrar</button>
              </div>
            </div>
          ))
        ) : (
          <div className="no-results-container">
            <AlertCircle size={48} color="#666" />
            <p>No se encontraron préstamos activos.</p>
          </div>
        )}
      </div>

      {mostrarModal && (
        <div className="modal-overlay">
          <div className="cat-form-card" style={{ maxWidth: '500px' }}>
            <div className="modal-header">
              <h3>{formData.id_Prestamo ? "Actualizar Préstamo" : "Registrar Préstamo"}</h3>
              <X className="close-icon" onClick={() => setMostrarModal(false)} />
            </div>
            <form onSubmit={handleGuardar} className="form-main">
              <div className="form-section">
                <label>ID Usuario Cliente</label>
                <input 
                  type="number" 
                  value={formData.id_Usuario_Cliente} 
                  onChange={(e) => setFormData({...formData, id_Usuario_Cliente: e.target.value})} 
                  required={!formData.id_Prestamo}
                />
              </div>

              {!formData.id_Prestamo && (
                <div className="form-section">
                  <label>ID Libro</label>
                  <input 
                    type="number" 
                    value={formData.id_Libro} 
                    onChange={(e) => setFormData({...formData, id_Libro: e.target.value})} 
                    required 
                  />
                </div>
              )}

              <div className="form-section">
                <label>Fecha Vencimiento</label>
                <input 
                  type="date" 
                  value={formData.fecha_Vencimiento} 
                  onChange={(e) => setFormData({...formData, fecha_Vencimiento: e.target.value})} 
                  required={!formData.id_Prestamo}
                />
              </div>

              <div className="form-section">
                <label>Observaciones</label>
                <textarea 
                  className="full-input"
                  style={{padding: '10px', borderRadius: '8px', border: '1px solid #ddd'}}
                  value={formData.observaciones} 
                  onChange={(e) => setFormData({...formData, observaciones: e.target.value})}
                />
              </div>

              {formData.id_Prestamo && (
                 <div className="form-section">
                 <label>Estado</label>
                 <select className="custom-select" value={formData.id_Estado} onChange={(e) => setFormData({...formData, id_Estado: parseInt(e.target.value)})}>
                   <option value={3}>Activo</option>
                   <option value={4}>Finalizado/Inactivo</option>
                 </select>
               </div>
              )}

              <div className="modal-footer">
                <button type="button" className="btn-cancelar" onClick={() => setMostrarModal(false)}>Cerrar</button>
                <button type="submit" className="btn-guardar-pro"><Save size={18} /> Guardar</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {confirmarBorrado.abierto && (
        <div className="modal-overlay">
          <div className="modal-confirm-card">
            <AlertCircle size={40} color="#f85149" />
            <h3>¿Eliminar este préstamo?</h3>
            <p>Esta acción desactivará el registro permanentemente.</p>
            <div className="btn-confirm-group">
              <button className="btn-confirm-no" onClick={() => setConfirmarBorrado({abierto:false})}>No</button>
              <button className="btn-confirm-yes" onClick={ejecutarEliminacion}>Sí, eliminar</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ListarPrestamos;
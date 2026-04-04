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
    id_Estado: 3 // Activo por defecto
  };

  const [formData, setFormData] = useState(estadoInicial);

  // Lista de estados disponibles según tu base de datos
  const opcionesEstados = [
    { id: 3, nombre: "Activo" },
    { id: 4, nombre: "Inactivo" },
    { id: 12, nombre: "Pagada" },
    { id: 13, nombre: "Cancelada" },
    { id: 15, nombre: "Mora" },
    { id: 16, nombre: "Devuelto" },
    { id: 17, nombre: "Dañado" }
  ];

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
        // OBJETO SIMPLIFICADO PARA ACTUALIZAR (Solo lo que pide el SP)
        const payload = {
          Id_Prestamo: formData.id_Prestamo,
          Id_Estado: parseInt(formData.id_Estado),
          Id_Modificador: userIdLogueado,
          Observaciones: formData.observaciones // Opcional por si el SP lo usa
        };
        await editarPrestamo(formData.id_Prestamo, payload);
        showToast("Estado actualizado", "success");
      } else {
        await insertarPrestamo(formData);
        showToast("Préstamo registrado", "success");
      }
      setMostrarModal(false);
      fetchPrestamos();
    } catch (error) {
      const msjError = error.response?.data?.msj || "Error en el servidor";
      showToast(msjError, "error");
    }
  };

  const prepararEdicion = (p) => {
    setFormData({
      id_Prestamo: p.id_Prestamo,
      observaciones: p.observaciones || "",
      id_Estado: p.id_Estado || 3,
      // Mantenemos estos para que el DTO no truene si son requeridos en el objeto, 
      // aunque el SP use COALESCE
      id_Usuario_Cliente: p.id_Usuario_Cliente,
      id_Libro: p.id_Libro || 0
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
                <span className={`status-pill`}>{p.estado}</span>
              </div>
              <h2 className="card-title">{p.libro || "Libro"}</h2>
              <div className="audit-box">
                <div className="audit-row">
                  <User size={14} />
                  <span className="audit-user">{p.nombre_Cliente}</span>
                </div>
                <div className="audit-row">
                  <Calendar size={14} />
                  <span className="audit-user">Vence: {new Date(p.fecha_Vencimiento).toLocaleDateString()}</span>
                </div>
              </div>
              <div className="card-actions">
                <button className="btn-edit" onClick={() => prepararEdicion(p)}><Edit size={16} /> Cambiar Estado</button>
                <button className="btn-del" onClick={() => setConfirmarBorrado({ abierto: true, id: p.id_Prestamo })}><Trash2 size={16} /> Borrar</button>
              </div>
            </div>
          ))
        ) : (
          <div className="no-results-container">
            <AlertCircle size={48} color="#666" />
            <p>No se encontraron resultados.</p>
          </div>
        )}
      </div>

      {mostrarModal && (
        <div className="modal-overlay">
          <div className="cat-form-card" style={{ maxWidth: '450px' }}>
            <div className="modal-header">
              <h3>{formData.id_Prestamo ? `Actualizar Préstamo #${formData.id_Prestamo}` : "Nuevo Préstamo"}</h3>
              <X className="close-icon" onClick={() => setMostrarModal(false)} />
            </div>
            <form onSubmit={handleGuardar} className="form-main">
              
              {/* SOLO MOSTRAR ESTOS CAMPOS SI ES NUEVO */}
              {!formData.id_Prestamo && (
                <>
                  <div className="form-section">
                    <label>ID Usuario Cliente</label>
                    <input type="number" value={formData.id_Usuario_Cliente} onChange={(e) => setFormData({...formData, id_Usuario_Cliente: e.target.value})} required />
                  </div>
                  <div className="form-section">
                    <label>ID Libro</label>
                    <input type="number" value={formData.id_Libro} onChange={(e) => setFormData({...formData, id_Libro: e.target.value})} required />
                  </div>
                  <div className="form-section">
                    <label>Fecha Vencimiento</label>
                    <input type="date" value={formData.fecha_Vencimiento} onChange={(e) => setFormData({...formData, fecha_Vencimiento: e.target.value})} required />
                  </div>
                </>
              )}

              {/* ESTO SE MUESTRA SIEMPRE O EN EDICIÓN */}
              <div className="form-section">
                <label>Estado del Préstamo</label>
                <select 
                  className="custom-select" 
                  value={formData.id_Estado} 
                  onChange={(e) => setFormData({...formData, id_Estado: e.target.value})}
                >
                  {opcionesEstados.map(est => (
                    <option key={est.id} value={est.id}>{est.nombre}</option>
                  ))}
                </select>
              </div>

              <div className="form-section">
                <label>Observaciones / Notas</label>
                <textarea 
                  className="full-input"
                  style={{minHeight: '80px', padding: '10px'}}
                  value={formData.observaciones} 
                  onChange={(e) => setFormData({...formData, observaciones: e.target.value})}
                />
              </div>

              <div className="modal-footer">
                <button type="button" className="btn-cancelar" onClick={() => setMostrarModal(false)}>Cancelar</button>
                <button type="submit" className="btn-guardar-pro"><Save size={18} /> {formData.id_Prestamo ? "Actualizar" : "Guardar"}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ListarPrestamos;
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { 
  Search, Plus, X, Save, ArrowLeft, Calendar, AlertCircle, Edit, Trash2, User, BookOpen, RefreshCw 
} from "lucide-react";
import { 
  getDevoluciones, 
  registrarDevolucion, 
  actualizarDevolucion, 
  eliminarDevolucion, 
  buscarDevolucionesPorUsuario 
} from "../../services/devolucionesService";
import "../../styles/datospersonales.css";
import { useToast } from "../../components/ToastContext";

const GestionDevoluciones = () => {
  const navigate = useNavigate();
  const { showToast } = useToast();
  const [lista, setLista] = useState([]);
  const [busquedaId, setBusquedaId] = useState("");
  const [mostrarModal, setMostrarModal] = useState(false);
  const [cargando, setCargando] = useState(false);
  const [confirmarBorrado, setConfirmarBorrado] = useState({ abierto: false, id: null });

  const userIdLogueado = parseInt(localStorage.getItem("userId") || "0");

  const estadoInicial = {
    id_Devolucion: null,
    id_Prestamo: "",
    id_Estado_Libro: 3, // Activo/Buen estado por defecto
    id_Creador: userIdLogueado,
    id_Estado: 3,
    forzarRecuperacion: false
  };

  const [formData, setFormData] = useState(estadoInicial);

  // Opciones de estado para el registro (según tu DB)
  const opcionesEstadosLibro = [
    { id: 3, nombre: "Buen Estado / Activo" },
    { id: 17, nombre: "Dañado / Requiere Reparación" }
  ];

  const opcionesEstadosRegistro = [
    { id: 3, nombre: "Activo" },
    { id: 4, nombre: "Inactivo / Anulado" }
  ];

  useEffect(() => {
    const filtrar = async () => {
      if (busquedaId.trim() === "") {
        fetchDevoluciones();
        return;
      }
      setCargando(true);
      try {
        const res = await buscarDevolucionesPorUsuario(busquedaId);
        setLista(res.data || []);
      } catch (error) {
        setLista([]);
      } finally { setCargando(false); }
    };
    const delay = setTimeout(filtrar, 500);
    return () => clearTimeout(delay);
  }, [busquedaId]);

  const fetchDevoluciones = async () => {
    setCargando(true);
    try {
      const res = await getDevoluciones();
      setLista(res.data || []);
    } catch (error) {
      showToast("Error al cargar devoluciones", "error");
    } finally { setCargando(false); }
  };

  const handleGuardar = async (e) => {
    e.preventDefault();
    try {
      if (formData.id_Devolucion) {
        const payload = {
          Id_Devolucion: formData.id_Devolucion,
          Id_Modificador: userIdLogueado,
          Id_Estado: parseInt(formData.id_Estado),
          ForzarRecuperacion: formData.forzarRecuperacion
        };
        await actualizarDevolucion(formData.id_Devolucion, payload);
        showToast("Devolución actualizada", "success");
      } else {
        const payloadInsert = {
          Id_Prestamo: parseInt(formData.id_Prestamo),
          Id_Estado_Libro: parseInt(formData.id_Estado_Libro),
          Id_Creador: userIdLogueado
        };
        await registrarDevolucion(payloadInsert);
        showToast("Devolución registrada", "success");
      }
      setMostrarModal(false);
      fetchDevoluciones();
    } catch (error) {
      const msj = error.response?.data?.msj || "Error en el servidor";
      showToast(msj, "error");
    }
  };

  const prepararEdicion = (d) => {
    setFormData({
      id_Devolucion: d.id_Devolucion,
      id_Prestamo: d.id_Prestamo,
      id_Estado: 3, 
      forzarRecuperacion: false,
      id_Estado_Libro: 3
    });
    setMostrarModal(true);
  };

  const ejecutarEliminacion = async () => {
    try {
      await eliminarDevolucion(confirmarBorrado.id, userIdLogueado);
      showToast("Registro eliminado", "warning");
      fetchDevoluciones();
    } catch (error) {
      showToast("No se pudo eliminar", "error");
    } finally {
      setConfirmarBorrado({ abierto: false, id: null });
    }
  };

  return (
    <div className="cat-page">
      <div className="cat-header">
        <div className="header-left">
          <button className="btn-back" onClick={() => navigate("/admin")}><ArrowLeft size={20} /></button>
          <h1>Gestión de Devoluciones</h1>
        </div>

        <div className="search-container" style={{ flex: 1, margin: '0 20px' }}>
          <Search className="search-icon-inside" size={18} />
          <input 
            className="search-input" 
            placeholder="Buscar por ID de Cliente..." 
            value={busquedaId} 
            onChange={(e) => setBusquedaId(e.target.value)} 
          />
        </div>

        <button className="btn-main" onClick={() => { setFormData(estadoInicial); setMostrarModal(true); }}>
          <Plus size={18} /> Nueva Devolución
        </button>
      </div>

      <div className="cat-grid">
        {cargando ? (
          <div className="no-data">Cargando datos...</div>
        ) : lista.length > 0 ? (
          lista.map((d) => (
            <div key={d.id_Devolucion} className="cat-card">
              <div className="card-info">
                <span className="card-type">DEV: #{d.id_Devolucion}</span>
                <span className="status-pill">{d.estadoRegistro}</span>
              </div>
              <h2 className="card-title">{d.libro || "Sin título"}</h2>
              <div className="audit-box">
                <div className="audit-row">
                  <User size={14} />
                  <span className="audit-user">{d.nombreCliente || d.usuario}</span>
                </div>
                <div className="audit-row">
                  <RefreshCw size={14} />
                  <span className="audit-user">Entregado: {new Date(d.fecha_Entrega).toLocaleDateString()}</span>
                </div>
                <div className="audit-row">
                  <BookOpen size={14} />
                  <span className="audit-user">Estado: {d.estadoLibro}</span>
                </div>
              </div>
              <div className="card-actions">
                <button className="btn-edit" onClick={() => prepararEdicion(d)}><Edit size={16} /> Gestionar</button>
                <button className="btn-del" onClick={() => setConfirmarBorrado({ abierto: true, id: d.id_Devolucion })}><Trash2 size={16} /></button>
              </div>
            </div>
          ))
        ) : (
          <div className="no-results-container">
            <AlertCircle size={48} color="#666" />
            <p>No hay devoluciones registradas.</p>
          </div>
        )}
      </div>

      {mostrarModal && (
        <div className="modal-overlay">
          <div className="cat-form-card" style={{ maxWidth: '450px' }}>
            <div className="modal-header">
              <h3>{formData.id_Devolucion ? `Devolución #${formData.id_Devolucion}` : "Registrar Devolución"}</h3>
              <X className="close-icon" onClick={() => setMostrarModal(false)} />
            </div>
            <form onSubmit={handleGuardar} className="form-main">
              {!formData.id_Devolucion ? (
                <>
                  <div className="form-section">
                    <label>ID del Préstamo</label>
                    <input type="number" value={formData.id_Prestamo} onChange={(e) => setFormData({...formData, id_Prestamo: e.target.value})} placeholder="Código del préstamo" required />
                  </div>
                  <div className="form-section">
                    <label>Estado Físico del Libro</label>
                    <select className="custom-select" value={formData.id_Estado_Libro} onChange={(e) => setFormData({...formData, id_Estado_Libro: e.target.value})}>
                      {opcionesEstadosLibro.map(est => <option key={est.id} value={est.id}>{est.nombre}</option>)}
                    </select>
                  </div>
                </>
              ) : (
                <>
                  <div className="form-section">
                    <label>Estado del Registro</label>
                    <select className="custom-select" value={formData.id_Estado} onChange={(e) => setFormData({...formData, id_Estado: e.target.value})}>
                      {opcionesEstadosRegistro.map(est => <option key={est.id} value={est.id}>{est.nombre}</option>)}
                    </select>
                  </div>
                  <div className="form-section" style={{display:'flex', gap:'10px', alignItems:'center'}}>
                    <input type="checkbox" checked={formData.forzarRecuperacion} onChange={(e) => setFormData({...formData, forzarRecuperacion: e.target.checked})} />
                    <label>¿Forzar recuperación de stock?</label>
                  </div>
                </>
              )}

              <div className="modal-footer">
                <button type="button" className="btn-cancelar" onClick={() => setMostrarModal(false)}>Cancelar</button>
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
            <h3>¿Eliminar Devolución?</h3>
            <p>Se desactivará este registro del historial.</p>
            <div className="btn-confirm-group">
              <button className="btn-confirm-no" onClick={() => setConfirmarBorrado({abierto:false})}>No</button>
              <button className="btn-confirm-yes" onClick={ejecutarEliminacion}>Sí, Eliminar</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default GestionDevoluciones;
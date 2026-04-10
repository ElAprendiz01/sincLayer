import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { 
  Search, Plus, X, Save, ArrowLeft, Calendar, AlertCircle, Edit, Trash2, User, BookOpen, RefreshCw, ShieldCheck, ShieldAlert 
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

  // --- CONTROL DE ACCESO NEXACORE ---
  const userRole = localStorage.getItem("userRole")?.toLowerCase();
  const isAdmin = userRole === "admin";

  const [lista, setLista] = useState([]);
  const [busquedaId, setBusquedaId] = useState("");
  const [mostrarModal, setMostrarModal] = useState(false);
  const [cargando, setCargando] = useState(false);
  const [confirmarBorrado, setConfirmarBorrado] = useState({ abierto: false, id: null });

  const userIdLogueado = parseInt(localStorage.getItem("userId") || "0");

  const estadoInicial = {
    id_Devolucion: null,
    id_Prestamo: "",
    id_Estado_Libro: 3, 
    id_Creador: userIdLogueado,
    id_Estado: 3,
    forzarRecuperacion: false
  };

  const [formData, setFormData] = useState(estadoInicial);

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
    if (!isAdmin) return;

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
        showToast("Devolución registrada con éxito", "success");
      }
      setMostrarModal(false);
      fetchDevoluciones();
    } catch (error) {
      const msj = error.response?.data?.msj || "Error en el servidor de NexaCore";
      showToast(msj, "error");
    }
  };

  const prepararEdicion = (d) => {
    if (!isAdmin) return;
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
    if (!isAdmin) return;
    try {
      await eliminarDevolucion(confirmarBorrado.id, userIdLogueado);
      showToast("Registro desactivado", "warning");
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
          <div>
            <h1>Gestión de Devoluciones</h1>
            <p className={`role-badge ${isAdmin ? 'admin' : 'readonly'}`}>
              {isAdmin ? <ShieldCheck size={14} /> : <ShieldAlert size={14} />}
              {isAdmin ? "Control de Inventario" : "Modo Consulta"}
            </p>
          </div>
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

        {isAdmin && (
          <button className="btn-main" onClick={() => { setFormData(estadoInicial); setMostrarModal(true); }}>
            <Plus size={18} /> Nueva Devolución
          </button>
        )}
      </div>

      <div className="cat-grid">
        {cargando ? (
          <div className="no-data">Sincronizando devoluciones...</div>
        ) : lista.length > 0 ? (
          lista.map((d) => (
            <div key={d.id_Devolucion} className="cat-card">
              <div className="card-info">
                <span className="card-type">FOLIO: #{d.id_Devolucion}</span>
                <span className={`status-pill ${d.estadoRegistro?.toLowerCase()}`}>{d.estadoRegistro}</span>
              </div>
              <h2 className="card-title">{d.libro || "Libro no identificado"}</h2>
              <div className="audit-box">
                <div className="audit-row">
                  <User size={14} color="#38bdf8" />
                  <span className="audit-user">{d.nombreCliente || d.usuario}</span>
                </div>
                <div className="audit-row">
                  <RefreshCw size={14} color="#10b981" />
                  <span className="audit-user">Retorno: {new Date(d.fecha_Entrega).toLocaleDateString()}</span>
                </div>
                <div className="audit-row">
                  <BookOpen size={14} color="#f59e0b" />
                  <span className="audit-user">Estado Físico: {d.estadoLibro}</span>
                </div>
              </div>
              {isAdmin && (
                <div className="card-actions">
                  <button className="btn-edit" onClick={() => prepararEdicion(d)}><Edit size={16} /> Gestionar</button>
                  <button className="btn-del" onClick={() => setConfirmarBorrado({ abierto: true, id: d.id_Devolucion })}><Trash2 size={16} /></button>
                </div>
              )}
            </div>
          ))
        ) : (
          <div className="no-results-container">
            <AlertCircle size={48} color="#475569" />
            <p>No se encontraron registros de devolución.</p>
          </div>
        )}
      </div>

      {/* MODAL FORMULARIO: Solo Admin */}
      {mostrarModal && isAdmin && (
        <div className="modal-overlay">
          <div className="cat-form-card" style={{ maxWidth: '450px' }}>
            <div className="modal-header">
              <h3>{formData.id_Devolucion ? `Gestión Folio #${formData.id_Devolucion}` : "Registrar Entrada"}</h3>
              <X className="close-icon" onClick={() => setMostrarModal(false)} />
            </div>
            <form onSubmit={handleGuardar} className="form-main">
              {!formData.id_Devolucion ? (
                <>
                  <div className="form-section">
                    <label>Código del Préstamo</label>
                    <input type="number" value={formData.id_Prestamo} onChange={(e) => setFormData({...formData, id_Prestamo: e.target.value})} placeholder="Ingrese ID de préstamo" required />
                  </div>
                  <div className="form-section">
                    <label>Condición del Libro</label>
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
                  <div className="audit-box" style={{marginTop: '10px'}}>
                    <div className="form-section-check">
                      <input type="checkbox" id="recup" checked={formData.forzarRecuperacion} onChange={(e) => setFormData({...formData, forzarRecuperacion: e.target.checked})} />
                      <label htmlFor="recup">Sincronizar stock manualmente</label>
                    </div>
                  </div>
                </>
              )}

              <div className="modal-footer">
                <button type="button" className="btn-cancelar" onClick={() => setMostrarModal(false)}>Cerrar</button>
                <button type="submit" className="btn-guardar-pro"><Save size={18} /> Aplicar Cambios</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* CONFIRMACIÓN BORRADO: Solo Admin */}
      {confirmarBorrado.abierto && isAdmin && (
        <div className="modal-overlay">
          <div className="modal-confirm-card">
            <AlertCircle size={40} color="#f85149" />
            <h3>¿Anular Registro?</h3>
            <p>Se marcará esta devolución como inactiva en el sistema.</p>
            <div className="btn-confirm-group">
              <button className="btn-confirm-no" onClick={() => setConfirmarBorrado({abierto:false})}>Cancelar</button>
              <button className="btn-confirm-yes" onClick={ejecutarEliminacion}>Confirmar</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default GestionDevoluciones;
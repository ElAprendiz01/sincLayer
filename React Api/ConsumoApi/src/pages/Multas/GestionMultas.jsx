import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { 
  Search, DollarSign, X, Save, ArrowLeft, AlertCircle, Edit, Trash2, User, List
} from "lucide-react";

// Importaciones según tu estructura de carpetas
import { 
  getMultasPendientes, 
  getUsuariosConMultas, 
  abonarMulta, 
  actualizarMultaGeneral, 
  eliminarMulta 
} from "../../services/multasService";
import "../../styles/datospersonales.css";
import { useToast } from "../../components/ToastContext";

const GestionMultas = () => {
  const navigate = useNavigate();
  const { showToast } = useToast(); 
  
  const [tabActual, setTabActual] = useState("individuales"); 
  const [lista, setLista] = useState([]);
  const [cargando, setCargando] = useState(false);
  
  const [modalAbono, setModalAbono] = useState({ abierto: false, multa: null });
  const [modalEdicion, setModalEdicion] = useState({ abierto: false, multa: null });
  
  const userIdLogueado = parseInt(localStorage.getItem("userId") || "0");
  const [montoAbono, setMontoAbono] = useState("");
  const [editData, setEditData] = useState({ id_Estado: 15, pagada: false });

  useEffect(() => {
    cargarDatos();
  }, [tabActual]);

  const cargarDatos = async () => {
    setCargando(true);
    try {
      const res = tabActual === "individuales" 
        ? await getMultasPendientes() 
        : await getUsuariosConMultas();
      setLista(res.data || []);
    } catch (error) {
      showToast("Error al cargar datos", "error");
    } finally { setCargando(false); }
  };

  const handleAbonar = async (e) => {
    e.preventDefault();
    const monto = parseFloat(montoAbono);
    
    // Validación segura de saldo para evitar errores de undefined
    const saldoDisponible = modalAbono.multa?.saldoPendiente || 0;

    if (isNaN(monto) || monto <= 0 || monto > saldoDisponible) {
      showToast("Monto de abono no válido o excede el saldo", "error");
      return;
    }

    try {
      const payload = {
        Id_Multa: modalAbono.multa.id_Multa,
        MontoAbono: monto,
        Id_Modificador: userIdLogueado
      };
      await abonarMulta(payload);
      showToast("Abono aplicado con éxito", "success");
      setModalAbono({ abierto: false, multa: null });
      setMontoAbono("");
      cargarDatos();
    } catch (error) {
      showToast(error.response?.data?.msj || "Error al abonar", "error");
    }
  };

  const handleActualizarMulta = async (e) => {
    e.preventDefault();
    if (!modalEdicion.multa) return;

    try {
      const payload = {
        Id_Multa: modalEdicion.multa.id_Multa,
        Id_Estado: parseInt(editData.id_Estado),
        Pagada: editData.pagada,
        Id_Modificador: userIdLogueado
      };
      await actualizarMultaGeneral(modalEdicion.multa.id_Multa, payload);
      showToast("Multa actualizada", "success");
      setModalEdicion({ abierto: false, multa: null });
      cargarDatos();
    } catch (error) {
      showToast(error.response?.data?.msj || "Error en actualización", "error");
    }
  };

  return (
    <div className="cat-page">
      <div className="cat-header">
        <div className="header-left">
          <button className="btn-back" onClick={() => navigate("/admin")}><ArrowLeft size={20} /></button>
          <h1>Gestión de Multas</h1>
        </div>

        <div className="tab-group" style={{ display: 'flex', gap: '10px' }}>
          <button 
            className={`btn-tab ${tabActual === "individuales" ? "active" : ""}`}
            onClick={() => setTabActual("individuales")}
          >
            <List size={18} /> Detalle
          </button>
          <button 
            className={`btn-tab ${tabActual === "usuarios" ? "active" : ""}`}
            onClick={() => setTabActual("usuarios")}
          >
            <User size={18} /> Por Usuario
          </button>
        </div>
      </div>

      <div className="cat-grid">
        {cargando ? (
          <div className="no-data">Cargando información...</div>
        ) : lista.length > 0 ? (
          lista.map((item) => (
            <div key={tabActual === "individuales" ? `multa-${item.id_Multa}` : `user-${item.id_Usuario}`} className="cat-card">
              {tabActual === "individuales" ? (
                <>
                  <div className="card-info">
                    <span className="card-type">Multa #{item.id_Multa}</span>
                    <span className="status-pill warning">{item.estadoRegistro || "Pendiente"}</span>
                  </div>
                  <h2 className="card-title">{item.nombre_Cliente || "Sin nombre"}</h2>
                  <p className="card-subtitle">{item.libro || "Sin título"}</p>
                  <div className="audit-box">
                    <div className="audit-row">
                      <DollarSign size={14} />
                      <span className="audit-label">Saldo:</span>
                      <span className="audit-user" style={{color: '#f85149', fontWeight: 'bold'}}>
                        ${(item.saldoPendiente || 0).toFixed(2)}
                      </span>
                    </div>
                  </div>
                  <div className="card-actions">
                    <button className="btn-edit" onClick={() => setModalAbono({ abierto: true, multa: item })}>
                      <DollarSign size={16} /> Abonar
                    </button>
                    <button className="btn-main" onClick={() => {
                        setEditData({ id_Estado: 15, pagada: false });
                        setModalEdicion({ abierto: true, multa: item });
                    }}>
                      <Edit size={16} /> Estado
                    </button>
                  </div>
                </>
              ) : (
                <>
                  <div className="card-info">
                    <span className="card-type">Usuario ID: {item.id_Usuario}</span>
                    <span className="status-pill info">{item.cantidadMultasPendientes || 0} Pendientes</span>
                  </div>
                  <h2 className="card-title">{item.nombre_Cliente || "Sin nombre"}</h2>
                  <div className="audit-box">
                    <div className="audit-row">
                      <DollarSign size={14} />
                      <span className="audit-label">Total Deuda:</span>
                      <span className="audit-user" style={{fontSize: '1.2rem', color: '#f85149'}}>
                        ${(item.totalPendiente || 0).toFixed(2)}
                      </span>
                    </div>
                  </div>
                </>
              )}
            </div>
          ))
        ) : (
          <div className="no-results-container">
            <AlertCircle size={48} />
            <p>No se encontraron multas pendientes.</p>
          </div>
        )}
      </div>

      {/* MODAL DE ABONO */}
      {modalAbono.abierto && (
        <div className="modal-overlay">
          <div className="cat-form-card" style={{ maxWidth: '400px' }}>
            <div className="modal-header">
              <h3>Registrar Abono</h3>
              <X className="close-icon" onClick={() => setModalAbono({ abierto: false, multa: null })} />
            </div>
            <form onSubmit={handleAbonar} className="form-main">
              <p>Multa: <strong>{modalAbono.multa?.libro || "N/A"}</strong></p>
              <p>Saldo Actual: <strong>${(modalAbono.multa?.saldoPendiente || 0).toFixed(2)}</strong></p>
              <div className="form-section">
                <label>Monto a Abonar</label>
                <input 
                  type="number" 
                  step="0.01" 
                  value={montoAbono}
                  onChange={(e) => setMontoAbono(e.target.value)}
                  placeholder="0.00"
                  required 
                />
              </div>
              <div className="modal-footer">
                <button type="submit" className="btn-guardar-pro">Confirmar Pago</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL EDICIÓN ESTADO */}
      {modalEdicion.abierto && (
        <div className="modal-overlay">
          <div className="cat-form-card" style={{ maxWidth: '400px' }}>
            <div className="modal-header">
              <h3>Administrar Multa</h3>
              <X className="close-icon" onClick={() => setModalEdicion({ abierto: false, multa: null })} />
            </div>
            <form onSubmit={handleActualizarMulta} className="form-main">
              <div className="form-section">
                <label>Cambiar Estado</label>
                <select 
                  className="custom-select"
                  value={editData.id_Estado}
                  onChange={(e) => setEditData({...editData, id_Estado: e.target.value})}
                >
                  <option value={15}>Mora (Pendiente)</option>
                  <option value={12}>Pagada (Manual)</option>
                  <option value={13}>Cancelada</option>
                </select>
              </div>
              <div className="form-section" style={{display: 'flex', gap: '10px', alignItems: 'center'}}>
                <input 
                  type="checkbox" 
                  id="checkPagada"
                  checked={editData.pagada} 
                  onChange={(e) => setEditData({...editData, pagada: e.target.checked})}
                />
                <label htmlFor="checkPagada">¿Marcar como pagada totalmente?</label>
              </div>
              <div className="modal-footer">
                <button type="submit" className="btn-guardar-pro">Guardar Cambios</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default GestionMultas;
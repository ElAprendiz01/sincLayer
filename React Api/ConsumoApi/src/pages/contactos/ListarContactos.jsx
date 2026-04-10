import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, AlertCircle, Edit, Trash2, ShieldCheck, ShieldAlert } from "lucide-react";
import { ContactoService } from "../../services/contactosService";
import "../../styles/contacto.css";
import { useToast } from "../../components/ToastContext"; 

const ListarContactos = () => {
  const navigate = useNavigate();
  const { showToast } = useToast(); 

  // --- SEGURIDAD Y ROLES ---
  const userRole = localStorage.getItem("userRole")?.toLowerCase();
  const isAdmin = userRole === "admin";

  // --- ESTADOS ---
  const [contactos, setContactos] = useState([]);
  const [mostrarForm, setMostrarForm] = useState(false);
  const [contactoEdit, setContactoEdit] = useState(null);
  const [confirmarBorrado, setConfirmarBorrado] = useState({ abierto: false, id: null });

  const userIdLogueado = localStorage.getItem("userId") || 5;

  const [formData, setFormData] = useState({
    id_Persona: "",
    tipo_Contacto: "",
    contacto: "",
    id_Creador: userIdLogueado,
    id_Estado: 3,
  });

  // --- CARGA DE DATOS ---
  useEffect(() => {
    cargarContactos();
  }, []);

  const cargarContactos = async () => {
    try {
      const res = await ContactoService.listar();
      if (res && res.data) {
        setContactos(res.data);
      }
    } catch (error) {
      console.error("Error al cargar contactos:", error);
      showToast("No se pudieron cargar los contactos", "error");
    }
  };

  // --- MANEJO DE FORMULARIO (Bloqueado si no es Admin) ---
  const abrirFormulario = (contacto = null) => {
    if (!isAdmin) return;
    if (contacto) {
      setContactoEdit(contacto);
      setFormData({
        id_Persona: contacto.id_Persona,
        tipo_Contacto: contacto.tipo_Contacto,
        contacto: contacto.contacto,
        id_Modificador: userIdLogueado,
        id_Estado: 3,
      });
    } else {
      setContactoEdit(null);
      setFormData({
        id_Persona: "",
        tipo_Contacto: "",
        contacto: "",
        id_Creador: userIdLogueado,
        id_Estado: 3,
      });
    }
    setMostrarForm(true);
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // --- OPERACIONES CRUD (Protegidas) ---
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isAdmin) return;

    try {
      let respuesta;
      if (contactoEdit) {
        respuesta = await ContactoService.editar(contactoEdit.id_Contacto, formData);
        showToast(respuesta.msj || "¡Contacto actualizado!", "success");
      } else {
        respuesta = await ContactoService.insertar(formData);
        showToast(respuesta.msj || "¡Contacto registrado!", "success");
      }
      setMostrarForm(false);
      await cargarContactos(); 
    } catch (error) {
      showToast(error.message || "Error al procesar", "error");
    }
  };

  const handleEliminar = (id) => {
    if (!isAdmin) return;
    setConfirmarBorrado({ abierto: true, id });
  };

  const ejecutarEliminacion = async () => {
    if (!isAdmin) return;
    try {
      const { id } = confirmarBorrado;
      const respuesta = await ContactoService.eliminar(id, userIdLogueado);
      showToast(respuesta.msj || "Contacto eliminado", "warning");
      setConfirmarBorrado({ abierto: false, id: null });
      await cargarContactos();
    } catch (error) {
      showToast("Error: " + error.message, "error");
      setConfirmarBorrado({ abierto: false, id: null });
    }
  };

  return (
    <div className="contactos-container">
      <div className="nav-top-bar" style={{ marginBottom: '20px' }}>
        <button onClick={() => navigate("/admin")} className="btn-back-dashboard">
          <ArrowLeft size={20} /> Volver al Panel
        </button>
      </div>

      <header className="contactos-header">
        <div>
          <h2>Directorio de Contactos - NexaCore</h2>
          <p className={`role-badge ${isAdmin ? 'admin' : 'reader'}`}>
            {isAdmin ? <ShieldCheck size={14} /> : <ShieldAlert size={14} />}
            {isAdmin ? "Privilegios de Administrador" : "Modo Lectura"}
          </p>
        </div>
        
        {/* BOTÓN NUEVO: Solo para Admin */}
        {isAdmin && (
          <button className="btn-nuevo" onClick={() => abrirFormulario()}>
            + Nuevo Contacto
          </button>
        )}
      </header>

      {/* FORMULARIO MODAL (Protección doble) */}
      {mostrarForm && isAdmin && (
        <div className="modal-overlay">
          <form className="contacto-form" onSubmit={handleSubmit}>
            <h3>{contactoEdit ? "Actualizar Contacto" : "Registrar Contacto"}</h3>
            <div className="form-group">
              <label>ID Persona</label>
              <input name="id_Persona" type="number" value={formData.id_Persona} onChange={handleChange} required disabled={!!contactoEdit} />
            </div>
            <div className="form-group">
              <label>Tipo (4: Celular, 5: Correo)</label>
              <input name="tipo_Contacto" type="number" value={formData.tipo_Contacto} onChange={handleChange} required />
            </div>
            <div className="form-group">
              <label>Valor de Contacto</label>
              <input name="contacto" type="text" value={formData.contacto} onChange={handleChange} required />
            </div>
            <div className="form-buttons">
              <button type="submit" className="btn-guardar">Guardar</button>
              <button type="button" className="btn-cancelar" onClick={() => setMostrarForm(false)}>Cancelar</button>
            </div>
          </form>
        </div>
      )}

      {/* MODAL DE ELIMINACIÓN */}
      {confirmarBorrado.abierto && isAdmin && (
        <div className="modal-overlay">
          <div className="modal-confirm-card">
            <div style={{ textAlign: 'center' }}>
              <div style={{ background: 'rgba(239, 68, 68, 0.1)', width: '60px', height: '60px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 15px' }}>
                <AlertCircle size={32} color="#ef4444" />
              </div>
              <h3 style={{ color: 'white' }}>¿Confirmar eliminación?</h3>
              <p style={{ color: '#94a3b8' }}>Esta acción no se puede deshacer en el sistema.</p>
            </div>
            <div className="btn-confirm-group" style={{ display: 'flex', gap: '10px', marginTop: '20px' }}>
              <button className="btn-confirm-no" onClick={() => setConfirmarBorrado({ abierto: false, id: null })}>Cancelar</button>
              <button className="btn-confirm-yes" onClick={ejecutarEliminacion}>Eliminar</button>
            </div>
          </div>
        </div>
      )}

      {/* TABLA DE DATOS */}
      <div className="table-wrapper">
        <table className="tabla-contactos">
          <thead>
            <tr>
              <th>ID</th>
              <th>Persona</th>
              <th>Tipo</th>
              <th>Valor</th>
              <th>Estado</th>
              {isAdmin && <th>Acciones</th>}
            </tr>
          </thead>
          <tbody>
            {contactos.length > 0 ? (
              contactos.map((c) => (
                <tr key={c.id_Contacto}>
                  <td>{c.id_Contacto}</td>
                  <td>{c.nombre_Persona} {c.apellido}</td>
                  <td>{c.tipo_Contacto_Nombre}</td>
                  <td>{c.contacto}</td>
                  <td><span className={`status-pill ${c.estado?.toLowerCase()}`}>{c.estado}</span></td>
                  
                  {/* ACCIONES: Solo para Admin */}
                  {isAdmin && (
                    <td>
                      <button className="btn-accion edit" onClick={() => abrirFormulario(c)}>Editar</button>
                      <button className="btn-accion delete" onClick={() => handleEliminar(c.id_Contacto)}>Eliminar</button>
                    </td>
                  )}
                </tr>
              ))
            ) : (
              <tr><td colSpan={isAdmin ? "6" : "5"}>No hay datos registrados.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ListarContactos;
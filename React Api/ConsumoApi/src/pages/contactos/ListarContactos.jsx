import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom"; // Hook para navegación
import { ArrowLeft } from "lucide-react";       // Icono de retroceso
import { ContactoService } from "../../services/contactosService";
import "../../styles/contacto.css";

const ListarContactos = () => {
  const navigate = useNavigate(); // Inicializamos el hook de navegación

  // --- ESTADOS ---
  const [contactos, setContactos] = useState([]);
  const [mostrarForm, setMostrarForm] = useState(false);
  const [contactoEdit, setContactoEdit] = useState(null);

  // Obtenemos el ID del usuario logueado para auditoría
  const userIdLogueado = localStorage.getItem("userId") || 5;

  // Estado del Formulario inicial
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
    }
  };

  // --- MANEJO DE FORMULARIO ---
  const abrirFormulario = (contacto = null) => {
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

  // --- OPERACIONES (CRUD) ---
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      let respuesta;
      if (contactoEdit) {
        respuesta = await ContactoService.editar(contactoEdit.id_Contacto, formData);
      } else {
        respuesta = await ContactoService.insertar(formData);
      }

      alert(respuesta.msj || "¡Operación realizada con éxito!");
      setMostrarForm(false);
      setContactoEdit(null);
      await cargarContactos(); 

    } catch (error) {
      console.error("Error en la operación:", error);
      alert("Error del sistema: " + error.message);
    }
  };

  const handleEliminar = async (id) => {
    if (!window.confirm("¿Estás seguro de que deseas eliminar este contacto?")) {
        return; 
    }

    try {
        const respuesta = await ContactoService.eliminar(id, userIdLogueado);
        alert(respuesta.msj || "Eliminado con éxito");
        await cargarContactos();
    } catch (error) {
        console.error("Error al eliminar:", error);
        alert("No se pudo eliminar: " + error.message);
    }
  };

  // --- RENDERIZADO ---
  return (
    <div className="contactos-container">
      {/* BARRA DE NAVEGACIÓN SUPERIOR */}
      <div className="nav-top-bar" style={{ marginBottom: '20px' }}>
        <button 
          onClick={() => navigate("/admin")} 
          className="btn-back-dashboard"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            background: 'transparent',
            border: 'none',
            color: '#94a3b8',
            cursor: 'pointer',
            fontSize: '14px',
            fontWeight: 'bold',
            transition: '0.3s'
          }}
        >
          <ArrowLeft size={20} />
          Volver al Panel de Control
        </button>
      </div>

      <header className="contactos-header">
        <h2>Directorio de Contactos - NexaCore</h2>
        <button className="btn-nuevo" onClick={() => abrirFormulario()}>
          + Nuevo Contacto
        </button>
      </header>

      {/* MODAL / FORMULARIO */}
      {mostrarForm && (
        <div className="modal-overlay">
          <form className="contacto-form" onSubmit={handleSubmit}>
            <h3>
              {contactoEdit ? "Actualizar Contacto" : "Registrar Contacto"}
            </h3>
            
            <div className="form-group">
              <label>ID Persona</label>
              <input
                name="id_Persona"
                type="number"
                value={formData.id_Persona}
                onChange={handleChange}
                required
                disabled={!!contactoEdit}
              />
            </div>

            <div className="form-group">
              <label>Tipo (4: Celular, 5: Correo)</label>
              <input
                name="tipo_Contacto"
                type="number"
                placeholder="Ej: 5"
                value={formData.tipo_Contacto}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label>Valor de Contacto</label>
              <input
                name="contacto"
                type="text"
                placeholder="Ej: darwin@gmail.com"
                value={formData.contacto}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-buttons">
              <button type="submit" className="btn-guardar">
                {contactoEdit ? "Actualizar" : "Guardar"}
              </button>
              <button
                type="button"
                className="btn-cancelar"
                onClick={() => setMostrarForm(false)}
              >
                Cancelar
              </button>
            </div>
          </form>
        </div>
      )}

      {/* TABLA DE RESULTADOS */}
      <div className="table-wrapper">
        <table className="tabla-contactos">
          <thead>
            <tr>
              <th>ID</th>
              <th>Persona</th>
              <th>Tipo</th>
              <th>Valor</th>
              <th>Estado</th>
              <th>Acciones</th>
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
                  <td>
                    <span className={`status-pill ${c.estado?.toLowerCase()}`}>
                      {c.estado}
                    </span>
                  </td>
                  <td>
                    <button
                      className="btn-accion edit"
                      onClick={() => abrirFormulario(c)}
                    >
                      Editar
                    </button>
                    <button
                      className="btn-accion delete"
                      onClick={() => handleEliminar(c.id_Contacto)}
                    >
                      Eliminar
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6">No se encontraron contactos activos.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ListarContactos;
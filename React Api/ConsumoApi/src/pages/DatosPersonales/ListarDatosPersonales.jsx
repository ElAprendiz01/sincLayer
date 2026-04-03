import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Search, Plus, Edit, Trash2, X, Save, ArrowLeft, User, AlertCircle,
} from "lucide-react";
import {
  getPersonas,
  insertarPersona,
  editarPersona,
  eliminarPersona,
  buscarPersonas,
} from "./../../services/datospersonalesService";
import "../../styles/datospersonales.css";

const ListarDatosPersonales = () => {
  const navigate = useNavigate();
  const [lista, setLista] = useState([]);
  const [busqueda, setBusqueda] = useState("");
  const [mostrarModal, setMostrarModal] = useState(false);
  const [mensajeApi, setMensajeApi] = useState("");
  const [cargando, setCargando] = useState(false);

  const userIdLogueado = parseInt(localStorage.getItem("userId") || "0");

  const estadoInicial = {
    id_Persona: null,
    primer_Nombre: "",
    segundo_Nombre: "",
    primer_Apellido: "",
    segundo_Apellido: "",
    genero: 9,
    tipo_DNI: 12,
    dni: "",
    id_Creador: userIdLogueado,
  };

  const [formData, setFormData] = useState(estadoInicial);

  // Función para obtener los datos
  const fetchPersonas = async () => {
    setCargando(true);
    try {
      const res = await getPersonas();
      // Validamos si res.data existe (porque el service ahora devuelve {codigo, data, msj})
      // O si res es directamente el array.
      const datos = res.data || (Array.isArray(res) ? res : []);
      
      if (res.codigo === 200 || Array.isArray(res)) {
        setLista(datos);
        setMensajeApi(datos.length === 0 ? "No hay registros disponibles" : "");
      } else {
        setLista([]);
        setMensajeApi(res.msj || "Error al cargar los datos");
      }
    } catch (error) {
      setMensajeApi("Error de conexión con el servidor");
    } finally {
      setCargando(false);
    }
  };

  const handleBusqueda = async (e) => {
    const valor = e.target.value;
    setBusqueda(valor);
    if (valor.trim() === "") {
      fetchPersonas();
    } else {
      const res = await buscarPersonas(valor);
      const datos = res.data || (Array.isArray(res) ? res : []);
      
      if (res.codigo === 200 || Array.isArray(res)) {
        setLista(datos);
        setMensajeApi(datos.length === 0 ? "No se encontraron resultados" : "");
      } else {
        setLista([]);
        setMensajeApi(res.msj || "Error en la búsqueda");
      }
    }
  };

  const handleGuardar = async (e) => {
    e.preventDefault();
    try {
      let res;
      if (formData.id_Persona) {
        res = await editarPersona(formData.id_Persona, {
          ...formData,
          id_Modificador: userIdLogueado,
        });
      } else {
        res = await insertarPersona(formData);
      }

      if (res.codigo === 200 || res.codigo === 201) {
        alert(res.msj || "Operación exitosa");
        setMostrarModal(false);
        setFormData(estadoInicial);
        fetchPersonas();
      } else {
        alert("Error: " + res.msj);
      }
    } catch (error) {
      alert("Error al procesar la solicitud");
    }
  };

  const handleEliminar = async (id) => {
    if (window.confirm("¿Estás seguro de eliminar este registro?")) {
      const res = await eliminarPersona(id, userIdLogueado);
      if (res.codigo === 200) {
        alert(res.msj);
        fetchPersonas();
      } else {
        alert("Error al eliminar: " + res.msj);
      }
    }
  };

  const prepararEdicion = (persona) => {
    setFormData({
      id_Persona: persona.id_Persona,
      primer_Nombre: persona.primer_Nombre || "",
      segundo_Nombre: persona.segundo_Nombre || "",
      primer_Apellido: persona.primer_Apellido || "",
      segundo_Apellido: persona.segundo_Apellido || "",
      genero: persona.genero || 9,
      tipo_DNI: persona.tipo_DNI || 12,
      dni: persona.dni || "",
    });
    setMostrarModal(true);
  };

  useEffect(() => {
    fetchPersonas();
  }, []);

  return (
    <div className="modulo-container">
      <div className="modulo-header">
        <div className="header-left">
          <button className="btn-back" onClick={() => navigate("/admin")}>
            <ArrowLeft size={20} />
          </button>
          <h1 className="modulo-titulo">Gestión de Datos Personales</h1>
        </div>
        <div className="acciones-top">
          <div className="search-container">
            <Search size={18} className="search-icon" />
            <input
              className="search-input"
              type="text"
              placeholder="Buscar por fecha..."
              value={busqueda}
              onChange={handleBusqueda}
            />
          </div>
          <button 
            className="btn-nuevo" 
            onClick={() => { setFormData(estadoInicial); setMostrarModal(true); }}
          >
            <Plus size={18} /> Nuevo Registro
          </button>
        </div>
      </div>

      <div className="tabla-card">
        <table className="tabla-entidad">
          <thead>
            <tr>
              <th>ID</th>
              <th>Nombre Completo</th>
              <th>DNI</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {cargando ? (
              <tr><td colSpan="4" className="no-data">Cargando datos...</td></tr>
            ) : lista.length > 0 ? (
              lista.map((p) => (
                <tr key={p.id_Persona} className="row-persona">
                  <td>{p.id_Persona}</td>
                  <td>
                    {`${p.primer_Nombre || ''} ${p.segundo_Nombre || ''} ${p.primer_Apellido || ''} ${p.segundo_Apellido || ''}`.trim()}
                  </td>
                  <td>{p.dni}</td>
                  <td className="acciones-celda">
                    <button className="btn-action edit" onClick={() => prepararEdicion(p)}>
                      <Edit size={16} />
                    </button>
                    <button className="btn-action delete" onClick={() => handleEliminar(p.id_Persona)}>
                      <Trash2 size={16} />
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="4" className="no-data">
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '10px' }}>
                    <AlertCircle size={30} color="#666" />
                    <p>{mensajeApi || "No se encontraron registros"}</p>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {mostrarModal && (
        <div className="modal-overlay">
          <div className="modal-body enhanced-form">
            <div className="modal-header">
              <div className="title-group">
                <User className="icon-title" />
                <h3>{formData.id_Persona ? "Editar Registro" : "Nuevo Registro"}</h3>
              </div>
              <X className="close-icon" onClick={() => setMostrarModal(false)} />
            </div>
            <form className="form-main" onSubmit={handleGuardar}>
                <div className="form-section">
                    <label>Nombres</label>
                    <div className="input-group">
                        <input 
                          type="text" 
                          placeholder="Primer Nombre" 
                          value={formData.primer_Nombre} 
                          onChange={(e) => setFormData({...formData, primer_Nombre: e.target.value})} 
                          required 
                        />
                        <input 
                          type="text" 
                          placeholder="Segundo Nombre" 
                          value={formData.segundo_Nombre} 
                          onChange={(e) => setFormData({...formData, segundo_Nombre: e.target.value})} 
                        />
                    </div>
                </div>
                <div className="form-section">
                    <label>Apellidos</label>
                    <div className="input-group">
                        <input 
                          type="text" 
                          placeholder="Primer Apellido" 
                          value={formData.primer_Apellido} 
                          onChange={(e) => setFormData({...formData, primer_Apellido: e.target.value})} 
                          required 
                        />
                        <input 
                          type="text" 
                          placeholder="Segundo Apellido" 
                          value={formData.segundo_Apellido} 
                          onChange={(e) => setFormData({...formData, segundo_Apellido: e.target.value})} 
                        />
                    </div>
                </div>
                <div className="form-section">
                    <label>DNI</label>
                    <input 
                      className="full-input" 
                      type="text" 
                      placeholder="Número de documento" 
                      value={formData.dni} 
                      onChange={(e) => setFormData({...formData, dni: e.target.value})} 
                      required 
                    />
                </div>
                <div className="modal-footer">
                    <button type="button" className="btn-cancelar" onClick={() => setMostrarModal(false)}>Cancelar</button>
                    <button type="submit" className="btn-guardar-pro">
                      <Save size={18} /> {formData.id_Persona ? "Actualizar" : "Registrar"}
                    </button>
                </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ListarDatosPersonales;
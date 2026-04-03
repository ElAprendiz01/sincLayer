import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { 
  Search, Plus, X, Save, ArrowLeft, Book, AlertCircle, Edit, Trash2, User 
} from "lucide-react";
import { 
  getLibros, 
  insertarLibro, 
  editarLibro, 
  eliminarLibro, 
  filtrarLibrosPorCategoria,
  filtrarLibrosPorAutor // Asegúrate de que esté exportado en tu service
} from "./../../services/librosService";
import "../../styles/datospersonales.css";
import { useToast } from "../../components/ToastContext";

const ListarLibros = () => {
  const navigate = useNavigate();
  const { showToast } = useToast();
  const [lista, setLista] = useState([]);
  const [busqueda, setBusqueda] = useState("");
  const [busquedaAutor, setBusquedaAutor] = useState(""); // Nuevo estado para autor
  const [mostrarModal, setMostrarModal] = useState(false);
  const [cargando, setCargando] = useState(false);
  const [confirmarBorrado, setConfirmarBorrado] = useState({ abierto: false, id: null });

  const userIdLogueado = parseInt(localStorage.getItem("userId") || "0");

  const estadoInicial = {
    id_Libro: null,
    titulo: "",
    isbn: "",
    id_Autor: "",
    id_Categoria: "",
    editorial: "",
    año_Publicacion: new Date().getFullYear(),
    stock: 0,
    id_Creador: userIdLogueado,
    id_Estado: 3, 
    forzarRecuperacion: false
  };

  const [formData, setFormData] = useState(estadoInicial);

  // Lógica unificada de filtrado
  useEffect(() => {
    const filtrar = async () => {
      // Si ambos están vacíos, cargar todo
      if (busqueda.trim() === "" && busquedaAutor.trim() === "") {
        fetchLibros();
        return;
      }
      
      setCargando(true);
      try {
        let res;
        if (busquedaAutor.trim() !== "") {
          // Prioridad a búsqueda por ID de autor si se escribe algo ahí
          res = await filtrarLibrosPorAutor(busquedaAutor);
        } else {
          res = await filtrarLibrosPorCategoria(busqueda);
        }
        setLista(res.data || []);
      } catch (error) {
        console.error("Error filtrando:", error);
        setLista([]); // Limpiar lista en caso de error
      } finally {
        setCargando(false);
      }
    };

    const delayDebounceFn = setTimeout(() => {
      filtrar();
    }, 500);

    return () => clearTimeout(delayDebounceFn);
  }, [busqueda, busquedaAutor]);

  const fetchLibros = async () => {
    setCargando(true);
    try {
      const res = await getLibros();
      setLista(res.data || []);
    } catch (error) {
      showToast("Error al cargar libros", "error");
    } finally { setCargando(false); }
  };

  // ... (handleGuardar, ejecutarEliminacion, prepararEdicion se mantienen igual)
  const handleGuardar = async (e) => {
    e.preventDefault();
    try {
      if (formData.id_Libro) {
        await editarLibro(formData.id_Libro, { ...formData, id_Modificador: userIdLogueado });
        showToast("Libro actualizado", "success");
      } else {
        await insertarLibro(formData);
        showToast("Libro registrado", "success");
      }
      setMostrarModal(false);
      fetchLibros();
    } catch (error) {
      const msj = error.response?.data?.msj || "Error en la operación";
      showToast(msj, "error");
    }
  };

  const ejecutarEliminacion = async () => {
    try {
      await eliminarLibro(confirmarBorrado.id, userIdLogueado);
      showToast("Libro eliminado", "warning");
      fetchLibros();
    } catch (error) { showToast("No se pudo eliminar", "error"); }
    finally { setConfirmarBorrado({ abierto: false, id: null }); }
  };

  const prepararEdicion = (l) => {
    setFormData({
      id_Libro: l.id_Libro,
      titulo: l.titulo,
      isbn: l.isbn,
      id_Autor: l.id_Autor,
      id_Categoria: l.id_Categoria,
      editorial: l.editorial,
      año_Publicacion: l.año_Publicacion,
      stock: l.stock,
      id_Estado: l.id_Estado || 3,
      forzarRecuperacion: false
    });
    setMostrarModal(true);
  };

  return (
    <div className="cat-page">
      <div className="cat-header">
        <div className="header-left">
          <button className="btn-back" onClick={() => navigate("/admin")}><ArrowLeft size={20} /></button>
          <h1>Biblioteca</h1>
        </div>

        {/* CONTENEDOR DE BUSQUEDA DOBLE */}
        <div className="search-group-container" style={{ display: 'flex', gap: '10px', flex: 1, margin: '0 20px' }}>
          <div className="search-container" style={{ flex: 2 }}>
            <Search className="search-icon-inside" size={18} />
            <input 
              className="search-input" 
              placeholder="Buscar por categoría..." 
              value={busqueda} 
              onChange={(e) => { setBusqueda(e.target.value); setBusquedaAutor(""); }} 
            />
          </div>
          
          <div className="search-container" style={{ flex: 1 }}>
            <User className="search-icon-inside" size={18} />
            <input 
              className="search-input" 
              type="number"
              placeholder="ID Autor..." 
              value={busquedaAutor} 
              onChange={(e) => { setBusquedaAutor(e.target.value); setBusqueda(""); }} 
            />
          </div>
        </div>

        <button className="btn-main" onClick={() => { setFormData(estadoInicial); setMostrarModal(true); }}>
          <Plus size={18} /> Nuevo Libro
        </button>
      </div>

      <div className="cat-grid">
        {cargando ? (
          <div className="no-data">Cargando catálogo...</div>
        ) : lista.length > 0 ? (
          lista.map((l) => (
            <div key={l.id_Libro} className="cat-card">
              <div className="card-info">
                <span className="card-type">ISBN: {l.isbn}</span>
                <span className="status-pill">{l.estado}</span>
              </div>
              <h2 className="card-title">{l.titulo}</h2>
              <div className="audit-box">
                <div className="audit-row">
                  <span className="audit-label">Stock:</span>
                  <span className="audit-user">{l.stock} unidades</span>
                </div>
                <div className="audit-row">
                  <span className="audit-label">Autor:</span>
                  <span className="audit-user">{l.nombre_Autor || "Sin autor"}</span>
                </div>
                <div className="audit-row">
                  <span className="audit-label">Editorial:</span>
                  <span className="audit-user">{l.editorial}</span>
                </div>
              </div>
              <div className="card-actions">
                <button className="btn-edit" onClick={() => prepararEdicion(l)}><Edit size={16} /> Editar</button>
                <button className="btn-del" onClick={() => setConfirmarBorrado({ abierto: true, id: l.id_Libro })}><Trash2 size={16} /> Borrar</button>
              </div>
            </div>
          ))
        ) : (
          /* MENSAJE CUANDO NO HAY RESULTADOS */
          <div className="no-results-container">
            <AlertCircle size={48} color="#666" />
            <p>No se encontraron libros con los criterios seleccionados.</p>
            <button className="btn-back" onClick={() => {setBusqueda(""); setBusquedaAutor("");}}>Limpiar filtros</button>
          </div>
        )}
      </div>

      {/* ... (Modales de guardar y borrar se mantienen igual) */}
      {mostrarModal && (
        <div className="modal-overlay">
          <div className="cat-form-card" style={{ maxWidth: '600px' }}>
            <div className="modal-header">
              <h3>{formData.id_Libro ? "Editar Libro" : "Nuevo Libro"}</h3>
              <X className="close-icon" onClick={() => setMostrarModal(false)} />
            </div>
            <form onSubmit={handleGuardar} className="form-main">
              <div className="form-section">
                <label>Título del Libro</label>
                <input type="text" className="full-input" value={formData.titulo} onChange={(e) => setFormData({...formData, titulo: e.target.value})} required />
              </div>
              <div className="input-group">
                <div>
                  <label>ID Autor</label>
                  <input type="number" value={formData.id_Autor} onChange={(e) => setFormData({...formData, id_Autor: e.target.value})} required />
                </div>
                <div>
                  <label>ID Categoría</label>
                  <input type="number" value={formData.id_Categoria} onChange={(e) => setFormData({...formData, id_Categoria: e.target.value})} required />
                </div>
              </div>
              <div className="input-group">
                <div>
                  <label>ISBN</label>
                  <input type="text" value={formData.isbn} onChange={(e) => setFormData({...formData, isbn: e.target.value})} required />
                </div>
                <div>
                  <label>Editorial</label>
                  <input type="text" value={formData.editorial} onChange={(e) => setFormData({...formData, editorial: e.target.value})} required />
                </div>
              </div>
              <div className="input-group">
                <div>
                  <label>Año</label>
                  <input type="number" value={formData.año_Publicacion} onChange={(e) => setFormData({...formData, año_Publicacion: e.target.value})} />
                </div>
                <div>
                  <label>Stock Inicial</label>
                  <input type="number" value={formData.stock} onChange={(e) => setFormData({...formData, stock: e.target.value})} />
                </div>
              </div>
              <div className="form-section">
                <label>Estado del Registro</label>
                <select className="custom-select" value={formData.id_Estado} onChange={(e) => setFormData({...formData, id_Estado: parseInt(e.target.value)})}>
                  <option value={3}>Activo / Disponible</option>
                  <option value={4}>Inactivo </option>
                </select>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn-cancelar" onClick={() => setMostrarModal(false)}>Cerrar</button>
                <button type="submit" className="btn-guardar-pro"><Save size={18} /> Guardar Libro</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {confirmarBorrado.abierto && (
        <div className="modal-overlay">
          <div className="modal-confirm-card">
            <AlertCircle size={40} color="#f85149" />
            <h3>¿Retirar de catálogo?</h3>
            <div className="btn-confirm-group">
              <button className="btn-confirm-no" onClick={() => setConfirmarBorrado({abierto:false})}>No</button>
              <button className="btn-confirm-yes" onClick={ejecutarEliminacion}>Sí, borrar</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ListarLibros;
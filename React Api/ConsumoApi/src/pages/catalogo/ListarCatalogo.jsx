import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { 
    getCatalogos, 
    insertarCatalogo, 
    actualizarCatalogo, 
    eliminarCatalogo,
    filtrarCatalogosPorNombre 
} from "../../services/catalogoService.js"; 
import "../../styles/catalogo.css"; 

export default function ListarCatalogo() {
    const [lista, setLista] = useState([]);
    const [loading, setLoading] = useState(true);
    const [busqueda, setBusqueda] = useState(""); 

    // Estados del formulario
    const [nombre, setNombre] = useState("");
    const [idTipo, setIdTipo] = useState("");
    const [editId, setEditId] = useState(null); 

    // Función unificada para cargar o filtrar datos
    const cargarDatos = async (termino = "") => {
        try {
            setLoading(true);
            let res;
            if (termino.trim() === "") {
                res = await getCatalogos();
                // Ajuste: Acceder a res.data.data según la estructura de tu handleResponse
                setLista(res.data.data || res.data || []);
            } else {
                res = await filtrarCatalogosPorNombre(termino);
                // Ajuste: Acceder a la data del filtro
                setLista(res.data.data || res.data || []); 
            }
        } catch (error) {
            console.error("Error al obtener datos:", error);
            setLista([]); 
        } finally {
            setLoading(false);
        }
    };

    // Debounce para búsqueda
    useEffect(() => {
        const timer = setTimeout(() => {
            cargarDatos(busqueda);
        }, 400);
        return () => clearTimeout(timer);
    }, [busqueda]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            // Obtenemos el ID del usuario del localStorage o defecto 5
            const userId = localStorage.getItem("userId") || 5; 

            const res = editId 
                ? await actualizarCatalogo(editId, nombre, idTipo, userId)
                : await insertarCatalogo(nombre, idTipo, userId);
            
            // Verificamos éxito (200 OK o el código que devuelva tu API)
            if (res.status === 200 || res.data.codigo === 200) {
                alert(editId ? "¡Registro actualizado correctamente!" : "¡Registro guardado con éxito!");
                resetForm();
                cargarDatos();
            }
        } catch (err) { 
            alert("Error en la operación: " + (err.msj || err)); 
        }
    };

    const resetForm = () => {
        setNombre("");
        setIdTipo("");
        setEditId(null);
    };

    const handleEliminar = async (id) => {
        if (window.confirm("¿Estás seguro de que deseas eliminar este registro?")) {
            try {
                await eliminarCatalogo(id);
                alert("Registro eliminado");
                cargarDatos();
            } catch (err) { 
                alert("Error al eliminar: " + (err.msj || err)); 
            }
        }
    };

    const handlePrepararEdicion = (item) => {
        setEditId(item.id_Catalogo);
        setNombre(item.nombre);
        setIdTipo(item.id_Tipo_Catalogo);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    return (
        <div className="cat-page">
            <header className="cat-header">
                <div className="header-left">
                    <Link to="/admin" className="btn-volver">← Volver</Link>
                    <h1>{editId ? "Modo Edición" : "Gestión de Catálogos"}</h1>
                </div>
                
                <div className="search-container">
                    <input 
                        type="text" 
                        placeholder="🔍 Buscar por nombre..." 
                        value={busqueda}
                        onChange={(e) => setBusqueda(e.target.value)}
                        className="search-input"
                    />
                </div>
            </header>

            <section className="form-section">
                <form className={`cat-form-card ${editId ? 'editing' : ''}`} onSubmit={handleSubmit}>
                    <div className="input-group">
                        <label>Nombre del Catálogo</label>
                        <input 
                            value={nombre} 
                            onChange={e => setNombre(e.target.value)} 
                            placeholder="Ej: Pasaporte" 
                            required 
                        />
                    </div>
                    <div className="input-group">
                        <label>ID Tipo de Catálogo</label>
                        <input 
                            type="number" 
                            value={idTipo} 
                            onChange={e => setIdTipo(e.target.value)} 
                            placeholder="Ej: 7" 
                            required 
                        />
                    </div>
                    <div className="form-actions-row">
                        <button type="submit" className="btn-main">
                            {editId ? "Actualizar Registro" : "Guardar Registro"}
                        </button>
                        {editId && (
                            <button type="button" className="btn-cancel" onClick={resetForm}>
                                Cancelar
                            </button>
                        )}
                    </div>
                </form>
            </section>

            <hr className="divider" />

            {loading && <p className="loading-text">Cargando información...</p>}
            
            <div className="cat-grid">
                {lista.length > 0 ? (
                    lista.map((item) => (
                        <div className={`cat-card category-${item.id_Tipo_Catalogo}`} key={item.id_Catalogo}>
                            <div className="card-info">
                                <span className="id-tag">#{item.id_Catalogo}</span>
                                <span className="type-badge">{item.tipo_Catalogo || 'Sin Categoría'}</span>
                            </div>
                            <h3 className="card-title">{item.nombre}</h3>
                            
                            <div className="card-actions">
                                <button 
                                    className="btn-edit" 
                                    onClick={() => handlePrepararEdicion(item)}
                                >
                                    ✏️ Editar
                                </button>
                                <button 
                                    className="btn-del" 
                                    onClick={() => handleEliminar(item.id_Catalogo)}
                                >
                                    🗑️ Borrar
                                </button>
                            </div>
                        </div>
                    ))
                ) : (
                    !loading && (
                        <div className="no-data-container">
                            <p className="no-data">No se encontraron resultados para su búsqueda.</p>
                        </div>
                    )
                )}
            </div>
        </div>
    );
}
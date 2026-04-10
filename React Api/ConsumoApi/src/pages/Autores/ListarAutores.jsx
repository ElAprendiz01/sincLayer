import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { 
    Search, ArrowLeft, User, AlertCircle, Save, Edit, Trash2, X, ShieldCheck, ShieldAlert 
} from "lucide-react";
import {
    getAutores,
    insertarAutor,
    actualizarAutor,
    eliminarAutor,
    filtrarAutorPorPersona
} from "../../services/autorService.js";
import "../../styles/autores.css";

export default function ListarAutores() {
    const navigate = useNavigate();
    
    // --- LÓGICA DE ROLES (NexaCore Security) ---
    const userRole = localStorage.getItem("userRole")?.toLowerCase();
    const isAdmin = userRole === "admin";
    // Si no es admin, forzamos el modo solo lectura
    const esSoloLectura = !isAdmin;

    const [autores, setAutores] = useState([]);
    const [loading, setLoading] = useState(true);
    const [busqueda, setBusqueda] = useState("");
    
    const [idPersona, setIdPersona] = useState("");
    const [idAutorEditando, setIdAutorEditando] = useState(null);
    const [alerta, setAlerta] = useState({ visible: false, mensaje: "", tipo: "" });

    const userIdLogueado = parseInt(localStorage.getItem("userId") || "0");

    const mostrarMensaje = (mensaje, tipo = "success") => {
        setAlerta({ visible: true, mensaje, tipo });
        setTimeout(() => {
            setAlerta({ visible: false, mensaje: "", tipo: "" });
        }, 4000);
    };

    const cargarDatos = async () => {
        setLoading(true);
        try {
            const res = await getAutores();
            if (res && res.data) setAutores(res.data);
            else setAutores([]);
        } catch (error) {
            mostrarMensaje("No se pudieron cargar los autores", "error");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        const filtrar = async () => {
            if (busqueda.trim() === "") {
                cargarDatos();
                return;
            }
            try {
                if (!isNaN(busqueda)) {
                    const res = await filtrarAutorPorPersona(busqueda);
                    setAutores(res.data || []);
                } else {
                    const termino = busqueda.toLowerCase();
                    setAutores(prev => prev.filter(autor => 
                        autor.nombre_Persona?.toLowerCase().includes(termino) || 
                        autor.apellido?.toLowerCase().includes(termino)
                    ));
                }
            } catch (error) {
                console.error("Error filtrando:", error);
            }
        };
        const timeoutId = setTimeout(filtrar, 500);
        return () => clearTimeout(timeoutId);
    }, [busqueda]);

    useEffect(() => { cargarDatos(); }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (esSoloLectura) return; // Bloqueo de seguridad funcional

        try {
            let res;
            if (idAutorEditando) {
                res = await actualizarAutor(idAutorEditando, idPersona);
            } else {
                res = await insertarAutor(idPersona);
            }
            const data = await res.json();
            if (data.o_Numero === 200) {
                mostrarMensaje(data.o_Msg || "Operación exitosa", "success");
                cancelarFormulario();
                await cargarDatos();
            } else {
                mostrarMensaje(data.o_Msg || "Error en la validación", "error");
            }
        } catch (err) {
            mostrarMensaje("Error de conexión con el servidor", "error");
        }
    };

    const handleEliminar = async (id) => {
        if (esSoloLectura) return;
        if (!window.confirm("¿Desea eliminar este registro de autor?")) return;
        try {
            const res = await eliminarAutor(id);
            const data = await res.json();
            if (data.o_Numero === 200) {
                mostrarMensaje(data.o_Msg, "success");
                await cargarDatos();
            } else {
                mostrarMensaje(data.o_Msg, "error");
            }
        } catch (error) {
            mostrarMensaje("Error al eliminar", "error");
        }
    };

    const prepararEdicion = (autor) => {
        if (esSoloLectura) return;
        setIdAutorEditando(autor.id_Autor);
        setIdPersona(autor.id_Persona);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const cancelarFormulario = () => {
        setIdAutorEditando(null);
        setIdPersona("");
    };

    if (loading) return <div className="autores-page-container"><div className="no-data">Sincronizando con NexaCore...</div></div>;

    return (
        <div className="autores-page-container">
            {alerta.visible && (
                <div className="notification-container">
                    <div className={`custom-alert ${alerta.tipo}`}>
                        <span>{alerta.tipo === 'success' ? '✅' : '❌'}</span>
                        <span>{alerta.mensaje}</span>
                    </div>
                </div>
            )}

            <header className="autores-header">
                <div className="header-left">
                    <button className="btn-back" onClick={() => navigate(-1)}>
                        <ArrowLeft size={20} /> Volver
                    </button>
                    <div>
                        <h1>{esSoloLectura ? "Consulta de Autores" : "Gestión de Autores"}</h1>
                        <p className={`role-badge ${isAdmin ? 'admin' : 'reader'}`}>
                            {isAdmin ? <ShieldCheck size={12} /> : <ShieldAlert size={12} />}
                            {isAdmin ? "Acceso Administrativo" : "Acceso de Consulta"}
                        </p>
                    </div>
                </div>

                <div className="search-container" style={{ flex: 1, maxWidth: '400px', marginLeft: '20px' }}>
                    <Search className="search-icon-inside" size={18} />
                    <input 
                        className="search-input" 
                        placeholder="Buscar por nombre o ID..." 
                        value={busqueda} 
                        onChange={(e) => setBusqueda(e.target.value)} 
                    />
                </div>
            </header>

            {/* FORMULARIO: Solo se renderiza si es Admin */}
            {isAdmin && (
                <form className="gestion-form" onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label>ID de la Persona (Datos Personales)</label>
                        <input
                            type="number"
                            value={idPersona}
                            onChange={(e) => setIdPersona(e.target.value)}
                            placeholder="Ingrese el ID de persona ej: 14"
                            required
                        />
                    </div>
                    <div className="form-buttons">
                        <button type="submit" className="btn-action btn-save">
                            {idAutorEditando ? <><Save size={16} /> Actualizar</> : <><User size={16} /> Registrar Autor</>}
                        </button>
                        {idAutorEditando && (
                            <button type="button" className="btn-action btn-cancel" onClick={cancelarFormulario}>
                                <X size={16} /> Cancelar
                            </button>
                        )}
                    </div>
                </form>
            )}

            <div className="table-wrapper">
                <table className="autores-table">
                    <thead>
                        <tr>
                            <th>ID Autor</th>
                            <th>ID Persona</th>
                            <th>Nombre Completo</th>
                            <th>Estado</th>
                            {isAdmin && <th>Auditoría</th>}
                            {isAdmin && <th style={{ textAlign: 'right' }}>Acciones</th>}
                        </tr>
                    </thead>
                    <tbody>
                        {autores.length > 0 ? (
                            autores.map((autor) => (
                                <tr key={autor.id_Autor}>
                                    <td><strong>#{autor.id_Autor}</strong></td>
                                    <td>{autor.id_Persona}</td>
                                    <td>{autor.nombre_Persona} {autor.apellido}</td>
                                    <td>
                                        <span className={`status-badge ${autor.estado === 'Activo' ? 'status-active' : ''}`}>
                                            {autor.estado}
                                        </span>
                                    </td>
                                    {isAdmin && (
                                        <td style={{ fontSize: '11px', color: '#666' }}>
                                            C: {autor.id_Creador} | M: {autor.id_Modificador || "-"}
                                        </td>
                                    )}
                                    {isAdmin && (
                                        <td className="actions-cell">
                                            <button className="btn-icon btn-edit" onClick={() => prepararEdicion(autor)}>
                                                <Edit size={16} />
                                            </button>
                                            <button className="btn-icon btn-delete" onClick={() => handleEliminar(autor.id_Autor)}>
                                                <Trash2 size={16} />
                                            </button>
                                        </td>
                                    )}
                                </tr>
                            ))
                        ) : (
                            <tr><td colSpan={isAdmin ? "6" : "4"} style={{ textAlign: 'center' }}>No hay registros.</td></tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
    getAutores,
    insertarAutor,
    actualizarAutor,
    eliminarAutor,
    filtrarAutorPorPersona
} from "../../services/autorService.js";
import "../../styles/autores.css";

export default function ListarAutores() {
    const [autores, setAutores] = useState([]);
    const [loading, setLoading] = useState(true);
    const [idPersona, setIdPersona] = useState("");
    const [idAutorEditando, setIdAutorEditando] = useState(null);
    const [busqueda, setBusqueda] = useState("");
    
    // Estado para la alerta bonita
    const [alerta, setAlerta] = useState({ visible: false, mensaje: "", tipo: "" });

    // Función para disparar la alerta
    const mostrarMensaje = (mensaje, tipo = "success") => {
        setAlerta({ visible: true, mensaje, tipo });
        setTimeout(() => {
            setAlerta({ visible: false, mensaje: "", tipo: "" });
        }, 4000);
    };

    const procesarRespuesta = async (res) => {
        try {
            // Obtenemos el texto plano primero por si no es un JSON
            const textoOriginal = await res.text();
            let data;

            try {
                data = JSON.parse(textoOriginal);
            } catch (e) {
                // Si no es JSON (es un error de sistema), mostramos el texto tal cual
                return { exito: false, msj: textoOriginal || "Error de sistema", tipo: "error" };
            }

            console.log("Datos recibidos:", data);

            if (res.ok && data.o_Numero === 200) {
                return { 
                    exito: true, 
                    msj: data.o_Msg || "Operación realizada", 
                    tipo: "success" 
                };
            } else {
                // BUSCAMOS EL MENSAJE EN TODAS LAS PROPIEDADES POSIBLES
                // Prioridad: 1. o_Msg, 2. mensaje, 3. message, 4. exceptionMessage
                const mensajeError = data.o_Msg || data.mensaje || data.message || data.exceptionMessage || "Error en la operación";
                
                return { 
                    exito: false, 
                    msj: mensajeError, 
                    tipo: "error" // Lo ponemos en 'error' para que salga el icono X roja
                };
            }
        } catch (error) {
            return { 
                exito: false, 
                msj: "Error crítico al procesar respuesta", 
                tipo: "error" 
            };
        }
    };

    const cargarDatos = async () => {
        setLoading(true);
        try {
            const res = await getAutores();
            if (res && res.data) setAutores(res.data);
            else setAutores([]);
        } catch (error) {
            console.error("Error:", error);
            mostrarMensaje("No se pudieron cargar los datos", "error");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { cargarDatos(); }, []);

    const handleEliminar = async (id) => {
        if (!window.confirm("¿Estás seguro de que deseas eliminar este autor?")) return;

        try {
            const res = await eliminarAutor(id);
            const resultado = await procesarRespuesta(res);

            mostrarMensaje(resultado.msj, resultado.tipo);
            if (resultado.exito) {
                await cargarDatos();
            }
        } catch (error) {
            mostrarMensaje("Error de conexión al eliminar", "error");
        }
    };

    const manejarBusqueda = async () => {
        if (!busqueda) { cargarDatos(); return; }
        setLoading(true);
        try {
            const res = await filtrarAutorPorPersona(busqueda);
            if (res && res.data) setAutores(res.data);
            else setAutores([]);
        } catch (error) {
            setAutores([]);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            let res;
            if (idAutorEditando) {
                res = await actualizarAutor(idAutorEditando, idPersona);
            } else {
                res = await insertarAutor(idPersona);
            }

            const resultado = await procesarRespuesta(res);
            mostrarMensaje(resultado.msj, resultado.tipo);

            if (resultado.exito) {
                cancelarFormulario();
                await cargarDatos();
            }
        } catch (err) {
            mostrarMensaje("Error crítico en el servidor", "error");
        }
    };

    const prepararEdicion = (autor) => {
        setIdAutorEditando(autor.id_Autor);
        setIdPersona(autor.id_Persona);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const cancelarFormulario = () => {
        setIdAutorEditando(null);
        setIdPersona("");
    };

    if (loading) return <div className="autores-page-container"><h2>Cargando información...</h2></div>;

    return (
        <div className="autores-page-container">
            {/* COMPONENTE DE ALERTA VISUAL */}
            {alerta.visible && (
                <div className="notification-container">
                    <div className={`custom-alert ${alerta.tipo}`}>
                        <span>{alerta.tipo === 'success' ? '✅' : alerta.tipo === 'error' ? '❌' : '⚠️'}</span>
                        <span>{alerta.mensaje}</span>
                    </div>
                </div>
            )}

            <header className="autores-header">
                <h1>Gestión de Autores</h1>
                <Link to="/home" className="btn-back">Volver al Inicio</Link>
            </header>

            <div className="search-box" style={{ marginBottom: '20px', display: 'flex', gap: '10px' }}>
                <input
                    type="number"
                    placeholder="Filtrar por ID Persona..."
                    value={busqueda}
                    onChange={(e) => setBusqueda(e.target.value)}
                    style={{ padding: '10px', borderRadius: '5px', border: '1px solid #ddd', flex: 1 }}
                />
                <button onClick={manejarBusqueda} className="btn-action btn-save">🔍 Buscar</button>
                <button onClick={() => { setBusqueda(""); cargarDatos(); }} className="btn-action btn-cancel">🔄 Ver Todos</button>
            </div>

            <form className="gestion-form" onSubmit={handleSubmit} style={{ backgroundColor: '#f9f9f9', padding: '20px', borderRadius: '8px', marginBottom: '30px' }}>
                <div className="form-group">
                    <label><strong>ID Persona a Registrar/Editar</strong></label>
                    <input
                        type="number"
                        value={idPersona}
                        onChange={(e) => setIdPersona(e.target.value)}
                        placeholder="Ej: 1016"
                        required
                    />
                    {idAutorEditando && (
                        <p style={{ color: '#d97706', marginTop: '5px' }}>
                            📍 Modificando Autor ID: <strong>{idAutorEditando}</strong>
                        </p>
                    )}
                </div>
                <div className="form-buttons">
                    <button type="submit" className="btn-action btn-save">
                        {idAutorEditando ? "💾 Actualizar Cambios" : "➕ Guardar Autor"}
                    </button>
                    {idAutorEditando && (
                        <button type="button" className="btn-action btn-cancel" onClick={cancelarFormulario}>
                            Cancelar
                        </button>
                    )}
                </div>
            </form>

            <div className="table-wrapper">
                <table className="autores-table">
                    <thead>
                        <tr>
                            <th>ID Autor</th>
                            <th>ID Persona</th>
                            <th>Nombre Completo</th>
                            <th>Auditoría (C/M)</th>
                            <th>Estado</th>
                            <th>Última Modificación</th>
                            <th style={{ textAlign: 'right' }}>Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {autores.length > 0 ? (
                            autores.map((autor) => (
                                <tr key={autor.id_Autor}>
                                    <td style={{ fontWeight: 'bold' }}>{autor.id_Autor}</td>
                                    <td style={{ color: '#2563eb' }}>{autor.id_Persona}</td>
                                    <td>{autor.nombre_Persona} {autor.apellido}</td>
                                    <td>
                                        <div style={{ fontSize: '0.8rem' }}>
                                            <div>🆕 C: <strong>{autor.id_Creador}</strong></div>
                                            {autor.id_Modificador && (
                                                <div style={{ color: '#059669' }}>✏️ M: <strong>{autor.id_Modificador}</strong></div>
                                            )}
                                        </div>
                                    </td>
                                    <td>
                                        <span className={`status-badge ${autor.estado === 'Activo' ? 'status-active' : ''}`}>
                                            {autor.estado}
                                        </span>
                                    </td>
                                    <td style={{ fontSize: '0.85rem' }}>
                                        {autor.fecha_Modificacion
                                            ? new Date(autor.fecha_Modificacion).toLocaleString()
                                            : new Date(autor.fecha_Creacion).toLocaleDateString()
                                        }
                                    </td>
                                    <td className="actions-cell">
                                        <button className="btn-icon btn-edit" onClick={() => prepararEdicion(autor)} title="Editar">✏️</button>
                                        <button className="btn-icon btn-delete" onClick={() => handleEliminar(autor.id_Autor)} title="Eliminar">🗑️</button>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr><td colSpan="7" style={{ textAlign: 'center' }}>No hay datos disponibles.</td></tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
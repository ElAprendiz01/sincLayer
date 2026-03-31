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
    
    // Estado para alertas
    const [alerta, setAlerta] = useState({ visible: false, mensaje: "", tipo: "" });

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
            // Validamos la estructura que manda tu API (data es el array)
            if (res && res.data) setAutores(res.data);
            else setAutores([]);
        } catch (error) {
            mostrarMensaje("No se pudieron cargar los autores", "error");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { cargarDatos(); }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
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
        setIdAutorEditando(autor.id_Autor);
        setIdPersona(autor.id_Persona);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const cancelarFormulario = () => {
        setIdAutorEditando(null);
        setIdPersona("");
    };

    if (loading) return <div className="autores-page-container"><h2>Sincronizando...</h2></div>;

    return (
        <div className="autores-page-container">
            {/* ALERTAS */}
            {alerta.visible && (
                <div className="notification-container">
                    <div className={`custom-alert ${alerta.tipo}`}>
                        <span>{alerta.tipo === 'success' ? '✅' : '❌'}</span>
                        <span>{alerta.mensaje}</span>
                    </div>
                </div>
            )}

            <header className="autores-header">
                <h1>Catálogo de Autores</h1>
                <Link to="/home" className="btn-back">Volver</Link>
            </header>

            {/* FORMULARIO DE REGISTRO/EDICIÓN */}
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
                        {idAutorEditando ? "💾 Actualizar Autor" : "➕ Registrar Autor"}
                    </button>
                    {idAutorEditando && (
                        <button type="button" className="btn-action btn-cancel" onClick={cancelarFormulario}>
                            Cancelar
                        </button>
                    )}
                </div>
            </form>

            {/* TABLA DE RESULTADOS */}
            <div className="table-wrapper">
                <table className="autores-table">
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Persona</th>
                            <th>Nombre Completo</th>
                            <th>Estado</th>
                            <th>Creador</th>
                            <th>Modificador</th>
                            <th style={{ textAlign: 'right' }}>Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {autores.length > 0 ? (
                            autores.map((autor) => (
                                <tr key={autor.id_Autor}>
                                    <td><strong>{autor.id_Autor}</strong></td>
                                    <td>{autor.id_Persona}</td>
                                    <td>{autor.nombre_Persona} {autor.apellido}</td>
                                    <td>
                                        <span className={`status-badge ${autor.estado === 'Activo' ? 'status-active' : ''}`}>
                                            {autor.estado}
                                        </span>
                                    </td>
                                    <td>{autor.id_Creador}</td>
                                    <td>{autor.id_Modificador || "-"}</td>
                                    <td className="actions-cell">
                                        <button className="btn-icon btn-edit" onClick={() => prepararEdicion(autor)}>✏️</button>
                                        <button className="btn-icon btn-delete" onClick={() => handleEliminar(autor.id_Autor)}>🗑️</button>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr><td colSpan="7" style={{ textAlign: 'center' }}>No hay autores disponibles.</td></tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
    Search, Plus, Edit, Trash2, X, Save, 
    ArrowLeft, CheckCircle2, History, UserCheck, ShieldAlert
} from 'lucide-react';
import { 
    getEstados, 
    eliminarEstado, 
    insertarEstado, 
    editarEstado, 
    filtrarEstados 
} from '../../services/estadoService';
import { useToast } from "../../components/ToastContext";

const ListarEstados = () => {
    const navigate = useNavigate();
    const { showToast } = useToast();

    // ESTADOS DE DATOS
    const [estados, setEstados] = useState([]);
    const [busqueda, setBusqueda] = useState('');
    const [cargando, setCargando] = useState(true);

    // CONTROL DE ACCESO
    const isAdmin = localStorage.getItem("userRole")?.toLowerCase() === "admin";
    const userIdLogueado = parseInt(localStorage.getItem("userId") || "0");

    // ESTADOS DEL MODAL
    const [modalOpen, setModalOpen] = useState(false);
    const [editandoId, setEditandoId] = useState(null);
    const [nombreForm, setNombreForm] = useState('');
    const [activoForm, setActivoForm] = useState(true);

    const cargarDatos = async (texto = '') => {
        setCargando(true);
        try {
            let res;
            if (texto.trim() !== '') {
                res = await filtrarEstados(texto);
            } else {
                res = await getEstados();
            }
            // Asumiendo que la respuesta viene en res.data basado en tus servicios anteriores
            const data = res.data || res; 
            setEstados(Array.isArray(data) ? data : []);
        } catch (error) {
            showToast("Error al sincronizar estados", "error");
            setEstados([]);
        } finally {
            setCargando(false);
        }
    };

    useEffect(() => {
        cargarDatos();
    }, []);

    const handleAbrirModal = (obj = null) => {
        if (!isAdmin) {
            showToast("No tienes permisos para realizar esta acción", "error");
            return;
        }
        if (obj) {
            setEditandoId(obj.id_Estado);
            setNombreForm(obj.estado);
            setActivoForm(obj.activo);
        } else {
            setEditandoId(null);
            setNombreForm('');
            setActivoForm(true);
        }
        setModalOpen(true);
    };

    const handleGuardar = async (e) => {
        e.preventDefault();
        try {
            if (editandoId) {
                await editarEstado(editandoId, {
                    estado: nombreForm,
                    activo: activoForm,
                    id_Modificador: userIdLogueado
                });
                showToast("Estado actualizado correctamente", "success");
            } else {
                await insertarEstado({
                    estado: nombreForm,
                    id_Creador: userIdLogueado
                });
                showToast("Nuevo estado registrado", "success");
            }
            setModalOpen(false);
            cargarDatos(busqueda);
        } catch (error) {
            showToast("Error en la operación", "error");
        }
    };

    const handleEliminar = async (id) => {
        if (!isAdmin) return;
        if (window.confirm("¿Desactivar este estado de NexaCore?")) {
            try {
                await eliminarEstado(id, userIdLogueado);
                showToast("Estado eliminado/desactivado", "warning");
                cargarDatos(busqueda);
            } catch (error) {
                showToast("Error al eliminar", "error");
            }
        }
    };

    return (
        <div className="cat-page" style={{ padding: '20px', maxWidth: '1200px', margin: '0 auto' }}>
            
            <div className="cat-header">
                <div className="header-left">
                    <button className="btn-back" onClick={() => navigate('/admin')}>
                        <ArrowLeft size={20} />
                    </button>
                    <div>
                        <h1 style={{ color: 'white', margin: 0 }}>Diccionario de Estados</h1>
                        <p style={{ color: '#8b949e', fontSize: '0.9rem' }}>Configuración de estados del sistema</p>
                    </div>
                </div>

                <div className="search-container">
                    <Search className="search-icon-inside" size={18} />
                    <input 
                        className="search-input"
                        type="text" 
                        placeholder="Buscar estado..." 
                        value={busqueda}
                        onChange={(e) => {
                            setBusqueda(e.target.value);
                            cargarDatos(e.target.value);
                        }}
                    />
                </div>

                {isAdmin && (
                    <button className="btn-main" onClick={() => handleAbrirModal()}>
                        <Plus size={20} /> Nuevo Estado
                    </button>
                )}
            </div>

            <div className="cat-grid">
                {cargando ? (
                    <div className="no-data">Consultando NexaCore Cloud...</div>
                ) : estados.length > 0 ? (
                    estados.map((e) => (
                        <div key={e.id_Estado} className="cat-card">
                            <div className="card-info">
                                <span className="card-type">ID: {e.id_Estado}</span>
                                <span className={`status-pill ${e.activo ? 'active' : 'inactive'}`} style={{
                                    background: e.activo ? 'rgba(56, 189, 248, 0.1)' : 'rgba(239, 68, 68, 0.1)',
                                    color: e.activo ? '#38bdf8' : '#ef4444',
                                    border: `1px solid ${e.activo ? '#38bdf8' : '#ef4444'}`
                                }}>
                                    {e.activo ? 'VIGENTE' : 'OBSOLETO'}
                                </span>
                            </div>

                            <h2 className="card-title" style={{ color: 'white', fontSize: '1.5rem', marginBottom: '15px' }}>
                                {e.estado}
                            </h2>

                            {/* PANEL DE AUDITORÍA */}
                            <div className="audit-box" style={{ background: '#0d1117', border: '1px solid #30363d', borderRadius: '12px', padding: '12px' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.75rem', color: '#8b949e', marginBottom: '8px' }}>
                                    <History size={14} /> <span>HISTORIAL DE REGISTRO</span>
                                </div>
                                
                                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem' }}>
                                    <span style={{ color: '#58a6ff' }}>Creado por:</span>
                                    <span style={{ color: 'white' }}>U-{e.id_Creador}</span>
                                </div>
                                <div style={{ textAlign: 'right', fontSize: '0.7rem', color: '#484f58', marginBottom: '10px' }}>
                                    {new Date(e.fecha_Creacion).toLocaleString()}
                                </div>

                                {e.id_Modificador && (
                                    <>
                                        <div style={{ borderTop: '1px solid #21262d', margin: '8px 0', paddingTop: '8px', display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem' }}>
                                            <span style={{ color: '#d29922' }}>Modificado:</span>
                                            <span style={{ color: 'white' }}>U-{e.id_Modificador}</span>
                                        </div>
                                        <div style={{ textAlign: 'right', fontSize: '0.7rem', color: '#484f58' }}>
                                            {new Date(e.fecha_Modificacion).toLocaleString()}
                                        </div>
                                    </>
                                )}
                            </div>

                            {isAdmin && (
                                <div className="card-actions" style={{ marginTop: '20px' }}>
                                    <button className="btn-edit" onClick={() => handleAbrirModal(e)}>
                                        <Edit size={16} /> Editar
                                    </button>
                                    <button className="btn-del" onClick={() => handleEliminar(e.id_Estado)}>
                                        <Trash2 size={16} />
                                    </button>
                                </div>
                            )}
                        </div>
                    ))
                ) : (
                    <div className="no-data">
                        <ShieldAlert size={40} style={{ opacity: 0.3 }} />
                        <p>No se encontraron definiciones de estados.</p>
                    </div>
                )}
            </div>

            {/* MODAL DE EDICIÓN / REGISTRO */}
            {modalOpen && (
                <div className="modal-overlay">
                    <div className="cat-form-card" style={{ maxWidth: '400px' }}>
                        <div className="modal-header">
                            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                <CheckCircle2 size={22} color="#58a6ff" />
                                <h3 style={{ color: 'white' }}>{editandoId ? 'Actualizar Definición' : 'Nuevo Estado'}</h3>
                            </div>
                            <X className="close-icon" onClick={() => setModalOpen(false)} />
                        </div>

                        <form onSubmit={handleGuardar} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                            <div className="input-group">
                                <label>Nombre del Estado</label>
                                <input 
                                    type="text" 
                                    required 
                                    value={nombreForm} 
                                    onChange={(e) => setNombreForm(e.target.value)}
                                    placeholder="Ej: Pendiente, Procesado..."
                                />
                            </div>

                            {editandoId && (
                                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', background: '#0d1117', padding: '12px', borderRadius: '8px', border: '1px solid #30363d' }}>
                                    <input 
                                        type="checkbox" 
                                        checked={activoForm} 
                                        onChange={(e) => setActivoForm(e.target.checked)}
                                        style={{ width: '18px', height: '18px' }}
                                    />
                                    <span style={{ color: '#c9d1d9', fontSize: '0.9rem' }}>Estado operativo (Vigente)</span>
                                </div>
                            )}

                            <div className="card-actions">
                                <button type="button" className="btn-cancel" onClick={() => setModalOpen(false)}>Cancelar</button>
                                <button type="submit" className="btn-main" style={{ flex: 2 }}>
                                    <Save size={18} /> {editandoId ? 'Confirmar Cambios' : 'Registrar Estado'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ListarEstados;
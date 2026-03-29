import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
    Search, Plus, Edit, Trash2, X, Save, 
    ArrowLeft, CheckCircle2 
} from 'lucide-react';
import { 
    getEstados, 
    eliminarEstado, 
    insertarEstado, 
    editarEstado, 
    filtrarEstados 
} from '../../services/estadoService';

const ListarEstados = () => {
    const navigate = useNavigate();

    // ESTADOS DE DATOS
    const [estados, setEstados] = useState([]);
    const [busqueda, setBusqueda] = useState('');
    const [cargando, setCargando] = useState(true);

    // ESTADOS DEL MODAL
    const [modalOpen, setModalOpen] = useState(false);
    const [editandoId, setEditandoId] = useState(null);
    const [nombreForm, setNombreForm] = useState('');
    const [activoForm, setActivoForm] = useState(true);

    // 1. CARGAR DATOS
    const cargarDatos = async (texto = '') => {
        setCargando(true);
        try {
            let data;
            if (texto.trim() !== '') {
                data = await filtrarEstados(texto);
            } else {
                data = await getEstados();
            }
            setEstados(Array.isArray(data) ? data : []);
        } catch (error) {
            console.error("Error al cargar estados:", error);
            setEstados([]);
        } finally {
            setCargando(false);
        }
    };

    useEffect(() => {
        cargarDatos();
    }, []);

    // 2. MANEJAR EL MODAL
    const handleAbrirModal = (obj = null) => {
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

    // 3. GUARDAR (INSERTAR / EDITAR)
    const handleGuardar = async (e) => {
        e.preventDefault();
        try {
            if (editandoId) {
                await editarEstado(editandoId, nombreForm, activoForm);
            } else {
                await insertarEstado(nombreForm);
            }
            setModalOpen(false);
            cargarDatos(busqueda);
        } catch (error) {
            alert("Error al guardar el estado");
        }
    };

    // 4. ELIMINAR
    const handleEliminar = async (id) => {
        if (window.confirm("¿Estás seguro de que deseas eliminar este estado?")) {
            await eliminarEstado(id);
            cargarDatos(busqueda);
        }
    };

    return (
        <div className="estados-wrapper" style={{ padding: '20px', maxWidth: '1200px', margin: '0 auto' }}>
            
            {/* BOTÓN VOLVER ATRÁS */}
            <button 
                onClick={() => navigate('/admin')} 
                className="btn-back"
                style={{ 
                    display: 'flex', alignItems: 'center', gap: '8px', 
                    background: 'none', border: 'none', color: '#646cff', 
                    cursor: 'pointer', marginBottom: '20px', fontWeight: 'bold' 
                }}
            >
                <ArrowLeft size={20} /> Volver al Panel
            </button>

            {/* ENCABEZADO */}
            <header className="estados-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
                <div>
                    <h1 style={{ fontSize: '2.5rem', margin: 0, color: 'white' }}>Gestión de Estados</h1>
                </div>
                <button 
                    onClick={() => handleAbrirModal()} 
                    style={{ 
                        background: '#646cff', color: 'white', border: 'none', 
                        padding: '12px 24px', borderRadius: '12px', cursor: 'pointer',
                        display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 'bold'
                    }}
                >
                    <Plus size={20} /> Nuevo Estado
                </button>
            </header>

            {/* BUSCADOR */}
            <div className="search-container" style={{ position: 'relative', marginBottom: '30px' }}>
                <Search style={{ position: 'absolute', left: '15px', top: '12px', color: '#555' }} size={20} />
                <input 
                    className="search-input"
                    type="text" 
                    placeholder="Buscar estado por nombre..." 
                    value={busqueda}
                    onChange={(e) => {
                        setBusqueda(e.target.value);
                        cargarDatos(e.target.value);
                    }}
                    style={{ 
                        width: '100%', padding: '12px 12px 12px 45px', 
                        background: '#1a1a1a', border: '1px solid #333', 
                        borderRadius: '12px', color: 'white' 
                    }}
                />
            </div>

            {/* GRILLA DE ESTADOS */}
            <div className="estados-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '20px' }}>
                {cargando ? (
                    <div style={{ gridColumn: '1/-1', textAlign: 'center', padding: '40px', color: '#888' }}>Cargando información...</div>
                ) : estados.length > 0 ? (
                    estados.map((e) => (
                        <div key={e.id_Estado} className="estado-card" style={{ background: '#111', border: '1px solid #333', padding: '20px', borderRadius: '16px', position: 'relative' }}>
                            
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '15px' }}>
                                <span style={{ background: '#222', padding: '4px 8px', borderRadius: '6px', fontSize: '12px', color: '#888' }}>ID: {e.id_Estado}</span>
                                <span style={{ 
                                    padding: '4px 10px', borderRadius: '20px', fontSize: '11px', fontWeight: 'bold',
                                    background: e.activo ? 'rgba(76, 175, 80, 0.1)' : 'rgba(244, 67, 54, 0.1)',
                                    color: e.activo ? '#4caf50' : '#f44336',
                                    border: `1px solid ${e.activo ? '#4caf50' : '#f44336'}`
                                }}>
                                    {e.activo ? 'ACTIVO' : 'INACTIVO'}
                                </span>
                            </div>

                            <h3 style={{ margin: '0 0 10px 0', fontSize: '1.4rem', color: 'white' }}>{e.estado}</h3>

                            {/* --- SECCIÓN DE AUDITORÍA MEJORADA --- */}
                            <div style={{ 
                                marginTop: '15px', 
                                padding: '12px',
                                background: '#0a0a0a', 
                                borderRadius: '10px',
                                fontSize: '11px',
                                border: '1px solid #222'
                            }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                                    <span style={{ color: '#888' }}>🚀 Creado por:</span>
                                    <span style={{ color: '#646cff', fontWeight: 'bold' }}>Usuario {e.id_Creador}</span>
                                </div>
                                <div style={{ textAlign: 'right', color: '#555', fontSize: '10px', marginBottom: '8px' }}>
                                    {new Date(e.fecha_Creacion).toLocaleDateString('es-NI')} {new Date(e.fecha_Creacion).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                                </div>

                                {e.id_Modificador && (
                                    <>
                                        <div style={{ borderTop: '1px dashed #333', paddingTop: '8px', display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                                            <span style={{ color: '#888' }}>✏️ Editado por:</span>
                                            <span style={{ color: '#ffb74d', fontWeight: 'bold' }}>Usuario {e.id_Modificador}</span>
                                        </div>
                                        <div style={{ textAlign: 'right', color: '#555', fontSize: '10px' }}>
                                            {e.fecha_Modificacion ? (
                                                `${new Date(e.fecha_Modificacion).toLocaleDateString('es-NI')} ${new Date(e.fecha_Modificacion).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}`
                                            ) : 'Fecha no registrada'}
                                        </div>
                                    </>
                                )}
                            </div>
                            {/* -------------------------------------- */}

                            <div style={{ display: 'flex', gap: '10px', marginTop: '20px' }}>
                                <button onClick={() => handleAbrirModal(e)} style={{ flex: 1, background: '#333', border: 'none', color: 'white', padding: '8px', borderRadius: '8px', cursor: 'pointer', display: 'flex', justifyContent: 'center', gap: '5px' }}>
                                    <Edit size={16} /> Editar
                                </button>
                                <button onClick={() => handleEliminar(e.id_Estado)} style={{ flex: 1, background: 'rgba(244, 67, 54, 0.1)', border: 'none', color: '#f44336', padding: '8px', borderRadius: '8px', cursor: 'pointer', display: 'flex', justifyContent: 'center', gap: '5px' }}>
                                    <Trash2 size={16} /> Borrar
                                </button>
                            </div>
                        </div>
                    ))
                ) : (
                    <div style={{ gridColumn: '1/-1', textAlign: 'center', color: '#555' }}>No se encontraron estados disponibles.</div>
                )}
            </div>

            {/* MODAL PARA AGREGAR/EDITAR */}
            {modalOpen && (
                <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.9)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, backdropFilter: 'blur(10px)' }}>
                    <div style={{ background: '#111', border: '1px solid #333', padding: '40px', borderRadius: '24px', width: '90%', maxWidth: '450px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
                            <h2 style={{ margin: 0, display: 'flex', alignItems: 'center', gap: '10px', color: 'white' }}>
                                <CheckCircle2 style={{ color: '#646cff' }} />
                                {editandoId ? 'Actualizar Estado' : 'Nuevo Registro'}
                            </h2>
                            <button onClick={() => setModalOpen(false)} style={{ background: 'none', border: 'none', color: '#555', cursor: 'pointer' }}><X size={24} /></button>
                        </div>

                        <form onSubmit={handleGuardar} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                            <div>
                                <label style={{ display: 'block', marginBottom: '10px', fontSize: '12px', color: '#888', textTransform: 'uppercase', fontWeight: 'bold' }}>Nombre del Estado</label>
                                <input 
                                    type="text" 
                                    required 
                                    value={nombreForm} 
                                    onChange={(e) => setNombreForm(e.target.value)}
                                    placeholder="Ej: Pendiente, Activo..."
                                    style={{ width: '100%', padding: '15px', background: '#000', border: '1px solid #333', borderRadius: '12px', color: 'white', outline: 'none' }}
                                />
                            </div>

                            {editandoId && (
                                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', background: '#1a1a1a', padding: '15px', borderRadius: '12px' }}>
                                    <input 
                                        type="checkbox" 
                                        checked={activoForm} 
                                        onChange={(e) => setActivoForm(e.target.checked)}
                                        style={{ width: '20px', height: '20px', cursor: 'pointer' }}
                                    />
                                    <span style={{ color: '#ccc' }}>¿Este estado está vigente?</span>
                                </div>
                            )}

                            <div style={{ display: 'flex', gap: '15px', marginTop: '10px' }}>
                                <button type="submit" style={{ flex: 2, background: '#646cff', color: 'white', border: 'none', padding: '15px', borderRadius: '12px', fontWeight: 'bold', cursor: 'pointer', display: 'flex', justifyContent: 'center', gap: '10px' }}>
                                    <Save size={20} /> {editandoId ? 'Guardar Cambios' : 'Registrar'}
                                </button>
                                <button type="button" onClick={() => setModalOpen(false)} style={{ flex: 1, background: '#222', color: '#888', border: 'none', borderRadius: '12px', cursor: 'pointer' }}>Cancelar</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ListarEstados;
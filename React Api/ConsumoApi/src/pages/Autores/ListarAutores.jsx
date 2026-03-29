import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Edit, Trash2, ArrowLeft } from 'lucide-react';
import { getTiposCatalogo, eliminarTipoCatalogo } from '../../services/tipoCatalogoService';
import '../../styles/tipoCatalogo.css';

const ListarTipoCatalogo = () => {
    const [tipos, setTipos] = useState([]);
    const [cargando, setCargando] = useState(true);
    const navigate = useNavigate();

    const cargarDatos = async () => {
        try {
            setCargando(true);
            const data = await getTiposCatalogo();
            setTipos(Array.isArray(data) ? data : []);
        } catch (error) {
            console.error("Error:", error);
        } finally {
            setCargando(false);
        }
    };

    useEffect(() => {
        cargarDatos();
    }, []);

    const handleEliminar = async (id) => {
        if (!window.confirm("¿Deseas eliminar este Tipo de Catálogo?")) return;
        const exito = await eliminarTipoCatalogo(id);
        if (exito) {
            setTipos(prev => prev.filter(t => t.id_Tipo_Catalogo !== id));
        } else {
            alert("Error al eliminar. Verifique si tiene registros asociados.");
        }
    };

    return (
        <div className="catalogo-container">
            <header className="catalogo-header">
                <button onClick={() => navigate('/admin')} className="btn-back">
                    <ArrowLeft size={18} /> Panel
                </button>
                <h1>Tipos de Catálogo</h1>
                <button className="btn-new">
                    <Plus size={20} /> Nuevo Tipo
                </button>
            </header>

            {cargando ? (
                <p>Conectando con NexaCore...</p>
            ) : (
                <div className="catalogo-grid">
                    {tipos.map((t) => (
                        <div key={t.id_Tipo_Catalogo} className="catalogo-card">
                            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                <span className="id-badge">ID: {t.id_Tipo_Catalogo}</span>
                                <span className={`status-badge ${t.activo ? 'status-active' : 'status-inactive'}`}>
                                    {t.activo ? 'Activo' : 'Inactivo'}
                                </span>
                            </div>
                            
                            <h3 style={{ margin: '20px 0', fontSize: '1.4rem' }}>{t.nombre}</h3>

                            <div className="card-actions">
                                <button className="btn-edit"><Edit size={16} /> Editar</button>
                                <button 
                                    className="btn-delete" 
                                    onClick={() => handleEliminar(t.id_Tipo_Catalogo)}
                                >
                                    <Trash2 size={16} /> Eliminar
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default ListarTipoCatalogo;
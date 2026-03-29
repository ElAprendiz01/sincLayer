import "../../styles/tipocatalogoModerno.css";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { 
    getTiposCatalogo, 
    eliminarTipoCatalogo, 
    crearTipoCatalogo, 
    editarTipoCatalogo 
} from "../../services/tipoCatalogoService";
import TipoCatalogoCard from "../../components/TipoCatologoCard"; 
import { ArrowLeft, Plus, Search } from "lucide-react";

const ListarTipoCatalogo = () => {
    const navigate = useNavigate();
    const [tipos, setTipos] = useState([]);
    const [cargando, setCargando] = useState(true);
    const [enviando, setEnviando] = useState(false); 
    const [modalAbierto, setModalAbierto] = useState(false);
    const [editandoId, setEditandoId] = useState(null);
    const [nombreTipo, setNombreTipo] = useState("");
    
    // Estado para la búsqueda dinámica
    const [terminoBusqueda, setTerminoBusqueda] = useState("");

    const cargar = async () => {
        const token = localStorage.getItem("token");
        if (!token) { navigate("/login"); return; }
        try {
            setCargando(true);
            const data = await getTiposCatalogo();
            setTipos(Array.isArray(data) ? data : []);
        } finally { setCargando(false); }
    };

    useEffect(() => { cargar(); }, []);

    const formatearFecha = (f) => {
        if (!f) return "-";
        const d = new Date(f);
        return `${d.getDate()}/${d.getMonth() + 1}/${d.getFullYear()} ${d.getHours()}:${d.getMinutes().toString().padStart(2, '0')}`;
    };

    const handleGuardar = async (e) => {
        e.preventDefault();
        const loggedUserId = localStorage.getItem("userId");
        setEnviando(true);
        try {
            const payload = { 
                nombre: nombreTipo, 
                id_Creador: editandoId ? null : parseInt(loggedUserId), 
                id_Modificador: editandoId ? parseInt(loggedUserId) : null, 
                activo: true 
            };
            const exito = editandoId ? await editarTipoCatalogo(editandoId, payload) : await crearTipoCatalogo(payload);
            if (exito) { setModalAbierto(false); await cargar(); }
        } finally { setEnviando(false); }
    };

    // Lógica para filtrar los catálogos por nombre en tiempo real
    const catalogosFiltrados = tipos.filter(t => 
        t.nombre.toLowerCase().includes(terminoBusqueda.toLowerCase())
    );

    return (
        <div className="tipo-container">
            {/* --- BOTÓN VOLVER ATRÁS AL PANEL --- */}
            <button 
                onClick={() => navigate('/admin')} 
                className="btn-back-link"
                style={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    gap: '8px', 
                    background: 'none', 
                    border: 'none', 
                    color: '#888', 
                    cursor: 'pointer', 
                    marginBottom: '20px', 
                    fontWeight: 'bold',
                    padding: 0
                }}
            >
                <ArrowLeft size={20} /> Volver al Panel
            </button>

            {/* --- HEADER CON TÍTULO Y NUEVO REGISTRO --- */}
            <div className="header-flex">
                <h1>Tipos de Catálogo</h1>
                <button 
                    className="btn-principal" 
                    onClick={() => {setEditandoId(null); setNombreTipo(""); setModalAbierto(true);}}
                    style={{ display: 'flex', alignItems: 'center', gap: '8px' }}
                >
                    <Plus size={20} /> Nuevo Registro
                </button>
            </div>

            {cargando ? (
                <div className="loader">Sincronizando con NexaCore...</div>
            ) : (
                <div className="tipo-grid">
                    {catalogosFiltrados.map((t, index) => (
                        <TipoCatalogoCard 
                            key={t.id_Tipo_Catalogo} 
                            t={t} 
                            index={index} 
                            formatFecha={formatearFecha}
                            onEdit={(tipo) => {setEditandoId(tipo.id_Tipo_Catalogo); setNombreTipo(tipo.nombre); setModalAbierto(true);}}
                            onDelete={async (id) => { if(window.confirm("¿Borrar?")) { await eliminarTipoCatalogo(id); cargar(); } }}
                        />
                    ))}
                </div>
            )}

            {/* Modal de Formulario */}
            {modalAbierto && (
                <div className="modal-overlay">
                    <div className="modal">
                        <h2>{editandoId ? "Actualizar" : "Nuevo"} Registro</h2>
                        <form onSubmit={handleGuardar}> 
                            <div className="form-group">
                                <label style={{ color: '#666', fontSize: '0.8rem', display: 'block', marginBottom: '10px' }}>
                                    Nombre del catálogo:
                                </label>
                                <input 
                                    type="text" 
                                    value={nombreTipo} 
                                    onChange={(e) => setNombreTipo(e.target.value)} 
                                    required 
                                    autoFocus
                                    placeholder="Ingrese el nombre..."
                                />
                            </div>

                            <div className="modal-btns" style={{ display: 'flex', gap: '10px', marginTop: '20px' }}>
                                <button type="submit" className="btn-principal" style={{ flex: 1 }} disabled={enviando}>
                                    {enviando ? "Guardando..." : "Guardar"}
                                </button>
                                
                                <button 
                                    type="button" 
                                    className="btn-del" 
                                    style={{ flex: 1 }} 
                                    onClick={() => setModalAbierto(false)}
                                >
                                    Cancelar
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ListarTipoCatalogo;
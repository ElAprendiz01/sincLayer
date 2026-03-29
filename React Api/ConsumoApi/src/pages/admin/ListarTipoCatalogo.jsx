import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Plus } from "lucide-react";
import { 
    getTiposCatalogo, 
    eliminarTipoCatalogo, 
    crearTipoCatalogo, 
    editarTipoCatalogo 
} from "../../services/tipoCatalogoService";
import TipoCatalogoCard from "../../components/TipoCatologoCard"; 
import "../../styles/tipocatalogoModerno.css";

const ListarTipoCatalogo = () => {
    const navigate = useNavigate();
    const [tipos, setTipos] = useState([]);
    const [cargando, setCargando] = useState(true);
    const [modalAbierto, setModalAbierto] = useState(false);
    const [editandoId, setEditandoId] = useState(null);
    const [nombreTipo, setNombreTipo] = useState("");

    const cargar = async () => {
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
        const payload = { 
            nombre: nombreTipo, 
            id_Creador: editandoId ? null : parseInt(loggedUserId), 
            id_Modificador: editandoId ? parseInt(loggedUserId) : null, 
            activo: true 
        };
        const exito = editandoId ? await editarTipoCatalogo(editandoId, payload) : await crearTipoCatalogo(payload);
        if (exito) { setModalAbierto(false); cargar(); }
    };

    return (
        <div className="tipo-container">
            <button onClick={() => navigate('/admin')} className="btn-back-link" style={{ color: '#888', background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '20px' }}>
                <ArrowLeft size={20} /> Volver al Panel
            </button>

            <div className="header-flex">
                <h1>Tipos de Catálogo</h1>
                <button className="btn-principal" onClick={() => {setEditandoId(null); setNombreTipo(""); setModalAbierto(true);}} style={{ background: '#111', color: '#eee', border: '1px solid #222', padding: '10px 20px', borderRadius: '12px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Plus size={20} /> Nuevo Registro
                </button>
            </div>

            {cargando ? (
                <div className="loader">Sincronizando con NexaCore...</div>
            ) : (
                <div className="tipo-grid">
                    {tipos.map((t, index) => (
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

            {modalAbierto && (
                <div className="modal-overlay">
                    <div className="modal">
                        <h2>{editandoId ? "Actualizar Registro" : "Nuevo Registro"}</h2>
                        <form onSubmit={handleGuardar}>
                            <label>Nombre del catálogo:</label>
                            <input type="text" value={nombreTipo} onChange={(e) => setNombreTipo(e.target.value)} required />
                            <div className="modal-btns" style={{ display: 'flex', gap: '10px' }}>
                                <button type="submit" className="btn-edit" style={{ flex: 2, background: '#eee', color: '#000' }}>Guardar</button>
                                <button type="button" className="btn-del" onClick={() => setModalAbierto(false)} style={{ flex: 1 }}>Cancelar</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ListarTipoCatalogo;
import { Edit3, Trash2, ShieldOff } from "lucide-react";

const TipoCatalogoCard = ({ t, onEdit, onDelete, formatFecha, index }) => {
    // Determinamos si el usuario tiene permisos basándonos en la existencia de las funciones
    const tienePermisos = !!onEdit && !!onDelete;

    return (
        <div className="modern-card" style={{ animationDelay: `${index * 0.1}s` }}>
            <div className="modern-card-header">
                <span className="badge-id">ID: {t.id_Tipo_Catalogo}</span>
                <span className={`status-pill ${t.activo ? 'activo' : 'inactivo'}`}>
                    {t.activo ? "ACTIVO" : "INACTIVO"}
                </span>
            </div>
            
            <h2 className="card-title">{t.nombre}</h2>
            
            <div className="audit-box">
                <div className="audit-row">
                    <span className="audit-label">🚀 Creado por:</span>
                    <div>
                        <span className="audit-user">Usuario {t.id_Creador}</span>
                        <span className="audit-date">{formatFecha(t.fecha_Creacion)}</span>
                    </div>
                </div>
                
                <div className="audit-sep"></div>
                
                <div className="audit-row">
                    <span className="audit-label">✏️ Editado por:</span>
                    <div>
                        {t.id_Modificador ? (
                            <>
                                <span className="audit-user">Usuario {t.id_Modificador}</span>
                                <span className="audit-date">{formatFecha(t.fecha_Modificacion)}</span>
                            </>
                        ) : (
                            <span className="audit-user text-slate-500">Sin modificaciones</span>
                        )}
                    </div>
                </div>
            </div>
            
            {/* SECCIÓN DE ACCIONES CORREGIDA */}
            <div className="acciones">
                {tienePermisos ? (
                    <>
                        <button className="btn-edit" onClick={() => onEdit(t)}>
                            <Edit3 size={16} /> Edit
                        </button>
                        <button className="btn-del" onClick={() => onDelete(t.id_Tipo_Catalogo)}>
                            <Trash2 size={16} /> Delete
                        </button>
                    </>
                ) : (
                    <div className="read-only-tag" style={{ 
                        display: 'flex', 
                        alignItems: 'center', 
                        gap: '6px', 
                        fontSize: '11px', 
                        color: '#64748b',
                        fontWeight: '600',
                        textTransform: 'uppercase',
                        padding: '8px'
                    }}>
                        <ShieldOff size={14} /> Solo lectura
                    </div>
                )}
            </div>
        </div>
    );
};

export default TipoCatalogoCard;
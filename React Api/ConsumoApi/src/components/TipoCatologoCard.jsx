import React from 'react';

const TipoCatalogoCard = ({ t, onEdit, onDelete, formatFecha, index }) => {
    return (
        <div 
            className="modern-card" 
            style={{ animationDelay: `${index * 0.1}s` }} 
        >
            <div className="modern-card-header">
                <span className="badge-id">ID: {t.id_Tipo_Catalogo}</span>
                <span className="status-pill">ACTIVO</span>
            </div>
            
            <h2 className="card-title">{t.nombre}</h2>
            
            <div className="audit-box">
                {/* Bloque Creador */}
                <div className="audit-row">
                    <div className="audit-label">🚀 Creado por:</div>
                    <div className="audit-data">
                        <span className="audit-user">Usuario {t.id_Creador}</span>
                        <span className="audit-date">{formatFecha(t.fecha_Creacion)}</span>
                    </div>
                </div>
                
                <div className="audit-sep"></div>
                
                {/* Bloque Modificador */}
                <div className="audit-row">
                    <div className="audit-label">✏️ Editado por:</div>
                    <div className="audit-data">
                        {t.id_Modificador ? (
                            <>
                                <span className="audit-user">Usuario {t.id_Modificador}</span>
                                <span className="audit-date">{formatFecha(t.fecha_Modificacion)}</span>
                            </>
                        ) : (
                            <span className="audit-user">-</span>
                        )}
                    </div>
                </div>
            </div>
            
            <div className="acciones">
                <button className="btn-edit" onClick={() => onEdit(t)}>Editor</button>
                <button className="btn-del" onClick={() => onDelete(t.id_Tipo_Catalogo)}>Borrar</button>
            </div>
        </div>
    );
};

export default TipoCatalogoCard;
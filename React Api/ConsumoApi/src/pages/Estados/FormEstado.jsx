import React, { useState, useEffect } from 'react';
import { Save, X, CheckCircle2 } from 'lucide-react';

const FormEstado = ({ onConfirmar, onCancel, estadoEdit }) => {
    const [nombre, setNombre] = useState('');
    const [activo, setActivo] = useState(true);

    useEffect(() => {
        if (estadoEdit) {
            setNombre(estadoEdit.estado);
            setActivo(estadoEdit.activo);
        }
    }, [estadoEdit]);

    const handleSubmit = (e) => {
        e.preventDefault();
        onConfirmar(nombre, activo);
    };

    return (
        <div className="bg-slate-800/80 border border-slate-700 p-6 rounded-3xl backdrop-blur-xl shadow-2xl">
            <h3 className="text-xl font-bold mb-6 text-white flex items-center gap-2">
                <CheckCircle2 className="text-blue-500" />
                {estadoEdit ? 'Actualizar Estado' : 'Nuevo Registro'}
            </h3>
            <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                    <label className="block text-slate-400 text-xs uppercase font-bold mb-2 ml-1">Nombre</label>
                    <input 
                        type="text" value={nombre} onChange={(e) => setNombre(e.target.value)}
                        className="w-full bg-slate-900 border border-slate-700 rounded-2xl p-4 text-white focus:border-blue-500 outline-none transition-all"
                        placeholder="Ej: Activo" required
                    />
                </div>
                
                {estadoEdit && (
                    <div className="flex items-center gap-3 ml-1">
                        <input 
                            type="checkbox" checked={activo} onChange={(e) => setActivo(e.target.checked)}
                            className="w-5 h-5 rounded border-slate-700 bg-slate-900 text-blue-600 focus:ring-blue-500"
                        />
                        <span className="text-slate-300 text-sm font-medium italic">Estado Activo</span>
                    </div>
                )}

                <div className="flex gap-3 pt-2">
                    <button type="submit" className="flex-1 bg-blue-600 hover:bg-blue-700 p-4 rounded-2xl font-bold flex justify-center items-center gap-2 transition-all">
                        <Save size={20} /> {estadoEdit ? 'Guardar Cambios' : 'Registrar'}
                    </button>
                    <button type="button" onClick={onCancel} className="bg-slate-700 hover:bg-slate-600 p-4 rounded-2xl transition-all">
                        <X size={20} />
                    </button>
                </div>
            </form>
        </div>
    );
};

export default FormEstado;
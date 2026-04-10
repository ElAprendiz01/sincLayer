import React, { useState, useEffect, useCallback } from "react";
import { Receipt, PlusCircle, Trash2, X, Edit2, Save, RotateCcw, Search, Info } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { pagosService } from "../../services/pagoService";
import { acuerdosService } from "../../services/acuerdospagoService";
import { showNexaAlert } from "../../utils/alerts";
import "../../styles/pago.css";

const PagosModulo = () => {
    // --- ESTADOS ---
    const [pagos, setPagos] = useState([]);
    const [loading, setLoading] = useState(false);
    const [showModalAcuerdos, setShowModalAcuerdos] = useState(false);
    const [acuerdosBusqueda, setAcuerdosBusqueda] = useState([]);
    const [editMode, setEditMode] = useState(false);

    const initialForm = {
        id_Pago: null,
        id_Multa: "",
        id_Acuerdo: null,
        monto_Pagado: "",
        metodo_Pago: 31, 
        numero_Comprobante: "",
        id_Creador: localStorage.getItem("userId") || 1
    };
    const [formData, setFormData] = useState(initialForm);

    // --- CARGAR DATOS ---
    const cargarPagos = useCallback(async () => {
        setLoading(true);
        try {
            const res = await pagosService.listar();
            setPagos(Array.isArray(res) ? res : []);
        } catch (error) {
            showNexaAlert.error("Error al sincronizar con el servidor");
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        cargarPagos();
    }, [cargarPagos]);

    // --- GESTIÓN DE ACUERDOS ---
    const abrirSeleccionAcuerdo = async () => {
        try {
            const data = await acuerdosService.listarTodos();
            setAcuerdosBusqueda(data || []);
            setShowModalAcuerdos(true);
        } catch (error) {
            showNexaAlert.error("No se pudieron obtener los acuerdos activos");
        }
    };

    const seleccionarAcuerdo = (acuerdo) => {
        setFormData({
            ...formData,
            id_Acuerdo: acuerdo.id_Acuerdo,
            id_Multa: acuerdo.id_Multa,
            monto_Pagado: acuerdo.monto_Por_Cuota
        });
        setShowModalAcuerdos(false);
    };

    // --- ACCIONES CRUD ---
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (editMode) {
                const payload = {
                    ...formData,
                    id_Modificador: localStorage.getItem("userId") || 1
                };
                const res = await pagosService.editar(payload);
                showNexaAlert.success(res.mensaje || "Registro actualizado");
            } else {
                const res = await pagosService.insertar(formData);
                showNexaAlert.success(res.mensaje || "Pago procesado exitosamente");
            }
            cancelarEdicion();
            cargarPagos();
        } catch (error) {
            showNexaAlert.error(error.message || "Error en la validación");
        }
    };

    const prepararEdicion = (pago) => {
        setEditMode(true);
        setFormData({
            id_Pago: pago.id_Pago,
            id_Multa: pago.id_Multa,
            id_Acuerdo: pago.id_Acuerdo,
            monto_Pagado: pago.monto_Pagado,
            metodo_Pago: pago.id_Metodo_Pago || 31, 
            numero_Comprobante: pago.numero_Comprobante,
            id_Creador: pago.id_Usuario
        });
    };

    const cancelarEdicion = () => {
        setEditMode(false);
        setFormData(initialForm);
    };

    const handleAnular = async (id) => {
        const confirmar = await showNexaAlert.confirm("¿Deseas anular esta transacción? El saldo se revertirá a la multa.");
        if (confirmar) {
            try {
                const modId = localStorage.getItem("userId") || 1;
                const res = await pagosService.anular(id, modId);
                showNexaAlert.success(res.mensaje || "Transacción anulada");
                cargarPagos();
            } catch (error) {
                showNexaAlert.error(error.message);
            }
        }
    };

    return (
        <div className="nexa-pagos-page bg-[#0f172a] min-h-screen p-4 lg:p-8 text-white font-sans">
            {/* HEADER CON GRADIENTE ACTUALIZADO (bg-linear-to-r) */}
            <header className="flex items-center justify-between mb-12 px-2">
                <div className="flex items-center gap-5">
                    <div className="p-4 bg-indigo-500/10 border border-indigo-500/20 rounded-3xl">
                        <Receipt className="text-indigo-400" size={36} />
                    </div>
                    <div>
                        <h1 className="text-3xl font-black tracking-tight bg-clip-text text-transparent bg-linear-to-r from-white to-slate-400">
                            Gestión de Caja
                        </h1>
                        <p className="text-slate-500 text-[10px] font-bold uppercase tracking-[0.2em]">Auditoría de ingresos v4.0</p>
                    </div>
                </div>
            </header>

            <div className="grid grid-cols-1 xl:grid-cols-12 gap-8 items-start">
                {/* PANEL IZQUIERDO: FORMULARIO CON rounded-4xl */}
                <aside className="xl:col-span-4 space-y-6">
                    <div className="bg-slate-900/50 border border-slate-800 p-8 rounded-4xl backdrop-blur-sm shadow-2xl">
                        <div className="flex items-center gap-3 mb-8">
                           <div className={`w-1.5 h-6 rounded-full ${editMode ? 'bg-amber-500' : 'bg-indigo-500'}`}></div>
                           <h3 className="text-sm font-black uppercase tracking-widest text-slate-200">
                                {editMode ? "Modificar Registro" : "Nuevo Ingreso"}
                           </h3>
                        </div>
                        
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">ID Multa</label>
                                <input type="number" className="w-full bg-slate-950/50 border border-slate-800 rounded-2xl px-5 py-3 text-slate-500 cursor-not-allowed italic text-sm" value={formData.id_Multa} readOnly placeholder="Vincule un acuerdo..." required />
                            </div>

                            {/* CONFLICTO DE COLOR RESUELTO AQUÍ */}
                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase tracking-widest ml-1 text-indigo-400">
                                    Acuerdo de Pago
                                </label>
                                <div className="flex gap-2">
                                    <input type="text" className="flex-1 bg-slate-950/50 border border-slate-800 rounded-2xl px-5 py-3 text-slate-300 font-medium text-sm" value={formData.id_Acuerdo ? `Convenio #${formData.id_Acuerdo}` : "Sin seleccionar"} readOnly />
                                    {!editMode && (
                                        <button type="button" onClick={abrirSeleccionAcuerdo} className="bg-indigo-600 hover:bg-indigo-500 w-14 rounded-2xl flex items-center justify-center transition-all shadow-lg shadow-indigo-600/20">
                                            <Search size={18} />
                                        </button>
                                    )}
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Importe ($)</label>
                                    <input type="number" step="0.01" className="w-full bg-slate-950 border border-slate-800 rounded-2xl px-5 py-3 text-emerald-400 font-black text-lg focus:border-emerald-500 outline-none transition-all" value={formData.monto_Pagado} onChange={(e) => setFormData({...formData, monto_Pagado: e.target.value})} required />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Referencia</label>
                                    <input type="text" className="w-full bg-slate-950 border border-slate-800 rounded-2xl px-5 py-3 focus:border-indigo-500 outline-none transition-all text-sm" value={formData.numero_Comprobante} onChange={(e) => setFormData({...formData, numero_Comprobante: e.target.value})} required />
                                </div>
                            </div>

                            <div className="pt-4 space-y-3">
                                <button type="submit" className={`w-full py-4 rounded-2xl font-black text-xs uppercase tracking-[0.2em] transition-all ${editMode ? 'bg-amber-600 hover:bg-amber-500' : 'bg-indigo-600 hover:bg-indigo-500'}`}>
                                    <span className="flex items-center justify-center gap-3">
                                        {editMode ? <Save size={18}/> : <PlusCircle size={18}/>}
                                        {editMode ? "Actualizar" : "Registrar Pago"}
                                    </span>
                                </button>
                                
                                {editMode && (
                                    <button type="button" onClick={cancelarEdicion} className="w-full py-4 rounded-2xl bg-slate-800 hover:bg-slate-700 text-slate-400 font-black text-xs uppercase tracking-[0.2em] transition-all flex items-center justify-center gap-3">
                                        <RotateCcw size={18}/> Cancelar
                                    </button>
                                )}
                            </div>
                        </form>
                    </div>
                </aside>

                {/* PANEL DERECHO: HISTORIAL CON rounded-4xl */}
                <main className="xl:col-span-8">
                    <div className="bg-slate-900/30 border border-slate-800 rounded-4xl overflow-hidden shadow-xl">
                        <div className="p-8 border-b border-slate-800 bg-slate-900/50 flex justify-between items-center">
                            <h3 className="text-xs font-black uppercase tracking-widest text-slate-400">Transacciones Recientes</h3>
                            <div className="p-2 bg-slate-800 rounded-lg"><Info size={16} className="text-slate-500"/></div>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="w-full text-left border-collapse">
                                <thead>
                                    <tr className="text-[10px] font-black text-slate-500 uppercase tracking-widest border-b border-slate-800">
                                        <th className="px-8 py-5">Ticket</th>
                                        <th className="px-8 py-5">Concepto</th>
                                        <th className="px-8 py-5">Monto</th>
                                        <th className="px-8 py-5">Referencia</th>
                                        <th className="px-8 py-5 text-right">Acciones</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-800/50">
                                    {loading ? (
                                        <tr><td colSpan="5" className="text-center py-20 text-[10px] font-black text-slate-600 uppercase tracking-widest animate-pulse">Consultando base de datos...</td></tr>
                                    ) : pagos.length === 0 ? (
                                        <tr><td colSpan="5" className="text-center py-20 text-slate-500 text-sm italic">No hay registros de cobro para mostrar.</td></tr>
                                    ) : (
                                        pagos.map((p) => (
                                            <tr key={`pago-row-${p.id_Pago}`} className="hover:bg-slate-800/30 transition-all group">
                                                <td className="px-8 py-5 font-mono text-[11px] text-indigo-400 font-bold">#P-{p.id_Pago}</td>
                                                <td className="px-8 py-5">
                                                    <div className="text-xs font-bold text-slate-200">Multa M-{p.id_Multa}</div>
                                                    <div className="text-[10px] text-slate-500 font-medium">Acuerdo: {p.id_Acuerdo || 'N/A'}</div>
                                                </td>
                                                <td className="px-8 py-5 font-black text-emerald-400 text-sm">${p.monto_Pagado}</td>
                                                <td className="px-8 py-5 text-xs text-slate-400">{p.numero_Comprobante}</td>
                                                <td className="px-8 py-5 text-right">
                                                    <div className="flex justify-end gap-2">
                                                        <button className="p-2 bg-slate-800 hover:bg-indigo-600 rounded-xl transition-all" onClick={() => prepararEdicion(p)}>
                                                            <Edit2 size={14} />
                                                        </button>
                                                        <button className="p-2 bg-slate-800 hover:bg-rose-600 rounded-xl transition-all" onClick={() => handleAnular(p.id_Pago)}>
                                                            <Trash2 size={14} />
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </main>
            </div>

            {/* MODAL: SELECCIÓN DE ACUERDOS */}
            <AnimatePresence>
                {showModalAcuerdos && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-slate-950/90 backdrop-blur-md flex items-center justify-center z-50 p-6">
                        <motion.div initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }} className="bg-[#111827] border border-slate-800 w-full max-w-2xl rounded-4xl overflow-hidden shadow-2xl">
                            <div className="p-8 border-b border-slate-800 flex justify-between items-center bg-slate-900/50">
                                <div>
                                    <h3 className="text-xl font-black text-white tracking-tight">Vincular Convenio</h3>
                                    <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mt-1">Convenios de pago vigentes</p>
                                </div>
                                <button onClick={() => setShowModalAcuerdos(false)} className="p-3 bg-slate-800 hover:bg-slate-700 rounded-2xl transition-all">
                                    <X size={20} />
                                </button>
                            </div>
                            <div className="p-8 max-h-[50vh] overflow-y-auto space-y-3">
                                {acuerdosBusqueda.map(ac => (
                                    <div key={ac.id_Acuerdo} className="flex items-center justify-between p-5 bg-slate-900/50 border border-slate-800 rounded-3xl hover:border-indigo-500/40 transition-all group">
                                        <div>
                                            <div className="text-sm font-black text-slate-200">Convenio #{ac.id_Acuerdo}</div>
                                            <div className="text-[10px] text-slate-500 font-bold uppercase">Ref: Multa M-{ac.id_Multa}</div>
                                        </div>
                                        <div className="flex items-center gap-6">
                                            <div className="text-right">
                                                <span className="text-[10px] text-slate-500 font-black uppercase block tracking-widest">Cuota sugerida</span>
                                                <span className="text-lg font-black text-emerald-400">${ac.monto_Por_Cuota}</span>
                                            </div>
                                            <button onClick={() => seleccionarAcuerdo(ac)} className="bg-indigo-600 hover:bg-indigo-500 px-6 py-3 rounded-2xl font-black text-xs uppercase tracking-widest transition-all">
                                                Seleccionar
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default PagosModulo;
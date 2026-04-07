import React, { useState, useEffect, useCallback } from "react";
import { Receipt, PlusCircle, Trash2, X, Edit2, Save, RotateCcw, Search } from "lucide-react";
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
        metodo_Pago: 31, // Valor por defecto según tu DB
        numero_Comprobante: "",
        id_Creador: localStorage.getItem("userId") || 1
    };
    const [formData, setFormData] = useState(initialForm);

    // --- CARGAR DATOS (READ) ---
    const cargarPagos = useCallback(async () => {
        setLoading(true);
        try {
            const res = await pagosService.listar(); // Llama a /Listar
            setPagos(Array.isArray(res) ? res : []);
        } catch (error) {
            showNexaAlert.error(error.message);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        cargarPagos();
    }, [cargarPagos]);

    // --- SELECCIÓN DE ACUERDO ---
    const abrirSeleccionAcuerdo = async () => {
        try {
            const data = await acuerdosService.listarTodos(); // Llama a /Listar de acuerdos
            setAcuerdosBusqueda(data || []);
            setShowModalAcuerdos(true);
        } catch (error) {
            showNexaAlert.error("No se pudieron cargar los acuerdos");
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

    // --- ACCIONES CRUD (CREATE / UPDATE) ---
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (editMode) {
                // UPDATE: Llama a /Editar
                const payload = {
                    ...formData,
                    id_Modificador: localStorage.getItem("userId") || 1
                };
                const res = await pagosService.editar(payload);
                showNexaAlert.success(res.mensaje || "Pago actualizado");
            } else {
                // CREATE: Llama a /Guardar
                const res = await pagosService.insertar(formData);
                showNexaAlert.success(res.mensaje || "Pago registrado");
            }
            cancelarEdicion();
            cargarPagos();
        } catch (error) {
            // Aquí se muestra el mensaje "El monto no puede ser mayor al saldo"
            showNexaAlert.error(error.message);
        }
    };

    // --- PREPARAR EDICIÓN ---
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

    // --- ANULACIÓN (DELETE) ---
    const handleAnular = async (id) => {
        const confirmar = await showNexaAlert.confirm("¿Deseas anular este pago? Se restaurará el saldo en la multa.");
        if (confirmar) {
            try {
                const modId = localStorage.getItem("userId") || 1;
                const res = await pagosService.anular(id, modId); // Llama a /Anular/{id}/{mod}
                showNexaAlert.success(res.mensaje || "Pago anulado");
                cargarPagos();
            } catch (error) {
                showNexaAlert.error(error.message);
            }
        }
    };

    return (
        <div className="nexa-pagos-page bg-[#0f172a] min-h-screen p-4 lg:p-8 text-white">
            <header className="flex items-center gap-4 mb-10">
                <div className="p-3 bg-blue-500/20 rounded-2xl">
                    <Receipt className="text-blue-400" size={32} />
                </div>
                <div>
                    <h1 className="text-3xl font-extrabold tracking-tight">Gestión de Pagos</h1>
                    <p className="text-slate-400 text-sm">Control de ingresos y saldos de multas</p>
                </div>
            </header>

            <div className="pagos-grid-layout">
                {/* PANEL IZQUIERDO: FORMULARIO */}
                <aside className="nexa-card-wrapper">
                    <div className="nexa-card">
                        <h3 className="card-title mb-8">
                            <span>{editMode ? "Editar Registro" : "Nuevo Ingreso"}</span>
                        </h3>
                        
                        <form onSubmit={handleSubmit} className="nexa-form">
                            <div className="form-group">
                                <label className="nexa-label">Multa Vinculada</label>
                                <input type="number" className="nexa-input" value={formData.id_Multa} readOnly placeholder="Seleccione un acuerdo..." required />
                            </div>

                            <div className="form-group">
                                <label className="nexa-label">Acuerdo de Pago</label>
                                <div className="flex gap-2">
                                    <input type="text" className="nexa-input flex-1" value={formData.id_Acuerdo ? `Acuerdo #${formData.id_Acuerdo}` : "Sin acuerdo"} readOnly />
                                    {!editMode && (
                                        <button type="button" onClick={abrirSeleccionAcuerdo} className="btn-selector bg-blue-600">
                                            <Search size={18} />
                                        </button>
                                    )}
                                </div>
                            </div>

                            <div className="form-group">
                                <label className="nexa-label">Monto Pagado ($)</label>
                                <input type="number" step="0.01" className="nexa-input" value={formData.monto_Pagado} onChange={(e) => setFormData({...formData, monto_Pagado: e.target.value})} required />
                            </div>

                            <div className="form-group">
                                <label className="nexa-label">N° de Comprobante</label>
                                <input type="text" className="nexa-input" value={formData.numero_Comprobante} onChange={(e) => setFormData({...formData, numero_Comprobante: e.target.value})} required />
                            </div>

                            <div className="flex flex-col gap-3 mt-6">
                                <button type="submit" className={`nexa-btn-submit ${editMode ? 'edit-mode' : ''}`}>
                                    <span className="flex items-center justify-center gap-2">
                                        {editMode ? <Save size={20}/> : <PlusCircle size={20}/>}
                                        <span>{editMode ? "ACTUALIZAR" : "REGISTRAR PAGO"}</span>
                                    </span>
                                </button>
                                
                                {editMode && (
                                    <button type="button" onClick={cancelarEdicion} className="p-3 rounded-xl bg-slate-700/50 hover:bg-slate-700 font-bold flex items-center justify-center gap-2 transition-all">
                                        <RotateCcw size={18}/> CANCELAR
                                    </button>
                                )}
                            </div>
                        </form>
                    </div>
                </aside>

                {/* PANEL DERECHO: TABLA */}
                <main className="nexa-card-wrapper">
                    <div className="nexa-card">
                        <h3 className="card-title mb-8">Historial Reciente</h3>
                        <div className="table-responsive">
                            <table className="nexa-table w-full">
                                <thead>
                                    <tr>
                                        <th>ID</th>
                                        <th>Multa</th>
                                        <th>Monto</th>
                                        <th>Comprobante</th>
                                        <th className="text-right">Acciones</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {loading ? (
                                        <tr><td colSpan="5" className="text-center py-10 text-slate-500">Cargando registros...</td></tr>
                                    ) : pagos.length === 0 ? (
                                        <tr><td colSpan="5" className="text-center py-10 text-slate-500">No hay pagos registrados.</td></tr>
                                    ) : (
                                        pagos.map((p) => (
                                            <tr key={`pago-row-${p.id_Pago}`} className="nexa-tr">
                                                <td><span className="id-badge">#{p.id_Pago}</span></td>
                                                <td className="text-blue-400 font-medium">M-{p.id_Multa}</td>
                                                <td className="font-bold text-lime-400">${p.monto_Pagado}</td>
                                                <td className="text-slate-400">{p.numero_Comprobante}</td>
                                                <td className="flex justify-end gap-3">
                                                    <button className="action-btn text-blue-400" title="Editar" onClick={() => prepararEdicion(p)}>
                                                        <Edit2 size={16} />
                                                    </button>
                                                    <button className="action-btn text-red-400" title="Anular" onClick={() => handleAnular(p.id_Pago)}>
                                                        <Trash2 size={16} />
                                                    </button>
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
            {showModalAcuerdos && (
                <div className="fixed inset-0 bg-black/80 backdrop-blur-md flex items-center justify-center z-50 p-4">
                    <div className="bg-[#1e293b] border border-slate-700 w-full max-w-2xl rounded-3xl overflow-hidden shadow-2xl modal-content">
                        <div className="p-6 border-b border-slate-700 flex justify-between items-center bg-slate-800/50">
                            <h3 className="text-xl font-bold text-blue-400">Seleccionar Acuerdo de Pago</h3>
                            <button onClick={() => setShowModalAcuerdos(false)} className="text-slate-400 hover:text-white">
                                <X size={24} />
                            </button>
                        </div>
                        <div className="p-6 max-h-[60vh] overflow-y-auto">
                            <table className="nexa-table w-full">
                                <thead>
                                    <tr>
                                        <th>Detalle</th>
                                        <th>Cuota</th>
                                        <th></th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {acuerdosBusqueda.map(ac => (
                                        <tr key={`acuerdo-opt-${ac.id_Acuerdo}`} className="nexa-tr">
                                            <td>
                                                <div className="font-bold">Acuerdo #{ac.id_Acuerdo}</div>
                                                <div className="text-xs text-slate-500">Multa: M-{ac.id_Multa}</div>
                                            </td>
                                            <td className="text-lime-400 font-bold">${ac.monto_Por_Cuota}</td>
                                            <td className="text-right">
                                                <button 
                                                    onClick={() => seleccionarAcuerdo(ac)} 
                                                    className="bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded-xl font-bold text-sm transition-colors"
                                                >
                                                    Elegir
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default PagosModulo;
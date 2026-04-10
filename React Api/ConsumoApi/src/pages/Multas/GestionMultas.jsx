import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { 
  Search, DollarSign, X, Save, ArrowLeft, AlertCircle, Edit, List, User, CreditCard
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

// Importaciones de servicios
import { 
  getMultasPendientes, 
  getUsuariosConMultas, 
  abonarMulta, 
  actualizarMultaGeneral 
} from "../../services/multasService";
import "../../styles/datospersonales.css";
import { useToast } from "../../components/ToastContext";

const GestionMultas = () => {
  const navigate = useNavigate();
  const { showToast } = useToast(); 
  
  const [tabActual, setTabActual] = useState("individuales"); 
  const [lista, setLista] = useState([]);
  const [cargando, setCargando] = useState(false);
  
  const [modalAbono, setModalAbono] = useState({ abierto: false, multa: null });
  const [modalEdicion, setModalEdicion] = useState({ abierto: false, multa: null });
  
  const userIdLogueado = parseInt(localStorage.getItem("userId") || "0");
  const [montoAbono, setMontoAbono] = useState("");
  const [editData, setEditData] = useState({ id_Estado: 15, pagada: false });

  useEffect(() => {
    cargarDatos();
  }, [tabActual]);

  const cargarDatos = async () => {
    setCargando(true);
    try {
      const res = tabActual === "individuales" 
        ? await getMultasPendientes() 
        : await getUsuariosConMultas();
      setLista(res.data || []);
    } catch (error) {
      showToast("Error al sincronizar cuentas", "error");
    } finally { setCargando(false); }
  };

  const handleAbonar = async (e) => {
    e.preventDefault();
    const monto = parseFloat(montoAbono);
    const saldoDisponible = modalAbono.multa?.saldoPendiente || 0;

    if (isNaN(monto) || monto <= 0 || monto > saldoDisponible) {
      showToast("Monto fuera de rango o superior al saldo pendiente", "error");
      return;
    }

    try {
      const payload = {
        Id_Multa: modalAbono.multa.id_Multa,
        MontoAbono: monto,
        Id_Modificador: userIdLogueado
      };
      await abonarMulta(payload);
      showToast("Transacción registrada correctamente", "success");
      setModalAbono({ abierto: false, multa: null });
      setMontoAbono("");
      cargarDatos();
    } catch (error) {
      showToast(error.response?.data?.msj || "Error en el procesamiento del pago", "error");
    }
  };

  const handleActualizarMulta = async (e) => {
    e.preventDefault();
    if (!modalEdicion.multa) return;

    try {
      const payload = {
        Id_Multa: modalEdicion.multa.id_Multa,
        Id_Estado: parseInt(editData.id_Estado),
        Pagada: editData.pagada,
        Id_Modificador: userIdLogueado
      };
      await actualizarMultaGeneral(modalEdicion.multa.id_Multa, payload);
      showToast("Estado de cuenta actualizado", "success");
      setModalEdicion({ abierto: false, multa: null });
      cargarDatos();
    } catch (error) {
      showToast(error.response?.data?.msj || "Fallo al actualizar estado", "error");
    }
  };

  return (
    <div className="cat-page bg-[#0f172a] min-h-screen text-slate-100">
      <div className="cat-header border-b border-slate-800/60 pb-6 mb-8 flex justify-between items-center px-6">
        <div className="header-left flex items-center gap-4">
          <button className="btn-back hover:bg-slate-800 p-2 rounded-xl transition-colors" onClick={() => navigate("/admin")}>
            <ArrowLeft size={20} />
          </button>
          <div>
            <span className="text-[10px] text-amber-500 font-bold uppercase tracking-[0.2em]">Finanzas y Control</span>
            <h1 className="text-2xl font-black">Gestión de Multas</h1>
          </div>
        </div>

        <div className="flex bg-slate-900/80 p-1 rounded-2xl border border-slate-800">
          <button 
            className={`flex items-center gap-2 px-6 py-2 rounded-xl text-xs font-bold transition-all ${tabActual === "individuales" ? "bg-blue-600 text-white shadow-lg shadow-blue-600/20" : "text-slate-500 hover:text-slate-300"}`}
            onClick={() => setTabActual("individuales")}
          >
            <List size={16} /> Detalle Individual
          </button>
          <button 
            className={`flex items-center gap-2 px-6 py-2 rounded-xl text-xs font-bold transition-all ${tabActual === "usuarios" ? "bg-blue-600 text-white shadow-lg shadow-blue-600/20" : "text-slate-500 hover:text-slate-300"}`}
            onClick={() => setTabActual("usuarios")}
          >
            <User size={16} /> Consolidado
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {cargando ? (
          <div className="col-span-full py-20 text-center font-mono text-xs uppercase tracking-widest animate-pulse text-slate-500">
            Consultando registros financieros...
          </div>
        ) : lista.length > 0 ? (
          lista.map((item) => (
            <motion.div 
              layout
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              key={tabActual === "individuales" ? `multa-${item.id_Multa}` : `user-${item.id_Usuario}`} 
              className="bg-slate-900/40 border border-slate-800 p-6 rounded-3xl hover:border-amber-500/30 transition-all group relative overflow-hidden"
            >
              {tabActual === "individuales" ? (
                <>
                  <div className="flex justify-between items-start mb-4">
                    <span className="text-[10px] font-mono text-slate-500 uppercase tracking-tighter">Ticket #{item.id_Multa}</span>
                    <span className="px-3 py-1 bg-amber-500/10 text-amber-500 border border-amber-500/20 rounded-full text-[10px] font-black uppercase">
                        {item.estadoRegistro || "En Mora"}
                    </span>
                  </div>
                  <h2 className="text-lg font-bold text-white group-hover:text-amber-400 transition-colors">{item.nombre_Cliente}</h2>
                  <p className="text-slate-500 text-xs mb-6 italic">"{item.libro || "Sin título"}"</p>
                  
                  <div className="bg-slate-950/50 rounded-2xl p-4 flex justify-between items-center mb-6 border border-slate-800/50">
                    <span className="text-xs text-slate-500 font-bold uppercase tracking-widest">Saldo Deudor</span>
                    <span className="text-xl font-black text-rose-500">
                        ${(item.saldoPendiente || 0).toFixed(2)}
                    </span>
                  </div>

                  <div className="flex gap-2">
                    <button className="flex-1 bg-emerald-600 hover:bg-emerald-500 py-2 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2" onClick={() => setModalAbono({ abierto: true, multa: item })}>
                      <CreditCard size={14} /> Abonar
                    </button>
                    <button className="px-4 bg-slate-800 hover:bg-slate-700 py-2 rounded-xl text-xs font-bold transition-all" onClick={() => { setEditData({ id_Estado: 15, pagada: false }); setModalEdicion({ abierto: true, multa: item }); }}>
                      <Edit size={14} />
                    </button>
                  </div>
                </>
              ) : (
                <>
                  <div className="flex justify-between items-center mb-6">
                    <div className="p-3 bg-blue-500/10 rounded-2xl text-blue-400">
                        <User size={24} />
                    </div>
                    <div className="text-right">
                        <span className="text-[10px] text-slate-500 font-bold uppercase block tracking-widest">Registros</span>
                        <span className="text-lg font-black text-white">{item.cantidadMultasPendientes || 0}</span>
                    </div>
                  </div>
                  <h2 className="text-xl font-bold text-white mb-6 tracking-tight">{item.nombre_Cliente}</h2>
                  <div className="border-t border-slate-800 pt-4 flex justify-between items-end">
                    <span className="text-[10px] text-slate-500 font-bold uppercase">Total Consolidado</span>
                    <span className="text-2xl font-black text-rose-500 tracking-tighter">${(item.totalPendiente || 0).toFixed(2)}</span>
                  </div>
                </>
              )}
            </motion.div>
          ))
        ) : (
          <div className="col-span-full py-20 text-center opacity-40">
            <AlertCircle className="mx-auto mb-4" size={48} />
            <p className="uppercase text-xs font-bold tracking-[0.3em]">Estado de cuentas limpio</p>
          </div>
        )}
      </div>

      {/* MODAL DE ABONO */}
      {modalAbono.abierto && (
        <div className="modal-overlay fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="bg-slate-900 border border-slate-700 p-8 rounded-4xl max-w-sm w-full shadow-2xl">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-black flex items-center gap-2">
                <DollarSign className="text-emerald-500" /> Registrar Abono
              </h3>
              <X className="cursor-pointer text-slate-500 hover:text-white" onClick={() => setModalAbono({ abierto: false, multa: null })} />
            </div>
            
            <div className="bg-slate-950 p-4 rounded-2xl mb-6 space-y-1">
                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest block">Saldo Pendiente</span>
                <span className="text-2xl font-black text-emerald-400 block">${(modalAbono.multa?.saldoPendiente || 0).toFixed(2)}</span>
            </div>

            <form onSubmit={handleAbonar} className="space-y-6">
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Cantidad a recibir</label>
                <input 
                  type="number" 
                  step="0.01" 
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 outline-none focus:border-emerald-500 text-lg font-bold"
                  value={montoAbono}
                  onChange={(e) => setMontoAbono(e.target.value)}
                  placeholder="0.00"
                  required 
                />
              </div>
              <button type="submit" className="w-full bg-emerald-600 hover:bg-emerald-500 py-4 rounded-2xl font-black uppercase text-xs tracking-widest shadow-lg shadow-emerald-600/20 transition-all">
                Confirmar Transacción
              </button>
            </form>
          </motion.div>
        </div>
      )}

      {/* MODAL EDICIÓN ESTADO */}
      {modalEdicion.abierto && (
        <div className="modal-overlay fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="bg-slate-900 border border-slate-700 p-8 rounded-4xl max-w-sm w-full shadow-2xl">
            <div className="flex justify-between items-center mb-8">
              <h3 className="text-lg font-black">Admin. Registro</h3>
              <X className="cursor-pointer text-slate-500 hover:text-white" onClick={() => setModalEdicion({ abierto: false, multa: null })} />
            </div>
            <form onSubmit={handleActualizarMulta} className="space-y-6">
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Estado Administrativo</label>
                <select 
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 outline-none focus:border-blue-500"
                  value={editData.id_Estado}
                  onChange={(e) => setEditData({...editData, id_Estado: e.target.value})}
                >
                  <option value={15}>Mora (Activa)</option>
                  <option value={12}>Liquidada (Manual)</option>
                  <option value={13}>Anulada / Cancelada</option>
                </select>
              </div>
              <div className="flex items-center gap-3 bg-slate-950 p-4 rounded-xl border border-slate-800">
                <input 
                  type="checkbox" 
                  id="checkPagada"
                  className="w-5 h-5 rounded-md accent-blue-600"
                  checked={editData.pagada} 
                  onChange={(e) => setEditData({...editData, pagada: e.target.checked})}
                />
                <label htmlFor="checkPagada" className="text-xs font-bold text-slate-300">Marcar liquidación total</label>
              </div>
              <button type="submit" className="w-full bg-blue-600 hover:bg-blue-500 py-4 rounded-2xl font-black uppercase text-xs tracking-widest transition-all">
                Guardar Cambios
              </button>
            </form>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default GestionMultas;
import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Handshake,
  Search,
  X,
  Trash2,
  Edit,
  PlusCircle,
} from "lucide-react";
import { motion } from "framer-motion";
import { acuerdosService } from "../../services/acuerdospagoService";
import { showNexaAlert } from "../../utils/alerts";
import "../../styles/acuerdopago.css";

const AcuerdosModulo = () => {
  const navigate = useNavigate();

  // --- INTEGRACIÓN CON LOGIN ---
  const currentUserId = localStorage.getItem("userId");
  const currentUserName = localStorage.getItem("userName");

  // --- ESTADOS ---
  const [acuerdos, setAcuerdos] = useState([]);
  const [filtro, setFiltro] = useState("");
  const [loading, setLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const initialFormState = {
    id_Acuerdo: null,
    id_Multa: "",
    monto_Total_Acordado: "",
    cantidad_Cuotas: "",
    monto_Por_Cuota: 0,
    frecuencia_Pago: 35, // Por defecto Mensual (ID 35 según tu DB)
  };
  const [formData, setFormData] = useState(initialFormState);

  // --- CARGA DE DATOS ---
  const cargarDatos = useCallback(async (termino = "") => {
    setLoading(true);
    try {
      let data;
      if (!termino || termino.trim() === "") {
        data = await acuerdosService.listarTodos();
      } else {
        data = await acuerdosService.obtenerPorId(termino);
      }
      // Ajuste para manejar respuestas individuales o arreglos
      setAcuerdos(Array.isArray(data) ? data : data ? [data] : []);
    } catch (error) {
      console.error("Error al cargar:", error);
      if (!termino) showNexaAlert.error("Error al conectar con el servidor.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      cargarDatos(filtro);
    }, 600);
    return () => clearTimeout(delayDebounceFn);
  }, [filtro, cargarDatos]);

  // Cálculo automático de la cuota
  useEffect(() => {
    const total = parseFloat(formData.monto_Total_Acordado);
    const cuotas = parseInt(formData.cantidad_Cuotas);

    if (!isNaN(total) && !isNaN(cuotas) && total > 0 && cuotas > 0) {
      const calculo = parseFloat((total / cuotas).toFixed(2));
      if (formData.monto_Por_Cuota !== calculo) {
        setFormData((prev) => ({ ...prev, monto_Por_Cuota: calculo }));
      }
    } else if (formData.monto_Por_Cuota !== 0) {
      setFormData((prev) => ({ ...prev, monto_Por_Cuota: 0 }));
    }
  }, [formData.monto_Total_Acordado, formData.cantidad_Cuotas, formData.monto_Por_Cuota]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // --- GUARDAR / EDITAR ---
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isSaving) return;

    if (!currentUserId) {
      showNexaAlert.error("Sesión expirada. Por favor reingresa.");
      navigate("/login");
      return;
    }

    setIsSaving(true);
    try {
      if (formData.id_Acuerdo) {
        await acuerdosService.editar({
          ...formData,
          id_Modificador: parseInt(currentUserId),
        });
        showNexaAlert.success("Acuerdo actualizado correctamente.");
      } else {
        await acuerdosService.insertar({
          ...formData,
          id_Creador: parseInt(currentUserId),
        });
        showNexaAlert.success("Nuevo acuerdo registrado.");
      }

      setFormData(initialFormState);
      cargarDatos();
    } catch (error) {
      showNexaAlert.error(error.message || "Error en la operación.");
    } finally {
      setIsSaving(false);
    }
  };

  // --- ELIMINAR ---
  const handleEliminar = async (id) => {
    const confirmado = await showNexaAlert.confirm(
      "¿Confirmas la eliminación de este acuerdo?",
    );
    if (confirmado) {
      try {
        await acuerdosService.eliminar(id, parseInt(currentUserId));
        showNexaAlert.success("Registro eliminado.");
        cargarDatos();
      } catch (error) {
        showNexaAlert.error("Error: " + error.message);
      }
    }
  };

  const prepararEdicion = (item) => {
    setFormData({
      id_Acuerdo: item.id_Acuerdo,
      id_Multa: item.id_Multa || "",
      monto_Total_Acordado: item.monto_Total_Acordado || "",
      cantidad_Cuotas: item.cantidad_Cuotas || "",
      monto_Por_Cuota: item.monto_Por_Cuota || 0,
      frecuencia_Pago: item.frecuencia_Pago || 35,
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="nexa-acuerdos-page bg-[#0f172a] min-h-screen p-4 lg:p-8 text-white">
      <motion.button
        whileHover={{ x: -5 }}
        onClick={() => navigate("/admin")}
        className="flex items-center gap-2 text-slate-400 hover:text-blue-400 transition-colors mb-8 bg-transparent border-none cursor-pointer p-0"
      >
        <ArrowLeft size={20} />
        <span className="text-sm font-semibold tracking-wide">Panel de Administración</span>
      </motion.button>

      <header className="mb-10">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-lime-500/20 rounded-2xl">
            <Handshake className="text-lime-500" size={32} />
          </div>
          <div>
            <span className="text-blue-400 font-bold tracking-widest uppercase text-xs">Tesorería & Cobros</span>
            <h1 className="text-3xl font-extrabold mt-1">Acuerdos de Pago</h1>
            {currentUserName && (
              <p className="text-xs text-slate-500 mt-1 uppercase">
                Usuario: <span className="text-lime-400 font-bold">{currentUserName}</span>
              </p>
            )}
          </div>
        </div>
      </header>

      <div className="acuerdos-grid-layout">
        <aside className="nexa-card-wrapper">
          <div className="nexa-card h-full">
            <div className="card-header mb-6">
              <div className="flex items-center gap-2 text-lime-400 font-bold text-lg mb-2">
                {formData.id_Acuerdo ? <Edit size={20} /> : <PlusCircle size={20} />}
                <span>{formData.id_Acuerdo ? "Editar Acuerdo" : "Nuevo Registro"}</span>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="nexa-form">
              <div className="form-group">
                <label className="nexa-label">ID Multa</label>
                <input
                  type="number"
                  name="id_Multa"
                  className="nexa-input"
                  value={formData.id_Multa}
                  onChange={handleInputChange}
                  required
                  disabled={!!formData.id_Acuerdo}
                />
              </div>

              <div className="flex gap-4">
                <div className="form-group flex-1">
                  <label className="nexa-label">Monto Total</label>
                  <input
                    type="number"
                    step="0.01"
                    name="monto_Total_Acordado"
                    className="nexa-input"
                    value={formData.monto_Total_Acordado}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="form-group flex-1">
                  <label className="nexa-label">Cuotas</label>
                  <input
                    type="number"
                    name="cantidad_Cuotas"
                    className="nexa-input"
                    value={formData.cantidad_Cuotas}
                    onChange={handleInputChange}
                    required
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="nexa-label">Tiempo de Pago</label>
                <select
                  name="frecuencia_Pago"
                  className="nexa-select w-full"
                  value={formData.frecuencia_Pago}
                  onChange={handleInputChange}
                >
                  <option value="35">Mensual</option>
                  <option value="36">Quincenal</option>
                  <option value="37">Semanal</option>
                </select>
              </div>

              <div className="info-box-nexa my-6 p-4 bg-slate-800/50 rounded-lg border border-slate-700">
                <span className="block text-xs text-slate-400 uppercase">Valor por cuota:</span>
                <span className="text-2xl font-black text-lime-400">
                  ${(formData.monto_Por_Cuota || 0).toFixed(2)}
                </span>
              </div>

              <div className="flex flex-col gap-3">
                <button type="submit" className="nexa-btn-submit" disabled={isSaving}>
                  {isSaving ? "PROCESANDO..." : formData.id_Acuerdo ? "GUARDAR CAMBIOS" : "REGISTRAR"}
                </button>
                {formData.id_Acuerdo && (
                  <button
                    type="button"
                    className="bg-slate-700 hover:bg-slate-600 p-2 rounded transition-all text-sm font-bold"
                    onClick={() => setFormData(initialFormState)}
                  >
                    CANCELAR EDICIÓN
                  </button>
                )}
              </div>
            </form>
          </div>
        </aside>

        <main className="nexa-card-wrapper">
          <div className="nexa-card h-full">
            <div className="card-header-flex mb-6">
              <h3 className="card-title">Historial de Acuerdos</h3>
              <div className="nexa-search-box">
                <Search size={16} />
                <input
                  type="text"
                  placeholder="Filtrar por ID..."
                  className="bg-transparent border-none outline-none text-sm ml-2 w-full text-white"
                  value={filtro}
                  onChange={(e) => setFiltro(e.target.value)}
                />
                {filtro && <X size={14} className="cursor-pointer" onClick={() => setFiltro("")} />}
              </div>
            </div>

            <div className="table-responsive">
              <table className="nexa-table w-full">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>MULTA</th>
                    <th>MONTO</th>
                    <th>TIEMPO DE PAGO</th>
                    <th className="text-right">ACCIONES</th>
                  </tr>
                </thead>
                <tbody>
                  {loading ? (
                    <tr><td colSpan="5" className="text-center py-8 italic opacity-40">Cargando...</td></tr>
                  ) : acuerdos.length === 0 ? (
                    <tr><td colSpan="5" className="text-center py-8 opacity-30">No se encontraron registros.</td></tr>
                  ) : (
                    acuerdos.map((item) => (
                      <tr key={`row-${item.id_Acuerdo}`} className="nexa-tr border-b border-slate-800">
                        <td>#{item.id_Acuerdo}</td>
                        <td className="text-slate-400">M-{item.id_Multa}</td>
                        <td className="font-bold text-lime-400">${item.monto_Total_Acordado}</td>
                        {/* Se usa el alias corregido del SP o la descripción del objeto */}
                        <td className="text-blue-300 font-medium">
                          {item.tiempo_de_Pago || item.frecuencia_Descripcion || "No definido"}
                        </td>
                        <td className="flex justify-end gap-2 py-3">
                          <button
                            className="p-2 hover:bg-blue-500/20 text-blue-400 rounded"
                            onClick={() => prepararEdicion(item)}
                          >
                            <Edit size={16} />
                          </button>
                          <button
                            className="p-2 hover:bg-red-500/20 text-red-400 rounded"
                            onClick={() => handleEliminar(item.id_Acuerdo)}
                          >
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
    </div>
  );
};

export default AcuerdosModulo;
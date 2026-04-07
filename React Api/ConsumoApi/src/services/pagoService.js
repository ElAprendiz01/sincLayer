const API_BASE = import.meta.env.VITE_API_URL;
const ENDPOINT_PAGOS = `${API_BASE}/api/Pagos`;
const ENDPOINT_ACUERDOS = `${API_BASE}/api/AcuerdosPago`;

export const pagosService = {
  /**
   * GET: Obtener todos los registros (Sp_Listar_Pagos)
   * URL: /api/Pagos/Listar
   */
  listar: async () => {
    try {
      const response = await fetch(`${ENDPOINT_PAGOS}/Listar`);
      const data = await response.json();
      
      if (!response.ok) throw new Error(data.mensaje || "Error al obtener la lista");
      return data;
    } catch (error) {
      console.error("Error en listar pagos:", error);
      throw error;
    }
  },

  /**
   * POST: Registrar un nuevo pago (Sp_Ingresar_Pagos)
   * URL: /api/Pagos/Guardar
   */
  insertar: async (datos) => {
    try {
      const response = await fetch(`${ENDPOINT_PAGOS}/Guardar`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id_Multa: parseInt(datos.id_Multa),
          id_Acuerdo: datos.id_Acuerdo ? parseInt(datos.id_Acuerdo) : null,
          monto_Pagado: parseFloat(datos.monto_Pagado),
          metodo_Pago: parseInt(datos.metodo_Pago),
          numero_Comprobante: datos.numero_Comprobante.trim(),
          id_Creador: parseInt(datos.id_Creador)
        }),
      });

      const result = await response.json();
      // Aquí capturamos el THROW "El monto no puede ser mayor al saldo"
      if (!response.ok) throw new Error(result.mensaje || "Error al procesar el pago");
      
      return result;
    } catch (error) {
      throw error;
    }
  },

  /**
   * PUT: Editar pago existente (Sp_Editar_Pagos)
   * URL: /api/Pagos/Editar
   */
  editar: async (datos) => {
    try {
      const response = await fetch(`${ENDPOINT_PAGOS}/Editar`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id_Pago: parseInt(datos.id_Pago),
          monto_Pagado: parseFloat(datos.monto_Pagado),
          metodo_Pago: parseInt(datos.metodo_Pago),
          numero_Comprobante: datos.numero_Comprobante.trim(),
          id_Modificador: parseInt(datos.id_Modificador)
        }),
      });

      const result = await response.json();
      if (!response.ok) throw new Error(result.mensaje || "Error al actualizar");
      
      return result;
    } catch (error) {
      throw error;
    }
  },

  /**
   * DELETE: Anulación lógica (Sp_Anular_Pago)
   * URL: /api/Pagos/Anular/{id}/{idModificador}
   */
  anular: async (id, idModificador) => {
    try {
      const response = await fetch(`${ENDPOINT_PAGOS}/Anular/${id}/${idModificador}`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" }
      });

      const result = await response.json();
      if (!response.ok) throw new Error(result.mensaje || "No se pudo anular");
      
      return result;
    } catch (error) {
      throw error;
    }
  }
};

export const acuerdosService = {
  /**
   * GET: Listar acuerdos para el modal de búsqueda
   * URL: /api/AcuerdosPago/Listar
   */
  listarTodos: async () => {
    try {
      const response = await fetch(`${ENDPOINT_ACUERDOS}/Listar`);
      const data = await response.json();
      
      if (!response.ok) throw new Error(data.mensaje || "Error al cargar acuerdos");
      return data;
    } catch (error) {
      console.error("Error en acuerdos:", error);
      throw error;
    }
  }
};
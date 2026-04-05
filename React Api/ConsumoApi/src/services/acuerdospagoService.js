/**
 * SyncLayer Library - Acuerdos de Pago Service
 * Desarrollado para: NexaCore Project
 * Tecnología: Fetch API (Native)
 */

const API_BASE = import.meta.env.VITE_API_URL;
const ENDPOINT = `${API_BASE}/api/Acuerdo_Pagos`;

export const acuerdosService = {
  /**
   * GET: Obtener todos los acuerdos de pago.
   */
  listarTodos: async () => {
    try {
      const response = await fetch(`${ENDPOINT}/Listar`);

      if (!response.ok) {
        const errorData = await response
          .json()
          .catch(() => ({ msj: "Error al obtener la lista" }));
        throw new Error(errorData.msj || "Error en el servidor");
      }

      const result = await response.json();
      return result.data;
    } catch (error) {
      console.error("Error en listarTodos:", error);
      throw error;
    }
  },

  /**
   * GET: Filtrar acuerdos por ID.
   */
  obtenerPorId: async (id) => {
    try {
      const response = await fetch(`${ENDPOINT}/listar_por_id/${id}`);
      if (!response.ok) throw new Error("No se encontró el acuerdo");

      const result = await response.json();
      return result.data;
    } catch (error) {
      console.error("Error en obtenerPorId:", error);
      throw error;
    }
  },

  /**
   * POST: Crear un nuevo acuerdo de pago.
   */
  insertar: async (datos) => {
    try {
      const userId = localStorage.getItem("userId") || 1;
      const montoCuota = datos.monto_Total_Acordado / datos.cantidad_Cuotas;

      const payload = {
        id_Multa: parseInt(datos.id_Multa),
        monto_Total_Acordado: parseFloat(datos.monto_Total_Acordado),
        cantidad_Cuotas: parseInt(datos.cantidad_Cuotas),
        monto_Por_Cuota: parseFloat(montoCuota.toFixed(2)),
        frecuencia_Pago: parseInt(datos.frecuencia_Pago),
        id_Creador: parseInt(userId),
      };

      const response = await fetch(ENDPOINT, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const contentType = response.headers.get("content-type");
      if (!response.ok) {
        if (contentType && contentType.includes("application/json")) {
          const errorData = await response.json();
          throw new Error(errorData.msj || "Error al crear el acuerdo");
        } else {
          const errorText = await response.text();
          throw new Error(errorText || "Error interno del servidor (No JSON)");
        }
      }

      return await response.json();
    } catch (error) {
      console.error("Error en insertar:", error);
      throw error;
    }
  },

  /**
   * PUT: Actualizar un acuerdo existente.
   */
  editar: async (datos) => {
    try {
      const userId = localStorage.getItem("userId") || 1;
      const montoCuota = datos.monto_Total_Acordado / datos.cantidad_Cuotas;

      const payload = {
        id_Acuerdo: parseInt(datos.id_Acuerdo),
        monto_Total_Acordado: parseFloat(datos.monto_Total_Acordado),
        cantidad_Cuotas: parseInt(datos.cantidad_Cuotas),
        monto_Por_Cuota: parseFloat(montoCuota.toFixed(2)),
        frecuencia_Pago: parseInt(datos.frecuencia_Pago),
        id_Modificador: parseInt(userId),
      };

      const response = await fetch(ENDPOINT, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorData = await response
          .json()
          .catch(() => ({ msj: "Error al actualizar" }));
        throw new Error(errorData.msj || "Error al actualizar el acuerdo");
      }

      return await response.json();
    } catch (error) {
      console.error("Error en editar:", error);
      throw error;
    }
  },

  /**
   * DELETE: Eliminar un acuerdo (CORREGIDO).
   * Ahora recibe el idModificador para coincidir con el Controller: /{id}/{idModificador}
   */
  eliminar: async (id, idModificador) => {
    try {
      // Ajustamos la URL para pasar ambos parámetros
      const response = await fetch(`${ENDPOINT}/${id}/${idModificador}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      });

      // Verificamos si la respuesta tiene contenido antes de hacer .json()
      // Esto evita el error "Unexpected end of JSON input"
      const contentType = response.headers.get("content-type");
      let result = {};
      
      if (contentType && contentType.includes("application/json")) {
        result = await response.json();
      }

      if (!response.ok) {
        throw new Error(result.msj || "No se puede eliminar el registro");
      }

      return result;
    } catch (error) {
      console.error("Error en eliminar:", error);
      throw error;
    }
  },
};
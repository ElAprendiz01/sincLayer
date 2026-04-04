const ApiBase = import.meta.env.VITE_API_URL;
const ApiUrl = `${ApiBase}/api/Multas`;

const getHeaders = () => ({
    "Content-Type": "application/json",
    "Authorization": `Bearer ${localStorage.getItem("token")}`
});

const manejarRespuesta = async (resp) => {
    const texto = await resp.text();
    let resultado = { codigo: resp.status, data: [], msj: "" };
    try {
        if (texto) {
            const json = JSON.parse(texto);
            resultado.data = json.data || json || [];
            resultado.msj = json.msj || "";
            resultado.codigo = json.codigo || resp.status;
        }
    } catch (e) {
        resultado.msj = texto;
    }

    if (!resp.ok) {
        const errorForzado = new Error(resultado.msj || "Error en el servidor");
        errorForzado.response = { data: resultado };
        throw errorForzado;
    }
    return resultado;
};

// GET: Listar todas las multas pendientes
export const getMultasPendientes = async () => {
    const resp = await fetch(`${ApiUrl}/listarMultasPendientes`, { headers: getHeaders() });
    return await manejarRespuesta(resp);
};

// GET: Listar usuarios con el resumen de sus multas
export const getUsuariosConMultas = async () => {
    const resp = await fetch(`${ApiUrl}/listarUsuariosMultasPendientes`, { headers: getHeaders() });
    return await manejarRespuesta(resp);
};

// POST: Realizar un abono a una multa
export const abonarMulta = async (datos) => {
    // datos debe traer: Id_Multa, MontoAbono, Id_Modificador
    const resp = await fetch(`${ApiUrl}/actualizarMultaAbono`, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify(datos)
    });
    return await manejarRespuesta(resp);
};

// PUT: Actualizar estado o forzar recuperación (Solo Admin según tu Controller)
export const actualizarMultaGeneral = async (id, datos) => {
    const resp = await fetch(`${ApiUrl}/actualizarMulta/${id}`, {
        method: 'PUT',
        headers: getHeaders(),
        body: JSON.stringify(datos)
    });
    return await manejarRespuesta(resp);
};

// DELETE: Eliminar/Desactivar multa
export const eliminarMulta = async (id, idModificador) => {
    const resp = await fetch(`${ApiUrl}/eliminarMulta/${id}?idModificador=${idModificador}`, {
        method: 'DELETE',
        headers: getHeaders()
    });
    if (resp.status === 204) return { codigo: 204, msj: "Eliminado" };
    return await manejarRespuesta(resp);
};
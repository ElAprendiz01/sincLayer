const ApiBase = import.meta.env.VITE_API_URL; 
const ApiUrl = `${ApiBase}/api/Prestamos`; 

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

export const getPrestamos = async () => {
    const resp = await fetch(`${ApiUrl}/LISTAR_PRESTAMOS`, { headers: getHeaders() });
    return await manejarRespuesta(resp);
};

export const insertarPrestamo = async (datos) => {
    const resp = await fetch(`${ApiUrl}/Insertar_prestamos`, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify(datos)
    });
    return await manejarRespuesta(resp);
};

export const editarPrestamo = async (id, datos) => {
    const resp = await fetch(`${ApiUrl}/Editar/${id}`, {
        method: 'PUT',
        headers: getHeaders(),
        body: JSON.stringify(datos)
    });
    return await manejarRespuesta(resp);
};

export const eliminarPrestamo = async (id, idModificador) => {
    const resp = await fetch(`${ApiUrl}/Eliminar/${id}?idModificador=${idModificador}`, {
        method: 'DELETE',
        headers: getHeaders()
    });
    // El controller devuelve NoContent (204), manejamos respuesta simple
    if (resp.status === 204) return { codigo: 204, msj: "Eliminado" };
    return await manejarRespuesta(resp);
};

export const buscarPrestamosPorUsuario = async (idUsuario) => {
    const resp = await fetch(`${ApiUrl}/buscarPorIdUsuario?Id_Usuario_Cliente=${idUsuario}`, { 
        headers: getHeaders() 
    });
    return await manejarRespuesta(resp);
};
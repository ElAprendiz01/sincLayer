const ApiBase = import.meta.env.VITE_API_URL; 
const ApiUrl = `${ApiBase}/api/Devoluciones`; 

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

export const getDevoluciones = async () => {
    const resp = await fetch(`${ApiUrl}/Listar_Devoluciones`, { headers: getHeaders() });
    return await manejarRespuesta(resp);
};

export const buscarDevolucionesPorUsuario = async (idUsuario) => {
    const resp = await fetch(`${ApiUrl}/Listar_DevolucionesPorUsuario?Id_Usuario_Cliente=${idUsuario}`, { 
        headers: getHeaders() 
    });
    return await manejarRespuesta(resp);
};

export const registrarDevolucion = async (datos) => {
    const resp = await fetch(`${ApiUrl}/Registrar_Devolucion`, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify(datos)
    });
    return await manejarRespuesta(resp);
};

export const actualizarDevolucion = async (id, datos) => {
    const resp = await fetch(`${ApiUrl}/Actualizar_Devolucion/${id}`, {
        method: 'PUT',
        headers: getHeaders(),
        body: JSON.stringify(datos)
    });
    return await manejarRespuesta(resp);
};

export const eliminarDevolucion = async (id, idModificador) => {
    const resp = await fetch(`${ApiUrl}/Eliminar_Devolucion/${id}?idModificador=${idModificador}`, {
        method: 'DELETE',
        headers: getHeaders()
    });
    return await manejarRespuesta(resp);
};
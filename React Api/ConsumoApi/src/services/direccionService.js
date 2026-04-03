const ApiBase = import.meta.env.VITE_API_URL; 
const ApiUrl = `${ApiBase}/api/Direcion`; 

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
            resultado.data = json.data || [];
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

export const getDirecciones = async () => {
    const resp = await fetch(`${ApiUrl}/listarDireccion`, { headers: getHeaders() });
    return await manejarRespuesta(resp);
};

export const insertarDireccion = async (datos) => {
    const resp = await fetch(`${ApiUrl}/insertarDireccion`, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify(datos)
    });
    return await manejarRespuesta(resp);
};

export const editarDireccion = async (id, datos) => {
    const resp = await fetch(`${ApiUrl}/EditarDireccion/${id}`, {
        method: 'PUT',
        headers: getHeaders(),
        body: JSON.stringify(datos)
    });
    return await manejarRespuesta(resp);
};

export const eliminarDireccion = async (id, idModificador) => {
    const resp = await fetch(`${ApiUrl}/DesactivarEliminarDireccion/${id}?idModificador=${idModificador}`, {
        method: 'DELETE',
        headers: getHeaders()
    });
    return await manejarRespuesta(resp);
};

export const filtrarDireccionPorPersona = async (idPersona) => {
    const resp = await fetch(`${ApiUrl}/FiltrarDireccionIDPersona?Id_Persona=${idPersona}`, {
        headers: getHeaders()
    });
    return await manejarRespuesta(resp);
};
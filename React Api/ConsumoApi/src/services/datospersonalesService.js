const ApiBase = import.meta.env.VITE_API_URL; 
// Asegúrate de que el nombre coincida exactamente con tu controlador en C#
const ApiUrl = `${ApiBase}/api/Datos_Personales_`; 

const getHeaders = () => ({
    "Content-Type": "application/json",
    "Authorization": `Bearer ${localStorage.getItem("token")}`
});

/**
 * Función centralizada mejorada para procesar respuestas
 */
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
        // Si no es JSON, tomamos el texto plano (ej. "Datos personal agregado Correctamente")
        resultado.msj = texto;
    }

    // ¡IMPORTANTE! Si la respuesta no es exitosa (200 o 201), lanzamos el objeto para que 
    // el 'catch' de tu componente ListarDatosPersonales.jsx lo reciba en error.response
    if (!resp.ok) {
        const errorForzado = new Error(resultado.msj || "Error en el servidor");
        errorForzado.response = { data: resultado }; // Simulamos estructura de Axios para compatibilidad
        throw errorForzado;
    }

    return resultado;
};

export const getPersonas = async () => {
    try {
        const resp = await fetch(`${ApiUrl}/Listar_Datos_Personales`, { 
            headers: getHeaders() 
        });
        return await manejarRespuesta(resp);
    } catch (error) {
        throw error; // Re-lanzamos para que el componente maneje el mensaje
    }
};

export const insertarPersona = async (datos) => {
    try {
        const resp = await fetch(`${ApiUrl}/Insertar_Datos_Personales`, {
            method: 'POST',
            headers: getHeaders(),
            body: JSON.stringify(datos)
        });
        return await manejarRespuesta(resp);
    } catch (error) {
        throw error;
    }
};

export const editarPersona = async (id, datos) => {
    try {
        const resp = await fetch(`${ApiUrl}/Editar/${id}`, {
            method: 'PUT',
            headers: getHeaders(),
            body: JSON.stringify(datos)
        });
        return await manejarRespuesta(resp);
    } catch (error) {
        throw error;
    }
};

export const eliminarPersona = async (id, idModificador) => {
    try {
        const resp = await fetch(`${ApiUrl}/Eliminar/${id}?idModificador=${idModificador}`, {
            method: 'DELETE',
            headers: getHeaders()
        });
        return await manejarRespuesta(resp);
    } catch (error) {
        throw error;
    }
};

export const buscarPersonas = async (criterio) => {
    try {
        const resp = await fetch(`${ApiUrl}/buscarPErsonaPorFechaNacimiento?buscar=${criterio}`, {
            headers: getHeaders()
        });
        return await manejarRespuesta(resp);
    } catch (error) {
        throw error;
    }
};
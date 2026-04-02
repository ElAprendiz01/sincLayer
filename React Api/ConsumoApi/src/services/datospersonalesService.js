const BASE_URL = 'http://localhost:5082/api/Datos_Personales_';

// Función auxiliar para obtener headers con Token
const getHeaders = () => ({
    "Content-Type": "application/json",
    "Authorization": `Bearer ${localStorage.getItem("token")}`
});

// Función auxiliar para procesar respuestas mixtas (JSON o Texto plano)
const manejarRespuesta = async (resp) => {
    const texto = await resp.text();
    try {
        return JSON.parse(texto);
    } catch (e) {
        // Si no es JSON (es texto plano), devolvemos un objeto compatible
        return { 
            codigo: resp.ok ? 200 : resp.status, 
            msj: texto || (resp.ok ? "Operación exitosa" : "Error en el servidor") 
        };
    }
};

export const getPersonas = async () => {
    const resp = await fetch(`${BASE_URL}/Listar_Datos_Personales`, {
        headers: getHeaders()
    });
    return await manejarRespuesta(resp);
};

export const insertarPersona = async (datos) => {
    const resp = await fetch(`${BASE_URL}/Insertar_Datos_Personales`, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify(datos)
    });
    return await manejarRespuesta(resp);
};

export const editarPersona = async (id, datos) => {
    const resp = await fetch(`${BASE_URL}/Editar/${id}`, {
        method: 'PUT',
        headers: getHeaders(),
        body: JSON.stringify(datos)
    });
    return await manejarRespuesta(resp);
};

export const eliminarPersona = async (id, idModificador) => {
    // Se envía el idModificador como Query String (?idModificador=X) como espera el Controller
    const resp = await fetch(`${BASE_URL}/Eliminar/${id}?idModificador=${idModificador}`, {
        method: 'DELETE',
        headers: getHeaders()
    });
    return await manejarRespuesta(resp);
};

export const buscarPersonas = async (criterio) => {
    const resp = await fetch(`${BASE_URL}/buscarPErsonaPorFechaNacimiento?buscar=${criterio}`, {
        headers: getHeaders()
    });
    // Usamos el procesador que creamos antes para capturar mensajes de error de la API
    return await manejarRespuesta(resp);
};
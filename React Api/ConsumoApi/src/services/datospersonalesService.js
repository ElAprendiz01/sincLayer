const ApiBase = import.meta.env.VITE_API_URL; // http://localhost:5082
// Nombre exacto según tu [Route("api/[controller]")]
const ApiUrl = `${ApiBase}/api/Datos_Personales_`; 

const getHeaders = () => ({
    "Content-Type": "application/json",
    "Authorization": `Bearer ${localStorage.getItem("token")}`
});

const manejarRespuesta = async (resp) => {
    const texto = await resp.text();
    let resultado = { codigo: resp.status, data: [], msj: "" };

    try {
        const json = JSON.parse(texto);
        // Si el backend responde con el objeto { codigo, msj, data }
        resultado.data = json.data || [];
        resultado.msj = json.msj || "";
        resultado.codigo = json.codigo || resp.status;
    } catch (e) {
        // Si el backend responde solo texto (como tus StatusCode 201 o 500)
        resultado.msj = texto;
    }
    return resultado;
};

// GET: api/Datos_Personales_/Listar_Datos_Personales
export const getPersonas = async () => {
    const resp = await fetch(`${ApiUrl}/Listar_Datos_Personales`, { 
        headers: getHeaders() 
    });
    return await manejarRespuesta(resp);
};

// POST: api/Datos_Personales_/Insertar_Datos_Personales
export const insertarPersona = async (datos) => {
    const resp = await fetch(`${ApiUrl}/Insertar_Datos_Personales`, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify(datos)
    });
    return await manejarRespuesta(resp);
};

// PUT: api/Datos_Personales_/Editar/{id}
export const editarPersona = async (id, datos) => {
    const resp = await fetch(`${ApiUrl}/Editar/${id}`, {
        method: 'PUT',
        headers: getHeaders(),
        body: JSON.stringify(datos)
    });
    return await manejarRespuesta(resp);
};

// DELETE: api/Datos_Personales_/Eliminar/{id}?idModificador=...
export const eliminarPersona = async (id, idModificador) => {
    const resp = await fetch(`${ApiUrl}/Eliminar/${id}?idModificador=${idModificador}`, {
        method: 'DELETE',
        headers: getHeaders()
    });
    return await manejarRespuesta(resp);
};

// GET: api/Datos_Personales_/buscarPErsonaPorFechaNacimiento?buscar=...
export const buscarPersonas = async (criterio) => {
    const resp = await fetch(`${ApiUrl}/buscarPErsonaPorFechaNacimiento?buscar=${criterio}`, {
        headers: getHeaders()
    });
    return await manejarRespuesta(resp);
};
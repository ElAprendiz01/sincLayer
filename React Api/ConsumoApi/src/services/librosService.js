const ApiBase = import.meta.env.VITE_API_URL; 
const ApiUrl = `${ApiBase}/api/Libro`; 

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
            // Si el backend devuelve la lista directo en el body, usa: json || []
            // Si el backend devuelve un objeto envoltorio { data: [...] }, usa: json.data || []
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

// --- SERVICIOS ---

export const getLibros = async () => {
    const resp = await fetch(`${ApiUrl}/ListarLibros`, { headers: getHeaders() });
    return await manejarRespuesta(resp);
};

export const filtrarLibrosPorAutor = async (idAutor) => {
    // Si no hay idAutor, no disparamos la petición o manejamos el error
    if (!idAutor) return { data: [] }; 
    const resp = await fetch(`${ApiUrl}/FiltarporAutor?Id_Autor=${idAutor}`, { headers: getHeaders() });
    return await manejarRespuesta(resp);
};

export const filtrarLibrosPorCategoria = async (nombre) => {
    const resp = await fetch(`${ApiUrl}/Filtarcategoria?nombre=${nombre}`, { headers: getHeaders() });
    return await manejarRespuesta(resp);
};

export const insertarLibro = async (datos) => {
    const resp = await fetch(`${ApiUrl}/InsertarLibro`, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify(datos)
    });
    return await manejarRespuesta(resp);
};

export const editarLibro = async (id, datos) => {
    const resp = await fetch(`${ApiUrl}/Editar/${id}`, {
        method: 'PUT',
        headers: getHeaders(),
        body: JSON.stringify(datos)
    });
    return await manejarRespuesta(resp);
};

export const eliminarLibro = async (id, idModificador) => {
    const resp = await fetch(`${ApiUrl}/Eliminar/${id}?idModificador=${idModificador}`, {
        method: 'DELETE',
        headers: getHeaders()
    });
    return await manejarRespuesta(resp);
};
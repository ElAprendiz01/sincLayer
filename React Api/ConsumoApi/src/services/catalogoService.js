const Api1 = import.meta.env.VITE_API_URL;
const API_URL = `${Api1}/api/Catalogo`;

/**
 * Manejador centralizado de respuestas para Fetch
 */
const handleResponse = async (response) => {
    const isJson = response.headers.get('content-type')?.includes('application/json');
    const data = isJson ? await response.json() : null;

    if (!response.ok) {
        // Si el backend envía un error 404 en el filtrado, lo manejamos aquí
        return Promise.reject(data || { msj: response.statusText });
    }
    return { data, status: response.status };
};

export const getCatalogos = async () => {
    const response = await fetch(`${API_URL}/listarCatalogo`);
    return handleResponse(response);
};

export const insertarCatalogo = async (nombre, id_Tipo_Catalogo) => {
    const userId = localStorage.getItem("userId") || 1;
    const payload = { 
        id_Tipo_Catalogo: parseInt(id_Tipo_Catalogo), 
        nombre, 
        id_Creador: parseInt(userId) 
    };
    const response = await fetch(`${API_URL}/insertarCatalogo`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
    });
    return handleResponse(response);
};

export const actualizarCatalogo = async (id_Catalogo, nombre, id_Tipo_Catalogo) => {
    const userId = localStorage.getItem("userId") || 1;
    
    // IMPORTANTE: Los nombres deben coincidir con tu DTO de C#
    const payload = { 
        id_Catalogo: parseInt(id_Catalogo), 
        id_Tipo_Catalogo: parseInt(id_Tipo_Catalogo), 
        nombre: nombre, 
        id_Modificador: parseInt(userId),
        activo: true // Añadimos activo por defecto para la edición
    };

    const response = await fetch(`${API_URL}/EditarCatalogo/${id_Catalogo}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
    });
    return handleResponse(response);
};

export const eliminarCatalogo = async (id, idModificador) => {
    // Priorizamos el idModificador que venga por parámetro o del localStorage
    const userId = idModificador || localStorage.getItem("userId") || 1;
    
    const response = await fetch(`${API_URL}/DesactivarEliminar/${id}?idModificador=${userId}`, {
        method: 'DELETE'
    });
    return handleResponse(response);
};

/**
 * Filtrar catálogos usando FETCH (Consistencia de equipo)
 */
export const filtrarCatalogosPorNombre = async (nombre) => {
    try {
        const response = await fetch(`${API_URL}/FiltrarCatalogo_por_Nombre?nombre=${encodeURIComponent(nombre)}`, {
            method: 'GET',
            headers: { 'Accept': 'application/json' }
        });
        
        const res = await handleResponse(response);
        
        // IMPORTANTE: Accedemos a res.data (el JSON) y luego a .data (la lista del SP)
        return {
            ...res,
            data: res.data.data || [] 
        };
    } catch (error) {
        // Si el controlador devuelve 404, llegará aquí
        console.warn("No se encontraron resultados:", error);
        return { data: [], status: 404 };
    }
};
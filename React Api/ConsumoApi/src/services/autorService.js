


const getUserIdSession = () => {
    const id = localStorage.getItem("userId");
    return id ? parseInt(id) : 1; 
};

/**
 * Helper para realizar peticiones fetch incluyendo el Token de Bearer
 * y manejando la expiración de sesión (401).
 */
const fetchConToken = async (url, options = {}) => {
    const token = localStorage.getItem("token");
    
    const defaultOptions = {
        ...options,
        headers: {
            ...options.headers,
            "Accept": "application/json",
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}` 
        }
    };

    const response = await fetch(url, defaultOptions);

    if (response.status === 401) {
        alert("Tu sesión ha expirado o no tienes permisos. Por favor, inicia sesión de nuevo.");
        localStorage.clear();
        window.location.href = "/login";
    }

    return response;
};

// --- OPERACIONES DEL SERVICIO ---

// 1. OBTENER TODOS
export const getAutores = async () => {
    try {
        const response = await fetchConToken(`${import.meta.env.VITE_API_URL}/api/Autor/ListarAutores`, { method: 'GET' });
        if (!response.ok) throw new Error("Error al obtener autores");
        return await response.json();
    } catch (error) {
        console.error("Error en getAutores:", error);
        throw error;
    }
};

// 2. GUARDAR (POST)
export const insertarAutor = async (idPersona) => {
    const data = {
        "id_Persona": parseInt(idPersona), 
        "id_Creador": getUserIdSession(), 
        "id_Estado": 3 
    };

    console.log("🚀 Insertando nuevo autor:", data);

    // Mantenemos el nombre del endpoint con el error de dedo que tiene tu API: IinseratrAutor
    return await fetchConToken(`${import.meta.env.VITE_API_URL}/api/Autor/IinseratrAutor`, { 
        method: 'POST',
        body: JSON.stringify(data)
    });
};

export const actualizarAutor = async (idAutor, idPersona) => {
    // 1. La URL usa el ID del autor (id) que recibe el controlador: [HttpPut("Editar/{id}")]
    const url = `${import.meta.env.VITE_API_URL}/api/Autor/Editar/${parseInt(idAutor)}`;

    // 2. El cuerpo DEBE tener los nombres exactos de las propiedades de tu clase AutoresDTOs
    // NOTA: No uses comas al final del último elemento para evitar el error de JSON
    const data = {
        Id_Autor: parseInt(idAutor),   
        Id_Persona: parseInt(idPersona), 
        Id_Modificador: getUserIdSession(), 
        Id_Estado: 3,
        ForzarRecuperacion: false
    };

    console.log("📝 Enviando al controlador:", data);

    return await fetchConToken(url, {
        method: 'PUT',
        body: JSON.stringify(data) // .NET convertirá este JSON en el objeto 'dto'
    });
};

// 4. ELIMINAR (DELETE)
export const eliminarAutor = async (id) => {
    const idModificador = getUserIdSession(); 
    
    // Construimos la URL con el query parameter para el idModificador
    const url = `${import.meta.env.VITE_API_URL}/api/Autor/Eliminar/${id}?idModificador=${idModificador}`;
    
    console.log("🗑️ Eliminando autor ID:", id);

    return await fetchConToken(url, {
        method: 'DELETE'
    });
};

// 5. FILTRAR POR PERSONA
export const filtrarAutorPorPersona = async (id_persona) => {
    const url = `${import.meta.env.VITE_API_URL}/api/Autor/FiltroPorIdPersona?id_persona=${id_persona}`;
    const response = await fetchConToken(url, { method: 'GET' });

    // En los filtros es común que si no hay datos devuelva un JSON con el msj de error
    const result = await response.json();
    return result; 
};
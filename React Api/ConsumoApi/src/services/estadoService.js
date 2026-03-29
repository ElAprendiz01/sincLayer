// Obtenemos la URL desde el archivo .env
const API_URL = import.meta.env.VITE_API_URL; 

export const getEstados = async () => {
    try {
        const token = localStorage.getItem("token");
        const response = await fetch(`${API_URL}/api/Estado/listarEstado`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });
        return await response.json();
    } catch (error) {
        console.error("Error al obtener estados:", error);
        return [];
    }
};

export const filtrarEstados = async (nombre) => {
    try {
        const token = localStorage.getItem("token");
        const response = await fetch(`${API_URL}/api/Estado/filtrar?nombreEstado=${nombre}`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });
        if (!response.ok) return [];
        return await response.json();
    } catch (error) {
        console.error("Error al filtrar:", error);
        return [];
    }
};

export const insertarEstado = async (nombreEstado) => {
    try {
        const token = localStorage.getItem("token");
        const userId = localStorage.getItem("userId");

        // CAMBIO: Usamos la ruta que te funciona 'Nuevo_estado'
        const response = await fetch(`${API_URL}/api/Estado/Nuevo_estado`, {
            method: 'POST', 
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                estado: nombreEstado,
                id_Creador: Number(userId),
                activo: true
            })
        });

        if (!response.ok) {
            console.error("Error en insertar:", response.status);
            return null;
        }

        return await response.json();
    } catch (error) {
        console.error("Error al insertar:", error);
        return null;
    }
};

export const editarEstado = async (id, nombreEstado, activo) => {
    try {
        const token = localStorage.getItem("token");
        const userId = localStorage.getItem("userId");

        // IMPORTANTE: Agregamos /${id} al final de la URL
        const response = await fetch(`${API_URL}/api/Estado/editar/${id}`, {
            method: 'PUT',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                id_Estado: id,
                estado: nombreEstado,
                activo: activo,
                id_Modificador: Number(userId)
            })
        });

        if (!response.ok) {
            // Si el servidor responde con error (400, 404, 500), lanzamos una excepción
            const errorData = await response.text();
            throw new Error(errorData || "Error al actualizar");
        }

        // Si la respuesta tiene contenido, lo convertimos a JSON
        const contentType = response.headers.get("content-type");
        if (contentType && contentType.includes("application/json")) {
            return await response.json();
        }
        
        return { success: true }; // Si el backend no devuelve JSON (ej. Return Ok())
    } catch (error) {
        console.error("Error al editar:", error);
        throw error;
    }
};

export const eliminarEstado = async (id) => {
    try {
        const token = localStorage.getItem("token");
        const response = await fetch(`${API_URL}/api/Estado/eliminar?id_Estado=${id}`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });
        return response.ok;
    } catch (error) {
        console.error("Error al eliminar:", error);
    }
};
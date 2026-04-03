// Obtenemos la URL desde el archivo .env
const Api1 = import.meta.env.VITE_API_URL;
const API_URL = `${Api1}/api/Estado`; // Asegúrate de que esta ruta coincida con tu backend

export const getEstados = async () => {
    try {
        const token = localStorage.getItem("token");
        const response = await fetch(`${API_URL}/listarEstado`, {
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
        const response = await fetch(`${API_URL}/filtrar?nombreEstado=${nombre}`, {
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
        
        // RECUPERAMOS EL ID QUE GUARDASTE EN EL LOGIN
        const userId = localStorage.getItem("userId");

        const response = await fetch(`${API_URL}/Nuevo_estado`, {
            method: 'POST', 
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                // NOTA: Prueba con mayúsculas si el error 500 persiste
                Estado: nombreEstado,
                Id_Creador: Number(userId), 
                Activo: true
            })
        });

        if (!response.ok) {
            // Esto nos ayudará a ver qué dice el servidor exactamente
            const errorText = await response.text();
            console.error("Error detallado del servidor:", errorText);
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
        const response = await fetch(`${API_URL}/editar/${id}`, {
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
        // CORRECCIÓN: Cambiamos ${idEliminar} por ${id}
        const response = await fetch(`${API_URL}/Eliminar/${id}`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });
        
        return response.ok; 
    } catch (error) {
        console.error("Error al eliminar:", error);
        return false; // Es buena práctica retornar false si hubo un error de red
    }
};
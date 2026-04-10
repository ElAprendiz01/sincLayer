const API_URL = `${import.meta.env.VITE_API_URL}/api/Usuario`;

const getHeaders = () => ({
    'Content-Type': 'application/json',
    'accept': '*/*'
});

export const usuarioService = {
    // LISTAR USUARIOS
    listar: async () => {
        try {
            const response = await fetch(`${API_URL}/listar`, { 
                method: 'GET', 
                headers: getHeaders() 
            });
            const result = await response.json();
            return result.data || [];
        } catch (error) {
            console.error("Error en listar:", error);
            return [];
        }
    },

    // INSERTAR USUARIO (POST)
    crear: async (datos) => {
        try {
            const payload = {
                Usuario: datos.usuario,
                Contrasena: datos.contrasena,
                Id_Rol: parseInt(datos.id_Rol),
                Id_Estado: parseInt(datos.id_Estado),
                Id_Persona: parseInt(datos.id_Persona),
                ForzarRecuperacion: datos.forzarRecuperacion || false,
                Id_Creador: 1 
            };

            const response = await fetch(`${API_URL}/crear`, {
                method: 'POST',
                headers: getHeaders(),
                body: JSON.stringify(payload)
            });

            const result = await response.json();
            
            if (!response.ok) {
                throw new Error(result.error || result.message || "Error al insertar");
            }

            return { ok: true, message: result.message };
        } catch (error) {
            throw error;
        }
    },

    // ACTUALIZAR USUARIO (PUT)
    actualizar: async (datos) => {
        try {
            const payload = {
                Id_Usuario: parseInt(datos.id_Usuario), 
                Id_Rol: parseInt(datos.id_Rol),
                Id_Estado: parseInt(datos.id_Estado),
                Id_Modificador: 1, 
                ForzarRecuperacion: datos.forzarRecuperacion || false
            };

            const response = await fetch(`${API_URL}/actualizar`, {
                method: 'PUT',
                headers: getHeaders(),
                body: JSON.stringify(payload)
            });

            const result = await response.json();

            if (!response.ok) {
                throw new Error(result.error || result.message || 'Error al actualizar');
            }

            return { ok: true, message: result.message };
        } catch (error) {
            throw error;
        }
    },

    // ELIMINAR USUARIO
    eliminar: async (idUsuario) => {
        try {
            const response = await fetch(`${API_URL}/eliminar`, {
                method: 'DELETE',
                headers: getHeaders(),
                body: JSON.stringify({ Id_Usuario: parseInt(idUsuario), Id_Modificador: 1 })
            });
            if (!response.ok) throw new Error("Fallo al eliminar");
            return { ok: true };
        } catch (error) {
            throw error;
        }
    }
};
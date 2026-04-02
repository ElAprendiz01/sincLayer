const BASE_URL = 'http://localhost:5082/api/Contacto';

export const ContactoService = {
    // 1. Listar
    listar: async () => {
        const response = await fetch(`${BASE_URL}/ListarContacto`);
        if (!response.ok) throw new Error("Error al obtener contactos");
        return await response.json();
    },

    // 2. Insertar
    insertar: async (datos) => {
        const userId = localStorage.getItem("userId");
        const payload = {
            Id_Persona: parseInt(datos.id_Persona),
            Tipo_Contacto: parseInt(datos.tipo_Contacto),
            Contacto: datos.contacto,
            Id_Creador: parseInt(userId) || 5,
            Id_Estado: 3
        };

        const response = await fetch(`${BASE_URL}/InsertarContacto`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });

        const result = await response.json();
        if (!response.ok) throw new Error(result.msj || "Error al insertar");
        return result;
    },

    // 3. Editar
    editar: async (id, datos) => {
        const userId = localStorage.getItem("userId");
        const payload = {
            Id_Contacto: id,
            Tipo_Contacto: parseInt(datos.tipo_Contacto),
            Contacto: datos.contacto,
            Id_Modificador: parseInt(userId) || 5,
            Id_Estado: 3
        };

        const response = await fetch(`${BASE_URL}/Editar/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });

        const result = await response.json();
        if (!response.ok) throw new Error(result.msj || "Error al editar");
        return result;
    },

    // 4. Eliminar (LA QUE TE DA ERROR)
    eliminar: async (id, idModificador) => {
        // Importante: Tu C# usa [HttpDelete("Eliminar/{id}")]
        // y recibe el idModificador por [FromQuery]
        const response = await fetch(`${BASE_URL}/Eliminar/${id}?idModificador=${idModificador}`, {
            method: 'DELETE'
        });

        const result = await response.json();
        if (!response.ok) throw new Error(result.msj || "Error al eliminar");
        return result;
    }
};
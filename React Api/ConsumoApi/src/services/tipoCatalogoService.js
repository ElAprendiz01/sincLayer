const BASE_URL = import.meta.env.VITE_API_URL; 
const API_URL = `${BASE_URL}/api/Cls_Tipo_Catalogo`;

export const getTiposCatalogo = async () => {
    try {
        const response = await fetch(API_URL);
        return await response.json();
    } catch (error) {
        return [];
    }
};

export const crearTipoCatalogo = async (data) => {
    try {
        const response = await fetch(`${API_URL}/NuevoCls_Tipo_Catalogo`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });
        return response.ok; 
    } catch (error) {
        return false;
    }
};

// EDITAR (Asegúrate de que incluya el modificador)
export const editarTipoCatalogo = async (id, data) => {
    try {
        const objetoCompleto = {
            id_Tipo_Catalogo: parseInt(id),
            nombre: data.nombre,
            id_Modificador: data.id_Modificador, // 🚩 Viene del componente
            activo: data.activo
        };

        const response = await fetch(`${BASE_URL}/api/Cls_Tipo_Catalogo/Editar/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(objetoCompleto)
        });
        return response.ok;
    } catch (error) {
        return false;
    }
};

export const eliminarTipoCatalogo = async (id) => {
    try {
        const response = await fetch(`${API_URL}/Eliminar/${id}`, {
            method: 'DELETE',
            headers: { 'Content-Type': 'application/json' }
        });
        return response.ok;
    } catch (error) {
        return false;
    }
};
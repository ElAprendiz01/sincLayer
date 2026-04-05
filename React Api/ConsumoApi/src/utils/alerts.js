import Swal from 'sweetalert2';

// Configuración base para el tema oscuro de NexaCore
const nexaToast = Swal.mixin({
    background: '#111214',
    color: '#fff',
    confirmButtonColor: '#00f2fe',
    cancelButtonColor: '#ff4136',
    customClass: {
        popup: 'nexa-swal-popup',
        title: 'nexa-swal-title'
    }
});

export const showNexaAlert = {
    success: (msg) => {
        nexaToast.fire({
            icon: 'success',
            title: '¡Operación Exitosa!',
            text: msg,
            timer: 2000,
            showConfirmButton: false
        });
    },
    error: (msg) => {
        nexaToast.fire({
            icon: 'error',
            title: 'Error en el Sistema',
            text: msg
        });
    },
    confirm: async (msg) => {
        const result = await nexaToast.fire({
            title: '¿Estás seguro?',
            text: msg,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Sí, confirmar',
            cancelButtonText: 'Cancelar',
            reverseButtons: true
        });
        return result.isConfirmed;
    }
};
using application.DTOs;
using Domain;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace application.Interfaces
{
    public interface IAcuerdos_Pago_Repository
    {
        Task<IEnumerable<Acuerdos_Pago_DTOs>> Listar_Acuerdos_PagosAsync();
        Task<IEnumerable<Acuerdos_Pago_DTOs>> Listar_Acuerdos_Pagos_IdAsync(int id);
        Task Insertar_Acuerdos_PagoAsync(Acuerdos_Pago_DTOs acuerdos_Pago);
        Task Editar_Acuerdos_PagoAsync(Acuerdos_Pago_DTOs acuerdos_Pago);
        Task Eliminar_Acuerdos_PagoAsync(int id, int Id_modificador);
    }
}

using application.DTOs;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace application.Interfaces
{
    public interface IPagoRepository
    {
        Task<IEnumerable<PagoDTO>> ObtenerTodosLosPagos();
        Task<IEnumerable<PagoDTO>> BuscarPagos(string? comprobante, int? idMulta);
        Task<string> RegistrarNuevoPago(PagoDTO pago);
        Task<string> ActualizarPagoExistente(PagoDTO pago);
        Task<string> AnularPagoSistema(int idPago, int idModificador);
    }
}

using Domain;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace application.Interfaces
{
    public interface IPrestamosRepository
    {

        Task<IEnumerable<PrestamosDomain>> Listar_PrestamosAsync();
        Task<IEnumerable<PrestamosDomain>> Listar_prestamosId_Usuario_ClienteAsync(int Id_Usuario_Cliente);
        Task NuevoPrestamosAsyn(PrestamosDomain oPrestamos);
        Task EditarPrestamosAsync(PrestamosDomain oPrestamos);
        Task EliminaPrestamosAsync(int id, int idModificador);
    }
}

using Domain;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace application.Interfaces
{
    public interface IDevolucionesRepository
    {

        Task<IEnumerable<DevolucionesDomain>> ListarDevolucionesAsync();
        Task<IEnumerable<DevolucionesDomain>> Listar_ListarDevolucionesPorUsuarioAsync(int Id_Usuario_Cliente);
        Task RegistrarDevolucionAsyn(DevolucionesDomain oPrestamos);
        Task ActualizarDevolucionAsync(DevolucionesDomain oPrestamos);
        Task SpDesactivarDevolucionAutomaticoAsync(int id, int idModificador);
    }
}

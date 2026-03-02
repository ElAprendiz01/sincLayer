using Domain;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace application.Interfaces
{
    public interface ImultasRepository
    {
        Task<IEnumerable<MultasDomain>> ListarMultasPendientesAsync();
        Task<IEnumerable<MultasDomain>> ListarUsuariosConMultasPendientes();
        Task ActualizarMultasPorAbonoaync(MultasDomain omultas);
        Task ActualizarMultasaync(MultasDomain omultas);
        Task EliminarMultaSync(int id, int IdModificador);
    }
}

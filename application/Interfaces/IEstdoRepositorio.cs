using Domain;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace application.Interfaces
{
    public interface IEstdoRepositorio
    {
        Task<IEnumerable<Estado_domain>> ListarEstadosAsync();
        Task<IEnumerable<Estado_domain>> ListarEstadospornombreAsync(string filtronombre);
        Task NuevoEstadoasync(Estado_domain oestado);
        Task ActualizarEstadoasync(Estado_domain oestado);
        Task EliminarEstadoasyc(int idestado);



    }
}

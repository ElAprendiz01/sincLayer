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
        Task<IEnumerable<Estado_domain>> ListarEstadospornombreAsync();
        Task NuevoEstado<estado_domain>(Estado_domain oestado);
        Task ActualizarEstado<estado_domain>(Estado_domain oestado);
        Task EliminarEstado<estado_domain>(int idestado);



    }
}

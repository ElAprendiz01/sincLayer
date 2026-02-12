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
        Task<IEnumerable<Estado_Dom>> ListarEstadosAsync();
        Task<IEnumerable<Estado_Dom>> ListarEstadospornombreAsync(string filtronombre);
        Task NuevoEstadoasync(Estado_Dom oestado);
        Task ActualizarEstadoasync(Estado_Dom oestado);
        Task EliminarEstadoasyc(int idestado);



    }
}

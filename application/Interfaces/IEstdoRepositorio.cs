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
        Task<IEnumerable<Estado_domain>> ListarEstadosAsync(); // viende del archivo domain, es el nombre de la clase que se creo en el domain
        Task<IEnumerable<Estado_domain>> ListarEstadospornombreAsync();
        Task NuevoEstado<estado_domain>(Estado_domain oestado);
        Task ActualizarEstado<estado_domain>(Estado_domain oestado);
        Task EliminarEstado<estado_domain>(int idestado);
        // ver
        // las


    }
}

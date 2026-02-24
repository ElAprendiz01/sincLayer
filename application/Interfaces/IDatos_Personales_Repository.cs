using Domain;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace application.Interfaces
{
    public interface IDatos_Personales_Repository
    {
        Task<IEnumerable<Datos_Personales>> Listar_Datos_PersonalesAsync();
        Task<IEnumerable<Datos_Personales>> Listar_Datos_PersonalesPorFechaAsync(string Buscar);
        Task NuevoDatos_PersonalesAsyn(Datos_Personales oDatos_Personales);
        Task EditarDatos_PersonalesAsync(Datos_Personales oDatos_Personales);
        Task EliminarDatos_PersonalesAsync(int id, int idModificador);
    }
}

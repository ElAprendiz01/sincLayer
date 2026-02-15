using Domain;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace application.Interfaces
{
    public interface IDireccionRepository
    {
        Task<IEnumerable<Direccion_Dom>> Listar_DireccionAsync();
        Task<IEnumerable<Direccion_Dom>> Listar_DireccionPorIdPersonaAsync(int Id_Persona);
        Task NuevaDireccionAsyn(Direccion_Dom oDireccion_Dom);
        Task EditarDireccionAsync(Direccion_Dom oDireccion_Dom);
        Task EliminarDireccionAsync(int id, int idModificador, int Id_Estado);
    }
}

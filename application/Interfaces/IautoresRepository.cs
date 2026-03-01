using Domain;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace application.Interfaces
{
    public interface IautoresRepository
    {

        Task<IEnumerable<AutoresDomain>> Listar_AutoresAsync();
        Task<IEnumerable<AutoresDomain>> Listar_autores_por_id_personaAsync(int id_persona);
        Task NuevoAutoresAsyn(AutoresDomain oautor);
        Task EditarautoresAsync(AutoresDomain oautor);
        Task EliminarAutoresAsync(int id, int idModificador);
    }
}

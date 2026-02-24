using Domain;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace application.Interfaces
{
    public interface IContacto_Repository
    {
        Task<IEnumerable<Contacto_Domai>> Listar_ContactoAsync();
        Task<IEnumerable<Contacto_Domai>> Listar_ContactoPorContactoAsync(string Buscar);
        Task NuevoContactoAsyn(Contacto_Domai oContacto_Domai);
        Task EditarContactoAsync(Contacto_Domai oContacto_Domai);
        Task EliminarContactoAsync(int id, int idModificador);
    }
}

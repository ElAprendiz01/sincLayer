using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Domain;

namespace application.Interfaces
{
    public interface ICatalogoRepositorio
    {

        Task<IEnumerable<Catalogo_Dom>> Listar_CatalogoAsync();
        Task<IEnumerable<Catalogo_Dom>> Listar_CatalogoPorFechaAsync(string Buscar);
        Task NuevoCatalogoAsyn(Catalogo_Dom oCatalogo);
        Task EditarCatalogoAsync(Catalogo_Dom oCatalogo);
        Task EliminarCatalogoAsync(int id, int idModificador ); 
        //cabio

    }
}

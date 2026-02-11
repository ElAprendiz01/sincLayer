using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Domain;

namespace application.Interfaces
{
    public interface ITipo_Catalogo_Repository
    {
        Task<IEnumerable<Cls_Tipo_Catalogo>> Listar_Cls_Tipo_CatalogoAsync();
        Task<IEnumerable<Cls_Tipo_Catalogo>> Listar_Cls_Tipo_CatalogoPorNombreAsync(string Buscar);
        Task NuevoCls_Tipo_CatalogoAsyn(Cls_Tipo_Catalogo oCls_Tipo_Catalogo);
        Task EditarCls_Tipo_CatalogoAsync(Cls_Tipo_Catalogo oCls_Tipo_Catalogo);
        Task EliminarCls_Tipo_CatalogoAsync(int id);
    }
}

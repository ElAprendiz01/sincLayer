using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using application;
using application.DTOs;
using application.Interfaces;
using Domain;

namespace application.Services
{
    public class CatalogoServices
    {
        private ICatalogoRepositorio _repository;

        public CatalogoServices(ICatalogoRepositorio repository)
        {
            _repository = repository;
        }
        public async Task<IEnumerable<Catalogo_Dom>> ListarCatalogo()
        {
            var listar = await _repository.Listar_CatalogoAsync();
            return listar.Select(c => new Catalogo_Dom
            {
                Id_Catalogo = c.Id_Catalogo,
                Id_Tipo_Catalogo = c.Id_Tipo_Catalogo,
                Tipo_Catalogo = c.Tipo_Catalogo,
                Nombre = c.Nombre,
                Fecha_Creacion = c.Fecha_Creacion,
                Fecha_Modificacion = c.Fecha_Modificacion,
                Id_Creador = c.Id_Creador,
                Id_Modificador = c.Id_Modificador,
                Activo = c.Activo
            });
            

        }
        public async Task<IEnumerable<Catalogo_Dom>> ListarCatalogoPornombre(string Buscar)
        {
            if (string.IsNullOrWhiteSpace(Buscar))
                return Enumerable.Empty<Catalogo_Dom>();
            var listar = await _repository.Listar_CatalogoPorFechaAsync(Buscar);
            return listar.Select(c => new Catalogo_Dom
            {
                Id_Catalogo = c.Id_Catalogo,
                Id_Tipo_Catalogo = c.Id_Tipo_Catalogo,
                Tipo_Catalogo = c.Tipo_Catalogo,
                Nombre = c.Nombre,
                Fecha_Creacion = c.Fecha_Creacion,
                Fecha_Modificacion = c.Fecha_Modificacion,
                Id_Creador = c.Id_Creador,
                Id_Modificador = c.Id_Modificador,
                Activo = c.Activo
            });
        }
        public async Task NuevoCatalogo(CatalogDTOs oCatalogo)
        {
            var oCatalogoDom = new Catalogo_Dom
            {
                Id_Tipo_Catalogo = oCatalogo.Id_Tipo_Catalogo,
                Nombre = oCatalogo.Nombre,
                Id_Creador = oCatalogo.Id_Creador
            };
            await _repository.NuevoCatalogoAsyn(oCatalogoDom);
        }
        public async Task EditarCatalogo(CatalogDTOs oCatalogo)
        {
            var oCatalogoDom = new Catalogo_Dom
            {
                Id_Catalogo = oCatalogo.Id_Catalogo,
                Id_Tipo_Catalogo = oCatalogo.Id_Tipo_Catalogo,
                Nombre = oCatalogo.Nombre,
                Id_Modificador = oCatalogo.Id_Modificador,
                Activo = oCatalogo.Activo
            };
             await _repository.EditarCatalogoAsync(oCatalogoDom);

        }
        public async Task EliminarCatalogo(int id, int idModificador )
        {
            await _repository.EliminarCatalogoAsync(id, idModificador);
        }

    }
}

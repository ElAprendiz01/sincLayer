using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using application.DTOs;
using application.Interfaces;
using Domain;

namespace application.Services
{
    public class Cls_Tipo_Catalogo_Services
    {
        private ITipo_Catalogo_Repository _repository; 
        public Cls_Tipo_Catalogo_Services(ITipo_Catalogo_Repository repository)
        {
            _repository = repository; 
        }

        //Metodo Listar
        public async Task<IEnumerable<Tipo_Catalogo_DTOs>> ListarCls_Tipo_Catalogo()
        {
            var listar = await _repository.Listar_Cls_Tipo_CatalogoAsync();

            return listar.Select(p => new Tipo_Catalogo_DTOs
            {
                Id_Tipo_Catalogo = p.Id_Tipo_Catalogo,
                Nombre = p.Nombre,
                Fecha_Creacion = p.Fecha_Creacion,
                Fecha_Modificacion = p.Fecha_Modificacion,
                Id_Creador = p.Id_Creador,
                Id_Modificador = p.Id_Modificador,
                Activo = p.Activo,
                

            });
        }

        //Metodo Listar por Nombre
        public async Task<IEnumerable<Tipo_Catalogo_DTOs>> ListarPorNombre(string Buscar)
        {
            if (string.IsNullOrWhiteSpace(Buscar))

                return Enumerable.Empty<Tipo_Catalogo_DTOs>();

            var lista = await _repository.Listar_Cls_Tipo_CatalogoPorNombreAsync(Buscar);
            return lista.Select(p => new Tipo_Catalogo_DTOs
            {
                Id_Tipo_Catalogo = p.Id_Tipo_Catalogo,
                Nombre = p.Nombre,
                Fecha_Creacion = p.Fecha_Creacion,
                Fecha_Modificacion = p.Fecha_Modificacion,
                Id_Creador = p.Id_Creador,
                Id_Modificador = p.Id_Modificador,
                Activo = p.Activo,
            });
        }

        //METODO INSERTAR
        public async Task NuevoCls_Tipo_Catalogo(Tipo_Catalogo_DTOs dto)
        {
            var oCls_Tipo_Catalogo = new Cls_Tipo_Catalogo
            {
                Nombre = dto.Nombre,
                Id_Creador = dto.Id_Creador
            };
            await _repository.NuevoCls_Tipo_CatalogoAsyn(oCls_Tipo_Catalogo);
        }

        //METODO EDITAR
        public async Task EditarCls_Tipo_Catalogo(Tipo_Catalogo_DTOs dto)
        {
            var oCls_Tipo_Catalogo = new Cls_Tipo_Catalogo
            {
                Id_Tipo_Catalogo = dto.Id_Tipo_Catalogo,
                Nombre = dto.Nombre,
                Id_Modificador = dto.Id_Modificador,
                Activo = dto.Activo,
            };
            await _repository.EditarCls_Tipo_CatalogoAsync(oCls_Tipo_Catalogo);
        }

        //METODO ELIMINAR
        public async Task EliminarCls_Tipo_Catalogo(int id)
        {
            await _repository.EliminarCls_Tipo_CatalogoAsync(id);
        }
    }
}

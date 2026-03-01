using application.DTOs;
using application.Interfaces;
using Domain;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace application.Services
{
    public class AutoresServices
    {
        private IautoresRepository _repository;

        public AutoresServices(IautoresRepository repository)
        {
            _repository = repository;
        }
        public async Task<IEnumerable<AutoresDomain>> Listar_autores()
        {
            var listar = await _repository.Listar_AutoresAsync();
            return listar.Select(a => new AutoresDomain
            {
                Id_Autor = a.Id_Autor,
                Id_Persona = a.Id_Persona,
                Nombre_Persona = a.Nombre_Persona,
                Apellido = a.Apellido,
                Fecha_Creacion = a.Fecha_Creacion,
                Fecha_Modificacion = a.Fecha_Modificacion,
                Id_Creador = a.Id_Creador,
                Id_Modificador = a.Id_Modificador,
                Estado = a.Estado
            });


        }
        public async Task<IEnumerable<AutoresDomain>> FiltrarAutoPorIdPersoan(int id_persona)
        {
            if (id_persona <= 0)
                return Enumerable.Empty<AutoresDomain>();
            var listar = await _repository.Listar_autores_por_id_personaAsync(id_persona);
            return listar.Select(a => new AutoresDomain
            {
                Id_Autor = a.Id_Autor,
                Id_Persona = a.Id_Persona,
                Nombre_Persona = a.Nombre_Persona,
                Apellido = a.Apellido,
                Fecha_Creacion = a.Fecha_Creacion,
                Fecha_Modificacion = a.Fecha_Modificacion,
                Id_Creador = a.Id_Creador,
                Id_Modificador = a.Id_Modificador,
                Estado = a.Estado
            });
        }

        public async Task nuevoAutor(AutoresDTOs oautor)
        {
            var oautordom = new AutoresDomain
            {
                Id_Persona = oautor.Id_Persona,
                Id_Creador = oautor.Id_Creador,
                Id_Estado = oautor.Id_Estado,
            };
            await _repository.NuevoAutoresAsyn(oautordom);
        }

        public async Task EditarAutor(AutoresDTOs oautor, bool esAdmin)
        {
            if (!esAdmin)
            {
                // Usuario normal NO puede forzar recuperación
                oautor.ForzarRecuperacion = false;
            }
            var oautordom = new AutoresDomain
            {
                Id_Autor = oautor.Id_Autor,
                Id_Persona = oautor.Id_Persona,
                Id_Modificador = oautor.Id_Modificador,
                Id_Estado = oautor.Id_Estado,
                ForzarRecuperacion = oautor.ForzarRecuperacion
            };
            await _repository.EditarautoresAsync(oautordom);
        }
        public async Task EliminarAutor(int id, int idModificador)
        {


            await _repository.EliminarAutoresAsync(id, idModificador);


        }
    }
}

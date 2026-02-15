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
    public class DireccionServices
    {
        private readonly IDireccionRepository _repository;
        public DireccionServices(IDireccionRepository repository)
        {
            _repository = repository;
        }
        //metodo listar
        public async Task<IEnumerable<DIreccionDTOs>> ListarDireccion()
        {
            var listar = await _repository.Listar_DireccionAsync();
            return listar.Select(d => new DIreccionDTOs
            {
                Id_Persona = d.Id_Persona,
                nombre_persona = d.nombre_persona,
                Apellido = d.Apellido,
                Id_direccion = d.Id_direccion,
                Ciudad = d.Ciudad,
                Barrio = d.Barrio,
                Calle = d.Calle,
                Fecha_Creacion = d.Fecha_Creacion,
                Fecha_Modificacion = d.Fecha_Modificacion,
                Id_Creador = d.Id_Creador,
                Id_Modificador = d.Id_Modificador,
                Id_Estado = d.Id_Estado,
            });
        }
        //metodo listar por idPersona
        public async Task<IEnumerable<DIreccionDTOs>> ListarPorIdPersona(int Id_Persona)
        {
            if (Id_Persona <= 0)

                return Enumerable.Empty<DIreccionDTOs>();

            var listar = await _repository.Listar_DireccionPorIdPersonaAsync(Id_Persona);
            return listar.Select(d => new DIreccionDTOs
            {
                Id_Persona = d.Id_Persona,
                nombre_persona = d.nombre_persona,
                Apellido = d.Apellido,
                Id_direccion = d.Id_direccion,
                Ciudad = d.Ciudad,
                Barrio = d.Barrio,
                Calle = d.Calle,
                Fecha_Creacion = d.Fecha_Creacion,
                Fecha_Modificacion = d.Fecha_Modificacion,
                Id_Creador = d.Id_Creador,
                Id_Modificador = d.Id_Modificador,
                Id_Estado = d.Id_Estado,
            });
        }
        //metodo insertar
        public async Task NuevaDireccion(DIreccionDTOs dto)
        {
            var direccion = new Direccion_Dom
            {
                Id_Persona = dto.Id_Persona,
                Id_direccion = dto.Id_direccion,
                Ciudad = dto.Ciudad,
                Barrio = dto.Barrio,
                Calle = dto.Calle,
                Id_Creador = dto.Id_Creador,
                Id_Modificador = dto.Id_Modificador,
                Id_Estado = dto.Id_Estado
            };
            await _repository.NuevaDireccionAsyn(direccion);

        }
        //metodo editar
        public async Task EditarDireccion(DIreccionDTOs dto)
        {
            var direccion = new Direccion_Dom
            {

                Id_direccion = dto.Id_direccion,
                Ciudad = dto.Ciudad,
                Barrio = dto.Barrio,
                Calle = dto.Calle,
                Id_Modificador = dto.Id_Modificador,
                Id_Estado = dto.Id_Estado
            };
            await _repository.EditarDireccionAsync(direccion);
        }
        //metodo eliminar
        public async Task EliminarDireccion(int id, int idModificador, int Id_Estado)
        {
            await _repository.EliminarDireccionAsync(id, idModificador, Id_Estado);
        }




    }
}

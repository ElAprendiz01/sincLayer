using application.DTOs;
using application.Interfaces;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Domain;


namespace application.Services
{
    public class EsatdosServices
    {
        // creo el campo privado para la interfaz
        private IEstdoRepositorio _repository;

        //creo el constructor para inyectar la dependencia
        public EsatdosServices(IEstdoRepositorio repository)
        {
            _repository = repository;
        }
        // creo el metodo de ñistar 
        public async Task<IEnumerable<EstadosDTOs>> ListarEstados()
        {
            var listar = await _repository.ListarEstadosAsync();
            return listar.Select(p => new EstadosDTOs
            {
                Id_Estado = p.Id_Estado,
                Estado = p.Estado,
                Fecha_Creacion = p.Fecha_Creacion,
                Fecha_Modificacion = p.Fecha_Modificacion,
                Id_Creador = p.Id_Creador,
                Id_Modificador = p.Id_Modificador,
                Activo = p.Activo,
            });
        }
        // creo el metodo de listar por nombre
        public async Task<IEnumerable<EstadosDTOs>> ListarPorNombre(string filtronombre)
        {
            if (string.IsNullOrWhiteSpace(filtronombre))
                return Enumerable.Empty<EstadosDTOs>();
            var lista = await _repository.ListarEstadospornombreAsync(filtronombre);
            return lista.Select(p => new EstadosDTOs
            {
                Id_Estado = p.Id_Estado,
                Estado = p.Estado,
                Fecha_Creacion = p.Fecha_Creacion,
                Fecha_Modificacion = p.Fecha_Modificacion,
                Id_Creador = p.Id_Creador,
                Id_Modificador = p.Id_Modificador,
                Activo = p.Activo,
            });
        }
        // creo el metodo de insertar
        public async Task NuevoEstado(EstadosDTOs dto)
        {
            var onuevoEstado = new Estado_Dom
            {

                Estado = dto.Estado,
                Fecha_Creacion = dto.Fecha_Creacion,
                Fecha_Modificacion = dto.Fecha_Modificacion,
                Id_Creador = dto.Id_Creador,
                Id_Modificador = dto.Id_Modificador,
                Activo = dto.Activo,
            };
            await _repository.NuevoEstadoasync(onuevoEstado);

        }

        // creo el metodo de actualizar
        public async Task ActualizarEstado(EstadosDTOs dto)
        {
            var oActualizarEstado = new Estado_Dom
            {
                Id_Estado = dto.Id_Estado,
                Estado = dto.Estado,
                Fecha_Creacion = dto.Fecha_Creacion,
                Fecha_Modificacion = dto.Fecha_Modificacion,
                Id_Creador = dto.Id_Creador,
                Id_Modificador = dto.Id_Modificador,
                Activo = dto.Activo,
            };
            await _repository.ActualizarEstadoasync(oActualizarEstado);
        }
        // metodo de eliminar
        public async Task EliminarEstado(int idestado)
        {
            await _repository.EliminarEstadoasyc(idestado);
        }
    }
}

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
    public class DevolucionesServices 
    {
        private IDevolucionesRepository _repository;
        public DevolucionesServices(IDevolucionesRepository repository)
        {
            _repository = repository;
        }
        //Metodo Listar Devoluciones
        public async Task<IEnumerable<DevolucionesDTOs>> ListarDevoluciones()
        {
            var lista = await _repository.ListarDevolucionesAsync();

            return lista.Select(d => new DevolucionesDTOs
            {
                Id_Devolucion = d.Id_Devolucion,
                Id_Prestamo = d.Id_Prestamo,
                NombreCliente = d.NombreCliente,
                Libro = d.Libro,
                Fecha_Entrega = d.Fecha_Entrega,
                EstadoLibro = d.EstadoLibro,
                Fecha_Creacion = d.Fecha_Creacion,
                Fecha_Modificacion = d.Fecha_Modificacion,
                Id_Creador = d.Id_Creador,
                Id_Modificador = d.Id_Modificador,
                EstadoRegistro = d.EstadoRegistro
            });
        }

        //Metodo Listar por Usuario
        public async Task<IEnumerable<DevolucionesDTOs>> ListarDevolucionesPorUsuario(int Id_Usuario_Cliente)
        {
            var lista = await _repository.Listar_ListarDevolucionesPorUsuarioAsync(Id_Usuario_Cliente);

            return lista.Select(d => new DevolucionesDTOs
            {
                Id_Devolucion = d.Id_Devolucion,
                Id_Prestamo = d.Id_Prestamo,
                Usuario = d.Usuario,
                Libro = d.Libro,
                Fecha_Entrega = d.Fecha_Entrega,
                EstadoLibro = d.EstadoLibro,
                Fecha_Creacion = d.Fecha_Creacion,
                Fecha_Modificacion = d.Fecha_Modificacion,
                Id_Creador = d.Id_Creador,
                Id_Modificador = d.Id_Modificador,
                EstadoRegistro = d.EstadoRegistro
            });
        }

        //Metodo Registrar Devolucion
        public async Task RegistrarDevolucion(DevolucionesDTOs dto)
        {
            var oDevolucion = new DevolucionesDomain
            {
                Id_Prestamo = dto.Id_Prestamo,
                Id_Estado_Libro = dto.Id_Estado_Libro,
                Id_Creador = dto.Id_Creador
            };

            await _repository.RegistrarDevolucionAsyn(oDevolucion);
        }

        //Metodo Actualizar Devolucion
        public async Task ActualizarDevolucion(DevolucionesDTOs dto, bool esAdmin)
        {
            if (!esAdmin)
            {
                dto.ForzarRecuperacion = false;
            }

            var oDevolucion = new DevolucionesDomain
            {
                Id_Devolucion = dto.Id_Devolucion,
                Id_Modificador = dto.Id_Modificador,
                Id_Estado = dto.Id_Estado,
                ForzarRecuperacion = dto.ForzarRecuperacion
            };

            await _repository.ActualizarDevolucionAsync(oDevolucion);
        }

        //Metodo Eliminar Devolucion
        public async Task EliminarDevolucion(int id, int idModificador)
        {
            await _repository.SpDesactivarDevolucionAutomaticoAsync(id, idModificador);
        }
    }
}

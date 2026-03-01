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
    public class PrestamosServices
    {
        private IPrestamosRepository _repository;

        public PrestamosServices(IPrestamosRepository repository)
        {
            _repository = repository;
        }
        public async Task<IEnumerable<PrestamosDomain>> Listar_Prestamos()
        {
            var listar = await _repository.Listar_PrestamosAsync();
            return listar.Select(a => new PrestamosDomain
            {
               Id_Prestamo = a.Id_Prestamo,
               Id_Usuario_Cliente = a.Id_Usuario_Cliente,
               Nombre_Cliente = a.Nombre_Cliente,
               Libro = a.Libro,
               Fecha_Prestamo = a.Fecha_Prestamo,
               Fecha_Vencimiento = a.Fecha_Vencimiento,
               Fecha_Devolucion_Real = a.Fecha_Devolucion_Real,
               Observaciones = a.Observaciones,
                Id_Creador = a.Id_Creador,
                Id_Modificador = a.Id_Modificador,
                Estado = a.Estado
            });


        }
        public async Task<IEnumerable<PrestamosDomain>> FiltrarporIdUSuario(int Id_Usuario_Cliente)
        {
            if (Id_Usuario_Cliente <= 0)
                return Enumerable.Empty<PrestamosDomain>();
            var listar = await _repository.Listar_prestamosId_Usuario_ClienteAsync(Id_Usuario_Cliente);
            return listar.Select(a => new PrestamosDomain
            {
                Id_Prestamo = a.Id_Prestamo,
                Id_Usuario_Cliente = a.Id_Usuario_Cliente,
                Nombre_Cliente = a.Nombre_Cliente,
                Libro = a.Libro,
                Fecha_Prestamo = a.Fecha_Prestamo,
                Fecha_Vencimiento = a.Fecha_Vencimiento,
                Fecha_Devolucion_Real = a.Fecha_Devolucion_Real,
                Observaciones = a.Observaciones,
                Id_Creador = a.Id_Creador,
                Id_Modificador = a.Id_Modificador,
                Estado = a.Estado

            });
        }

        public async Task nuevoPrestamos(PrestamosDTOs oPrestamos)
        {
            var oPrestamo = new PrestamosDomain
            {
                Id_Usuario_Cliente = oPrestamos.Id_Usuario_Cliente,
                Id_Libro = oPrestamos.Id_Libro,
                Fecha_Vencimiento = oPrestamos.Fecha_Vencimiento,
                Observaciones = oPrestamos.Observaciones,
                Id_Creador = oPrestamos.Id_Creador
            };
            await _repository.NuevoPrestamosAsyn(oPrestamo);
        }

        public async Task EditarPrestamos(PrestamosDTOs oPrestamos, bool esAdmin)
        {
            if (!esAdmin)
            {
                // Usuario normal NO puede forzar recuperación
                oPrestamos.ForzarRecuperacion = false;
            }
            var oPrestamo = new PrestamosDomain
            {
                Id_Prestamo = oPrestamos.Id_Prestamo,
                Id_Modificador = oPrestamos.Id_Modificador,
                Id_Estado = oPrestamos.Id_Estado,
                ForzarRecuperacion = oPrestamos.ForzarRecuperacion
            };
            await _repository.EditarPrestamosAsync(oPrestamo);
        }
        public async Task EliminaPrestamos(int id, int idModificador)
        {


            await _repository.EliminaPrestamosAsync(id, idModificador);


        }
    }
}

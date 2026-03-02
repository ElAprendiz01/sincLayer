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
    public class MultasServices
    {

        private ImultasRepository _repository;
        public MultasServices(ImultasRepository Repository)
        {
            _repository = Repository;
        }

        public async Task<IEnumerable<MultasDTOs>>ListarMultasPendientes()
        {
            var lista = await _repository.ListarMultasPendientesAsync();

            return lista.Select(m => new MultasDTOs
            {
                Id_Multa = m.Id_Multa,
                Id_Prestamo = m.Id_Prestamo,
                Id_Usuario_Cliente = m.Id_Usuario_Cliente,
                Nombre_Cliente = m.Nombre_Cliente,
                Libro = m.Libro,
                Monto_Multa = m.Monto_Multa,
                SaldoPendiente = m.SaldoPendiente,
                Fecha_Creacion = m.Fecha_Creacion,
                Fecha_Modificacion = m.Fecha_Modificacion,
                Id_Creador = m.Id_Creador,
                Id_Modificador = m.Id_Modificador,
                EstadoRegistro = m.EstadoRegistro

            });


        }
        public async Task<IEnumerable<MultasDTOs>> ListarUSuariosConMultas()
        {
            var lista = await _repository.ListarUsuariosConMultasPendientes();

            return lista.Select(m => new MultasDTOs
            {
                Id_Usuario = m.Id_Usuario,
                Nombre_Cliente = m.Nombre_Cliente,
                CantidadMultasPendientes = m.CantidadMultasPendientes,
                TotalPendiente = m.TotalPendiente

            });


        }
        public async Task ActualizarMultaporAbono( MultasDTOs omultas)
        {
            var multas = new MultasDomain
            {
                    Id_Multa  = omultas.Id_Multa,
                    MontoAbono = omultas.MontoAbono,
                    Id_Modificador = omultas.Id_Modificador

            };
            await _repository.ActualizarMultasPorAbonoaync(multas);

        }
        public async Task ActualizarMulta(MultasDTOs omultas, bool esAdmin)
        {
            
            if (!esAdmin)
            {
               
                omultas.ForzarRecuperacion = false;
            }
            var multas = new MultasDomain
            {
                Id_Multa = omultas.Id_Multa,
                Id_Modificador = omultas.Id_Modificador,
                Pagada  = omultas.Pagada,
                Id_Estado = omultas.Id_Estado,
                ForzarRecuperacion  = omultas.ForzarRecuperacion

            };
            await _repository.ActualizarMultasaync(multas);
        }
        public async Task Eliinarmulta(int id, int idModificador)
        {
            await _repository.EliminarMultaSync(id, idModificador);
        }


    }
}

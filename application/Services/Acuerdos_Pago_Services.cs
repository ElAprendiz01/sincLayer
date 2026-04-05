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
    public class Acuerdos_Pago_Services
    {
        private readonly IAcuerdos_Pago_Repository _repository;

        public Acuerdos_Pago_Services(IAcuerdos_Pago_Repository repository)
        {
            _repository = repository;
        }

        public async Task Insertar_acuerdos_pago_async(Acuerdos_Pago_DTOs acuerdos_Pago)
        {
            var olist = new Acuerdos_Pago_DTOs
            {
                Id_Multa = acuerdos_Pago.Id_Multa,
                Monto_Total_Acordado = acuerdos_Pago.Monto_Total_Acordado,
                Cantidad_Cuotas = acuerdos_Pago.Cantidad_Cuotas,
                Monto_Por_Cuota = acuerdos_Pago.Monto_Por_Cuota,
                Frecuencia_Pago = acuerdos_Pago.Frecuencia_Pago,
                Id_Creador = acuerdos_Pago.Id_Creador
            };

            await _repository.Insertar_Acuerdos_PagoAsync(acuerdos_Pago);
        }

        public async Task Editar_acuerdos_pago_async(Acuerdos_Pago_DTOs acuerdos_Pago)
        {
            var olist = new Acuerdos_Pago_DTOs
            {
                Id_Acuerdo = acuerdos_Pago.Id_Acuerdo,
                Monto_Total_Acordado = acuerdos_Pago.Monto_Total_Acordado,
                Cantidad_Cuotas = acuerdos_Pago.Cantidad_Cuotas,
                Monto_Por_Cuota = acuerdos_Pago.Monto_Por_Cuota,
                Frecuencia_Pago = acuerdos_Pago.Frecuencia_Pago,
                Id_Modificador = acuerdos_Pago.Id_Modificador
            };

            await _repository.Insertar_Acuerdos_PagoAsync(acuerdos_Pago);
        }

        public async Task<IEnumerable<Acuerdos_Pago_DTOs>> Listar_Acuerdos_Pago()
        {
            var listar = await _repository.Listar_Acuerdos_PagosAsync();
            return listar.Select(p => new Acuerdos_Pago_DTOs
            {
                Id_Acuerdo = p.Id_Acuerdo,
                Id_Multa = p.Id_Multa,
                Monto_Total_Acordado = p.Monto_Total_Acordado,
                Cantidad_Cuotas = p.Cantidad_Cuotas,
                Monto_Por_Cuota = p.Monto_Por_Cuota,
                Frecuencia_Pago = p.Frecuencia_Pago,
                Frecuencia_Descripcion = p.Frecuencia_Descripcion,
                Fecha_Creacion = p.Fecha_Creacion,
            });
        }
        public async Task<Acuerdos_Pago_DTOs> Obtener_Acuerdo_Pago_Por_Id(int id)
        {
            var lista = await _repository.Listar_Acuerdos_Pagos_IdAsync(id);

            return lista.Select(item => new Acuerdos_Pago_DTOs
            {
                Id_Acuerdo = item.Id_Acuerdo,
                Id_Multa = item.Id_Multa,
                Monto_Total_Acordado = item.Monto_Total_Acordado,
                Cantidad_Cuotas = item.Cantidad_Cuotas,
                Monto_Por_Cuota = item.Monto_Por_Cuota,
                Frecuencia_Pago = item.Frecuencia_Pago,
                Fecha_Creacion = item.Fecha_Creacion,
                Estado = item.Estado
            }).FirstOrDefault()!;
        }

        public async Task Eliminar_Acuerdo_Pago(int id, int Id_modificador)
        {
            await _repository.Eliminar_Acuerdos_PagoAsync(id, Id_modificador);
        }
    }

}

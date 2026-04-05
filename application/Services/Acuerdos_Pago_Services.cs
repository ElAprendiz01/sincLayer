using application.DTOs;
using application.Interfaces;
using System.Collections.Generic;
using System.Linq;
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

        public async Task Insertar_acuerdos_pago_async(Acuerdos_Pago_DTOs dto)
        {
            // Mapeo limpio para inserción
            var modelo = new Acuerdos_Pago_DTOs
            {
                Id_Multa = dto.Id_Multa,
                Monto_Total_Acordado = dto.Monto_Total_Acordado,
                Cantidad_Cuotas = dto.Cantidad_Cuotas,
                Monto_Por_Cuota = dto.Monto_Por_Cuota,
                Frecuencia_Pago = dto.Frecuencia_Pago,
                Id_Creador = dto.Id_Creador
            };

            await _repository.Insertar_Acuerdos_PagoAsync(modelo);
        }

        public async Task Editar_acuerdos_pago_async(Acuerdos_Pago_DTOs dto)
        {
            var modelo = new Acuerdos_Pago_DTOs
            {
                Id_Acuerdo = dto.Id_Acuerdo,
                Monto_Total_Acordado = dto.Monto_Total_Acordado,
                Cantidad_Cuotas = dto.Cantidad_Cuotas,
                Monto_Por_Cuota = dto.Monto_Por_Cuota,
                Frecuencia_Pago = dto.Frecuencia_Pago,
                Id_Modificador = dto.Id_Modificador
            };

            await _repository.Editar_Acuerdos_PagoAsync(modelo);
        }

        public async Task<IEnumerable<Acuerdos_Pago_DTOs>> Listar_Acuerdos_Pago()
        {
            var data = await _repository.Listar_Acuerdos_PagosAsync();

            // Aseguramos que el mapeo use todos los campos que el DTO ahora tiene
            return data.Select(p => new Acuerdos_Pago_DTOs
            {
                Id_Acuerdo = p.Id_Acuerdo,
                Id_Multa = p.Id_Multa,
                Monto_Total_Acordado = p.Monto_Total_Acordado,
                Cantidad_Cuotas = p.Cantidad_Cuotas,
                Monto_Por_Cuota = p.Monto_Por_Cuota,
                Frecuencia_Pago = p.Frecuencia_Pago,
                Frecuencia_Descripcion = p.Frecuencia_Descripcion, // El alias del repo
                Fecha_Creacion = p.Fecha_Creacion,
                Id_Estado = p.Id_Estado,
                Estado = p.Estado
            });
        }

        public async Task<Acuerdos_Pago_DTOs?> Obtener_Acuerdo_Pago_Por_Id(int id)
        {
            var data = await _repository.Listar_Acuerdos_Pagos_IdAsync(id);

            return data.Select(item => new Acuerdos_Pago_DTOs
            {
                Id_Acuerdo = item.Id_Acuerdo,
                Id_Multa = item.Id_Multa,
                Monto_Total_Acordado = item.Monto_Total_Acordado,
                Cantidad_Cuotas = item.Cantidad_Cuotas,
                Monto_Por_Cuota = item.Monto_Por_Cuota,
                Frecuencia_Pago = item.Frecuencia_Pago,
                Frecuencia_Descripcion = item.Frecuencia_Descripcion,
                Fecha_Creacion = item.Fecha_Creacion,
                Fecha_Modificacion = item.Fecha_Modificacion,
                Estado = item.Estado,
                Id_Estado = item.Id_Estado
            }).FirstOrDefault();
        }

        public async Task Eliminar_Acuerdo_Pago(int id, int idModificador)
        {
            await _repository.Eliminar_Acuerdos_PagoAsync(id, idModificador);
        }
    }
}
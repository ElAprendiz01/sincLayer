using application.DTOs;
using application.Interfaces;
using Domain;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace application.Services
{
    public class PagosServices
    {
        private readonly IPagoRepository _repository;

        public PagosServices(IPagoRepository repository)
        {
            _repository = repository;
        }

        public async Task<IEnumerable<PagoDTO>> Listar_pagos()
        {
            var listar = await _repository.ObtenerTodosLosPagos();
            return listar.Select(p => new PagoDTO
            {
                Id_Pago = p.Id_Pago,
                Id_Multa = p.Id_Multa,
                Id_Acuerdo = p.Id_Acuerdo != null ? p.Id_Acuerdo : null,
                Monto_Pagado = p.Monto_Pagado,
                Metodo_Pago_Nombre = p.Metodo_Pago_Nombre ?? "N/A",
                Numero_Comprobante = p.Numero_Comprobante ?? "Sin Comprobante",
                Fecha_Pago = p.Fecha_Pago,
                Id_Creador = p.Id_Creador,
                Estado_Nombre = p.Estado_Nombre ?? "Activo"
            });
        }

        public async Task<IEnumerable<PagoDTO>> FiltrarPagos(string comprobante, int idMulta)
        {
            var listar = await _repository.BuscarPagos(comprobante, idMulta);
            return listar.Select(p => new PagoDTO
            {
                Id_Pago = p.Id_Pago,
                Id_Multa = p.Id_Multa,
                Monto_Pagado = p.Monto_Pagado,
                Metodo_Pago_Nombre = p.Metodo_Pago_Nombre ?? "N/A",
                Numero_Comprobante = string.IsNullOrEmpty(p.Numero_Comprobante) ? "N/A" : p.Numero_Comprobante,
                Fecha_Pago = p.Fecha_Pago
            });
        }

        // Cambiamos a Task<string> para capturar el mensaje del SP
        public async Task<string> nuevoPago(PagoDTO opago)
        {
            var opagodom = new PagoDTO
            {
                Id_Multa = opago.Id_Multa,
                Id_Acuerdo = opago.Id_Acuerdo,
                Monto_Pagado = opago.Monto_Pagado,
                Metodo_Pago = opago.Metodo_Pago,
                Numero_Comprobante = opago.Numero_Comprobante,
                Id_Creador = opago.Id_Creador
            };
            return await _repository.RegistrarNuevoPago(opagodom);
        }

        public async Task<string> EditarPago(PagoDTO opago)
        {
            var opagodom = new PagoDTO
            {
                Id_Pago = opago.Id_Pago,
                Monto_Pagado = opago.Monto_Pagado,
                Metodo_Pago = opago.Metodo_Pago,
                Numero_Comprobante = opago.Numero_Comprobante,
                Id_Modificador = opago.Id_Modificador
            };
            return await _repository.ActualizarPagoExistente(opagodom);
        }

        public async Task<string> AnularPago(int id, int idModificador)
        {
            return await _repository.AnularPagoSistema(id, idModificador);
        }
    }
}
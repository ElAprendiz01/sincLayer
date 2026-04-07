using application.DTOs;
using application.Services;
using Microsoft.AspNetCore.Mvc;
using System.Threading.Tasks;

namespace WebApi.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class PagosController : ControllerBase
    {
        private readonly PagosServices _pagosServices;

        // Inyectamos el servicio siguiendo tu estructura de capas
        public PagosController(PagosServices pagosServices)
        {
            _pagosServices = pagosServices;
        }

        [HttpGet("Listar")]
        public async Task<IActionResult> Listar()
        {
            // Retorna la lista completa mapeada en el service
            var lista = await _pagosServices.Listar_pagos();
            return Ok(lista);
        }

        [HttpGet("Filtrar")]
        public async Task<IActionResult> Filtrar(string? comprobante, int idMulta)
        {
            // Pasamos los parámetros opcionales al buscador
            var filtro = await _pagosServices.FiltrarPagos(comprobante, idMulta);
            return Ok(filtro);
        }

        [HttpPost("Guardar")]
        public async Task<IActionResult> Guardar([FromBody] PagoDTO opago)
        {
            if (opago == null) return BadRequest(new { mensaje = "Datos de pago no recibidos" });

            // Captura el mensaje que viene del SELECT o del THROW del SP
            var respuesta = await _pagosServices.nuevoPago(opago);
            return Ok(new { mensaje = respuesta });
        }

        [HttpPut("Editar")]
        public async Task<IActionResult> Editar([FromBody] PagoDTO opago)
        {
            if (opago == null || opago.Id_Pago <= 0)
                return BadRequest(new { mensaje = "ID de pago no válido para editar" });

            // Captura el mensaje de éxito o error de validación del SQL
            var respuesta = await _pagosServices.EditarPago(opago);
            return Ok(new { mensaje = respuesta });
        }

        [HttpDelete("Anular/{id}/{idModificador}")]
        public async Task<IActionResult> Anular(int id, int idModificador)
        {
            if (id <= 0) return BadRequest(new { mensaje = "ID de pago no válido para anular" });

            // Ejecuta la anulación lógica y devuelve el mensaje del SP
            var respuesta = await _pagosServices.AnularPago(id, idModificador);
            return Ok(new { mensaje = respuesta });
        }
    }
}
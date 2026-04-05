using System;
using System.Linq;
using System.Threading.Tasks;
using application.DTOs;
using application.Services;
using Microsoft.AspNetCore.Mvc;

namespace Presentacion.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class Acuerdo_PagosController : ControllerBase
    {
        private readonly Acuerdos_Pago_Services _service;

        public Acuerdo_PagosController(Acuerdos_Pago_Services service)
        {
            _service = service;
        }

        [HttpGet("Listar")]
        public async Task<IActionResult> Listar_Acuerdo_Pagos()
        {
            try
            {
                var lista = await _service.Listar_Acuerdos_Pago();
                if (lista == null || !lista.Any())
                {
                    return NotFound(new { codigo = 404, msj = "No se encontraron acuerdos de pago." });
                }
                return Ok(new { codigo = 200, msj = "Consulta exitosa", data = lista });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { codigo = 500, msj = ex.Message });
            }
        }

        [HttpGet("listar_por_id/{id}")]
        public async Task<IActionResult> Listar_Acuerdo_Pagos_Por_Id(int id)
        {
            try
            {
                var lista = await _service.Obtener_Acuerdo_Pago_Por_Id(id);
                if (lista == null)
                {
                    return NotFound(new { codigo = 404, msj = "Acuerdo no encontrado." });
                }
                return Ok(new { codigo = 200, msj = "Consulta exitosa", data = lista });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { codigo = 500, msj = ex.Message });
            }
        }

        [HttpPost]
        public async Task<IActionResult> Ingresar_Datos_Acuerdos_Pagos([FromBody] Acuerdos_Pago_DTOs acuerdos)
        {
            try
            {
                if (!ModelState.IsValid)
                {
                    return BadRequest(new { codigo = 400, msj = "Datos no válidos" });
                }

                await _service.Insertar_acuerdos_pago_async(acuerdos);
                return Ok(new { codigo = 200, msj = "Acuerdo Ingresado Correctamente" });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { codigo = 500, msj = ex.Message });
            }
        }

        // --- MÉTODO CORREGIDO PARA ACTUALIZAR ---
        [HttpPut]
        public async Task<IActionResult> Editar_Acuerdos_Pagos([FromBody] Acuerdos_Pago_DTOs acuerdos)
        {
            try
            {
                // Validación: Se requiere al menos el ID del acuerdo y el ID del que modifica
                if (acuerdos == null || !acuerdos.Id_Acuerdo.HasValue)
                {
                    return BadRequest(new { codigo = 400, msj = "El identificador del acuerdo es obligatorio." });
                }

                await _service.Editar_acuerdos_pago_async(acuerdos);

                return Ok(new { codigo = 200, msj = "Acuerdo actualizado correctamente" });
            }
            catch (Exception ex)
            {
                // Captura errores de SQL (como los THROW del SP) y los devuelve al cliente
                return StatusCode(500, new { codigo = 500, msj = ex.Message });
            }
        }

        [HttpDelete("{id}/{idModificador}")]
        public async Task<IActionResult> Eliminar_Acuerdos_Pagos(int id, int idModificador)
        {
            try
            {
                await _service.Eliminar_Acuerdo_Pago(id, idModificador);
                return Ok(new { codigo = 200, msj = "Acuerdo eliminado correctamente" });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { codigo = 500, msj = ex.Message });
            }
        }
    }
}
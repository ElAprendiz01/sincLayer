using application.DTOs;
using application.Services;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace Presentacion.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class MultasController : ControllerBase
    {

        private readonly MultasServices _service;

        public MultasController(MultasServices service)
        {
            _service = service;
        }

        [HttpGet("listarMultasPendientes")]
        public async Task<IActionResult> ListarMultasPendientes()
        {
            try
            {
                var lista = await _service.ListarMultasPendientes();

                if (lista == null || !lista.Any())
                {
                    return NotFound(new
                    {
                        codigo = 404,
                        msj = "No se encontraron multas pendientes."
                    });
                }

                return Ok(new
                {
                    codigo = 200,
                    msj = "Consulta exitosa",
                    data = lista
                });
            }
            catch (Exception ex)
            {
                return StatusCode(500, "Internal server error: " + ex.Message);
            }
        }

        [HttpGet("listarUsuariosMultasPendientes")]
        public async Task<IActionResult> ListarUsuariosMultas()
        {
            try
            {
                var lista = await _service.ListarUSuariosConMultas();

                if (lista == null || !lista.Any())
                {
                    return NotFound(new
                    {
                        codigo = 404,
                        msj = "No se encontraron usuarios con multas pendientes."
                    });
                }

                return Ok(new
                {
                    codigo = 200,
                    msj = "Consulta exitosa",
                    data = lista
                });
            }
            catch (Exception ex)
            {
                return StatusCode(500, "Internal server error: " + ex.Message);
            }
        }

        [HttpPost("actualizarMultaAbono")]
        public async Task<IActionResult> ActualizarMultaAbono([FromBody] MultasDTOs dto)
        {
            try
            {
                if (!ModelState.IsValid)
                    return BadRequest(new { msj = "El modelo no es válido" });

                await _service.ActualizarMultaporAbono(dto);

                return StatusCode(200, "Abono registrado correctamente");
            }
            catch (Exception ex)
            {
                return StatusCode(500, "Error al registrar abono: " + ex.Message);
            }
        }

        [HttpPut("actualizarMulta/{id}")]
        public async Task<IActionResult> ActualizarMulta(int id, [FromBody] MultasDTOs dto)
        {
            try
            {
                if (!ModelState.IsValid)
                    return BadRequest(new { msj = "El modelo no es válido" });

                if (id != dto.Id_Multa)
                    return BadRequest(new { msj = "El id no coincide" });

                dto.Id_Multa = id;

                bool esAdmin = User.IsInRole("Admin");

                await _service.ActualizarMulta(dto, esAdmin);

                return NoContent();
            }
            catch (Exception ex)
            {
                return StatusCode(500, "Error al actualizar multa: " + ex.Message);
            }
        }

        [HttpDelete("eliminarMulta/{id}")]
        public async Task<IActionResult> EliminarMulta(int id, [FromQuery] int idModificador)
        {
            try
            {
                await _service.Eliinarmulta(id, idModificador);

                return NoContent();
            }
            catch (Exception ex)
            {
                return StatusCode(500, "Error al eliminar multa: " + ex.Message);
            }
        }


    }
}

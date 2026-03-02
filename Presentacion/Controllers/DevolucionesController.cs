using application.DTOs;
using application.Services;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace Presentacion.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class DevolucionesController : ControllerBase
    {

        private readonly DevolucionesServices _service;
        public DevolucionesController(DevolucionesServices service)
        {
            _service = service;
        }

        [HttpGet("Listar_Devoluciones")]
        public async Task<IActionResult> ListarDevoluciones()
        {
            try
            {
                var lista = await _service.ListarDevoluciones();

                if (lista == null || !lista.Any())
                {
                    return NotFound(new
                    {
                        codigo = 404,
                        msj = "No se encontraron devoluciones registradas."
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
                return StatusCode(500, "Internal server error" + ex.Message);
            }
        }

        [HttpGet("Listar_DevolucionesPorUsuario")]
        public async Task<IActionResult> ListarDevolucionesPorUsuario([FromQuery] int Id_Usuario_Cliente)
        {
            try
            {
                var lista = await _service.ListarDevolucionesPorUsuario(Id_Usuario_Cliente);

                if (lista == null || !lista.Any())
                {
                    return NotFound(new
                    {
                        codigo = 404,
                        msj = "No se encontraron devoluciones para el usuario especificado."
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
                return StatusCode(500, "Error al filtrar devoluciones: " + ex.Message);
            }
        }

        [HttpPost("Registrar_Devolucion")]
        public async Task<IActionResult> RegistrarDevolucion([FromBody] DevolucionesDTOs dto)
        {
            try
            {
                if (!ModelState.IsValid)
                    return BadRequest(new { msj = "El Modelo no es válido" });

                await _service.RegistrarDevolucion(dto);

                return StatusCode(201, "Devolución registrada correctamente");
            }
            catch (Exception ex)
            {
                return StatusCode(500, "internal server error" + ex.Message);
            }
        }

        [HttpPut("Actualizar_Devolucion/{id}")]
        public async Task<IActionResult> ActualizarDevolucion(int id, [FromBody] DevolucionesDTOs dto)
        {
            try
            {
                if (!ModelState.IsValid)
                    return BadRequest(new { msj = "El modelo no es válido" });

                if (id != dto.Id_Devolucion)
                    return BadRequest(new { msj = "El id no coincide" });

                dto.Id_Devolucion = id;

                bool esAdmin = User.IsInRole("Admin");

                await _service.ActualizarDevolucion(dto, esAdmin);

                return NoContent();
            }
            catch (Exception ex)
            {
                return StatusCode(500, "internal server error" + ex.Message);
            }
        }

        [HttpDelete("Eliminar_Devolucion/{id}")]
        public async Task<IActionResult> EliminarDevolucion(int id, [FromQuery] int idModificador)
        {
            await _service.EliminarDevolucion(id, idModificador);
            return NoContent();
        }

    }
}

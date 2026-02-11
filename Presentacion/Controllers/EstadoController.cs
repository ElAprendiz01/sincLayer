using application.DTOs;
using application.Services;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace Presentacion.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class EstadoController : ControllerBase
    {
        private readonly EsatdosServices _service;
        public EstadoController(EsatdosServices service)
        {
            _service = service;
        }

        [HttpGet("listarEstado")]
        public async Task<IActionResult> listarEstado()
        {
            try
            {
                var lista = await _service.ListarEstados();
                return Ok(lista);
            }
            catch (Exception ex)
            {
                return StatusCode(500, "Internal serve error" + ex.Message);
            }
        }

        [HttpPost("Nuevo_estado")]
        public async Task<IActionResult> nuevoEsatdo(EstadosDTOs dto)
        {
            try
            {
                if (!ModelState.IsValid)
                {
                    return BadRequest(new { msj = "El ,modelo no es valido" });
                }
                await _service.NuevoEstado(dto);
                return StatusCode(201, "estado agregado Correctamente");
            }
            catch (Exception ex)
            {
                return StatusCode(500, "internal server error" + ex.Message);
            }
        }

        [HttpPut("Editar/{id}")]
        public async Task<IActionResult> editarEstado(int id, [FromBody] EstadosDTOs dto)
        {
            try
            {
                if (!ModelState.IsValid)
                {
                    return BadRequest(new { msj = "el modelo no es valido" });
                }
                if (id != dto.Id_Estado)
                {
                    return BadRequest(new { msj = "el id no coincide" });
                }
                dto.Id_Estado = id;
                await _service.ActualizarEstado(dto);
                return NoContent();
            }
            catch (Exception ex)
            {
                return StatusCode(500, "internal server error" + ex.Message);
            }
        }
        [HttpGet("filtrar")]
        public async Task<IActionResult> FiltrarPorNombre([FromQuery] string nombreEstado)
        {
            try
            {
                var lista = await _service.ListarPorNombre(nombreEstado);
                return Ok(lista);
            }
            catch (Exception ex)
            {
                return StatusCode(500, "Internal server error: " + ex.Message);
            }
        }

        [HttpDelete("Eliminar/{id}")]
        public async Task<IActionResult> eliminarEstado(int id)
        {
            await _service.EliminarEstado(id);
            return NoContent();
        }
    }
}

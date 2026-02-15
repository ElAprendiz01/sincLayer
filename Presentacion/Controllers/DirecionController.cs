using application.DTOs;
using application.Services;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace Presentacion.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class DirecionController : ControllerBase
    {

        private readonly DireccionServices _service;

        public DirecionController(DireccionServices service)
        {
            _service = service;
        }


        [HttpGet("listarDireccion")]
        public async Task<IActionResult> Listar()
        {
            try
            {
                var lista = await _service.ListarDireccion();
                return Ok(lista);
            }
            catch (Exception ex)
            {
                return StatusCode(500, "Internal server error: " + ex.Message);
            }
        }


        [HttpPost("insertarDireccion")]
        public async Task<IActionResult> Nuevo([FromBody] DIreccionDTOs dto)
        {
            try
            {
                if (!ModelState.IsValid)
                    return BadRequest(new { msj = "El modelo no es válido" });

                await _service.NuevaDireccion(dto);

                return StatusCode(201, "Dirección agregado correctamente");
            }
            catch (Exception ex)
            {
                return StatusCode(500, "Error al insertar direccion: " + ex.Message);
            }
        }


        [HttpPut("EditarDireccion/{id}")]
        public async Task<IActionResult> Editar(int id, [FromBody] DIreccionDTOs dto)
        {
            try
            {
                if (!ModelState.IsValid)
                    return BadRequest(new { msj = "El modelo no es válido" });

                if (id != dto.Id_direccion)
                    return BadRequest(new { msj = "El id no coincide" });

                await _service.EditarDireccion(dto);

                return NoContent();
            }
            catch (Exception ex)
            {
                return StatusCode(500, "Error al editar direccion: " + ex.Message);
            }
        }


        [HttpDelete("DesactivarEliminarDireccion/{id}")]
        public async Task<IActionResult> Eliminar(int id, [FromQuery] int idModificador, [FromQuery] int Id_Estado)
        {
            try
            {
                await _service.EliminarDireccion(id, idModificador, Id_Estado);
                return NoContent();
            }
            catch (Exception ex)
            {
                return StatusCode(500, "Error al eliminar Dirección: " + ex.Message);
            }
        }


        [HttpGet("FiltrarDireccionIDPErsona")]
        public async Task<IActionResult> Filtrar([FromQuery] int Id_Persona)
        {
            try
            {
                var lista = await _service.ListarPorIdPersona(Id_Persona);

               if (lista == null || !lista.Any())
                {
                    return NotFound(new
                    {
                        codigo = 404,
                        msj = "No se encontraron direcciones para la persona especificada."
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
                return StatusCode(500, "Error al filtrar Dirección: " + ex.Message);
            }
        }

    }
}

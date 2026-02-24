using application.DTOs;
using application.Services;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace Presentacion.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class Contacto_Controller : ControllerBase
    {
        private readonly Contacto_Services _service;
        public Contacto_Controller(Contacto_Services service)
        {
            _service = service;
        }

        [HttpGet("Listar Contacto")]
        public async Task<IActionResult> Listar_Contacto()
        {
            try
            {
                var lista = await _service.Listar_Contacto();

                if (lista == null || !lista.Any())
                {
                    return NotFound(new
                    {
                        codigo = 404,
                        msj = "No se encontraron contactos registrados."
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

        [HttpPost("Insertar Contacto")]
        public async Task<IActionResult> NuevoContacto(ContactoDTOs dto)
        {
            try
            {
                if (!ModelState.IsValid)
                {
                    return BadRequest(new { msj = "El modelo no es válido" });
                }

                await _service.NuevoContacto(dto);

                return StatusCode(201, "Contacto agregado correctamente");
            }
            catch (Exception ex)
            {
                return StatusCode(500, "Error al insertar contacto: " + ex.Message);
            }
        }

        [HttpPut("Editar/{id}")]
        public async Task<IActionResult> EditarContacto(int id, [FromBody] ContactoDTOs dto)
        {
            try
            {
                if (!ModelState.IsValid)
                {
                    return BadRequest(new { msj = "El modelo no es válido" });
                }

                if (id != dto.Id_Contacto)
                {
                    return BadRequest(new { msj = "El id no coincide" });
                }

                dto.Id_Contacto = id;

                bool esAdmin = User.IsInRole("Admin");

                await _service.EditarContacto(dto, esAdmin);

                return NoContent();
            }
            catch (Exception ex)
            {
                return StatusCode(500, "Error al editar contacto: " + ex.Message);
            }
        }

        [HttpDelete("Eliminar/{id}")]
        public async Task<IActionResult> EliminarContacto(int id, [FromQuery] int idModificador)
        {
            try
            {
                await _service.EliminarContacto(id, idModificador);
                return NoContent();
            }
            catch (Exception ex)
            {
                return StatusCode(500, "Error al eliminar contacto: " + ex.Message);
            }
        }
    }
}
using application.DTOs;
using application.Services;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace Presentacion.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ContactoController : ControllerBase
    {
        private readonly Contacto_Services _service;
        public ContactoController(Contacto_Services service)
        {
            _service = service;
        }

        [HttpGet("ListarContacto")]
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

        [HttpPost("InsertarContacto")]
        public async Task<IActionResult> NuevoContacto([FromBody] ContactoDTOs dto)
        {
            try
            {
                if (!ModelState.IsValid)
                {
                    return BadRequest(new { msj = "El modelo no es válido" });
                }

                await _service.NuevoContacto(dto);

                // CORRECCIÓN: Enviar un objeto anónimo para que sea JSON válido
                return Ok(new { codigo = 200, msj = "Contacto agregado correctamente" });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { msj = "Error al insertar contacto: " + ex.Message });
            }
        }

        [HttpPut("Editar/{id}")]
        public async Task<IActionResult> EditarContacto(int id, [FromBody] ContactoDTOs dto)
        {
            try
            {
                if (id != dto.Id_Contacto)
                {
                    return BadRequest(new { msj = "El id no coincide" });
                }

                bool esAdmin = User.IsInRole("Admin");
                await _service.EditarContacto(dto, esAdmin);

                // CORRECCIÓN: Enviar objeto JSON
                return Ok(new { codigo = 200, msj = "Se ha editado correctamente" });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { msj = "Error al editar contacto: " + ex.Message });
            }
        }

        [HttpDelete("Eliminar/{id}")]
        public async Task<IActionResult> EliminarContacto(int id, [FromQuery] int idModificador)
        {
            try
            {
                await _service.EliminarContacto(id, idModificador);

                // CORRECCIÓN: No uses NoContent() si quieres mostrar un mensaje en el alert de React
                return Ok(new { codigo = 200, msj = "Contacto eliminado correctamente" });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { msj = "Error al eliminar contacto: " + ex.Message });
            }
        }
    }
}
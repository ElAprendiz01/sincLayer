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
                return Ok(lista);
            }
            catch (Exception ex)
            {
                return StatusCode(500, "Internal serve error" + ex.Message);
            }
        }

        [HttpPost("Insertar Contacto")]
        public async Task<IActionResult> NuevoContacto(ContactoDTOs dto)
        {
            try
            {
                if (!ModelState.IsValid)
                {
                    return BadRequest(new { msj = "El Modelo no es valido" });
                }
                await _service.NuevoContacto(dto);
                return StatusCode(201, "Contacto agregado Correctamente");
            }
            catch (Exception ex)
            {
                return StatusCode(500, "internal server error" + ex.Message);
            }
        }

        [HttpPut("Editar/{id}")]
        public async Task<IActionResult> EditarContacto(int id, [FromBody] ContactoDTOs dto)
        {
            try
            {
                if (!ModelState.IsValid)
                {
                    return BadRequest(new { msj = "el modelo no es valido" });
                }
                if (id != dto.Id_Persona)
                {
                    return BadRequest(new { msj = "el id no coincide" });
                }
                dto.Id_Persona = id;
                await _service.EditarContacto(dto);
                return NoContent();
            }
            catch (Exception ex)
            {
                return StatusCode(500, "internal server error" + ex.Message);
            }

        }

        [HttpDelete("Eliminar/{id}")]
        public async Task<IActionResult> EliminarContacto(int id)
        {
            await _service.EliminarContacto(id);
            return NoContent();
        }
    }
}

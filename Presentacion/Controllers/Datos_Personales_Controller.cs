using application.DTOs;
using application.Services;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace Presentacion.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class Datos_Personales_Controller : ControllerBase
    {
        private readonly Datos_Personales_Services _service;
        public Datos_Personales_Controller(Datos_Personales_Services service)
        {
            _service = service;
        }

        [HttpGet("Listar Datos Personales")]
        public async Task<IActionResult> Listar_Datos_Personales()
        {
            try
            {
                var lista = await _service.Listar_Datos_Personales();
                return Ok(lista);
            }
            catch (Exception ex)
            {
                return StatusCode(500, "Internal serve error" + ex.Message);
            }
        }

        [HttpPost("Insertar Datos Personales")]
        public async Task<IActionResult> NuevoDatos_Personales(Datos_Personales_DTOs dto)
        {
            try
            {
                if (!ModelState.IsValid)
                {
                    return BadRequest(new { msj = "El Modelo no es valido" });
                }
                await _service.NuevoDatos_Personales(dto);
                return StatusCode(201, "Datos personal agregado Correctamente");
            }
            catch (Exception ex)
            {
                return StatusCode(500, "internal server error" + ex.Message);
            }
        }

        [HttpPut("Editar/{id}")]
        public async Task<IActionResult> EditarDatos_Personales(int id, [FromBody] Datos_Personales_DTOs dto)
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
                await _service.EditarDatos_Personales(dto);
                return NoContent();
            }
            catch (Exception ex)
            {
                return StatusCode(500, "internal server error" + ex.Message);
            }

        }

        [HttpDelete("Eliminar/{id}")]
        public async Task<IActionResult> EliminarDatos_Personales(int id)
        {
            await _service.EliminarDatos_Personales(id);
            return NoContent();
        }

    }
}

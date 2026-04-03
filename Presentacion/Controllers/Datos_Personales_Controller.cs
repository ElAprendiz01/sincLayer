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

        [HttpGet("Listar_Datos_Personales")]
        public async Task<IActionResult> Listar_Datos_Personales()
        {
            try
            {
                var lista = await _service.Listar_Datos_Personales();
               
                if (lista == null || !lista.Any())
                {
                    return NotFound(new
                    {
                        codigo = 404,
                        msj = "No se encontraron datos perosnales de la persona especificada."
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
                return StatusCode(500, "Internal serve error" + ex.Message);
            }
        }

        [HttpPost("Insertar_Datos_Personales")]
        public async Task<IActionResult> NuevoDatos_Personales(Datos_Personales_DTOs dto)
        {
            try
            {
                if (!ModelState.IsValid)
                {
                    return BadRequest(new { msj = "El Modelo no es valido" });
                }
                await _service.NuevoDatos_Personales(dto);
                return Ok(new { codigo = 201, msj = "Datos personales agregados correctamente" });
            }
            catch (Exception ex)
            {
                return BadRequest(new { codigo = 400, msj = ex.Message });
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


                bool esAdmin = User.IsInRole("Admin");


                await _service.EditarDatos_Personales(dto, esAdmin); 
                return Ok(new { codigo = 200, msj = "Datos personales Actualizdo correctamente" });
            }
            catch (Exception ex)
            {
                return BadRequest(new { codigo = 400, msj = ex.Message });
            }

        }

        [HttpDelete("Eliminar/{id}")]
        public async Task<IActionResult> EliminarDatos_Personales(int id, [FromQuery] int idModificador)
        {
            try
            {
                await _service.EliminarDatos_Personales(id, idModificador);
                return Ok(new
                {
                    codigo = 200,
                    msj = "Datos personales eliminados exitosamente"
                });
            }
            catch (Exception ex)
            {
                // Esto captura el "La persona no existe o ya está desactivada"
                return BadRequest(new
                {
                    codigo = 400,
                    msj = ex.Message
                });
            }
        }

        [HttpGet("buscarPErsonaPorFechaNacimiento")]
        public async Task<IActionResult> Filtrar([FromQuery] string buscar)
        {
            try
            {
                var lista = await _service.Listar_Datos_PersonalesPorFecha(buscar);

                if (lista == null || !lista.Any())
                {
                    return NotFound(new
                    {
                        codigo = 404,
                        msj = "No se encontraron perosnas con ea fecha especificada."
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
                return BadRequest(new { codigo = 400, msj = ex.Message });
            }
        }
    }
}

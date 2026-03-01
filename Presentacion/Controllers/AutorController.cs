using application.DTOs;
using application.Services;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace Presentacion.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AutorController : ControllerBase
    {

        private readonly AutoresServices _service;
        public AutorController(AutoresServices service)
        {
            _service = service;
        }

        [HttpGet("ListarAutores")]
        public async Task<IActionResult> ListarAutores()
        {
            try
             {
                var lista = await _service.Listar_autores();

                if (lista == null || !lista.Any())
                {
                    return NotFound(new
                    {
                        codigo = 404,
                        msj = "No se encontraron  el autor especificado."
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

        [HttpPost("IinseratrAutor")]
        public async Task<IActionResult> NuevoAutor(AutoresDTOs dto)
        {
            try
            {
                if (!ModelState.IsValid)
                {
                    return BadRequest(new { msj = "El Modelo no es valido" });
                }
                await _service.nuevoAutor(dto);
                return StatusCode(201, "autor agregado Correctamente");
            }
            catch (Exception ex)
            {
                return StatusCode(500, "internal server error" + ex.Message);
            }
        }

        [HttpPut("Editar/{id}")]
        public async Task<IActionResult> editarfAutor(int id, [FromBody] AutoresDTOs dto)
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


                await _service.EditarAutor(dto, esAdmin);
                return NoContent();
            }
            catch (Exception ex)
            {
                return StatusCode(500, "internal server error" + ex.Message);
            }

        }

        [HttpDelete("Eliminar/{id}")]
        public async Task<IActionResult> EliminarAutor(int id, int idModificador)
        {
            await _service.EliminarAutor(id, idModificador);
            return NoContent();
        }

        [HttpGet("FiltroPorIdPersona")]
        public async Task<IActionResult> Filtrar([FromQuery] int id_persona)
        {
            try
            {
                var lista = await _service.FiltrarAutoPorIdPersoan(id_persona);

                if (lista == null || !lista.Any())
                {
                    return NotFound(new
                    {
                        codigo = 404,
                        msj = "No se encontro autor  con ea Id especificado."
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
                return StatusCode(500, "Error al filtrar DTP: " + ex.Message);
            }
        }
    }
}

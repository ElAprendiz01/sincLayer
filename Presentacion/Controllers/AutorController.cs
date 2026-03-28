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
                return Ok(new
                {
                    o_Numero = 200,
                    o_Msg = "Consulta exitosa",
                    data = lista
                });
            }
            catch (Exception ex)
            {
                
                return BadRequest(new { o_Numero = 0, o_Msg = ex.Message });
            }
        }

        [HttpPost("IinseratrAutor")]
        public async Task<IActionResult> NuevoAutor(AutoresDTOs dto)
        {
            try
            {
                if (!ModelState.IsValid)
                {
                    return BadRequest(new { o_Numero = 400, o_Msg = "El Modelo no es válido" });
                }

                await _service.nuevoAutor(dto);

                
                return Ok(new { o_Numero = 200, o_Msg = "Autor agregado correctamente" });
            }
            catch (Exception ex)
            {
                // Aquí llega el "MENSAJE DEL SP" que lanzaste con throw new Exception(mensaje)
                return BadRequest(new { o_Numero = 0, o_Msg = ex.Message });
            }
        }

        [HttpPut("Editar/{id}")]
        public async Task<IActionResult> editarfAutor(int id, [FromBody] AutoresDTOs dto)
        {
            try
            {
                if (!ModelState.IsValid)
                {
                    return BadRequest(new { o_Numero = 400, o_Msg = "El modelo no es válido" });
                }

                bool esAdmin = User.IsInRole("Admin");

                
                dto.Id_Autor = id;

                await _service.EditarAutor(dto, esAdmin);
                return Ok(new { o_Numero = 200, o_Msg = "Autor actualizado correctamente" });
            }
            catch (Exception ex)
            {
                return BadRequest(new { o_Numero = 0, o_Msg = ex.Message });
            }
        }

        [HttpDelete("Eliminar/{id}")]
        public async Task<IActionResult> EliminarAutor(int id, int idModificador)
        {
            try
            {
                await _service.EliminarAutor(id, idModificador);
                return Ok(new { o_Numero = 200, o_Msg = "Autor desactivado con éxito" });
            }
            catch (Exception ex)
            {
                // IMPORTANTE: Esto enviará el mensaje del SP: "El autor no existe o ya está desactivado"
                return BadRequest(new { o_Numero = 0, o_Msg = ex.Message });
            }
        }

        [HttpGet("FiltroPorIdPersona")]
        public async Task<IActionResult> Filtrar([FromQuery] int id_persona)
        {
            try
            {
                var lista = await _service.FiltrarAutoPorIdPersoan(id_persona);

                if (lista == null || !lista.Any())
                {
                    return NotFound(new { o_Numero = 404, o_Msg = "No se encontró el autor con ese ID Persona." });
                }

                return Ok(new
                {
                    o_Numero = 200,
                    o_Msg = "Consulta exitosa",
                    data = lista
                });
            }
            catch (Exception ex)
            {
                return BadRequest(new { o_Numero = 0, o_Msg = ex.Message });
            }
        }
    }
}
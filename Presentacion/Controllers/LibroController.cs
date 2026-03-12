using application.DTOs;
using application.Services;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace Presentacion.Controllers
{
   
        [Route("api/[controller]")]
        [ApiController]
        public class LibroController : ControllerBase
        {

            private readonly LibrosService _service;
            public LibroController(LibrosService service)
            {
                _service = service;
            }

            [HttpGet("ListarLibros")]
            public async Task<IActionResult> ListarLibros()
            {
                try
                {
                    var lista = await _service.Listar_Libros();

                    if (lista == null || !lista.Any())
                    {
                        return NotFound(new
                        {
                            codigo = 404,
                            msj = "No se encontraron  el Libro especificado."
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


            [HttpPost("InsertarLibro")]
            public async Task<IActionResult> Nuevolibro(LibrosDTO dto)
            {
                try
                {
                    if (!ModelState.IsValid)
                    {
                        return BadRequest(new { msj = "El Modelo no es valido" });
                    }
                    await _service.NuevoLibro(dto);
                    return StatusCode(201, "libro agregado Correctamente");
                }
                catch (Exception ex)
                {
                    return StatusCode(500, "internal server error" + ex.Message);
                }
            }


            [HttpPut("Editar/{id}")]
            public async Task<IActionResult> EditarLibro(int id, [FromBody] LibrosDTO dto)
            {
                try
                {
                    if (!ModelState.IsValid)
                    {
                        return BadRequest(new { msj = "el modelo no es valido" });
                    }
                    if (id != dto.Id_Libro)
                    {
                        return BadRequest(new { msj = "el id no coincide" });
                    }
                    dto.Id_Libro = id;


                    bool esAdmin = User.IsInRole("Admin");


                    await _service.EditarLibro(dto, esAdmin);
                    return NoContent();
                }
                catch (Exception ex)
                {
                    return StatusCode(500, "internal server error" + ex.Message);
                }

            }


            [HttpDelete("Eliminar/{id}")]
            public async Task<IActionResult> EliminarLibro(int id, int idModificador)
            {
                await _service.EliminarLibro(id, idModificador);
                return NoContent();
            }


            [HttpGet("FiltarporAutor")]
            public async Task<IActionResult> Filtrar([FromQuery] int Id_Autor)
            {
                try
                {
                    var lista = await _service.FiltrarLibrosPorAutor(Id_Autor);

                    if (lista == null || !lista.Any())
                    {
                        return NotFound(new
                        {
                            codigo = 404,
                            msj = "No se encontro autor  con ese Id especificado."
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

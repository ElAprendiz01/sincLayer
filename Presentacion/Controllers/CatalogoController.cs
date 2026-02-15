using application.DTOs;
using application.Services;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace Presentacion.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class CatalogoController : ControllerBase
    {
            private readonly CatalogoServices _service;

            public CatalogoController(CatalogoServices service)
            {
                _service = service;
            }

            
            [HttpGet ("listarCatalogo")]
            public async Task<IActionResult> Listar()
            {
                try
                {
                    var lista = await _service.ListarCatalogo();
                    return Ok(lista);
                }
                catch (Exception ex)
                {
                    return StatusCode(500, "Internal server error: " + ex.Message);
                }
            }

            
            [HttpPost("insertarCatalogo")]
            public async Task<IActionResult> Nuevo([FromBody] CatalogDTOs dto)
            {
                try
                {
                    if (!ModelState.IsValid)
                        return BadRequest(new { msj = "El modelo no es válido" });

                    await _service.NuevoCatalogo(dto);

                    return StatusCode(201, "Catálogo agregado correctamente");
                }
                catch (Exception ex)
                {
                    return StatusCode(500, "Error al insertar catálogo: " + ex.Message);
                }
            }

            
            [HttpPut("EditarCatalogo/{id}")]
            public async Task<IActionResult> Editar(int id, [FromBody] CatalogDTOs dto)
            {
                try
                {
                    if (!ModelState.IsValid)
                        return BadRequest(new { msj = "El modelo no es válido" });

                    if (id != dto.Id_Catalogo)
                        return BadRequest(new { msj = "El id no coincide" });

                    await _service.EditarCatalogo(dto);

                     return NoContent();
                }
                catch (Exception ex)
                {
                    return BadRequest(new { msj = ex.Message }); // con este return podriamos mostrar las exceppciones desde el sp
                   // consultarlor con el docente lovo pa ver si es permitodo 
                }
            }

            
            [HttpDelete("DesactivarEliminar/{id}")]
            public async Task<IActionResult> Eliminar(int id, [FromQuery] int idModificador )
            {
                try
                {
                        await _service.EliminarCatalogo(id, idModificador);

                        return NoContent();


            }
            catch (Exception ex)
                {
                    return StatusCode(500, "Error al eliminar catálogo: " + ex.Message);
                }
            }

         
            [HttpGet("FiltrarCatalogo_por_Nombre")]
            public async Task<IActionResult> Filtrar([FromQuery] string nombre)
            {
                try
                {
                    var lista = await _service.ListarCatalogoPornombre(nombre);
                    if (lista == null || !lista.Any())
                    {
                        return NotFound(new
                        {
                            codigo = 404,
                            msj = "No se encontro el catalogo especificado."
                        });
                    }
                    return Ok(new
                    {
                        codigo = 200,
                        msj = "Consulta exitosa",
                        data = lista
                    });
                // nota preguntar si esta validacion es aceptada 
                // nota no tengo validaciones de que si no encuentra anda ¿, entonces me retrna una lista avcia ver como validar eso de que si no lo encuentra mostrar un print

            }
            catch (Exception ex)
                {
                    return StatusCode(500, "Error al filtrar catálogo: " + ex.Message);
                }
              }
        
    }
}

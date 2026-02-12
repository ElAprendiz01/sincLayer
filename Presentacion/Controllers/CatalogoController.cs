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
                    return StatusCode(500, "Error al editar catálogo: " + ex.Message);
                }
            }

            
            [HttpDelete("DesactivarEliminar/{id}")]
            public async Task<IActionResult> Eliminar(int id, [FromQuery] int idModificador)
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
                    return Ok(lista);
                }
                catch (Exception ex)
                {
                    return StatusCode(500, "Error al filtrar catálogo: " + ex.Message);
                }
            }
        
    }
}

using application.DTOs;
using application.Services;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace Presentacion.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class PrestamosController : ControllerBase
    {
        private readonly PrestamosServices _service;
        public PrestamosController(PrestamosServices service)
        {
            _service = service;
        }

        [HttpGet("LISTAR_PRESTAMOS")]
        public async Task<IActionResult> listarPrestamos()
        {
            try
            {
                var lista = await _service.Listar_Prestamos();

                if (lista == null || !lista.Any())
                {
                    return NotFound(new
                    {
                        codigo = 404,
                        msj = "No se encontraron prestamos ."
                    });
                }
                return Ok(new
                {
                    
                    data = lista
                });
            }
            catch (Exception ex)
            {
                return StatusCode(500, "Internal serve error" + ex.Message);
            }
        }

        [HttpPost("Insertar_prestamos")]
        public async Task<IActionResult> NuevoPrestamos(PrestamosDTOs dto)
        {
            try
            {
                if (!ModelState.IsValid)
                {
                    return BadRequest(new { msj = "El Modelo no es valido" });
                }
                await _service.nuevoPrestamos(dto);
                return StatusCode(201, "prestamos agregado Correctamente");
            }
            catch (Exception ex)
            {
                return StatusCode(500, "internal server error" + ex.Message);
            }
        }

        [HttpPut("Editar/{id}")]
        public async Task<IActionResult> EditarPrestamos(int id, [FromBody] PrestamosDTOs dto)
        {
            try
            {
                if (!ModelState.IsValid)
                {
                    return BadRequest(new { msj = "el modelo no es valido" });
                }
                if (id != dto.Id_Prestamo)
                {
                    return BadRequest(new { msj = "el id no coincide" });
                }
                dto.Id_Prestamo = id;


                bool esAdmin = User.IsInRole("Admin");


                await _service.EditarPrestamos(dto, esAdmin);
                return NoContent();
            }
            catch (Exception ex)
            {
                return StatusCode(500, "internal server error" + ex.Message);
            }

        }

        [HttpDelete("Eliminar/{id}")]
        public async Task<IActionResult> EliminarDatos_Personales(int id, int idModificador)
        {
            await _service.EliminaPrestamos(id, idModificador);
            return NoContent();
        }

        [HttpGet("buscarPorIdUsuario")]
        public async Task<IActionResult> Filtrar([FromQuery] int Id_Usuario_Cliente)
        {
            try
            {
                var lista = await _service.FiltrarporIdUSuario(Id_Usuario_Cliente);

                if (lista == null || !lista.Any())
                {
                    return NotFound(new
                    {
                        codigo = 404,
                        msj = "No se encontraron prestamos con el id especificado."
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

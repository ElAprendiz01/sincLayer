using application.DTOs;
using application.Services;
using Domain;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace Presentacion.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class RolController : ControllerBase
    {
        private readonly rolservice _service;

        public RolController(rolservice service)
        {
            _service = service;
        }
        [HttpPost("Crear_rol")]
        public async Task<IActionResult> Crear([FromBody] RolDTO dto)
        {
            await _service.CrearRol(dto);
            return Ok("Rol creado correctamente");
        }

        [HttpPut("Actualizar_rol")]
        public async Task<IActionResult> Actualizar( [FromBody] RolDTO dto)
        {
            bool esAdmin = User.IsInRole("Admin");
            await _service.ActualizarRol(dto, esAdmin);
            return Ok("Rol actualizado correctamente");
        }

        [HttpDelete("eliminar rol/{id}")]
        public async Task<IActionResult> Eliminar( int idRol,[FromQuery] int idModificador)
        {
            await _service.EliminarRol(idRol, idModificador);
            return Ok("Rol eliminado correctamente");
        }//pendiendte veridicar 
    }
}

using application.DTOs;
using application.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace Presentacion.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class UsuarioController : ControllerBase
    {
        private readonly UsuarioServices _service;

        public UsuarioController(UsuarioServices service)
        {
            _service = service;
        }

        // LOGIN
        //usar el autorice cuando ya este cosntruido el cliente 
        //[Authorize]
        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] UsuarioDTOs dto)
        {
            var usuario = await _service.Login(dto);

            if (usuario == null)
                return Unauthorized("Usuario o contraseña incorrecta");

            return Ok(usuario);
        }

        // CREAR USUARIO
        [HttpPost("crear")]
        public async Task<IActionResult> CrearUsuario([FromBody] UsuarioDTOs dto)
        {
            try
            {
                await _service.CrearUsuario(dto);
                return Ok("Usuario creado correctamente");
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        // ACTUALIZAR USUARIO
        [HttpPut("actualizar")]
        public async Task<IActionResult> ActualizarUsuario([FromBody] UsuarioDTOs dto)
        {
            try
            {
                await _service.ActualizarUsuario(dto);
                return Ok("Usuario actualizado correctamente");
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        // ELIMINAR USUARIO
        [HttpDelete("eliminar")]
        public async Task<IActionResult> EliminarUsuario([FromBody] UsuarioDTOs dto)
        {
            try
            {
                await _service.EliminarUsuario(dto);
                return Ok("Usuario eliminado correctamente");
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }
    }
}

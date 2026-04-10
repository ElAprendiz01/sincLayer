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
                // Retornamos un objeto JSON para que el cliente no falle al intentar parsearlo
                return Unauthorized(new { message = "Usuario o contraseña incorrecta" });

            // Retornamos solo lo necesario, sin exponer el hash de contraseña
            return Ok(new
            {
                 usuario.Id_Usuario,
                 usuario.Usuario,
                 usuario.Rol,
                 usuario.token
            });
        }

        // CREAR USUARIO
        [HttpPost("crear")]
        public async Task<IActionResult> CrearUsuario([FromBody] UsuarioDTOs dto)
        {
            try
            {
                if (dto == null) return BadRequest("Datos no recibidos.");

                await _service.CrearUsuario(dto);
                return Ok(new { message = "Usuario creado exitosamente en SyncLayer" });
            }
            catch (Exception ex)
            {
                // Esto captura los errores del SP (ej: "El usuario ya existe")
                return BadRequest(new { error = ex.Message });
            }
        }

        // ACTUALIZAR USUARIO
        [HttpPut("actualizar")]
        public async Task<IActionResult> ActualizarUsuario([FromBody] UsuarioDTOs dto)
        {
            // 1. Validación inicial: Que el DTO no llegue nulo
            if (dto == null)
            {
                return BadRequest("Los datos del usuario son requeridos.");
            }

            // 2. Validación de ID: No se puede actualizar sin saber a quién
            if (!dto.Id_Usuario.HasValue || dto.Id_Usuario <= 0)
            {
                return BadRequest("El ID de usuario no es válido.");
            }

            try
            {
                // Llamada al servicio que ya configuramos
                await _service.ActualizarUsuario(dto);

                return Ok(new { message = "Usuario actualizado correctamente" });
            }
            catch (Exception ex)
            {
                // Aquí capturamos el "throw new Exception(mensaje)" que viene del Repositorio
                // y se lo enviamos a React para que sepas qué falló en el SQL.
                return BadRequest(new { error = ex.Message });
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

        [HttpGet("listar")]
        public async Task<IActionResult> ListarUsuarios()
        {
            // NO agregues [FromBody] ni parámetros aquí
            try
            {
                var lista = await _service.ListarUsuarios();
                return Ok(new { data = lista });
            }
            catch (Exception ex)
            {
                // Esto nos dirá en la consola de Chrome cuál es el error real si falla
                return BadRequest(new { error = ex.Message });
            }
        }
    }
}

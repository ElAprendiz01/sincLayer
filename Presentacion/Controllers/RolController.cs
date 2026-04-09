// 'using' importa dependencias necesarias para acceder a clases de otras capas o del framework.
using application.DTOs; // Acceso a los objetos de transferencia de datos (estructuras limpias).
using application.Services; // Acceso a la lógica de negocio.
using Domain; // Acceso a las entidades del núcleo del sistema.
using Microsoft.AspNetCore.Http; // Manejo de códigos de estado HTTP (200, 400, 500).
using Microsoft.AspNetCore.Mvc; // Base para crear controladores API.
using Microsoft.AspNetCore.Authorization; // Motor de seguridad para permisos y roles.

namespace Presentacion.Controllers
{
    /// <summary>
    /// Controlador para gestionar los Roles del sistema.
    /// [Route] define la URL: api/rol.
    /// [ApiController] habilita comportamientos automáticos como validación de errores 400.
    /// [Authorize] es la PRIMERA BARRERA: nadie entra sin un token válido.
    /// </summary>
    [Route("api/[controller]")]
    [ApiController]
    [Authorize]
    public class RolController : ControllerBase
    {
        // Campo privado para el servicio; 'readonly' evita que se cambie la referencia tras su creación.
        private readonly rolservice _service;

        // Inyección de Dependencias: El framework le "pasa" el servicio al controlador automáticamente.
        public RolController(rolservice service)
        {
            _service = service;
        }

        /// <summary>
        /// Crea un nuevo rol en el sistema.
        /// [HttpPost] indica que este método recibe datos (recursos nuevos).
        /// </summary>
        [HttpPost("Crear_rol")]
        // ProducesResponseType documenta para Swagger qué esperar: claridad para el frontend.
        [ProducesResponseType(StatusCodes.Status201Created)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]
        public async Task<IActionResult> Crear([FromBody] RolDTO dto)
        {
            // SEGURIDAD: Validación de nulidad. Evita que el servidor truene (NullReferenceException) si mandan basura.
            if (dto == null) return BadRequest("Los datos del rol son requeridos.");

            // SEGURIDAD: ModelState revisa si el DTO cumple con las reglas (ej: [Required] o [MaxLength]).
            // Detiene la ejecución antes de llegar a la base de datos si los datos son inválidos.
            if (!ModelState.IsValid) return BadRequest(ModelState);

            try
            {
                // 'await' libera el hilo del servidor mientras la base de datos trabaja, mejorando la eficiencia.
                await _service.CrearRol(dto);
                // Return 201: Es el estándar correcto para decir "se creó algo nuevo".
                return CreatedAtAction(nameof(Crear), new { mensaje = "Rol creado correctamente" });
            }
            catch (ArgumentException ex)
            {
                // CONTROL DE ERRORES: Si el negocio dice "este nombre ya existe", devolvemos un 400 (Error del cliente).
                return BadRequest(ex.Message);
            }
            catch (Exception ex)
            {
                // SEGURIDAD: Captura cualquier error crítico y devuelve un 500 genérico.
                // NUNCA devuelvas 'ex.ToString()' al cliente porque revelarías nombres de tablas o código interno.
                return StatusCode(500, "Ocurrió un error interno al procesar la solicitud.");
            }
        }

        /// <summary>
        /// Actualiza un rol existente. Solo accesible por Administradores.
        /// </summary>
        [HttpPut("Actualizar_rol")]
        // SEGURIDAD DE ROL: Segundo filtro. El usuario debe estar autenticado Y ser "Admin".
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> Actualizar([FromBody] RolDTO dto)
        {
            

            try
            {
                // 'User' es un objeto que contiene los datos del Token JWT.
                // IsInRole verifica los privilegios en tiempo real.
                bool esAdmin = User.IsInRole("Admin");

                await _service.ActualizarRol(dto, esAdmin);
                return Ok(new { mensaje = "Rol actualizado correctamente" });
            }
            catch (KeyNotFoundException)
            {
                // 404: Indica que el recurso que intentan editar no existe.
                return NotFound($"Perrito un error critico el el servidor CVF596, revisalo ");
            }
            catch (Exception)
            {
                return StatusCode(500, "Error al actualizar el rol.");
            }
        }

        /// <summary>
        /// Elimina un rol del sistema usando su identificador.
        /// </summary>
        [HttpDelete("Eliminar/{id}")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> EliminarRol(int id)
        {
            // SEGURIDAD: Evita ataques de fuerza bruta o inyección con IDs absurdos.
            if (id <= 0) return BadRequest("ID no válido.");

            try
            {
                // SEGURIDAD CRÍTICA: No pedimos el "idModificador" por el JSON o URL.
                // Lo sacamos del "Claim" (la identidad dentro del Token). 
                // Esto garantiza que el ID que llega al servicio es el del usuario real que se logueó.
                var idModificadorClaim = User.FindFirst("sub")?.Value;
                if (string.IsNullOrEmpty(idModificadorClaim)) return Unauthorized();

                int idModificador = int.Parse(idModificadorClaim);

                await _service.EliminarRol(id, idModificador);
                // 204 No Content: Indica éxito total pero que no hay nada más que mostrar.
                return NoContent();
            }
            catch (KeyNotFoundException)
            {
                return NotFound();
            }
            catch (Exception)
            {
                return StatusCode(500, "Error al eliminar el rol.");
            }
        }
    }
}
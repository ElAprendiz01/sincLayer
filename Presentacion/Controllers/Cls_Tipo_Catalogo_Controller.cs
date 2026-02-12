using application.DTOs;
using application.Services;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace Presentacion.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class Cls_Tipo_Catalogo_Controller : ControllerBase
    {
        private readonly Cls_Tipo_Catalogo_Services _service;
        public Cls_Tipo_Catalogo_Controller(Cls_Tipo_Catalogo_Services service)
        {
            _service = service;
        }

        [HttpGet]
        public async Task<IActionResult> ListarCls_Tipo_Catalogo()
        {
            try
            {
                var lista = await _service.ListarCls_Tipo_Catalogo();
                return Ok(lista);
            }
            catch (Exception ex)
            {
                return StatusCode(500, "Internal serve error" + ex.Message);
            }
        }

        [HttpPost("NuevoCls_Tipo_Catalogo")]
        public async Task<IActionResult> NuevoCls_Tipo_Catalogo(Tipo_Catalogo_DTOs dto)
        {
            try
            {
                if (!ModelState.IsValid)
                {
                    return BadRequest(new { msj = "El modelo no es valido" });
                }
                await _service.NuevoCls_Tipo_Catalogo(dto);
                return StatusCode(201, "Cls_Tipo_Catalogo agregado Correctamente");
            }
            catch (Exception ex)
            {
                return StatusCode(500, "internal server error" + ex.Message);
            }
        }

        [HttpPut("Editar/{id}")]
        public async Task<IActionResult> EditarCls_Tipo_Catalogo(int id, [FromBody] Tipo_Catalogo_DTOs dto)
        {
            try
            {
                if (!ModelState.IsValid)
                {
                    return BadRequest(new { msj = "el modelo no es valido" });
                }
                if (id != dto.Id_Tipo_Catalogo)
                {
                    return BadRequest(new { msj = "el id no coincide" });
                }
                dto.Id_Tipo_Catalogo = id;
                await _service.EditarCls_Tipo_Catalogo(dto);
                return NoContent();
            }
            catch (Exception ex)
            {
                return StatusCode(500, "internal server error" + ex.Message);
            }
        }

        [HttpDelete("Eliminar/{id}")]
        public async Task<IActionResult> EliminarCls_Tipo_Catalogo(int id)
        {
            await _service.EliminarCls_Tipo_Catalogo(id);
            return NoContent();
        }
    }
}

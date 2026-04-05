using System.Linq;
using System.Reflection.Metadata.Ecma335;
using System.Threading.Tasks;
using application.DTOs;
using application.Services;
using Domain;
using Microsoft.AspNetCore.Mvc;

namespace Presentacion.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class Acuerdo_PagosController : Controller
    {
        private readonly Acuerdos_Pago_Services _service;

        public Acuerdo_PagosController(Acuerdos_Pago_Services service)
        {
            _service = service;
        }

        [HttpGet("Listars")]
        public async Task<IActionResult> Listar_Acuerdo_Pagos()
        {
            try
            {
                var lista = await _service.Listar_Acuerdos_Pago();
                if (lista == null || !lista.Any())
                {
                    return NotFound(new
                    {
                        codigo = 404,
                        msj = "No se encontraron acuerdos de pago para la persona especificada."
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
                return StatusCode(500, ex.Message);
            }
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> Listar_Acuerdo_Pagos_Por_Id(int id)
        {
            try
            {
                var lista = await _service.Obtener_Acuerdo_Pago_Por_Id(id);
                if (lista == null)
                {
                    return NotFound(new
                    {
                        codigo = 404,
                        msj = "No se encontraron acuerdos de pago para la persona especificada."
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
                return StatusCode(500, ex.Message);
            }
        }

        [HttpPost]
        public async Task<IActionResult> Ingresar_Datos_Acuerdos_Pagos(Acuerdos_Pago_DTOs acuerdos)
        {
            try
            {
                if (!ModelState.IsValid)
                {
                    return StatusCode(401,"Datos no validos");
                }
                await _service.Insertar_acuerdos_pago_async(acuerdos);
                return StatusCode(200, "Acuerdo Ingresado Correctamente");
            }
            catch (Exception ex)
            {
                return StatusCode(500, ex.Message);
            }
        }

        [HttpPut]
        public async Task<IActionResult> Editar_Acuerdos_Pagos(Acuerdos_Pago_DTOs acuerdos)
        {
            try
            {
                if (!ModelState.IsValid)
                {
                    return StatusCode(401, "Datos no validos");
                }
                await _service.Editar_acuerdos_pago_async(acuerdos);
                return StatusCode(200, "Acuerdo Editado correctamente");
            }
            catch (Exception ex)
            {
                return StatusCode(500, ex.Message);
            }
        }
    }
}

using application.DTOs;
using application.Interfaces;
using Domain;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace application.Services
{
    public class Contacto_Services
    {
        private IContacto_Repository _repository;
        public Contacto_Services(IContacto_Repository repository)
        {
            _repository = repository;
        }

        //Metodo Listar
        public async Task<IEnumerable<ContactoDTOs>> Listar_Contacto()
        {
            var listar = await _repository.Listar_ContactoAsync();

            return listar.Select(p => new ContactoDTOs
            {
                Id_Contacto = p.Id_Contacto,
                Id_Persona = p.Id_Persona,
                Nombre_Persona = p.Nombre_Persona,
                Apellido = p.Apellido,
                Tipo_Contacto = p.Tipo_Contacto,
                Contacto = p.Contacto,
                Tipo_Contacto_Nombre = p.Tipo_Contacto_Nombre,
                Fecha_Creacion = p.Fecha_Creacion,
                Fecha_Modificacion = p.Fecha_Modificacion,
                Id_Creador = p.Id_Creador,
                Id_Modificador = p.Id_Modificador,
                Estado = p.Estado,
            });
        }

        //Metodo Listar Cotacto
        public async Task<IEnumerable<ContactoDTOs>> Listar_ContactoPorContacto(string Buscar)
        {
            if (string.IsNullOrWhiteSpace(Buscar))

                return Enumerable.Empty<ContactoDTOs>();

            var lista = await _repository.Listar_ContactoPorContactoAsync(Buscar);
            return lista.Select(p => new ContactoDTOs
            {
                Id_Contacto = p.Id_Contacto,
                Id_Persona = p.Id_Persona,
                Nombre_Persona = p.Nombre_Persona,
                Apellido = p.Apellido,
                Contacto = p.Contacto,
                Tipo_Contacto_Nombre = p.Tipo_Contacto_Nombre,
                Tipo_Contacto = p.Tipo_Contacto,
                Fecha_Creacion = p.Fecha_Creacion,
                Fecha_Modificacion = p.Fecha_Modificacion,
                Id_Creador = p.Id_Creador,
                Id_Modificador = p.Id_Modificador,
                Estado = p.Estado,
            });
        }

        //METODO INSERTAR
        public async Task NuevoContacto(ContactoDTOs dto)
        {
            var oContacto_Domai = new Contacto_Domai
            {
                Id_Persona = dto.Id_Persona,
                Tipo_Contacto = dto.Tipo_Contacto,
                Contacto = dto.Contacto,
                Fecha_Creacion = dto.Fecha_Creacion,
                Fecha_Modificacion = dto.Fecha_Modificacion,
                Id_Creador = dto.Id_Creador,
                Id_Modificador = dto.Id_Modificador,
                Id_Estado = dto.Id_Estado,
            };
            await _repository.NuevoContactoAsyn(oContacto_Domai);
        }

        //METODO EDITAR
        public async Task EditarContacto(ContactoDTOs dto, bool esAdmin)
        {
            if (!esAdmin)
            {
                // Usuario normal NO puede forzar recuperación
                dto.ForzarRecuperacion = false;
            }
            var oContacto_Domai = new Contacto_Domai
            {
                Id_Contacto = dto.Id_Contacto,
                Id_Persona = dto.Id_Persona,
                Tipo_Contacto = dto.Tipo_Contacto,
                Contacto = dto.Contacto,
                Fecha_Creacion = dto.Fecha_Creacion,
                Fecha_Modificacion = dto.Fecha_Modificacion,
                Id_Creador = dto.Id_Creador,
                Id_Modificador = dto.Id_Modificador,
                Id_Estado = dto.Id_Estado,
                ForzarRecuperacion = dto.ForzarRecuperacion

            };
            await _repository.EditarContactoAsync(oContacto_Domai);
        }

        //METODO ELIMINAR
        public async Task EliminarContacto(int id,int idModificador)
        {
            await _repository.EliminarContactoAsync(id,idModificador);
        }

    }
}

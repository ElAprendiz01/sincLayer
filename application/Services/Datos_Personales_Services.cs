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
    public class Datos_Personales_Services
    {
        private IDatos_Personales_Repository _repository;
        public Datos_Personales_Services(IDatos_Personales_Repository repository)
        {
            _repository = repository;
        }

        //Metodo Listar
        public async Task<IEnumerable<Datos_Personales_DTOs>> Listar_Datos_Personales()
        {
            var listar = await _repository.Listar_Datos_PersonalesAsync();

            return listar.Select(p => new Datos_Personales_DTOs
            {
                Id_Persona = p.Id_Persona,
                Genero = p.Genero,
                Primer_Nombre = p.Primer_Nombre,
                Segundo_Nombre = p.Segundo_Nombre,
                Primer_Apellido = p.Primer_Apellido,
                Segundo_Apellido = p.Segundo_Apellido,
                Fecha_Nacimiento = p.Fecha_Nacimiento,
                Tipo_DNI = p.Tipo_DNI,
                DNI = p.DNI,
                Fecha_Creacion = p.Fecha_Creacion,
                Fecha_Modificacion = p.Fecha_Modificacion,
                Id_Creador = p.Id_Creador,
                Id_Modificador = p.Id_Modificador,
                Id_Estado = p.Id_Estado

            });
        }

        //Metodo Listar por Fecha
        public async Task<IEnumerable<Datos_Personales_DTOs>> Listar_Datos_PersonalesPorFecha(string Buscar)
        {
            if (string.IsNullOrWhiteSpace(Buscar))

                return Enumerable.Empty<Datos_Personales_DTOs>();

            var lista = await _repository.Listar_Datos_PersonalesPorFechaAsync(Buscar);
            return lista.Select(p => new Datos_Personales_DTOs
            {
                Id_Persona = p.Id_Persona,
                Genero = p.Genero,
                Primer_Nombre = p.Primer_Nombre,
                Segundo_Nombre = p.Segundo_Nombre,
                Primer_Apellido = p.Primer_Apellido,
                Segundo_Apellido = p.Segundo_Apellido,
                Fecha_Nacimiento = p.Fecha_Nacimiento,
                Tipo_DNI = p.Tipo_DNI,
                DNI = p.DNI,
                Fecha_Creacion = p.Fecha_Creacion,
                Fecha_Modificacion = p.Fecha_Modificacion,
                Id_Creador = p.Id_Creador,
                Id_Modificador = p.Id_Modificador,
                Id_Estado = p.Id_Estado

            });
        }

        //METODO INSERTAR
        public async Task NuevoDatos_Personales(Datos_Personales_DTOs dto)
        {
            var oDatos_Personales = new Datos_Personales
            {
               Genero = dto.Genero,
                Primer_Nombre = dto.Primer_Nombre,
                Segundo_Nombre = dto.Segundo_Nombre,
                Primer_Apellido = dto.Primer_Apellido,
                Segundo_Apellido = dto.Segundo_Apellido,
                Fecha_Nacimiento = dto.Fecha_Nacimiento,
                Tipo_DNI = dto.Tipo_DNI,
                DNI = dto.DNI,
                Fecha_Creacion = dto.Fecha_Creacion,
                Fecha_Modificacion = dto.Fecha_Modificacion,
                Id_Creador = dto.Id_Creador,
                Id_Modificador = dto.Id_Modificador,
                Id_Estado = dto.Id_Estado


            };
            await _repository.NuevoDatos_PersonalesAsyn(oDatos_Personales);
        }

        //METODO EDITAR
        public async Task EditarDatos_Personales(Datos_Personales_DTOs dto)
        {
            var oDatos_Personales = new Datos_Personales
            {
                Id_Persona = dto.Id_Persona,
                Genero = dto.Genero,
                Primer_Nombre = dto.Primer_Nombre,
                Segundo_Nombre = dto.Segundo_Nombre,
                Primer_Apellido = dto.Primer_Apellido,
                Segundo_Apellido = dto.Segundo_Apellido,
                Fecha_Nacimiento = dto.Fecha_Nacimiento,
                Tipo_DNI = dto.Tipo_DNI,
                DNI = dto.DNI,
                Fecha_Creacion = dto.Fecha_Creacion,
                Fecha_Modificacion = dto.Fecha_Modificacion,
                Id_Creador = dto.Id_Creador,
                Id_Modificador = dto.Id_Modificador,
                Id_Estado = dto.Id_Estado

            };
            await _repository.EditarDatos_PersonalesAsync(oDatos_Personales);
        }

        //METODO ELIMINAR
        public async Task EliminarDatos_Personales(int id)
        {
            await _repository.EliminarDatos_PersonalesAsync(id);
        }

    }
}

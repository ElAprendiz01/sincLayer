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
    public class rolservice
    {
     
           private readonly IRolRepository _repo;

            public rolservice(IRolRepository repo)
            {
                _repo = repo;
            }

        // CREAR
        public async Task CrearRol(RolDTO dto)
         {
                var rolDomain = new RolesDomain
                {
                    Nombre = dto.Nombre,
                    Id_Creador = dto.Id_Creador,
                    Id_Estado = dto.Id_Estado
                };

                await _repo.CrearRolAsync(rolDomain);
         }

            // ACTUALIZAR
            public async Task ActualizarRol(RolDTO dto, bool esAdmin)
            {
                if (!esAdmin)
                    dto.ForzarRecuperacion = false;

                var rolDomain = new RolesDomain
                {
                    Id_Rol = dto.Id_Rol,
                    Nombre = dto.Nombre,
                    Id_Modificador = dto.Id_Modificador,
                    Id_Estado = dto.Id_Estado,
                    ForzarRecuperacion = dto.ForzarRecuperacion
                };

                await _repo.ActualizarRolAsync(rolDomain);
            }

            // ELIMINAR
            public async Task EliminarRol(int idRol, int idModificador)
            {
                await _repo.EliminarRolAsync(idRol, idModificador);
            }
        
    }
}


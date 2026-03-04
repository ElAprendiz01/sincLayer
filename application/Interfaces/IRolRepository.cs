using Domain;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace application.Interfaces
{
    public interface IRolRepository
    {
      
            Task CrearRolAsync(RolesDomain rol);
            Task ActualizarRolAsync(RolesDomain rol);
            Task EliminarRolAsync(int idRol, int idModificador);
        
    }
}

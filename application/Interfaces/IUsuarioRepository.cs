using Domain;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace application.Interfaces
{
    public interface IUsuarioRepository
    {
        Task<UsuarioDomain?> ObtenerUsuarioAsync(string usuario);

        Task ActualizarRolAsync(RolesDomain rol, bool forzarRecuperacion);
        Task InsertarRol(RolesDomain rol, bool forzarRecuperacion);
        Task EliminarRolAsync(int idRol, int idModificador);
    }
}

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
        Task CrearUsuarioAsync(UsuarioDomain usuario);

        Task ActualizarUsuarioAsync(UsuarioDomain usuario);

        Task EliminarUsuarioAsync(int? idUsuario, int idModificador);

        Task<UsuarioDomain?> ObtenerUsuarioAsync(string usuario);
    }
}

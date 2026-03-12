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
    public class LoginServices
    {
        private readonly IUsuarioRepository _repository;

        public LoginServices(IUsuarioRepository repository)
        {
            _repository = repository;
        }

        public async Task<UsuarioDomain?> AutenticarUsuario(UsuarioDTOs dto)
        {
            // Buscar usuario en BD
            var usuario = await _repository.ObtenerUsuarioAsync(dto.Usuario);

            if (usuario == null)
                return null;

            // Validar contraseña (hash)
            bool passwordValida = BCrypt.Net.BCrypt.Verify(dto.Contraseña, usuario.Contraseña);

            if (!passwordValida)
                return null;

            return usuario;
        }
    }
}

using application.DTOs;
using application.Interfaces;
using Domain;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using Microsoft.IdentityModel.Tokens;
using System.Text;
using System.Threading.Tasks;
using BCrypt.Net;
using Microsoft.Extensions.Configuration;
namespace application.Services
{
    public class UsuarioServices
    {
        private readonly IUsuarioRepository _repository;
        private readonly IConfiguration _config;
        public UsuarioServices(IUsuarioRepository repository, IConfiguration config)
        {
            _repository = repository;
            _config = config;

        }

        public async Task CrearUsuario(UsuarioDTOs dto)
        {
            var usuario = new UsuarioDomain
            {
                Usuario = dto.Usuario,
                PasswordHash = BCrypt.Net.BCrypt.HashPassword(dto.Contraseña),
                Id_Persona = dto.Id_Persona,
                Id_Rol = dto.Id_Rol,
                Id_Creador = dto.Id_Creador
            };

            await _repository.CrearUsuarioAsync(usuario);
        }

        public async Task<UsuarioDomain?> Login(UsuarioDTOs dto)
        {
            var usuario = await _repository.ObtenerUsuarioAsync(dto.Usuario);

            if (usuario == null)
                return null;

            bool passwordValida =
                BCrypt.Net.BCrypt.Verify(dto.Contraseña, usuario.PasswordHash);

            if (!passwordValida)
                return null;

            var token = GenerarToken(usuario);

            usuario.token = GenerarToken(usuario);
            return usuario;
        }

        public async Task ActualizarUsuario(UsuarioDTOs dto)
        {
            var usuario = new UsuarioDomain
            {
                Id_Usuario = dto.Id_Usuario,
                Id_Rol = dto.Id_Rol,
                Id_Estado = dto.Id_Estado,
                Id_Modificador = dto.Id_Modificador
            };

            await _repository.ActualizarUsuarioAsync(usuario);
        }

        public async Task EliminarUsuario(UsuarioDTOs dto)
        {
            await _repository.EliminarUsuarioAsync(dto.Id_Usuario, dto.Id_Modificador.Value);
        }
        public string GenerarToken(UsuarioDomain usuario)
        {
            var claims = new[]
            {
            new Claim(ClaimTypes.Name, usuario.Usuario),
            new Claim(ClaimTypes.Role, usuario.Rol),
            new Claim("IdUsuario", usuario.Id_Usuario.ToString())
             };

            var key = new SymmetricSecurityKey(
                Encoding.UTF8.GetBytes(_config["Jwt:Key"])
            );

            var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

            var token = new JwtSecurityToken(
                issuer: _config["Jwt:Issuer"],
                audience: _config["Jwt:Audience"],
                claims: claims,
                expires: DateTime.Now.AddMinutes(60),
                signingCredentials: creds
            );

            return new JwtSecurityTokenHandler().WriteToken(token);
        }

    }
}

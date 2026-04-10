using application.Interfaces;
using Domain;
using infrastructure.DB;
using Microsoft.Data.SqlClient;
using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace infrastructure.Repository
{
    public  class UsarioRepositoy: IUsuarioRepository
    {
        private readonly DBconexionfactory _dbConnectionFactory;

        public UsarioRepositoy(DBconexionfactory dbConnectionFactory)
        {
            _dbConnectionFactory = dbConnectionFactory;
        }

        // LOGIN
        public async Task<UsuarioDomain?> ObtenerUsuarioAsync(string usuario)
        {
            using var con = _dbConnectionFactory.CreateConnection();
            await con.OpenAsync();

            using (SqlCommand cmd = new SqlCommand("Sp_ObtenerUsuario", con))
            {
                cmd.CommandType = CommandType.StoredProcedure;

                cmd.Parameters.Add(new SqlParameter("@Usuario", usuario));

                using (SqlDataReader dr = await cmd.ExecuteReaderAsync())
                {
                    if (await dr.ReadAsync())
                    {
                        return new UsuarioDomain
                        {
                            Id_Usuario = Convert.ToInt32(dr["Id_Usuario"]),
                            Usuario = dr["Usuario"].ToString(),
                            PasswordHash = dr["Contraseña"].ToString(),
                            Rol = dr["Rol"].ToString()
                        };
                    }
                }
            }

            return null;
        }

        // CREAR USUARIO
        // --- MÉTODO PARA AGREGAR (CREAR) USUARIO ---
        public async Task CrearUsuarioAsync(UsuarioDomain usuario)
        {
            using var con = _dbConnectionFactory.CreateConnection();
            await con.OpenAsync();

            using (SqlCommand cmd = new SqlCommand("Sp_CrearUsuario", con))
            {
                cmd.CommandType = CommandType.StoredProcedure;

                // Parámetros de entrada enviados desde el Service/DTO
                cmd.Parameters.Add(new SqlParameter("@Usuario", usuario.Usuario));
                cmd.Parameters.Add(new SqlParameter("@PasswordHash", usuario.PasswordHash));
                cmd.Parameters.Add(new SqlParameter("@Id_Persona", usuario.Id_Persona)); // Vinculación obligatoria
                cmd.Parameters.Add(new SqlParameter("@Id_Rol", usuario.Id_Rol));
                cmd.Parameters.Add(new SqlParameter("@Id_Creador", usuario.Id_Creador));

                // Parámetros de salida para capturar la respuesta del SP
                var oNumero = new SqlParameter("@O_Numero", SqlDbType.Int)
                {
                    Direction = ParameterDirection.Output
                };

                var oMsg = new SqlParameter("@O_Msg", SqlDbType.NVarChar, 255)
                {
                    Direction = ParameterDirection.Output
                };

                cmd.Parameters.Add(oNumero);
                cmd.Parameters.Add(oMsg);

                // Ejecución asíncrona
                await cmd.ExecuteNonQueryAsync();

                // Validación de la respuesta del procedimiento
                int codigo = (int)oNumero.Value;
                string mensaje = oMsg.Value?.ToString() ?? "Error desconocido en el servidor";

                // Si el SP devuelve -1 (u otro código de error), lanzamos la excepción con el mensaje de SQL
                if (codigo <= 0)
                    throw new Exception(mensaje);
            }
        }

        // ACTUALIZAR USUARIO
        public async Task ActualizarUsuarioAsync(UsuarioDomain usuario)
        {
            using var con = _dbConnectionFactory.CreateConnection();
            await con.OpenAsync();

            using (SqlCommand cmd = new SqlCommand("SpActualizarUsuario", con))
            {
                cmd.CommandType = CommandType.StoredProcedure;

                // Parámetros de entrada
                cmd.Parameters.Add(new SqlParameter("@Id_Usuario", usuario.Id_Usuario));
                cmd.Parameters.Add(new SqlParameter("@Id_Rol", (object?)usuario.Id_Rol ?? DBNull.Value));
                cmd.Parameters.Add(new SqlParameter("@Id_Modificador", usuario.Id_Modificador ?? 1)); // 1 como fallback
                cmd.Parameters.Add(new SqlParameter("@Id_Estado", (object?)usuario.Id_Estado ?? DBNull.Value));
                cmd.Parameters.Add(new SqlParameter("@ForzarRecuperacion", usuario.ForzarRecuperacion ?? false));
                cmd.Parameters.AddWithValue("@Contrasena", (object?)usuario.PasswordHash ?? DBNull.Value);

                // Parámetros de salida
                var oNumero = new SqlParameter("@O_Numero", SqlDbType.Int) { Direction = ParameterDirection.Output };
                var oMsg = new SqlParameter("@O_Msg", SqlDbType.NVarChar, 255) { Direction = ParameterDirection.Output };

                cmd.Parameters.Add(oNumero);
                cmd.Parameters.Add(oMsg);

                await cmd.ExecuteNonQueryAsync();

                int codigo = (int)oNumero.Value;
                string mensaje = oMsg.Value?.ToString() ?? "Error desconocido";

                if (codigo <= 0)
                    throw new Exception(mensaje);
            }
        }

        // ELIMINAR USUARIO (DESACTIVAR)
        public async Task EliminarUsuarioAsync(int? idUsuario, int idModificador)
        {
            using var con = _dbConnectionFactory.CreateConnection();
            await con.OpenAsync();

            using (SqlCommand cmd = new SqlCommand("SpActualizarUsuario", con))
            {
                cmd.CommandType = CommandType.StoredProcedure;

                cmd.Parameters.Add(new SqlParameter("@Id_Usuario", idUsuario));
                cmd.Parameters.Add(new SqlParameter("@Id_Modificador", idModificador));
                cmd.Parameters.Add(new SqlParameter("@Id_Estado", 4));
                cmd.Parameters.Add(new SqlParameter("@ForzarRecuperacion", 0));

                var oNumero = new SqlParameter("@O_Numero", SqlDbType.Int)
                { Direction = ParameterDirection.Output };

                var oMsg = new SqlParameter("@O_Msg", SqlDbType.VarChar, 255)
                { Direction = ParameterDirection.Output };

                cmd.Parameters.Add(oNumero);
                cmd.Parameters.Add(oMsg);

                await cmd.ExecuteNonQueryAsync();

                int codigo = (int)oNumero.Value;
                string mensaje = oMsg.Value.ToString();

                if (codigo <= 0)
                    throw new Exception(mensaje);
            }
        }

        public async Task<IEnumerable<UsuarioDomain>> ListarUsuariosAsync()
        {
            var lista = new List<UsuarioDomain>();
            using var con = _dbConnectionFactory.CreateConnection();
            await con.OpenAsync();

            using (SqlCommand cmd = new SqlCommand("Sp_ListarUsuarios", con))
            {
                cmd.CommandType = CommandType.StoredProcedure;

                using (SqlDataReader dr = await cmd.ExecuteReaderAsync())
                {
                    while (await dr.ReadAsync())
                    {
                        lista.Add(new UsuarioDomain
                        {
                            Id_Usuario = Convert.ToInt32(dr["Id_Usuario"]),
                            Usuario = dr["Usuario"].ToString(),
                            Rol = dr["Rol"].ToString(),
                            Id_Estado = Convert.ToInt32(dr["Id_Estado"])
                        });
                    }
                }
            }
            return lista;
        }
    }
}

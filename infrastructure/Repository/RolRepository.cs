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
    public class RolRepository : IRolRepository
    {
      
            private readonly DBconexionfactory _factory;

            public RolRepository(DBconexionfactory factory)
            {
                _factory = factory;
            }

        public async Task ActualizarRolAsync(RolesDomain rol)
        {
            using var connection = _factory.CreateConnection();
            await connection.OpenAsync();

            using var cmd = new SqlCommand("SpActualizarRol", connection);
            cmd.CommandType = CommandType.StoredProcedure;

            cmd.Parameters.Add(new SqlParameter("@Id_Rol", rol.Id_Rol));
            cmd.Parameters.Add(new SqlParameter("@Nombre",
                rol.Nombre ?? (object)DBNull.Value));
           
            cmd.Parameters.Add(new SqlParameter("@Id_Modificador",
                rol.Id_Modificador ?? (object)DBNull.Value));

            cmd.Parameters.AddWithValue("@ForzarRecuperacion", (object?)rol.ForzarRecuperacion ?? DBNull.Value);
            var oNumero = new SqlParameter("@O_Numero", SqlDbType.Int)
            { Direction = ParameterDirection.Output };

            var oMsg = new SqlParameter("@O_Msg", SqlDbType.VarChar, 255)
            { Direction = ParameterDirection.Output };

            cmd.Parameters.Add(oNumero);
            cmd.Parameters.Add(oMsg);

            await cmd.ExecuteNonQueryAsync();

            if ((int)oNumero.Value <= 0)
                throw new Exception(oMsg.Value?.ToString());
        }

        public async Task CrearRolAsync(RolesDomain rol)
            {
                using var con = _factory.CreateConnection();
                await con.OpenAsync();

                using var cmd = new SqlCommand("Sp_CrearRol", con);
                cmd.CommandType = CommandType.StoredProcedure;

                cmd.Parameters.Add(new SqlParameter("@Nombre", rol.Nombre));
                cmd.Parameters.Add(new SqlParameter("@Id_Creador", rol.Id_Creador));

                var oNumero = new SqlParameter("@O_Numero", SqlDbType.Int)
                { Direction = ParameterDirection.Output };

                var oMsg = new SqlParameter("@O_Msg", SqlDbType.VarChar, 255)
                { Direction = ParameterDirection.Output };

                cmd.Parameters.Add(oNumero);
                cmd.Parameters.Add(oMsg);

                await cmd.ExecuteNonQueryAsync();

                if ((int)oNumero.Value <= 0)
                    throw new Exception(oMsg.Value.ToString());
            }

        public async Task EliminarRolAsync(int idRol, int idModificador)
        {
            using var connection = _factory.CreateConnection();
            await connection.OpenAsync();

            using var cmd = new SqlCommand("Sp_EliminarRol", connection);
            cmd.CommandType = CommandType.StoredProcedure;

            cmd.Parameters.Add(new SqlParameter("@Id_Rol", idRol));
            cmd.Parameters.Add(new SqlParameter("@Id_Modificador", idModificador));

            var oNumero = new SqlParameter("@O_Numero", SqlDbType.Int)
            { Direction = ParameterDirection.Output };

            var oMsg = new SqlParameter("@O_Msg", SqlDbType.VarChar, 255)
            { Direction = ParameterDirection.Output };

            cmd.Parameters.Add(oNumero);
            cmd.Parameters.Add(oMsg);

            await cmd.ExecuteNonQueryAsync();

            if ((int)oNumero.Value <= 0)
                throw new Exception(oMsg.Value?.ToString());
        }
    }
}

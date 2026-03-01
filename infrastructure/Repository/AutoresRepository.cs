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
using static System.Runtime.InteropServices.JavaScript.JSType;

namespace infrastructure.Repository
{
    public class AutoresRepository : IautoresRepository
    {
        private readonly DBconexionfactory _dBConectionFactory;
        public AutoresRepository(DBconexionfactory dBConectionFactory)
        {
            _dBConectionFactory = dBConectionFactory;
        }
       

  

        public async Task<IEnumerable<AutoresDomain>> Listar_AutoresAsync()
        {
            var olist = new List<AutoresDomain>();

            using var con = _dBConectionFactory.CreateConnection();
            await con.OpenAsync();

            using (SqlCommand cmd = new SqlCommand("SpListarAutores", con))
            {
                cmd.CommandType = CommandType.StoredProcedure;

                using (SqlDataReader dr = await cmd.ExecuteReaderAsync())
                {
                    while (await dr.ReadAsync())
                    {
                        olist.Add(new AutoresDomain
                        {
                            Id_Autor = Convert.ToInt32(dr["Id_Autor"]),
                            Id_Persona = Convert.ToInt32(dr["Id_Persona"]),

                            Nombre_Persona = dr["Nombre_Persona"] == DBNull.Value ? null : dr["Nombre_Persona"].ToString(),
                            Apellido = dr["Apellido"] == DBNull.Value ? null : dr["Apellido"].ToString(),
                            Fecha_Creacion = Convert.ToDateTime(dr["Fecha_Creacion"]),
                            Fecha_Modificacion = dr["Fecha_Modificacion"] == DBNull.Value ? null : Convert.ToDateTime(dr["Fecha_Modificacion"]),
                            Id_Creador = dr["Id_Creador"] == DBNull.Value ? 0 : Convert.ToInt32(dr["Id_Creador"]),
                            Id_Modificador = dr["Id_Modificador"] == DBNull.Value ? null : Convert.ToInt32(dr["Id_Modificador"]),
                            Estado = dr["Estado"] == DBNull.Value ? null : dr["Estado"].ToString()
                        });
                    }
                }
            }

            return olist;
        }

        public async  Task<IEnumerable<AutoresDomain>> Listar_autores_por_id_personaAsync(int id_persona)
        {

            var olist = new List<AutoresDomain>();

            using var con = _dBConectionFactory.CreateConnection();
            await con.OpenAsync();

            using (SqlCommand cmd = new SqlCommand("SpFiltrarAutoresPorPersonaActivos", con))
            {
                cmd.CommandType = CommandType.StoredProcedure;

                cmd.Parameters.Add(new SqlParameter("@Id_Persona", id_persona));

                using (SqlDataReader dr = await cmd.ExecuteReaderAsync())
                {
                    while (await dr.ReadAsync())
                    {
                        olist.Add(new AutoresDomain
                        {
                            Id_Autor = Convert.ToInt32(dr["Id_Autor"]),
                            Id_Persona = Convert.ToInt32(dr["Id_Persona"]),

                            Nombre_Persona = dr["Nombre_Persona"] == DBNull.Value ? null : dr["Nombre_Persona"].ToString(),
                            Apellido = dr["Apellido"] == DBNull.Value ? null : dr["Apellido"].ToString(),
                            Fecha_Creacion = Convert.ToDateTime(dr["Fecha_Creacion"]),
                            Fecha_Modificacion = dr["Fecha_Modificacion"] == DBNull.Value ? null : Convert.ToDateTime(dr["Fecha_Modificacion"]),
                            Id_Creador = dr["Id_Creador"] == DBNull.Value ? 0 : Convert.ToInt32(dr["Id_Creador"]),
                            Id_Modificador = dr["Id_Modificador"] == DBNull.Value ? null : Convert.ToInt32(dr["Id_Modificador"]),
                            Estado = dr["Estado"] == DBNull.Value ? null : dr["Estado"].ToString()
                        });
                    }
                }
            }

            return olist;
        }

        public async  Task NuevoAutoresAsyn(AutoresDomain oautor)
        {

            using var con = _dBConectionFactory.CreateConnection();
            await con.OpenAsync();
            using var cmd = new SqlCommand("SpInsertarAutor", con);
            {
                cmd.CommandType = CommandType.StoredProcedure;
            
                cmd.Parameters.Add(new SqlParameter("@Id_Persona", oautor.Id_Persona));
                cmd.Parameters.Add(new SqlParameter("@Id_Creador", (object?)oautor.Id_Creador ?? DBNull.Value));
                cmd.Parameters.Add(new SqlParameter("@Id_Estado", (object?)oautor.Id_Estado ?? DBNull.Value));


                var oNumero = new SqlParameter("@O_Numero", SqlDbType.Int)
                { Direction = ParameterDirection.Output };
                var oMsg = new SqlParameter("@O_Msg", SqlDbType.VarChar, 255)
                { Direction = ParameterDirection.Output };

                cmd.Parameters.Add(oNumero);
                cmd.Parameters.Add(oMsg);

                await cmd.ExecuteNonQueryAsync();

                // Captura de errores del SP
                int codigo = (int)oNumero.Value;
                string mensaje = oMsg.Value.ToString();

                if (codigo <= 0)
                    throw new Exception(mensaje);

            }

        }

        public async Task EditarautoresAsync(AutoresDomain oautor)
        {
            using var con = _dBConectionFactory.CreateConnection();
            await con.OpenAsync();
            using var cmd = new SqlCommand("SpActualizarAutor", con);
            {
                cmd.CommandType = CommandType.StoredProcedure;

                cmd.Parameters.Add(new SqlParameter("@Id_Autor", oautor.Id_Autor));
                cmd.Parameters.Add(new SqlParameter("@Id_Modificador", (object?)oautor.Id_Modificador ?? DBNull.Value));
                cmd.Parameters.Add(new SqlParameter("@Id_Estado", (object?)oautor.Id_Estado ?? DBNull.Value));


                var oNumero = new SqlParameter("@O_Numero", SqlDbType.Int)
                { Direction = ParameterDirection.Output };
                var oMsg = new SqlParameter("@O_Msg", SqlDbType.VarChar, 255)
                { Direction = ParameterDirection.Output };

                cmd.Parameters.Add(oNumero);
                cmd.Parameters.Add(oMsg);

                await cmd.ExecuteNonQueryAsync();

                // Captura de errores del SP
                int codigo = (int)oNumero.Value;
                string mensaje = oMsg.Value.ToString();

                if (codigo <= 0)
                    throw new Exception(mensaje);

            }
        }

        public async  Task EliminarAutoresAsync(int id, int idModificador)
        {

            using var con = _dBConectionFactory.CreateConnection();
            await con.OpenAsync();
            using var cmd = new SqlCommand("SpDesactivarAutorAutomatico", con);
            {
                cmd.CommandType = CommandType.StoredProcedure;
                cmd.Parameters.Add(new SqlParameter("@Id_Autor", id));
                cmd.Parameters.Add(new SqlParameter("@Id_Modificador", idModificador));


                var oNumero = new SqlParameter("@O_Numero", SqlDbType.Int)
                { Direction = ParameterDirection.Output };
                var oMsg = new SqlParameter("@O_Msg", SqlDbType.VarChar, 255)
                { Direction = ParameterDirection.Output };
                cmd.Parameters.Add(oNumero);
                cmd.Parameters.Add(oMsg);
                await cmd.ExecuteNonQueryAsync();
                // Captura de errores del SP
                int codigo = (int)oNumero.Value;
                string mensaje = oMsg.Value.ToString();
                if (codigo <= 0)
                    throw new Exception(mensaje);
            }
        }
    }
}

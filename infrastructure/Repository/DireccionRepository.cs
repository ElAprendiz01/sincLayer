using application.Interfaces;
using Domain;
using infrastructure.DB;
using Microsoft.Data.SqlClient;
using Microsoft.IdentityModel.Tokens;
using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace infrastructure.Repository
{
    public class DireccionRepository : IDireccionRepository
    {
        private readonly DBconexionfactory _dBConectionFactory;
        public DireccionRepository(DBconexionfactory dBConectionFactory)
        {
            _dBConectionFactory = dBConectionFactory;
        }
        public async Task EditarDireccionAsync(Direccion_Dom oDireccion_Dom)
        {
            using var con= _dBConectionFactory.CreateConnection();
            await con.OpenAsync();
            using var cmd = new SqlCommand("SpActualizarDireccion", con);
            {
                cmd.CommandType = CommandType.StoredProcedure;

                cmd.Parameters.Add(new SqlParameter("Id_direccion", oDireccion_Dom.Id_direccion));
                cmd.Parameters.Add(new SqlParameter("@Ciudad", (object?)oDireccion_Dom.Ciudad ?? DBNull.Value));
                cmd.Parameters.Add(new SqlParameter("@Barrio", (object?)oDireccion_Dom.Barrio ?? DBNull.Value));
                cmd.Parameters.Add(new SqlParameter("@Calle", (object?)oDireccion_Dom.Calle ?? DBNull.Value));
                cmd.Parameters.Add(new SqlParameter("@Id_Modificador", (object?)oDireccion_Dom.Id_Modificador ?? DBNull.Value));
                cmd.Parameters.Add(new SqlParameter("@Id_Estado", (object?)oDireccion_Dom.Id_Estado ?? DBNull.Value));


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

        public async  Task EliminarDireccionAsync(int id, int idModificador, int Id_Estado)
        {
            using var con = _dBConectionFactory.CreateConnection();
            await con.OpenAsync();
            using var cmd = new SqlCommand("SpDesactivarEliinarDireccion", con);
            {
                cmd.CommandType = CommandType.StoredProcedure;
                cmd.Parameters.Add(new SqlParameter("@Id_direccion", id));
                cmd.Parameters.Add(new SqlParameter("@Id_Modificador", idModificador));
                cmd.Parameters.Add(new SqlParameter("@Id_Estado", Id_Estado));


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

        public async Task<IEnumerable<Direccion_Dom>> Listar_DireccionAsync()
        {
            var olist = new List<Direccion_Dom>();

            using var con = _dBConectionFactory.CreateConnection();
            await con.OpenAsync();
            using var cmd = new SqlCommand("spListardireccines", con);
            {
                cmd.CommandType = CommandType.StoredProcedure;

                using (SqlDataReader dr = await cmd.ExecuteReaderAsync())
                {
                    while (await dr.ReadAsync())
                    {
                        olist.Add(new Direccion_Dom
                        {
                            Id_Persona = dr.GetInt32(dr.GetOrdinal("Id_Persona")),
                            nombre_persona = dr.GetString(dr.GetOrdinal("nombre_persona")),
                            Apellido = dr.GetString(dr.GetOrdinal("Apellido")),
                            Id_direccion = dr.GetInt32(dr.GetOrdinal("Id_direccion")),
                            Ciudad = dr.IsDBNull(dr.GetOrdinal("Ciudad")) ? null : dr.GetString(dr.GetOrdinal("Ciudad")),
                            Barrio = dr.IsDBNull(dr.GetOrdinal("Barrio")) ? null : dr.GetString(dr.GetOrdinal("Barrio")),
                            Calle = dr.IsDBNull(dr.GetOrdinal("Calle")) ? null : dr.GetString(dr.GetOrdinal("Calle")),
                            Fecha_Creacion = dr.GetDateTime(dr.GetOrdinal("Fecha_Creacion")),
                            Fecha_Modificacion = dr.IsDBNull(dr.GetOrdinal("Fecha_Modificacion")) ? null : dr.GetDateTime(dr.GetOrdinal("Fecha_Modificacion")),
                            Id_Creador = dr.IsDBNull(dr.GetOrdinal("Id_Creador")) ? null : dr.GetInt32(dr.GetOrdinal("Id_Creador")),
                            Id_Modificador = dr.IsDBNull(dr.GetOrdinal("Id_Modificador")) ? null : dr.GetInt32(dr.GetOrdinal("Id_Modificador")),
                            Id_Estado = dr.GetInt32(dr.GetOrdinal("Id_Estado"))
                        });

                    }
                }
                return olist;
            }

        }

        public async  Task<IEnumerable<Direccion_Dom>> Listar_DireccionPorIdPersonaAsync(int Id_Persona)
        {
            var olist = new List<Direccion_Dom>();

            using var con = _dBConectionFactory.CreateConnection();
            await con.OpenAsync();
            using var cmd = new SqlCommand("SpFiltrarDireccionesPorPersona", con);
            {
                cmd.CommandType = CommandType.StoredProcedure;

                cmd.Parameters.Add(new SqlParameter("@Id_Persona", Id_Persona));
                using (SqlDataReader dr = await cmd.ExecuteReaderAsync())
                {
                    while (await dr.ReadAsync())
                    {
                        olist.Add(new Direccion_Dom
                        {
                            Id_Persona = dr.GetInt32(dr.GetOrdinal("Id_Persona")),
                            nombre_persona = dr.GetString(dr.GetOrdinal("nombre_persona")),
                            Apellido = dr.GetString(dr.GetOrdinal("Apellido")),
                            Id_direccion = dr.GetInt32(dr.GetOrdinal("Id_direccion")),
                            Ciudad = dr.IsDBNull(dr.GetOrdinal("Ciudad")) ? null : dr.GetString(dr.GetOrdinal("Ciudad")),
                            Barrio = dr.IsDBNull(dr.GetOrdinal("Barrio")) ? null : dr.GetString(dr.GetOrdinal("Barrio")),
                            Calle = dr.IsDBNull(dr.GetOrdinal("Calle")) ? null : dr.GetString(dr.GetOrdinal("Calle")),
                            Fecha_Creacion = dr.GetDateTime(dr.GetOrdinal("Fecha_Creacion")),
                            Fecha_Modificacion = dr.IsDBNull(dr.GetOrdinal("Fecha_Modificacion")) ? null : dr.GetDateTime(dr.GetOrdinal("Fecha_Modificacion")),
                            Id_Creador = dr.IsDBNull(dr.GetOrdinal("Id_Creador")) ? null : dr.GetInt32(dr.GetOrdinal("Id_Creador")),
                            Id_Modificador = dr.IsDBNull(dr.GetOrdinal("Id_Modificador")) ? null : dr.GetInt32(dr.GetOrdinal("Id_Modificador")),
                            Id_Estado = dr.GetInt32(dr.GetOrdinal("Id_Estado"))
                        });

                    }
                }
                return olist;
            }
        }

        public async Task NuevaDireccionAsyn(Direccion_Dom oDireccion_Dom)
        {
            using var con = _dBConectionFactory.CreateConnection();
            await con.OpenAsync();
            using var cmd = new SqlCommand("SpInsertarDireccion", con);
            {
                cmd.CommandType = CommandType.StoredProcedure;

                cmd.Parameters.Add(new SqlParameter("Id_Persona", oDireccion_Dom.Id_Persona));
                cmd.Parameters.Add(new SqlParameter("@Ciudad", (object?)oDireccion_Dom.Ciudad ?? DBNull.Value));
                cmd.Parameters.Add(new SqlParameter("@Barrio", (object?)oDireccion_Dom.Barrio ?? DBNull.Value));
                cmd.Parameters.Add(new SqlParameter("@Calle", (object?)oDireccion_Dom.Calle ?? DBNull.Value));
                cmd.Parameters.Add(new SqlParameter("@Id_Creador", (object?)oDireccion_Dom.Id_Creador ?? DBNull.Value));
                cmd.Parameters.Add(new SqlParameter("@Id_Estado", (object?)oDireccion_Dom.Id_Estado ?? DBNull.Value));


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

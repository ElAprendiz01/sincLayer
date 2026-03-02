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
    public class DevolucionesRepository : IDevolucionesRepository
    {
        private readonly DBconexionfactory _dBConectionFactory;
        public DevolucionesRepository(DBconexionfactory dBConectionFactory)
        {
            _dBConectionFactory = dBConectionFactory;
        }
        public async Task<IEnumerable<DevolucionesDomain>> ListarDevolucionesAsync()
        {
            var olist = new List<DevolucionesDomain>();

            using var con = _dBConectionFactory.CreateConnection();
            await con.OpenAsync();

            using var cmd = new SqlCommand("SpListarDevoluciones", con);
            {
                cmd.CommandType = CommandType.StoredProcedure;

                using SqlDataReader dr = await cmd.ExecuteReaderAsync();

                while (await dr.ReadAsync())
                {
                    olist.Add(new DevolucionesDomain
                    {
                        Id_Devolucion = dr.GetInt32(dr.GetOrdinal("Id_Devolucion")),
                        Id_Prestamo = dr.GetInt32(dr.GetOrdinal("Id_Prestamo")),
                        NombreCliente = dr.IsDBNull(dr.GetOrdinal("NombreCliente")) ? null : dr.GetString(dr.GetOrdinal("NombreCliente")),
                        Libro = dr.IsDBNull(dr.GetOrdinal("Libro")) ? null : dr.GetString(dr.GetOrdinal("Libro")),
                        Fecha_Entrega = dr.GetDateTime(dr.GetOrdinal("Fecha_Entrega")),
                        EstadoLibro = dr.IsDBNull(dr.GetOrdinal("EstadoLibro")) ? null : dr.GetString(dr.GetOrdinal("EstadoLibro")),
                        Fecha_Creacion = dr.GetDateTime(dr.GetOrdinal("Fecha_Creacion")),
                        Fecha_Modificacion = dr.IsDBNull(dr.GetOrdinal("Fecha_Modificacion")) ? null : dr.GetDateTime(dr.GetOrdinal("Fecha_Modificacion")),
                        Id_Creador = dr.IsDBNull(dr.GetOrdinal("Id_Creador")) ? null : dr.GetInt32(dr.GetOrdinal("Id_Creador")),
                        Id_Modificador = dr.IsDBNull(dr.GetOrdinal("Id_Modificador")) ? null : dr.GetInt32(dr.GetOrdinal("Id_Modificador")),
                        EstadoRegistro = dr.IsDBNull(dr.GetOrdinal("EstadoRegistro")) ? null : dr.GetString(dr.GetOrdinal("EstadoRegistro"))
                    });
                }

                return olist;
            }
        }

        public async Task<IEnumerable<DevolucionesDomain>> Listar_ListarDevolucionesPorUsuarioAsync(int Id_Usuario_Cliente)
        {
            var olist = new List<DevolucionesDomain>();

            using var con = _dBConectionFactory.CreateConnection();
            await con.OpenAsync();

            using var cmd = new SqlCommand("SpListarDevolucionesPorUsuario", con);
            {
                cmd.CommandType = CommandType.StoredProcedure;
                cmd.Parameters.Add(new SqlParameter("@Id_Usuario_Cliente", Id_Usuario_Cliente));

                using SqlDataReader dr = await cmd.ExecuteReaderAsync();

                while (await dr.ReadAsync())
                {
                    olist.Add(new DevolucionesDomain
                    {
                        Id_Devolucion = dr.GetInt32(dr.GetOrdinal("Id_Devolucion")),
                        Id_Prestamo = dr.GetInt32(dr.GetOrdinal("Id_Prestamo")),
                        Usuario = dr.IsDBNull(dr.GetOrdinal("Usuario")) ? null : dr.GetString(dr.GetOrdinal("Usuario")),
                        Libro = dr.IsDBNull(dr.GetOrdinal("Libro")) ? null : dr.GetString(dr.GetOrdinal("Libro")),
                        Fecha_Entrega = dr.GetDateTime(dr.GetOrdinal("Fecha_Entrega")),
                        EstadoLibro = dr.IsDBNull(dr.GetOrdinal("EstadoLibro")) ? null : dr.GetString(dr.GetOrdinal("EstadoLibro")),
                        Fecha_Creacion = dr.GetDateTime(dr.GetOrdinal("Fecha_Creacion")),
                        Fecha_Modificacion = dr.IsDBNull(dr.GetOrdinal("Fecha_Modificacion")) ? null : dr.GetDateTime(dr.GetOrdinal("Fecha_Modificacion")),
                        Id_Creador = dr.IsDBNull(dr.GetOrdinal("Id_Creador")) ? null : dr.GetInt32(dr.GetOrdinal("Id_Creador")),
                        Id_Modificador = dr.IsDBNull(dr.GetOrdinal("Id_Modificador")) ? null : dr.GetInt32(dr.GetOrdinal("Id_Modificador")),
                        EstadoRegistro = dr.IsDBNull(dr.GetOrdinal("EstadoRegistro")) ? null : dr.GetString(dr.GetOrdinal("EstadoRegistro"))
                    });
                }

                return olist;
            }
        }

        public async Task RegistrarDevolucionAsyn(DevolucionesDomain oDevolucion)
        {
            using var con = _dBConectionFactory.CreateConnection();
            await con.OpenAsync();

            using var cmd = new SqlCommand("SpRegistrarDevolucion", con);
            {
                cmd.CommandType = CommandType.StoredProcedure;

                cmd.Parameters.Add(new SqlParameter("@Id_Prestamo", oDevolucion.Id_Prestamo));
                cmd.Parameters.Add(new SqlParameter("@Id_Estado_Libro", oDevolucion.Id_Estado_Libro));
                cmd.Parameters.Add(new SqlParameter("@Id_Creador", oDevolucion.Id_Creador));
                cmd.Parameters.Add(new SqlParameter("@Observaciones", (object?)null ?? DBNull.Value));

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

        public async Task ActualizarDevolucionAsync(DevolucionesDomain oDevolucion)
        {
            using var con = _dBConectionFactory.CreateConnection();
            await con.OpenAsync();

            using var cmd = new SqlCommand("SpActualizarDevolucion", con);
            {
                cmd.CommandType = CommandType.StoredProcedure;

                cmd.Parameters.Add(new SqlParameter("@Id_Devolucion", oDevolucion.Id_Devolucion));
                cmd.Parameters.Add(new SqlParameter("@Id_Modificador", oDevolucion.Id_Modificador));
                cmd.Parameters.Add(new SqlParameter("@Id_Estado", (object?)oDevolucion.Id_Estado ?? DBNull.Value));
                cmd.Parameters.Add(new SqlParameter("@ForzarRecuperacion", oDevolucion.ForzarRecuperacion ?? false));

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

        public async Task SpDesactivarDevolucionAutomaticoAsync(int id, int idModificador)
        {
            using var con = _dBConectionFactory.CreateConnection();
            await con.OpenAsync();

            using var cmd = new SqlCommand("SpDesactivarDevolucionAutomatico", con);
            {
                cmd.CommandType = CommandType.StoredProcedure;

                cmd.Parameters.Add(new SqlParameter("@Id_Devolucion", id));
                cmd.Parameters.Add(new SqlParameter("@Id_Modificador", idModificador));

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
    }
}

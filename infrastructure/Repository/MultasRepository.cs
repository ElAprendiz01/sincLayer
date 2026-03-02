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
    public class MultasRepository : ImultasRepository
    {
        private readonly DBconexionfactory _dBConectionFactory;
        public MultasRepository(DBconexionfactory dBConectionFactory)
        {
            _dBConectionFactory = dBConectionFactory;
        }

        public async Task ActualizarMultasaync(MultasDomain omultas)
        {
            using var con = _dBConectionFactory.CreateConnection();
            await con.OpenAsync();

            using var cmd = new SqlCommand("SpActualizarMulta", con);
            {
                cmd.CommandType = CommandType.StoredProcedure;

                cmd.Parameters.Add(new SqlParameter("@Id_Multa", omultas.Id_Multa));
                cmd.Parameters.Add(new SqlParameter("@Id_Modificador", omultas.Id_Modificador));
                cmd.Parameters.Add(new SqlParameter("@Pagada", (object?)omultas.Pagada ?? DBNull.Value));
                cmd.Parameters.Add(new SqlParameter("@Id_Estado", (object?)omultas.Id_Estado ?? DBNull.Value));
                cmd.Parameters.Add(new SqlParameter("@ForzarRecuperacion", omultas.ForzarRecuperacion ?? false));

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

        public async Task ActualizarMultasPorAbonoaync(MultasDomain omultas)
        {
            using var con = _dBConectionFactory.CreateConnection();
            await con.OpenAsync();

            using var cmd = new SqlCommand("SpAbonarMulta", con);
            {
                cmd.CommandType = CommandType.StoredProcedure;

                cmd.Parameters.Add(new SqlParameter("@Id_Multa", omultas.Id_Multa));
                cmd.Parameters.Add(new SqlParameter("@MontoAbono", (object?)omultas.MontoAbono ?? DBNull.Value));
                cmd.Parameters.Add(new SqlParameter("@Id_Modificador", omultas.Id_Modificador));

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

        public async Task EliminarMultaSync(int id, int idModificador)
        {
            using var con = _dBConectionFactory.CreateConnection();
            await con.OpenAsync();

            using var cmd = new SqlCommand("SpDesactivarMultaAutomatico", con);
            {
                cmd.CommandType = CommandType.StoredProcedure;
                cmd.Parameters.Add(new SqlParameter("@Id_Multa", id));
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

        public async Task<IEnumerable<MultasDomain>> ListarMultasPendientesAsync()
        {
            var olist = new List<MultasDomain>();

            using var con = _dBConectionFactory.CreateConnection();
            await con.OpenAsync();

            using var cmd = new SqlCommand("SpListarMultasPendientes", con);
            {
                cmd.CommandType = CommandType.StoredProcedure;

                using (SqlDataReader dr = await cmd.ExecuteReaderAsync())
                {
                    while (await dr.ReadAsync())
                    {
                        olist.Add(new MultasDomain
                        {
                            Id_Multa = dr.GetInt32(dr.GetOrdinal("Id_Multa")),
                            Id_Prestamo = dr.GetInt32(dr.GetOrdinal("Id_Prestamo")),
                            Id_Usuario_Cliente = dr.GetInt32(dr.GetOrdinal("Id_Usuario_Cliente")),
                            Nombre_Cliente = dr.GetString(dr.GetOrdinal("Nombre_Cliente")),
                            Libro = dr.GetString(dr.GetOrdinal("Libro")),
                            Monto_Multa = dr.GetDecimal(dr.GetOrdinal("Monto_Multa")),
                            SaldoPendiente = dr.GetDecimal(dr.GetOrdinal("SaldoPendiente")),
                            Fecha_Creacion = dr.GetDateTime(dr.GetOrdinal("Fecha_Creacion")),
                            Fecha_Modificacion = dr.IsDBNull(dr.GetOrdinal("Fecha_Modificacion")) ? null : dr.GetDateTime(dr.GetOrdinal("Fecha_Modificacion")),
                            Id_Creador = dr.IsDBNull(dr.GetOrdinal("Id_Creador")) ? null : dr.GetInt32(dr.GetOrdinal("Id_Creador")),
                            Id_Modificador = dr.IsDBNull(dr.GetOrdinal("Id_Modificador")) ? null : dr.GetInt32(dr.GetOrdinal("Id_Modificador")),
                            EstadoRegistro = dr.GetString(dr.GetOrdinal("EstadoRegistro"))
                        });
                    }
                }

                return olist;
            }
        }

        public async Task<IEnumerable<MultasDomain>> ListarUsuariosConMultasPendientes()
        {
            var olist = new List<MultasDomain>();

            using var con = _dBConectionFactory.CreateConnection();
            await con.OpenAsync();

            using var cmd = new SqlCommand("SpListarUsuariosConMultasPendientes", con);
            {
                cmd.CommandType = CommandType.StoredProcedure;

                using (SqlDataReader dr = await cmd.ExecuteReaderAsync())
                {
                    while (await dr.ReadAsync())
                    {
                        olist.Add(new MultasDomain
                        {
                            Id_Usuario = dr.GetInt32(dr.GetOrdinal("Id_Usuario")),
                            Nombre_Cliente = dr.GetString(dr.GetOrdinal("NombreCliente")),
                            CantidadMultasPendientes = dr.GetInt32(dr.GetOrdinal("CantidadMultasPendientes")),
                            TotalPendiente = dr.GetDecimal(dr.GetOrdinal("TotalPendiente"))
                        });
                    }
                }

                return olist;
            }
        }
    
    
    }
}

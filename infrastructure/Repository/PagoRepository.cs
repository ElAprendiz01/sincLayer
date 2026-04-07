using application.DTOs;
using application.Interfaces;
using infrastructure.DB;
using Microsoft.Data.SqlClient;
using System;
using System.Collections.Generic;
using System.Data;
using System.Threading.Tasks;

namespace infrastructure.Repository
{
    public class PagoRepository : IPagoRepository
    {
        private readonly DBconexionfactory _dBConectionFactory;

        public PagoRepository(DBconexionfactory dBConectionFactory)
        {
            _dBConectionFactory = dBConectionFactory;
        }

        public async Task<string> RegistrarNuevoPago(PagoDTO pago)
        {
            try
            {
                using var con = _dBConectionFactory.CreateConnection();
                await con.OpenAsync();
                using var cmd = new SqlCommand("Sp_Ingresar_Pagos", con);
                cmd.CommandType = CommandType.StoredProcedure;

                cmd.Parameters.Add(new SqlParameter("@Id_Multa", pago.Id_Multa));
                cmd.Parameters.Add(new SqlParameter("@Id_Acuerdo", (object?)pago.Id_Acuerdo ?? DBNull.Value));
                cmd.Parameters.Add(new SqlParameter("@Monto_Pagado", pago.Monto_Pagado));
                cmd.Parameters.Add(new SqlParameter("@Metodo_Pago", pago.Metodo_Pago));
                cmd.Parameters.Add(new SqlParameter("@Numero_Comprobante", (object?)pago.Numero_Comprobante ?? DBNull.Value));
                cmd.Parameters.Add(new SqlParameter("@Id_Creador", pago.Id_Creador));

                // Leemos el SELECT final del SP que trae la columna 'Mensaje'
                using (SqlDataReader dr = await cmd.ExecuteReaderAsync())
                {
                    if (await dr.ReadAsync())
                    {
                        return dr["Mensaje"].ToString();
                    }
                }
                return "Operación realizada";
            }
            catch (SqlException ex)
            {
                // Aquí capturamos el mensaje del THROW 50001, 50002, etc.
                return ex.Message;
            }
        }

        public async Task<string> ActualizarPagoExistente(PagoDTO pago)
        {
            try
            {
                using var con = _dBConectionFactory.CreateConnection();
                await con.OpenAsync();
                using var cmd = new SqlCommand("Sp_Editar_Pagos", con);
                cmd.CommandType = CommandType.StoredProcedure;

                cmd.Parameters.Add(new SqlParameter("@Id_Pago", pago.Id_Pago));
                cmd.Parameters.Add(new SqlParameter("@Monto_Pagado", (object?)pago.Monto_Pagado ?? DBNull.Value));
                cmd.Parameters.Add(new SqlParameter("@Metodo_Pago", (object?)pago.Metodo_Pago ?? DBNull.Value));
                cmd.Parameters.Add(new SqlParameter("@Numero_Comprobante", (object?)pago.Numero_Comprobante ?? DBNull.Value));
                cmd.Parameters.Add(new SqlParameter("@Id_Modificador", pago.Id_Modificador));

                using (SqlDataReader dr = await cmd.ExecuteReaderAsync())
                {
                    if (await dr.ReadAsync())
                    {
                        // En tu SP de editar la columna se llama 'mensaje'
                        return dr["mensaje"].ToString();
                    }
                }
                return "Registro actualizado";
            }
            catch (SqlException ex)
            {
                return ex.Message;
            }
        }

        public async Task<string> AnularPagoSistema(int idPago, int idModificador)
        {
            try
            {
                using var con = _dBConectionFactory.CreateConnection();
                await con.OpenAsync();
                using var cmd = new SqlCommand("Sp_Anular_Pago", con);
                cmd.CommandType = CommandType.StoredProcedure;

                cmd.Parameters.Add(new SqlParameter("@Id_Pago", idPago));
                cmd.Parameters.Add(new SqlParameter("@Id_Modificador", idModificador));

                using (SqlDataReader dr = await cmd.ExecuteReaderAsync())
                {
                    if (await dr.ReadAsync())
                    {
                        return dr["Mensaje"].ToString();
                    }
                }
                return "Pago anulado";
            }
            catch (SqlException ex)
            {
                return ex.Message;
            }
        }

        // Métodos de Listar y Filtrar (Se mantienen igual con tu estilo de conversión manual)
        public async Task<IEnumerable<PagoDTO>> ObtenerTodosLosPagos()
        {
            var olist = new List<PagoDTO>();
            using var con = _dBConectionFactory.CreateConnection();
            await con.OpenAsync();
            using (SqlCommand cmd = new SqlCommand("Sp_Listar_Pagos", con))
            {
                cmd.CommandType = CommandType.StoredProcedure;
                using (SqlDataReader dr = await cmd.ExecuteReaderAsync())
                {
                    while (await dr.ReadAsync())
                    {
                        olist.Add(new PagoDTO
                        {
                            Id_Pago = Convert.ToInt32(dr["Id_Pago"]),
                            Id_Multa = Convert.ToInt32(dr["Id_Multa"]),
                            Id_Acuerdo = dr["Id_Acuerdo"] == DBNull.Value ? null : Convert.ToInt32(dr["Id_Acuerdo"]),
                            Monto_Pagado = Convert.ToDecimal(dr["Monto_Pagado"]),
                            Metodo_Pago_Nombre = dr["Metodo_Pago_Nombre"].ToString(),
                            Numero_Comprobante = dr["Numero_Comprobante"].ToString(),
                            Fecha_Pago = Convert.ToDateTime(dr["Fecha_Pago"]),
                            Id_Creador = Convert.ToInt32(dr["Id_Usuario"]),
                            Estado_Nombre = dr["Estado_Nombre"].ToString()
                        });
                    }
                }
            }
            return olist;
        }

        public async Task<IEnumerable<PagoDTO>> BuscarPagos(string? comprobante, int? idMulta)
        {
            var olist = new List<PagoDTO>();
            using var con = _dBConectionFactory.CreateConnection();
            await con.OpenAsync();
            using (SqlCommand cmd = new SqlCommand("Sp_Filtrar_Pagos", con))
            {
                cmd.CommandType = CommandType.StoredProcedure;
                cmd.Parameters.Add(new SqlParameter("@Numero_Comprobante", string.IsNullOrEmpty(comprobante) ? DBNull.Value : comprobante));
                cmd.Parameters.Add(new SqlParameter("@Id_Multa", (idMulta == null || idMulta <= 0) ? DBNull.Value : idMulta));

                using (SqlDataReader dr = await cmd.ExecuteReaderAsync())
                {
                    while (await dr.ReadAsync())
                    {
                        olist.Add(new PagoDTO
                        {
                            Id_Pago = Convert.ToInt32(dr["Id_Pago"]),
                            Id_Multa = Convert.ToInt32(dr["Id_Multa"]),
                            Monto_Pagado = Convert.ToDecimal(dr["Monto_Pagado"]),
                            Metodo_Pago_Nombre = dr["Metodo_Pago_Nombre"].ToString(),
                            Numero_Comprobante = dr["Numero_Comprobante"].ToString(),
                            Fecha_Pago = Convert.ToDateTime(dr["Fecha_Pago"])
                        });
                    }
                }
            }
            return olist;
        }
    }
}
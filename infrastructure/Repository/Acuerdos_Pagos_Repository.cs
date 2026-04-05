using application.DTOs;
using application.Interfaces;
using infrastructure.DB;
using Microsoft.Data.SqlClient;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace infrastructure.Repository
{
    public class Acuerdos_Pagos_Repository : IAcuerdos_Pago_Repository
    {
        private readonly DBconexionfactory _conection;

        public Acuerdos_Pagos_Repository(DBconexionfactory conection)
        {
            _conection = conection;
        }

        public async Task Editar_Acuerdos_PagoAsync(Acuerdos_Pago_DTOs acuerdos_Pago)
        {
            try
            {
                using var con = _conection.CreateConnection();
                await con.OpenAsync();

                using (SqlCommand cmd = new SqlCommand("Sp_Editar_Acuerdos_Pago", con))
                {
                    cmd.CommandType = System.Data.CommandType.StoredProcedure;
                    cmd.Parameters.Add(new SqlParameter("@Id_Acuerdo", acuerdos_Pago.Id_Acuerdo));
                    cmd.Parameters.Add(new SqlParameter("@Monto_Total_Acordado", acuerdos_Pago.Monto_Total_Acordado));
                    cmd.Parameters.Add(new SqlParameter("@Cantidad_Cuotas", acuerdos_Pago.Cantidad_Cuotas));
                    cmd.Parameters.Add(new SqlParameter("@Monto_Por_Cuota", acuerdos_Pago.Monto_Por_Cuota));
                    cmd.Parameters.Add(new SqlParameter("@Frecuencia_Pago", acuerdos_Pago.Frecuencia_Pago));
                    cmd.Parameters.Add(new SqlParameter("@Id_Modificador", acuerdos_Pago.Id_Modificador));
                    await cmd.ExecuteNonQueryAsync();
                }
            }
            catch (SqlException)
            {
                throw;
            }
            catch (Exception ex)
            {
                throw new Exception("Error al editar el acuerdo de pago: " + ex.Message);
            }
        }

        public async Task Eliminar_Acuerdos_PagoAsync(int id,int Id_modificador)
        {
            try
            {
                using var con = _conection.CreateConnection();
                await con.OpenAsync();

                using (SqlCommand cmd = new SqlCommand("Sp_Acuerdos_Pago_Eliminar", con))
                {
                    cmd.CommandType = System.Data.CommandType.StoredProcedure;
                    cmd.Parameters.Add(new SqlParameter("@Id_Acuerdo", id));
                    cmd.Parameters.Add(new SqlParameter("@Id_Modificador", Id_modificador));
                    await cmd.ExecuteNonQueryAsync();
                }
            }
            catch (SqlException)
            {
                throw;
            }
            catch (Exception ex)
            {
                throw new Exception(ex.Message);
            }
        }

        public async Task Insertar_Acuerdos_PagoAsync(Acuerdos_Pago_DTOs acuerdos_Pago)
        {
            try
            {
                using var con = _conection.CreateConnection();
                await con.OpenAsync();

                using (SqlCommand cmd = new SqlCommand("Sp_Acuerdos_Pago_Insertar", con))
                {
                    cmd.CommandType = System.Data.CommandType.StoredProcedure;
                    cmd.Parameters.Add(new SqlParameter("@Id_Multa", acuerdos_Pago.Id_Multa));
                    cmd.Parameters.Add(new SqlParameter("@Monto_Total_Acordado", acuerdos_Pago.Monto_Total_Acordado));
                    cmd.Parameters.Add(new SqlParameter("@Cantidad_Cuotas", acuerdos_Pago.Cantidad_Cuotas));
                    cmd.Parameters.Add(new SqlParameter("@Monto_Por_Cuota", acuerdos_Pago.Monto_Por_Cuota));
                    cmd.Parameters.Add(new SqlParameter("@Frecuencia_Pago", acuerdos_Pago.Frecuencia_Pago));
                    cmd.Parameters.Add(new SqlParameter("@Id_Creador", acuerdos_Pago.Id_Creador));
                    await cmd.ExecuteNonQueryAsync();
                }
            }
            catch (SqlException)
            {
                throw;
            }
            catch (Exception ex)
            {
                throw new Exception("Error al editar el acuerdo de pago: " + ex.Message);
            }
        }

        public async Task<IEnumerable<Acuerdos_Pago_DTOs>> Listar_Acuerdos_PagosAsync()
        {
            var list = new List<Acuerdos_Pago_DTOs>();
            using var con = _conection.CreateConnection();
            await con.OpenAsync();

            using (SqlCommand cmd = new SqlCommand("Sp_Acuerdos_Pago_Listar", con))
            {
                cmd.CommandType = System.Data.CommandType.StoredProcedure;
                using (SqlDataReader dr = await cmd.ExecuteReaderAsync())
                {
                    while (dr.Read())
                    {
                        list.Add(new Acuerdos_Pago_DTOs
                        {
                            Id_Acuerdo = dr["Id_Acuerdo"] == DBNull.Value ? 0 : Convert.ToInt32(dr["Id_Acuerdo"]),
                            Id_Multa = dr["Id_Multa"] == DBNull.Value ? 0 : Convert.ToInt32(dr["Id_Multa"]),
                            Monto_Total_Acordado = dr["Monto_Total_Acordado"] == DBNull.Value ? 0 : Convert.ToDecimal(dr["Monto_Total_Acordado"]),
                            Cantidad_Cuotas = dr["Cantidad_Cuotas"] == DBNull.Value ? 0 : Convert.ToInt32(dr["Cantidad_Cuotas"]),
                            Monto_Por_Cuota = dr["Monto_Por_Cuota"] == DBNull.Value ? 0 : Convert.ToDecimal(dr["Monto_Por_Cuota"]),
                            Frecuencia_Pago = dr["Frecuencia_Pago"] == DBNull.Value ? 0 : Convert.ToInt32(dr["Frecuencia_Pago"]),
                            Frecuencia_Descripcion = dr["Frecuencia_Descripcion"] == DBNull.Value ? string.Empty : dr["Frecuencia_Pago"].ToString(),
                            Fecha_Creacion = dr["Frecuencia_Pago"] == DBNull.Value ? 0 : Convert.ToDateTime(dr["Frecuencia_Pago"])
                        });
                    }
                }
            }
            return list;
        }

        public async Task<IEnumerable<Acuerdos_Pago_DTOs>> Listar_Acuerdos_Pagos_IdAsync(int id)
        {
            var list = new List<Acuerdos_Pago_DTOs>();
            using var con = _conection.CreateConnection();
            await con.OpenAsync();

            using (SqlCommand cmd = new SqlCommand("Sp_Filtrar_Acuerdos_Pago", con))
            {
                cmd.CommandType = System.Data.CommandType.StoredProcedure;
                cmd.Parameters.Add(new SqlParameter("", id));

                using (SqlDataReader dr = await cmd.ExecuteReaderAsync())
                {
                    while (dr.Read())
                    {
                        list.Add(new Acuerdos_Pago_DTOs
                        {
                            Id_Acuerdo = dr["Id"] == DBNull.Value ? 0 : Convert.ToInt32(dr["Id"]),
                            Id_Multa = dr["Id Multa"] == DBNull.Value ? 0 : Convert.ToInt32(dr["Id Multa"]),
                            Monto_Total_Acordado = dr["Total Acordado"] == DBNull.Value ? 0 : Convert.ToDecimal(dr["Total Acordado"]),
                            Cantidad_Cuotas = dr["Cuotas"] == DBNull.Value ? 0 : Convert.ToInt32(dr["Cuotas"]),
                            Monto_Por_Cuota = dr["Monto Cuota"] == DBNull.Value ? 0 : Convert.ToDecimal(dr["Monto Cuota"]),
                            Frecuencia_Descripcion = dr["Frecuencia"] == DBNull.Value ? string.Empty : dr["Frecuencia"].ToString(),
                            Fecha_Creacion = dr["Frecuencia_Pago"] == DBNull.Value ? DateTime.MinValue : Convert.ToDateTime(dr["Frecuencia_Pago"]),
                            Estado = dr["Estado"] == DBNull.Value ? string.Empty : dr["Estado"].ToString()
                        });
                    }
                }
            }
            return list;
        }
    }
}

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
                    cmd.CommandType = CommandType.StoredProcedure;

                    // Uso de AddWithValue o asignación explícita con validación de nulos
                    cmd.Parameters.Add(new SqlParameter("@Id_Acuerdo", acuerdos_Pago.Id_Acuerdo ?? (object)DBNull.Value));
                    cmd.Parameters.Add(new SqlParameter("@Monto_Total_Acordado", acuerdos_Pago.Monto_Total_Acordado ?? (object)DBNull.Value));
                    cmd.Parameters.Add(new SqlParameter("@Cantidad_Cuotas", acuerdos_Pago.Cantidad_Cuotas ?? (object)DBNull.Value));
                    cmd.Parameters.Add(new SqlParameter("@Monto_Por_Cuota", acuerdos_Pago.Monto_Por_Cuota ?? (object)DBNull.Value));
                    cmd.Parameters.Add(new SqlParameter("@Frecuencia_Pago", acuerdos_Pago.Frecuencia_Pago ?? (object)DBNull.Value));
                    cmd.Parameters.Add(new SqlParameter("@Id_Modificador", acuerdos_Pago.Id_Modificador ?? (object)DBNull.Value));

                    await cmd.ExecuteNonQueryAsync();
                }
            }
            catch (SqlException)
            {
                // Re-lanzar la excepción original para que el controlador la convierta en JSON
                throw;
            }
            catch (Exception ex)
            {
                throw new Exception("Error de infraestructura al editar el acuerdo", ex);
            }
        }

        public async Task Eliminar_Acuerdos_PagoAsync(int id, int Id_modificador)
        {
            try
            {
                using var con = _conection.CreateConnection();
                await con.OpenAsync();

                using (SqlCommand cmd = new SqlCommand("Sp_Acuerdos_Pago_Eliminar", con))
                {
                    cmd.CommandType = CommandType.StoredProcedure;
                    cmd.Parameters.Add(new SqlParameter("@Id_Acuerdo", id));
                    cmd.Parameters.Add(new SqlParameter("@Id_Modificador", Id_modificador));
                    await cmd.ExecuteNonQueryAsync();
                }
            }
            catch (SqlException) { throw; }
            catch (Exception ex) { throw new Exception("Error al eliminar el registro", ex); }
        }

        public async Task Insertar_Acuerdos_PagoAsync(Acuerdos_Pago_DTOs acuerdos_Pago)
        {
            try
            {
                using var con = _conection.CreateConnection();
                await con.OpenAsync();

                using (SqlCommand cmd = new SqlCommand("Sp_Acuerdos_Pago_Insertar", con))
                {
                    cmd.CommandType = CommandType.StoredProcedure;

                    // CRÍTICO: Validar que los campos obligatorios no lleguen nulos a SQL
                    cmd.Parameters.Add(new SqlParameter("@Id_Multa", acuerdos_Pago.Id_Multa ?? (object)DBNull.Value));
                    cmd.Parameters.Add(new SqlParameter("@Monto_Total_Acordado", acuerdos_Pago.Monto_Total_Acordado ?? (object)DBNull.Value));
                    cmd.Parameters.Add(new SqlParameter("@Cantidad_Cuotas", acuerdos_Pago.Cantidad_Cuotas ?? (object)DBNull.Value));
                    cmd.Parameters.Add(new SqlParameter("@Monto_Por_Cuota", acuerdos_Pago.Monto_Por_Cuota ?? (object)DBNull.Value));
                    cmd.Parameters.Add(new SqlParameter("@Frecuencia_Pago", acuerdos_Pago.Frecuencia_Pago ?? (object)DBNull.Value));
                    cmd.Parameters.Add(new SqlParameter("@Id_Creador", acuerdos_Pago.Id_Creador ?? (object)DBNull.Value));

                    await cmd.ExecuteNonQueryAsync();
                }
            }
            catch (SqlException) { throw; }
            catch (Exception ex) { throw new Exception("Error de infraestructura al insertar acuerdo", ex); }
        }

        public async Task<IEnumerable<Acuerdos_Pago_DTOs>> Listar_Acuerdos_PagosAsync()
        {
            var list = new List<Acuerdos_Pago_DTOs>();
            try
            {
                using var con = _conection.CreateConnection();
                await con.OpenAsync();

                using (SqlCommand cmd = new SqlCommand("Sp_Acuerdos_Pago_Listar", con))
                {
                    cmd.CommandType = CommandType.StoredProcedure;
                    using (SqlDataReader dr = await cmd.ExecuteReaderAsync())
                    {
                        while (await dr.ReadAsync())
                        {
                            list.Add(MapearAcuerdo(dr));
                        }
                    }
                }
                return list;
            }
            catch (SqlException) { throw; }
        }

        public async Task<IEnumerable<Acuerdos_Pago_DTOs>> Listar_Acuerdos_Pagos_IdAsync(int id)
        {
            var list = new List<Acuerdos_Pago_DTOs>();
            try
            {
                using var con = _conection.CreateConnection();
                await con.OpenAsync();

                using (SqlCommand cmd = new SqlCommand("Sp_Filtrar_Acuerdos_Pago", con))
                {
                    cmd.CommandType = CommandType.StoredProcedure;
                    cmd.Parameters.Add(new SqlParameter("@Id_Acuerdo", id));
                    cmd.Parameters.Add(new SqlParameter("@Id_Multa", DBNull.Value));

                    using (SqlDataReader dr = await cmd.ExecuteReaderAsync())
                    {
                        while (await dr.ReadAsync())
                        {
                            list.Add(MapearAcuerdo(dr));
                        }
                    }
                }
                return list;
            }
            catch (SqlException) { throw; }
        }

        // Método privado para evitar repetir la lógica de mapeo
        private Acuerdos_Pago_DTOs MapearAcuerdo(SqlDataReader dr)
        {
            return new Acuerdos_Pago_DTOs
            {
                Id_Acuerdo = dr["Id_Acuerdo"] as int?,
                Id_Multa = dr["Id_Multa"] as int?,
                Monto_Total_Acordado = dr["Monto_Total_Acordado"] as decimal?,
                Cantidad_Cuotas = dr["Cantidad_Cuotas"] as int?,
                Monto_Por_Cuota = dr["Monto_Por_Cuota"] as decimal?,
                Frecuencia_Pago = dr["Frecuencia_Pago"] as int?,
                Frecuencia_Descripcion = dr["Frecuencia_Pago_Nombre"]?.ToString() ?? string.Empty,
                Fecha_Creacion = dr["Fecha_Creacion"] as DateTime?,
                Fecha_Modificacion = dr["Fecha_Modificacion"] as DateTime?,
                Id_Creador = dr["Id_Creador"] as int?,
                Id_Modificador = dr["Id_Modificador"] as int?,
                Id_Estado = dr["Id_Estado"] as int?,
                Estado = dr["Estado"]?.ToString() ?? string.Empty
            };
        }
    }
}
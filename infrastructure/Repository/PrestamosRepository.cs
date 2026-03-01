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
    public class PrestamosRepository : IPrestamosRepository
    {
        private readonly DBconexionfactory _dBConectionFactory;
        public PrestamosRepository(DBconexionfactory dBConectionFactory)
        {
            _dBConectionFactory = dBConectionFactory;
        }




        public async Task<IEnumerable<PrestamosDomain>> Listar_PrestamosAsync()
        {
            var olist = new List<PrestamosDomain>();

            using var con = _dBConectionFactory.CreateConnection();
            await con.OpenAsync();

            using (SqlCommand cmd = new SqlCommand("SpListarPrestamos", con))
            {
                cmd.CommandType = CommandType.StoredProcedure;

                using (SqlDataReader dr = await cmd.ExecuteReaderAsync())
                {
                    while (await dr.ReadAsync())
                    {
                        olist.Add(new PrestamosDomain
                        {
                            Id_Prestamo = dr["Id_Prestamo"] == DBNull.Value ? 0 : Convert.ToInt32(dr["Id_Prestamo"]),
                            Id_Usuario_Cliente = dr["Id_Usuario_Cliente"] == DBNull.Value ? 0 : Convert.ToInt32(dr["Id_Usuario_Cliente"]),
                            Nombre_Cliente = dr["Nombre_Cliente"] == DBNull.Value ? null : dr["Nombre_Cliente"].ToString(),
                            Libro = dr["Libro"] == DBNull.Value ? null : dr["Libro"].ToString(),
                            Fecha_Prestamo = Convert.ToDateTime(dr["Fecha_Prestamo"]),
                            Fecha_Vencimiento = Convert.ToDateTime(dr["Fecha_Vencimiento"]),
                            Fecha_Devolucion_Real = dr["Fecha_Devolucion_Real"] == DBNull.Value ? null : Convert.ToDateTime(dr["Fecha_Devolucion_Real"]),
                            Id_Creador = dr["Id_Creador"] == DBNull.Value ? 0 : Convert.ToInt32(dr["Id_Creador"]),
                            Id_Modificador = dr["Id_Modificador"] == DBNull.Value ? null : Convert.ToInt32(dr["Id_Modificador"]),
                            Estado = dr["Estado"] == DBNull.Value ? null : dr["Estado"].ToString()
                        });
                    }
                }
            }

            return olist;
        } 

   

        public async Task EditarPrestamosAsync(PrestamosDomain oprestamos)
        {
            using var con = _dBConectionFactory.CreateConnection();
            await con.OpenAsync();
            using var cmd = new SqlCommand("SpActualizarPrestamo", con);
            {
                cmd.CommandType = CommandType.StoredProcedure;

                cmd.Parameters.Add(new SqlParameter("@Id_Prestamo", oprestamos.Id_Prestamo));
                cmd.Parameters.Add(new SqlParameter("@Id_Modificador", (object?)oprestamos.Id_Modificador ?? DBNull.Value));
                cmd.Parameters.Add(new SqlParameter("@Id_Estado", (object?)oprestamos.Id_Estado ?? DBNull.Value));

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

   

        public async Task<IEnumerable<PrestamosDomain>> Listar_prestamosId_Usuario_ClienteAsync(int Id_Usuario_Cliente)
        {
            var olist = new List<PrestamosDomain>();

            using var con = _dBConectionFactory.CreateConnection();
            await con.OpenAsync();

            using (SqlCommand cmd = new SqlCommand("SpFiltrarPrestamosPorUsuario", con))
            {
                cmd.CommandType = CommandType.StoredProcedure;

                cmd.Parameters.Add(new SqlParameter("@Id_Usuario_Cliente", Id_Usuario_Cliente));

                using (SqlDataReader dr = await cmd.ExecuteReaderAsync())
                {
                    while (await dr.ReadAsync())
                    {
                        olist.Add(new PrestamosDomain
                        {
                            Id_Prestamo = dr["Id_Prestamo"] == DBNull.Value ? 0 : Convert.ToInt32(dr["Id_Prestamo"]),
                            Id_Usuario_Cliente = dr["Id_Usuario_Cliente"] == DBNull.Value ? 0 : Convert.ToInt32(dr["Id_Usuario_Cliente"]),
                            Nombre_Cliente = dr["Nombre_Cliente"] == DBNull.Value ? null : dr["Nombre_Cliente"].ToString(),
                            Libro = dr["Libro"] == DBNull.Value ? null : dr["Libro"].ToString(),
                            Fecha_Prestamo = Convert.ToDateTime(dr["Fecha_Prestamo"]),
                            Fecha_Vencimiento = Convert.ToDateTime(dr["Fecha_Vencimiento"]),
                            Fecha_Devolucion_Real = dr["Fecha_Devolucion_Real"] == DBNull.Value ? null : Convert.ToDateTime(dr["Fecha_Devolucion_Real"]),
                            Id_Creador = dr["Id_Creador"] == DBNull.Value ? 0 : Convert.ToInt32(dr["Id_Creador"]),
                            Id_Modificador = dr["Id_Modificador"] == DBNull.Value ? null : Convert.ToInt32(dr["Id_Modificador"]),
                            Estado = dr["Estado"] == DBNull.Value ? null : dr["Estado"].ToString()
                        });
                    }
                }
            }

            return olist;
        }

        public async Task NuevoPrestamosAsyn(PrestamosDomain oPrestamos)
        {

            using var con = _dBConectionFactory.CreateConnection();
            await con.OpenAsync();
            using var cmd = new SqlCommand("SpInsertarPrestamo", con);
            {
                cmd.CommandType = CommandType.StoredProcedure;

                cmd.Parameters.Add(new SqlParameter("@Id_Usuario_Cliente", oPrestamos.Id_Usuario_Cliente));
                cmd.Parameters.Add(new SqlParameter("@Id_Libro", (object?)oPrestamos.Id_Libro ?? DBNull.Value));
                cmd.Parameters.Add(new SqlParameter("@Fecha_Vencimiento",oPrestamos.Fecha_Vencimiento));
                cmd.Parameters.Add(new SqlParameter("@Observaciones", (object?)oPrestamos.Observaciones ?? DBNull.Value));
                cmd.Parameters.Add(new SqlParameter("@Id_Creador", oPrestamos.Id_Creador));


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

        public async Task EliminaPrestamosAsync(int id, int idModificador)
        {
            using var con = _dBConectionFactory.CreateConnection();
            await con.OpenAsync();
            using var cmd = new SqlCommand("SpDesactivarPrestamoAutomatico", con);
            {
                cmd.CommandType = CommandType.StoredProcedure;
                cmd.Parameters.Add(new SqlParameter("@Id_Prestamo", id));
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

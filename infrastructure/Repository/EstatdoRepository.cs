using application.Interfaces;
using Azure.Core;
using Domain;
using infrastructure.DB;
using Microsoft.Data.SqlClient;
using System;
using System.Collections.Generic;
using System.Data;
using System.Diagnostics.CodeAnalysis;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace infrastructure.Repository
{// nota para iplementar la interzaz ubicarse IEstdoRepositorio y darle ctrl + . y buscar la opcion implemnetar interfaz
    public class EstatdoRepository : IEstdoRepositorio // mandamos a llamar la interfaz para implementar sus metodos
    {
        // vamos a crear la campo privado readonly para la conexion a la base de datos
        private readonly DBconexionfactory _DBconectioFactory;
        // creamos el constructor para inyectar la cadena de conexion
        public EstatdoRepository(DBconexionfactory connectionString)
        {
            _DBconectioFactory = connectionString;
        }
     
        public async Task ActualizarEstadoasync(Estado_Dom oestado)
        {
            using var con = _DBconectioFactory.CreateConnection();
            await con.OpenAsync();

            using (SqlCommand cmd = new SqlCommand("SpActualizarCls_Estado", con)) // el nombre del store procedure
            {
                cmd.CommandType = CommandType.StoredProcedure;
                cmd.Parameters.Add(new SqlParameter("@Id_Estado", oestado.Id_Estado));
                cmd.Parameters.Add(new SqlParameter("@Estado", oestado.Estado));
                cmd.Parameters.Add(new SqlParameter("@Id_Modificador", oestado.Id_Modificador));
                cmd.Parameters.Add(new SqlParameter("@Activo", oestado.Activo));
                await cmd.ExecuteNonQueryAsync();
            }
        }

        public async Task EliminarEstadoasyc(int idestado)
        {
            using var con = _DBconectioFactory.CreateConnection();
            await con.OpenAsync();

            using (SqlCommand cmd = new SqlCommand("SPeliminaEstado", con)) // el nombre del store procedure
            {
                cmd.CommandType = CommandType.StoredProcedure;
                cmd.Parameters.Add(new SqlParameter("@Id_Estado", idestado));
                await cmd.ExecuteNonQueryAsync();
            }
        }

        public async Task<IEnumerable<Estado_Dom>> ListarEstadosAsync()
        {
           // vamos a crear el meto para listar 
           // creamos la variable para la lista 
           var olista = new List<Estado_Dom>(); //  vine del donmain
            // creamos la conexion a la base de datos
            using var con = _DBconectioFactory.CreateConnection();
            await con.OpenAsync();
            using(SqlCommand cmd = new SqlCommand("SpListar_Cls_Estado", con)) // el nombre del store procedure
            {
                cmd.CommandType = CommandType.StoredProcedure;
                using (SqlDataReader dr = await cmd.ExecuteReaderAsync())
                {
                    while (await dr.ReadAsync())
                    {
                        olista.Add(new Estado_Dom
                        {
                            Id_Estado = Convert.ToInt32(dr["Id_Estado"]),
                            Estado = dr["Estado"].ToString(),
                            Fecha_Creacion = Convert.ToDateTime(dr["Fecha_Creacion"]),
                            Fecha_Modificacion = dr["Fecha_Modificacion"] == DBNull.Value ? null : Convert.ToDateTime(dr["Fecha_Modificacion"]),
                            Id_Creador = dr["Id_Creador"] == DBNull.Value ? null : Convert.ToInt32(dr["Id_Creador"]),
                            Id_Modificador = dr["Id_Modificador"] == DBNull.Value ? null : Convert.ToInt32(dr["Id_Modificador"]),
                            Activo = Convert.ToBoolean(dr["Activo"])
                        });
                    }
                }
            }
            return olista;


        }

        public async Task<IEnumerable<Estado_Dom>> ListarEstadospornombreAsync(string filtronombre)
        {
            var olista = new List<Estado_Dom>();

            using var con = _DBconectioFactory.CreateConnection();
            await con.OpenAsync();
            using (SqlCommand cmd = new SqlCommand("SpFiltrarCls_EstadoPorNombre", con)) // el nombre del store procedure
            {
                cmd.CommandType = CommandType.StoredProcedure;
                cmd.Parameters.Add(new SqlParameter("@Estado", filtronombre));// es la varible que tengo en el sp y el valor que le voy a pasar
                using (SqlDataReader dr = await cmd.ExecuteReaderAsync())
                {
                    while (await dr.ReadAsync())
                    {
                        olista.Add(new Estado_Dom
                        {
                            Id_Estado = Convert.ToInt32(dr["Id_Estado"]),
                            Estado = dr["Estado"].ToString(),
                            Fecha_Creacion = Convert.ToDateTime(dr["Fecha_Creacion"]),
                            Fecha_Modificacion = dr["Fecha_Modificacion"] == DBNull.Value ? null : Convert.ToDateTime(dr["Fecha_Modificacion"]),
                            Id_Creador = dr["Id_Creador"] == DBNull.Value ? null : Convert.ToInt32(dr["Id_Creador"]),
                            Id_Modificador = dr["Id_Modificador"] == DBNull.Value ? null : Convert.ToInt32(dr["Id_Modificador"]),
                            Activo = Convert.ToBoolean(dr["Activo"])
                        });
                    }
                }
            }
            return olista;

        }

        public async Task NuevoEstadoasync(Estado_Dom oestado)
        {
            using var con = _DBconectioFactory.CreateConnection();
            await con.OpenAsync();

             using (SqlCommand cmd = new SqlCommand("SpInsertar_Cls_Estado", con)) // el nombre del store procedure
            {
                cmd.CommandType = CommandType.StoredProcedure;
                cmd.Parameters.Add(new SqlParameter("@Estado", oestado.Estado));
                cmd.Parameters.Add(new SqlParameter("@Id_Creador", oestado.Id_Creador));
                cmd.Parameters.Add(new SqlParameter("@Activo", oestado.Activo));
                await cmd.ExecuteNonQueryAsync();
            }
        }
    }
}

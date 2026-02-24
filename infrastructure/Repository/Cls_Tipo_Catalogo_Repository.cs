using application.Interfaces;
using infrastructure.DB;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Microsoft.Data.SqlClient;
using Domain;
using System.Data;
using application;


namespace infrastructure.Repository
{
    public class Cls_Tipo_Catalogo_Repository : ITipo_Catalogo_Repository
    {
        private readonly DBconexionfactory _dBConectionFactory;
        public Cls_Tipo_Catalogo_Repository(DBconexionfactory dBConectionFactory)
        {
            _dBConectionFactory = dBConectionFactory;
        }

        //Listar Cls_Tipo_Catalogo
        public async Task<IEnumerable<Cls_Tipo_Catalogo>> Listar_Cls_Tipo_CatalogoAsync()
        {
            var olist = new List<Cls_Tipo_Catalogo>();

            using var con = _dBConectionFactory.CreateConnection();
            await con.OpenAsync();

            using (SqlCommand cmd = new SqlCommand("Listar_Cls_Tipo_Catalogo", con))
            {
                cmd.CommandType = CommandType.StoredProcedure;
                using (SqlDataReader dr = await cmd.ExecuteReaderAsync())
                {
                    while (await dr.ReadAsync())
                    {
                        olist.Add(new Cls_Tipo_Catalogo
                        {
                            Id_Tipo_Catalogo = dr.GetInt32(dr.GetOrdinal("Id_Tipo_Catalogo")),
                            Nombre = dr.IsDBNull(dr.GetOrdinal("Nombre")) ? null : dr.GetString(dr.GetOrdinal("Nombre")),
                            Fecha_Creacion = dr.GetDateTime(dr.GetOrdinal("Fecha_Creacion")),
                            Fecha_Modificacion = dr.IsDBNull(dr.GetOrdinal("Fecha_Modificacion")) ? (DateTime?)null : dr.GetDateTime(dr.GetOrdinal("Fecha_Modificacion")),
                            Id_Creador = dr.GetInt32(dr.GetOrdinal("Id_Creador")),
                            Id_Modificador = dr.IsDBNull(dr.GetOrdinal("Id_Modificador")) ? (int?)null : dr.GetInt32(dr.GetOrdinal("Id_Modificador")),
                            Activo = dr.IsDBNull(dr.GetOrdinal("Activo")) ? (bool?)null : dr.GetBoolean(dr.GetOrdinal("Activo"))


                        });
                    }

                }

            }
            return olist;
        }

        //Listar Cls_Tipo_Catalogo por nombre
        public async Task<IEnumerable<Cls_Tipo_Catalogo>> Listar_Cls_Tipo_CatalogoPorNombreAsync(string Buscar)
        {
            var olist = new List<Cls_Tipo_Catalogo>();

            using var con = _dBConectionFactory.CreateConnection();
            await con.OpenAsync();

            using (SqlCommand cmd = new SqlCommand("Buscar_Cls_Tipo_Catalogo_Nombre", con))
            {
                cmd.CommandType = CommandType.StoredProcedure;

                cmd.Parameters.Add(new SqlParameter("@Buscar", Buscar));
                using (SqlDataReader dr = await cmd.ExecuteReaderAsync())
                {
                    while (await dr.ReadAsync())
                    {
                        olist.Add(new Cls_Tipo_Catalogo
                        {
                            Id_Tipo_Catalogo = dr.GetInt32(dr.GetOrdinal("Id_Tipo_Catalogo")),
                            Nombre = dr.IsDBNull(dr.GetOrdinal("Nombre")) ? null : dr.GetString(dr.GetOrdinal("Nombre")),
                            Fecha_Creacion = dr.GetDateTime(dr.GetOrdinal("Fecha_Creacion")),
                            Fecha_Modificacion = dr.IsDBNull(dr.GetOrdinal("Fecha_Modificacion")) ? (DateTime?)null : dr.GetDateTime(dr.GetOrdinal("Fecha_Modificacion")),
                            Id_Creador = dr.GetInt32(dr.GetOrdinal("Id_Creador")),
                            Id_Modificador = dr.IsDBNull(dr.GetOrdinal("Id_Modificador")) ? (int?)null : dr.GetInt32(dr.GetOrdinal("Id_Modificador")),
                            Activo = dr.IsDBNull(dr.GetOrdinal("Activo")) ? (bool?)null : dr.GetBoolean(dr.GetOrdinal("Activo"))

                        });
                    }

                }

            }
            return olist;

        }

        //Insertar Cls_Tipo_Catalogo
        public async Task NuevoCls_Tipo_CatalogoAsyn(Cls_Tipo_Catalogo oCls_Tipo_Catalogo)
        {
            using var con = _dBConectionFactory.CreateConnection();
            await con.OpenAsync();

            using (SqlCommand cmd = new SqlCommand("Insertar_Cls_Tipo_Catalogo", con))
            {
                cmd.CommandType = CommandType.StoredProcedure;
                cmd.Parameters.Add(new SqlParameter("@Nombre", oCls_Tipo_Catalogo.Nombre));
                cmd.Parameters.Add(new SqlParameter("@Id_Creador", oCls_Tipo_Catalogo.Id_Creador));


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


                await cmd.ExecuteNonQueryAsync();


            }

        }

        //Editar Cls_Tipo_Catalogo
        public async Task EditarCls_Tipo_CatalogoAsync(Cls_Tipo_Catalogo oCls_Tipo_Catalogo)
        {
            using var con = _dBConectionFactory.CreateConnection();
            await con.OpenAsync();

            using (SqlCommand cmd = new SqlCommand("Editar_Cls_Tipo_Catalogo", con))
            {

                cmd.CommandType = CommandType.StoredProcedure;
                cmd.Parameters.Add(new SqlParameter("@Id_Tipo_Catalogo", oCls_Tipo_Catalogo.Id_Tipo_Catalogo));
                cmd.Parameters.Add(new SqlParameter("@Nombre", oCls_Tipo_Catalogo.Nombre));
                cmd.Parameters.Add(new SqlParameter("@Id_Modificador", oCls_Tipo_Catalogo.Id_Modificador));
                cmd.Parameters.Add(new SqlParameter("@Activo", oCls_Tipo_Catalogo.Activo));

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


                await cmd.ExecuteNonQueryAsync();

            }
        }

        //Eliminar Cls_Tipo_Catalogo

        public async Task EliminarCls_Tipo_CatalogoAsync(int id)
        {
            using var con = _dBConectionFactory.CreateConnection();
            await con.OpenAsync();

            using (SqlCommand cmd = new SqlCommand("Eliminar_Cls_Tipo_Catalogo", con))
            {

                cmd.CommandType = CommandType.StoredProcedure;
                cmd.Parameters.Add(new SqlParameter("@Id_Tipo_Catalogo", id));


                await cmd.ExecuteNonQueryAsync();


            }
        }
    }
}

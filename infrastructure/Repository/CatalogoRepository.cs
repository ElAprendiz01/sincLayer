using application.Interfaces;
using Domain;
using infrastructure.DB;
using Microsoft.Data.SqlClient;
using System;
using System.Collections.Generic;
using System.Data;
using System.Data.Common;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace infrastructure.Repository
{
    public class CatalogoRepository : ICatalogoRepositorio
    {

        private readonly DBconexionfactory _dBConectionFactory;
        public CatalogoRepository(DBconexionfactory dBConectionFactory)
        {
            _dBConectionFactory = dBConectionFactory;
        }
        public async Task EditarCatalogoAsync(Catalogo_Dom oCatalogo)
        {
            using var con = _dBConectionFactory.CreateConnection();
            await con.OpenAsync();

            using (SqlCommand cmd = new SqlCommand("SP_ActualizarCatalogo", con))
            {
                cmd.CommandType = CommandType.StoredProcedure;

                cmd.Parameters.Add(new SqlParameter("@Id_Catalogo", oCatalogo.Id_Catalogo));
                cmd.Parameters.Add(new SqlParameter("@Id_Tipo_Catalogo", (object?)oCatalogo.Id_Tipo_Catalogo ?? DBNull.Value));
                cmd.Parameters.Add(new SqlParameter("@Nombre", (object?)oCatalogo.Nombre ?? DBNull.Value));
                cmd.Parameters.Add(new SqlParameter("@Activo", (object?)oCatalogo.Activo ?? DBNull.Value));
                cmd.Parameters.Add(new SqlParameter("@Id_Modificador", oCatalogo.Id_Modificador));

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

                if (codigo != 0)
                    throw new Exception(mensaje);

            }

        }

        public async Task EliminarCatalogoAsync(int id, int idModificador)
        {
            using var con = _dBConectionFactory.CreateConnection();
            await con.OpenAsync();

            using (SqlCommand cmd = new SqlCommand("SP_DesactivarCatalogo", con))
            {
                cmd.CommandType = CommandType.StoredProcedure;

                cmd.Parameters.Add(new SqlParameter("@Id_Catalogo", id));
                cmd.Parameters.Add(new SqlParameter("@Id_Modificador", idModificador));

                // OUTPUTS
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

                if (codigo != 0)
                    throw new Exception(mensaje);
            }
        }

        public async Task<IEnumerable<Catalogo_Dom>> Listar_CatalogoAsync()
        {
            var olist = new List<Catalogo_Dom>();

            using var con = _dBConectionFactory.CreateConnection();
            await con.OpenAsync();

            using (SqlCommand cmd = new SqlCommand("SP_ListarCatalogos", con))
            {
                cmd.CommandType = CommandType.StoredProcedure;


                using (SqlDataReader dr = await cmd.ExecuteReaderAsync())
                {
                    while (await dr.ReadAsync())
                    {
                        olist.Add(new Catalogo_Dom
                        {
                            Id_Catalogo = Convert.ToInt32(dr["Id_Catalogo"]),
                            Id_Tipo_Catalogo = Convert.ToInt32(dr["Id_Tipo_Catalogo"]),
                            Tipo_Catalogo = dr["Tipo_Catalogo"].ToString(),
                            Nombre = dr["Nombre"].ToString(),
                            Fecha_Creacion = Convert.ToDateTime(dr["Fecha_Creacion"]),
                            Fecha_Modificacion = dr["Fecha_Modificacion"] == DBNull.Value ? null : Convert.ToDateTime(dr["Fecha_Modificacion"]),
                            Id_Creador = Convert.ToInt32(dr["Id_Creador"]),
                            Id_Modificador = dr["Id_Modificador"] == DBNull.Value ? null : Convert.ToInt32(dr["Id_Modificador"]),
                            Activo = Convert.ToBoolean(dr["Activo"])
                        });
                    }
                }
            }

            return olist;


        }

        public async Task<IEnumerable<Catalogo_Dom>> Listar_CatalogoPorFechaAsync(string nombre)
        {
          
            var olist = new List<Catalogo_Dom>();

            using var con = _dBConectionFactory.CreateConnection();
            await con.OpenAsync();

            using (SqlCommand cmd = new SqlCommand("SP_FiltrarCatalogosPorNombre", con))
            {
                cmd.CommandType = CommandType.StoredProcedure;

                cmd.Parameters.Add(new SqlParameter("@Nombre", nombre));

                using (SqlDataReader dr = await cmd.ExecuteReaderAsync())
                {
                    while (await dr.ReadAsync())
                    {
                        olist.Add(new Catalogo_Dom
                        {
                            Id_Catalogo = Convert.ToInt32(dr["Id_Catalogo"]),
                            Id_Tipo_Catalogo = Convert.ToInt32(dr["Id_Tipo_Catalogo"]),
                            Tipo_Catalogo = dr["Tipo_Catalogo"].ToString(),
                            Nombre = dr["Nombre"].ToString(),
                            Fecha_Creacion = Convert.ToDateTime(dr["Fecha_Creacion"]),
                            Fecha_Modificacion = dr["Fecha_Modificacion"] == DBNull.Value? null: Convert.ToDateTime(dr["Fecha_Modificacion"]),
                            Id_Creador = Convert.ToInt32(dr["Id_Creador"]),
                            Id_Modificador = dr["Id_Modificador"] == DBNull.Value? null: Convert.ToInt32(dr["Id_Modificador"]),
                            Activo = Convert.ToBoolean(dr["Activo"])
                        });
                    }
                }
            }

            return olist;
        
        }

        public async Task NuevoCatalogoAsyn(Catalogo_Dom oCatalogo)
        {
            using var con = _dBConectionFactory.CreateConnection();
            await con.OpenAsync();
            using (SqlCommand cmd = new SqlCommand("SP_InsertarCatalogo", con))
            {
                cmd.CommandType = CommandType.StoredProcedure;

                cmd.Parameters.Add(new SqlParameter("@Id_Tipo_Catalogo", oCatalogo.Id_Tipo_Catalogo));
                cmd.Parameters.Add(new SqlParameter("@Nombre", oCatalogo.Nombre));
                cmd.Parameters.Add(new SqlParameter("@Id_Creador", oCatalogo.Id_Creador));

                // OUTPUTS
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

                if (codigo != 0)
                    throw new Exception(mensaje);


            }
        }
    }
}

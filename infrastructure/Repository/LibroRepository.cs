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
 

      public class LibrosRepository : ILibroRepository
        {
            private readonly DBconexionfactory _dBConectionFactory;

            public LibrosRepository(DBconexionfactory dBConectionFactory)
            {
                _dBConectionFactory = dBConectionFactory;
            }

            public async Task<IEnumerable<LibroDomain>> Listar_LibrosAsync()
            {
                var olist = new List<LibroDomain>();

                using var con = _dBConectionFactory.CreateConnection();
                await con.OpenAsync();

                using (SqlCommand cmd = new SqlCommand("SpListarLibrosInactivos", con))
                {
                    cmd.CommandType = CommandType.StoredProcedure;

                    using (SqlDataReader dr = await cmd.ExecuteReaderAsync())
                    {
                        while (await dr.ReadAsync())
                        {
                            olist.Add(new LibroDomain
                            {
                                Id_Libro = dr["Id_Libro"] == DBNull.Value ? null : Convert.ToInt32(dr["Id_Libro"]),
                                Titulo = dr["Titulo"] == DBNull.Value ? null : dr["Titulo"].ToString(),
                                ISBN = dr["ISBN"] == DBNull.Value ? null : dr["ISBN"].ToString(),
                                Nombre_Autor = dr["Autor"] == DBNull.Value ? null : dr["Autor"].ToString(),
                                Nombre_Categoria = dr["Categoria"] == DBNull.Value ? null : dr["Categoria"].ToString(),
                                Editorial = dr["Editorial"] == DBNull.Value ? null : dr["Editorial"].ToString(),
                                Año_Publicacion = dr["Año_Publicacion"] == DBNull.Value ? null : Convert.ToInt32(dr["Año_Publicacion"]),
                                Stock = dr["Stock"] == DBNull.Value ? null : Convert.ToInt32(dr["Stock"]),
                                Fecha_Creacion = Convert.ToDateTime(dr["Fecha_Creacion"]),
                                Fecha_Modificacion = dr["Fecha_Modificacion"] == DBNull.Value ? null : Convert.ToDateTime(dr["Fecha_Modificacion"]),
                                Id_Creador = dr["Id_Creador"] == DBNull.Value ? null : Convert.ToInt32(dr["Id_Creador"]),
                                Id_Modificador = dr["Id_Modificador"] == DBNull.Value ? null : Convert.ToInt32(dr["Id_Modificador"]),
                                Estado = dr["Estado"] == DBNull.Value ? null : dr["Estado"].ToString()

                            });
                        }
                    }
                }

                return olist;
            }







      }


}

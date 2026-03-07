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

        public async Task<IEnumerable<LibroDomain>> Listar_autores_por_id_personaAsync( int idAutor)
        {

            var olist = new List<LibroDomain>();

            using var con = _dBConectionFactory.CreateConnection();
            await con.OpenAsync();

            using (SqlCommand cmd = new SqlCommand("SPFiltrarLibrosPorAutor", con))
            {
                cmd.CommandType = CommandType.StoredProcedure;

                cmd.Parameters.Add(new SqlParameter("@Id_Autor", idAutor));

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

        public async Task<IEnumerable<LibroDomain>> Listar_Libros_Por_CategoriaAsync(int idCategoria)
        {
            var olist = new List<LibroDomain>();

            using var con = _dBConectionFactory.CreateConnection();
            await con.OpenAsync();

            using (SqlCommand cmd = new SqlCommand("SPFiltrarLibrosPorCategoria", con))
            {
                cmd.CommandType = CommandType.StoredProcedure;
                cmd.Parameters.Add(new SqlParameter("@Id_Categoria", idCategoria));

                using (SqlDataReader dr = await cmd.ExecuteReaderAsync())
                {
                    while (await dr.ReadAsync())
                    {
                        olist.Add(new LibroDomain
                        {
                            Id_Libro = dr["Id_Libro"] == DBNull.Value ? null : Convert.ToInt32(dr["Id_Libro"]),
                            Titulo = dr["Titulo"] == DBNull.Value ? null : dr["Titulo"].ToString(),
                            ISBN = dr["ISBN"] == DBNull.Value ? null : dr["ISBN"].ToString(),
                            Nombre_Autor = dr["Nombre_Autor"] == DBNull.Value ? null : dr["Nombre_Autor"].ToString(),
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


        public async Task NuevoLibroAsync(LibroDomain olibro)
        {
            using var con = _dBConectionFactory.CreateConnection();
            await con.OpenAsync();

            using var cmd = new SqlCommand("SpInsertarLibro", con);
            {
                cmd.CommandType = CommandType.StoredProcedure;

               
                cmd.Parameters.Add(new SqlParameter("@Titulo", olibro.Titulo));
                cmd.Parameters.Add(new SqlParameter("@ISBN", (object?)olibro.ISBN ?? DBNull.Value));
                cmd.Parameters.Add(new SqlParameter("@Id_Autor", (object?)olibro.Id_Autor ?? DBNull.Value));
                cmd.Parameters.Add(new SqlParameter("@Id_Categoria", (object?)olibro.Id_Categoria ?? DBNull.Value));
                cmd.Parameters.Add(new SqlParameter("@Editorial", (object?)olibro.Editorial ?? DBNull.Value));
                cmd.Parameters.Add(new SqlParameter("@Año_Publicacion", (object?)olibro.Año_Publicacion ?? DBNull.Value));
                cmd.Parameters.Add(new SqlParameter("@Stock", (object?)olibro.Stock ?? DBNull.Value));
                cmd.Parameters.Add(new SqlParameter("@Id_Creador", (object?)olibro.Id_Creador ?? DBNull.Value));
                cmd.Parameters.Add(new SqlParameter("@Id_Estado", (object?)olibro.Id_Estado ?? DBNull.Value));

                
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

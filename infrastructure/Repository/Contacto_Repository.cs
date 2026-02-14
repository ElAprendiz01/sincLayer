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
    public class Contacto_Repository : IContacto_Repository
    {
        private readonly DBconexionfactory _dBConectionFactory;
        public Contacto_Repository(DBconexionfactory dBConectionFactory)
        {
            _dBConectionFactory = dBConectionFactory;
        }


        //Listar Contacto
        public async Task<IEnumerable<Contacto_Domai>> Listar_ContactoAsync()
        {
            var olist = new List<Contacto_Domai>();

            using var con = _dBConectionFactory.CreateConnection();
            await con.OpenAsync();

            using (SqlCommand cmd = new SqlCommand("Listar_Tbl_Contacto", con))
            {
                cmd.CommandType = CommandType.StoredProcedure;
                using (SqlDataReader dr = await cmd.ExecuteReaderAsync())
                {
                    while (await dr.ReadAsync())
                    {
                        olist.Add(new Contacto_Domai
                        {
                            Id_Contacto = Convert.ToInt32(dr["Id_Contacto"]),
                            Id_Persona = Convert.ToInt32(dr["Id_Persona "]),
                            Tipo_Contacto = Convert.ToInt32(dr["Tipo_Contacto "]),
                            Contacto = dr["Contacto"].ToString(),
                            Fecha_Creacion = Convert.ToDateTime(dr["Fecha_Creacion"]),
                            Fecha_Modificacion = Convert.ToDateTime(dr["Fecha_Modicacion"]),
                            Id_Creador = Convert.ToInt32(dr["Id_Creador"]),
                            Id_Modificador = Convert.ToInt32(dr["Id_Modificador"]),
                            Id_Estado = Convert.ToInt32(dr["Id_Estado"]),
                        });
                    }

                }

            }
            return olist;
        }

        //Listar Contacto por contacto
        public async Task<IEnumerable<Contacto_Domai>> Listar_ContactoPorContactoAsync(string Buscar)
        {
            var olist = new List<Contacto_Domai>();

            using var con = _dBConectionFactory.CreateConnection();
            await con.OpenAsync();

            using (SqlCommand cmd = new SqlCommand("Buscar_Tbl_Contacto_Contacto", con))
            {
                cmd.CommandType = CommandType.StoredProcedure;

                cmd.Parameters.Add(new SqlParameter("@Buscar", Buscar));
                using (SqlDataReader dr = await cmd.ExecuteReaderAsync())
                {
                    while (await dr.ReadAsync())
                    {
                        olist.Add(new Contacto_Domai
                        {
                            Id_Contacto = Convert.ToInt32(dr["Id_Contacto"]),
                            Id_Persona = Convert.ToInt32(dr["Id_Persona "]),
                            Tipo_Contacto = Convert.ToInt32(dr["Tipo_Contacto "]),
                            Contacto = dr["Contacto"].ToString(),
                            Fecha_Creacion = Convert.ToDateTime(dr["Fecha_Creacion"]),
                            Fecha_Modificacion = Convert.ToDateTime(dr["Fecha_Modicacion"]),
                            Id_Creador = Convert.ToInt32(dr["Id_Creador"]),
                            Id_Modificador = Convert.ToInt32(dr["Id_Modificador"]),
                            Id_Estado = Convert.ToInt32(dr["Id_Estado"]),
                        });
                    }

                }

            }
            return olist;

        }
        //Insertar Contacto
        public async Task NuevoContactoAsyn(Contacto_Domai oContacto_Domai)
        {
            using var con = _dBConectionFactory.CreateConnection();
            await con.OpenAsync();

            using (SqlCommand cmd = new SqlCommand("Insertar_Tbl_Contacto", con))
            {
                cmd.CommandType = CommandType.StoredProcedure;
                cmd.Parameters.Add(new SqlParameter("@Id_Persona", oContacto_Domai.Id_Persona));
                cmd.Parameters.Add(new SqlParameter("@Tipo_Contacto", oContacto_Domai.Tipo_Contacto));
                cmd.Parameters.Add(new SqlParameter("@Contacto", oContacto_Domai.Contacto));
                cmd.Parameters.Add(new SqlParameter("@Fecha_Creacion", oContacto_Domai.Fecha_Creacion));
                cmd.Parameters.Add(new SqlParameter("@Id_Creador", oContacto_Domai.Id_Creador));
                cmd.Parameters.Add(new SqlParameter("@Id_Modificador", oContacto_Domai.Id_Modificador));                
                cmd.Parameters.Add(new SqlParameter("@Estado", oContacto_Domai.Id_Estado));                
                await cmd.ExecuteNonQueryAsync();


            }

        }

        //Editar Contacto
        public async Task EditarContactoAsync(Contacto_Domai oContacto_Domai)
        {
            using var con = _dBConectionFactory.CreateConnection();
            await con.OpenAsync();

            using (SqlCommand cmd = new SqlCommand("Editar_Tbl_Contacto", con))
            {

                cmd.CommandType = CommandType.StoredProcedure;
                cmd.Parameters.Add(new SqlParameter("@Id_Contacto", oContacto_Domai.Id_Contacto));
                cmd.Parameters.Add(new SqlParameter("@Id_Persona", oContacto_Domai.Id_Persona));
                cmd.Parameters.Add(new SqlParameter("@Tipo_Contacto", oContacto_Domai.Tipo_Contacto));
                cmd.Parameters.Add(new SqlParameter("@Contacto", oContacto_Domai.Contacto));
                cmd.Parameters.Add(new SqlParameter("@Fecha_Creacion", oContacto_Domai.Fecha_Creacion));
                cmd.Parameters.Add(new SqlParameter("@Id_Creador", oContacto_Domai.Id_Creador));
                cmd.Parameters.Add(new SqlParameter("@Id_Modificador", oContacto_Domai.Id_Modificador));
                cmd.Parameters.Add(new SqlParameter("@Estado", oContacto_Domai.Id_Estado));


                await cmd.ExecuteNonQueryAsync();

            }
        }

        //Eliminar Contacto

        public async Task EliminarContactoAsync(int id)
        {
            using var con = _dBConectionFactory.CreateConnection();
            await con.OpenAsync();

            using (SqlCommand cmd = new SqlCommand("Eliminar_Tbl_Contacto", con))
            {

                cmd.CommandType = CommandType.StoredProcedure;
                cmd.Parameters.Add(new SqlParameter("@Id_Contacto", id));


                await cmd.ExecuteNonQueryAsync();

            }
        }
    }
}

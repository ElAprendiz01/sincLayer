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
    public class Datos_Personales_Repository : IDatos_Personales_Repository
    {
        private readonly DBconexionfactory _dBConectionFactory;
        public Datos_Personales_Repository(DBconexionfactory dBConectionFactory)
        {
            _dBConectionFactory = dBConectionFactory;
        }

        //Listar Datos_Personales
        public async Task<IEnumerable<Datos_Personales>> Listar_Datos_PersonalesAsync()
        {
            var olist = new List<Datos_Personales>();

            using var con = _dBConectionFactory.CreateConnection();
            await con.OpenAsync();

            using (SqlCommand cmd = new SqlCommand("Listar_Tbl_Datos_Personales", con))
            {
                cmd.CommandType = CommandType.StoredProcedure;
                using (SqlDataReader dr = await cmd.ExecuteReaderAsync())
                {
                    while (await dr.ReadAsync())
                    {
                        olist.Add(new Datos_Personales
                        {
                            Id_Persona = Convert.ToInt32(dr["Id_Persona"]),
                            Genero = Convert.ToInt32(dr["Genero"]),
                            Primer_Nombre = dr["Primer_Nombre"].ToString(),
                            Segundo_Nombre = dr["Segundo_Nombre"].ToString(),
                            Primer_Apellido = dr["Primer_Apellido"].ToString(),
                            Segundo_Apellido = dr["Segundo_Apellido"].ToString(),
                            Fecha_Nacimiento = Convert.ToDateTime(dr["Fecha_Nacimiento"]),
                            Tipo_DNI = Convert.ToInt32(dr["Tipo_DNI"]),
                            DNI = dr["DNI"].ToString(),
                            Fecha_Creacion = Convert.ToDateTime(dr["Fecha_Creacion"]),
                            Fecha_Modificacion = Convert.ToDateTime(dr["Fecha_Modificacion"]),
                            Id_Creador = Convert.ToInt32(dr["Id_Creador"]),
                            Id_Modificador = Convert.ToInt32(dr["Id_Modificador"]),
                            Id_Estado = Convert.ToInt32(dr["Id_Estado"])

                        });
                    }

                }

            }
            return olist;
        }

        //Listar Datos_Personales por Fecha de Nacimiento
        public async Task<IEnumerable<Datos_Personales>> Listar_Datos_PersonalesPorFechaAsync(string Buscar)
        {
            var olist = new List<Datos_Personales>();

            using var con = _dBConectionFactory.CreateConnection();
            await con.OpenAsync();

            using (SqlCommand cmd = new SqlCommand("Buscar_Tbl_Datos_Personales_Fecha_Nacimiento", con))
            {
                cmd.CommandType = CommandType.StoredProcedure;

                cmd.Parameters.Add(new SqlParameter("@Buscar", Buscar));
                using (SqlDataReader dr = await cmd.ExecuteReaderAsync())
                {
                    while (await dr.ReadAsync())
                    {
                        olist.Add(new Datos_Personales
                        {
                            Id_Persona = Convert.ToInt32(dr["Id_Persona"]),
                            Genero = Convert.ToInt32(dr["Genero"]),
                            Primer_Nombre = dr["Primer_Nombre"].ToString(),
                            Segundo_Nombre = dr["Segundo_Nombre"].ToString(),
                            Primer_Apellido = dr["Primer_Apellido"].ToString(),
                            Segundo_Apellido = dr["Segundo_Apellido"].ToString(),
                            Fecha_Nacimiento = Convert.ToDateTime(dr["Fecha_Nacimiento"]),
                            Tipo_DNI = Convert.ToInt32(dr["Tipo_DNI"]),
                            DNI = dr["DNI"].ToString(),
                            Fecha_Creacion = Convert.ToDateTime(dr["Fecha_Creacion"]),
                            Fecha_Modificacion = Convert.ToDateTime(dr["Fecha_Modificacion"]),
                            Id_Creador = Convert.ToInt32(dr["Id_Creador"]),
                            Id_Modificador = Convert.ToInt32(dr["Id_Modificador"]),
                            Id_Estado = Convert.ToInt32(dr["Id_Estado"])
                        });
                    }

                }

            }
            return olist;

        }

        //Insertar Datos Personales
        public async Task NuevoDatos_PersonalesAsyn(Datos_Personales oDatos_Personales)
        {
            using var con = _dBConectionFactory.CreateConnection();
            await con.OpenAsync();

            using (SqlCommand cmd = new SqlCommand("Insertar_Tbl_Datos_Personales", con))
            {
                cmd.CommandType = CommandType.StoredProcedure;
                cmd.Parameters.Add(new SqlParameter("@Genero", oDatos_Personales.Genero));
                cmd.Parameters.Add(new SqlParameter("@Primer_Nombre", oDatos_Personales.Primer_Nombre));
                cmd.Parameters.Add(new SqlParameter("@Segundo_Nombre", oDatos_Personales.Segundo_Nombre));
                cmd.Parameters.Add(new SqlParameter("@Primer_Apellido", oDatos_Personales.Primer_Apellido));
                cmd.Parameters.Add(new SqlParameter("@Segundo_Apellido", oDatos_Personales.Segundo_Apellido));
                cmd.Parameters.Add(new SqlParameter("@Fecha_Nacimiento", oDatos_Personales.Fecha_Nacimiento));
                cmd.Parameters.Add(new SqlParameter("@Tipo_DNI", oDatos_Personales.Tipo_DNI));
                cmd.Parameters.Add(new SqlParameter("@DNI", oDatos_Personales.DNI));
                cmd.Parameters.Add(new SqlParameter("@Fecha_Creacion", oDatos_Personales.Fecha_Creacion));
                cmd.Parameters.Add(new SqlParameter("@Fecha_Modificacion", oDatos_Personales.Fecha_Modificacion));
                cmd.Parameters.Add(new SqlParameter("@Id_Creador", oDatos_Personales.Id_Creador));
                cmd.Parameters.Add(new SqlParameter("@Id_Modificador", oDatos_Personales.Id_Modificador));
                cmd.Parameters.Add(new SqlParameter("@Id_Estado", oDatos_Personales.Id_Estado));
                await cmd.ExecuteNonQueryAsync();


            }

        }
        //Editar Datos Personales
        public async Task EditarDatos_PersonalesAsync(Datos_Personales oDatos_Personales)
        {
            using var con = _dBConectionFactory.CreateConnection();
            await con.OpenAsync();

            using (SqlCommand cmd = new SqlCommand("Editar_Tbl_Datos_Personales", con))
            {

                cmd.CommandType = CommandType.StoredProcedure;
                cmd.Parameters.Add(new SqlParameter("@Id_Persona", oDatos_Personales.Id_Persona));
                cmd.Parameters.Add(new SqlParameter("@Genero", oDatos_Personales.Genero));
                cmd.Parameters.Add(new SqlParameter("@Primer_Nombre", oDatos_Personales.Primer_Nombre));
                cmd.Parameters.Add(new SqlParameter("@Segundo_Nombre", oDatos_Personales.Segundo_Nombre));
                cmd.Parameters.Add(new SqlParameter("@Primer_Apellido", oDatos_Personales.Primer_Apellido));
                cmd.Parameters.Add(new SqlParameter("@Segundo_Apellido", oDatos_Personales.Segundo_Apellido));
                cmd.Parameters.Add(new SqlParameter("@Fecha_Nacimiento", oDatos_Personales.Fecha_Nacimiento));
                cmd.Parameters.Add(new SqlParameter("@Tipo_DNI", oDatos_Personales.Tipo_DNI));
                cmd.Parameters.Add(new SqlParameter("@DNI", oDatos_Personales.DNI));
                cmd.Parameters.Add(new SqlParameter("@Fecha_Creacion", oDatos_Personales.Fecha_Creacion));
                cmd.Parameters.Add(new SqlParameter("@Fecha_Modificacion", oDatos_Personales.Fecha_Modificacion));
                cmd.Parameters.Add(new SqlParameter("@Id_Creador", oDatos_Personales.Id_Creador));
                cmd.Parameters.Add(new SqlParameter("@Id_Modificador", oDatos_Personales.Id_Modificador));
                cmd.Parameters.Add(new SqlParameter("@Id_Estado", oDatos_Personales.Id_Estado));

                await cmd.ExecuteNonQueryAsync();

            }
        }

        //Eliminar Datos Personales

        public async Task EliminarDatos_PersonalesAsync(int id)
        {
            using var con = _dBConectionFactory.CreateConnection();
            await con.OpenAsync();

            using (SqlCommand cmd = new SqlCommand("Eliminar_Tbl_Datos_Personales", con))
            {

                cmd.CommandType = CommandType.StoredProcedure;
                cmd.Parameters.Add(new SqlParameter("@Id_Persona", id));


                await cmd.ExecuteNonQueryAsync();

            }
        }
    }
}

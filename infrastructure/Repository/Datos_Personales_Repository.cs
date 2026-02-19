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
                            Id_Persona = dr.IsDBNull(dr.GetOrdinal("Id_Persona")) ? 0 : dr.GetInt32(dr.GetOrdinal("Id_Persona")),
                            Genero = dr.IsDBNull(dr.GetOrdinal("Genero")) ? (int?)null : dr.GetInt32(dr.GetOrdinal("Genero")),
                            Primer_Nombre = dr.IsDBNull(dr.GetOrdinal("Primer_Nombre")) ? null : dr.GetString(dr.GetOrdinal("Primer_Nombre")),
                            Segundo_Nombre = dr.IsDBNull(dr.GetOrdinal("Segundo_Nombre")) ? null : dr.GetString(dr.GetOrdinal("Segundo_Nombre")),
                            Primer_Apellido = dr.IsDBNull(dr.GetOrdinal("Primer_Apellido")) ? null : dr.GetString(dr.GetOrdinal("Primer_Apellido")),
                            Segundo_Apellido = dr.IsDBNull(dr.GetOrdinal("Segundo_Apellido")) ? null : dr.GetString(dr.GetOrdinal("Segundo_Apellido")),
                            Fecha_Nacimiento = dr.IsDBNull(dr.GetOrdinal("Fecha_Nacimiento")) ? (DateTime?)null : dr.GetDateTime(dr.GetOrdinal("Fecha_Nacimiento")),
                            Tipo_DNI = dr.IsDBNull(dr.GetOrdinal("Tipo_DNI")) ? (int?)null : dr.GetInt32(dr.GetOrdinal("Tipo_DNI")),
                            DNI = dr.IsDBNull(dr.GetOrdinal("DNI")) ? null : dr.GetString(dr.GetOrdinal("DNI")),
                            Fecha_Creacion = dr.IsDBNull(dr.GetOrdinal("Fecha_Creacion")) ? (DateTime?)null : dr.GetDateTime(dr.GetOrdinal("Fecha_Creacion")),
                            Fecha_Modificacion = dr.IsDBNull(dr.GetOrdinal("Fecha_Modificacion")) ? (DateTime?)null : dr.GetDateTime(dr.GetOrdinal("Fecha_Modificacion")),
                            Id_Creador = dr.IsDBNull(dr.GetOrdinal("Id_Creador")) ? (int?)null : dr.GetInt32(dr.GetOrdinal("Id_Creador")),
                            Id_Modificador = dr.IsDBNull(dr.GetOrdinal("Id_Modificador")) ? (int?)null : dr.GetInt32(dr.GetOrdinal("Id_Modificador")),
                            Estado = dr.IsDBNull(dr.GetOrdinal("Estado")) ? null : dr.GetString(dr.GetOrdinal("Estado"))

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
                            Id_Persona = dr.IsDBNull(dr.GetOrdinal("Id_Persona")) ? 0 : dr.GetInt32(dr.GetOrdinal("Id_Persona")),
                            Genero = dr.IsDBNull(dr.GetOrdinal("Genero")) ? (int?)null : dr.GetInt32(dr.GetOrdinal("Genero")),
                            Primer_Nombre = dr.IsDBNull(dr.GetOrdinal("Primer_Nombre")) ? null : dr.GetString(dr.GetOrdinal("Primer_Nombre")),
                            Segundo_Nombre = dr.IsDBNull(dr.GetOrdinal("Segundo_Nombre")) ? null : dr.GetString(dr.GetOrdinal("Segundo_Nombre")),
                            Primer_Apellido = dr.IsDBNull(dr.GetOrdinal("Primer_Apellido")) ? null : dr.GetString(dr.GetOrdinal("Primer_Apellido")),
                            Segundo_Apellido = dr.IsDBNull(dr.GetOrdinal("Segundo_Apellido")) ? null : dr.GetString(dr.GetOrdinal("Segundo_Apellido")),
                            Fecha_Nacimiento = dr.IsDBNull(dr.GetOrdinal("Fecha_Nacimiento")) ? (DateTime?)null : dr.GetDateTime(dr.GetOrdinal("Fecha_Nacimiento")),
                            Tipo_DNI = dr.IsDBNull(dr.GetOrdinal("Tipo_DNI")) ? (int?)null : dr.GetInt32(dr.GetOrdinal("Tipo_DNI")),
                            DNI = dr.IsDBNull(dr.GetOrdinal("DNI")) ? null : dr.GetString(dr.GetOrdinal("DNI")),
                            Fecha_Creacion = dr.IsDBNull(dr.GetOrdinal("Fecha_Creacion")) ? (DateTime?)null : dr.GetDateTime(dr.GetOrdinal("Fecha_Creacion")),
                            Fecha_Modificacion = dr.IsDBNull(dr.GetOrdinal("Fecha_Modificacion")) ? (DateTime?)null : dr.GetDateTime(dr.GetOrdinal("Fecha_Modificacion")),
                            Id_Creador = dr.IsDBNull(dr.GetOrdinal("Id_Creador")) ? (int?)null : dr.GetInt32(dr.GetOrdinal("Id_Creador")),
                            Id_Modificador = dr.IsDBNull(dr.GetOrdinal("Id_Modificador")) ? (int?)null : dr.GetInt32(dr.GetOrdinal("Id_Modificador")),
                            Estado = dr.IsDBNull(dr.GetOrdinal("Estado")) ? null : dr.GetString(dr.GetOrdinal("Estado"))
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
                cmd.Parameters.Add(new SqlParameter("@Id_Creador", oDatos_Personales.Id_Creador));
                cmd.Parameters.Add(new SqlParameter("@Id_Estado", oDatos_Personales.Id_Estado));

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
                cmd.Parameters.Add(new SqlParameter("@Id_Modificador", oDatos_Personales.Id_Modificador));
                cmd.Parameters.Add(new SqlParameter("@Id_Estado", oDatos_Personales.Id_Estado));
                cmd.Parameters.Add(new SqlParameter("@ForzarRecuperacion", oDatos_Personales.ForzarRecuperacion));

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

        //Eliminar Datos Personales

        public async Task EliminarDatos_PersonalesAsync(int id, int idModificador, int Id_Estado)
        {
            using var con = _dBConectionFactory.CreateConnection();
            await con.OpenAsync();

            using (SqlCommand cmd = new SqlCommand("Eliminar_Tbl_Datos_Personales", con))
            {

                cmd.CommandType = CommandType.StoredProcedure;
                cmd.Parameters.Add(new SqlParameter("@Id_Persona", id));

                cmd.Parameters.Add(new SqlParameter("@Id_Modificador", idModificador));
                cmd.Parameters.Add(new SqlParameter("@Id_Estado", Id_Estado));


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
    }
}

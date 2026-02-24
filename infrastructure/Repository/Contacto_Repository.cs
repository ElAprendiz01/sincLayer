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
                            Id_Contacto = dr.GetInt32(dr.GetOrdinal("Id_Contacto")),
                            Id_Persona = dr.GetInt32(dr.GetOrdinal("Id_Persona")),
                            Nombre_Persona = dr.GetString(dr.GetOrdinal("Nombre_Persona")),
                            Apellido = dr.GetString(dr.GetOrdinal("Apellido")),
                            Tipo_Contacto = dr.GetInt32(dr.GetOrdinal("Tipo_Contacto")),
                            Tipo_Contacto_Nombre = dr.GetString(dr.GetOrdinal("Tipo_Contacto_Nombre")),
                            Contacto = dr.IsDBNull(dr.GetOrdinal("Contacto")) ? null : dr.GetString(dr.GetOrdinal("Contacto")),
                            Fecha_Creacion = dr.GetDateTime(dr.GetOrdinal("Fecha_Creacion")),
                            Fecha_Modificacion = dr.IsDBNull(dr.GetOrdinal("Fecha_Modificacion")) ? (DateTime?)null : dr.GetDateTime(dr.GetOrdinal("Fecha_Modificacion")),
                            Id_Creador = dr.GetInt32(dr.GetOrdinal("Id_Creador")),
                            Id_Modificador = dr.IsDBNull(dr.GetOrdinal("Id_Modificador")) ? (int?)null : dr.GetInt32(dr.GetOrdinal("Id_Modificador")),
                            Estado = dr.IsDBNull(dr.GetOrdinal("Estado")) ? null : dr.GetString(dr.GetOrdinal("Estado"))


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
                            Id_Contacto = dr.GetInt32(dr.GetOrdinal("Id_Contacto")),
                            Id_Persona = dr.GetInt32(dr.GetOrdinal("Id_Persona")),
                            Nombre_Persona = dr.GetString(dr.GetOrdinal("Nombre_Persona")),
                            Apellido = dr.GetString(dr.GetOrdinal("Apellido")),
                            Tipo_Contacto = dr.GetInt32(dr.GetOrdinal("Tipo_Contacto")),
                            Tipo_Contacto_Nombre = dr.GetString(dr.GetOrdinal("Tipo_Contacto_Nombre")),
                            Contacto = dr.IsDBNull(dr.GetOrdinal("Contacto")) ? null : dr.GetString(dr.GetOrdinal("Contacto")),
                            Fecha_Creacion = dr.GetDateTime(dr.GetOrdinal("Fecha_Creacion")),
                            Fecha_Modificacion = dr.IsDBNull(dr.GetOrdinal("Fecha_Modificacion")) ? (DateTime?)null : dr.GetDateTime(dr.GetOrdinal("Fecha_Modificacion")),
                            Id_Creador = dr.GetInt32(dr.GetOrdinal("Id_Creador")),
                            Id_Modificador = dr.IsDBNull(dr.GetOrdinal("Id_Modificador")) ? (int?)null : dr.GetInt32(dr.GetOrdinal("Id_Modificador")),
                            Estado = dr.IsDBNull(dr.GetOrdinal("Estado")) ? null : dr.GetString(dr.GetOrdinal("Estado"))


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
                cmd.Parameters.Add(new SqlParameter("@Id_Creador", oContacto_Domai.Id_Creador));                
                cmd.Parameters.Add(new SqlParameter("@Id_Estado", oContacto_Domai.Id_Estado));


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

        //Editar Contacto
        public async Task EditarContactoAsync(Contacto_Domai oContacto_Domai)
        {
            using var con = _dBConectionFactory.CreateConnection();
            await con.OpenAsync();

            using (SqlCommand cmd = new SqlCommand("Editar_Tbl_Contacto", con))
            {

                cmd.CommandType = CommandType.StoredProcedure;
                cmd.Parameters.Add(new SqlParameter("@Id_Contacto", oContacto_Domai.Id_Contacto));
                cmd.Parameters.Add(new SqlParameter("@Tipo_Contacto", oContacto_Domai.Tipo_Contacto));
                cmd.Parameters.Add(new SqlParameter("@Contacto", oContacto_Domai.Contacto));
                cmd.Parameters.Add(new SqlParameter("@Id_Modificador", oContacto_Domai.Id_Modificador));
                cmd.Parameters.Add(new SqlParameter("@Id_Estado", oContacto_Domai.Id_Estado));

                cmd.Parameters.Add(new SqlParameter("@ForzarRecuperacion", oContacto_Domai.ForzarRecuperacion));

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

        //Eliminar Contacto

        public async Task EliminarContactoAsync(int id, int idModificador)
        {
            using var con = _dBConectionFactory.CreateConnection();
            await con.OpenAsync();

            using (SqlCommand cmd = new SqlCommand("Eliminar_Tbl_Contacto", con))
            {

                cmd.CommandType = CommandType.StoredProcedure;
                cmd.Parameters.Add(new SqlParameter("@Id_Contacto", id));

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

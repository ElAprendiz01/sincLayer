using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Microsoft.Data.SqlClient;

namespace infrastructure.DB
{
    public class DBconexionfactory
    {
        private readonly string _connectionString;

        public DBconexionfactory(string connectionString)
        {
            _connectionString = connectionString;
        }
        public SqlConnection CreateConnection()
        {
            return new SqlConnection(_connectionString);
        }
    }
}

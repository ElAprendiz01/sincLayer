using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace application.DTOs
{
    public class Datos_Personales_DTOs
    {
        public int Id_Persona { get; set; }
        public int Genero { get; set; }
        public string Primer_Nombre { get; set; }
        public string Segundo_Nombre { get; set; }
        public string Primer_Apellido { get; set; }
        public string Segundo_Apellido { get; set; }
        public DateTime Fecha_Nacimiento { get; set; }
        public int Tipo_DNI { get; set; }
        public string DNI { get; set; }
        public DateTime Fecha_Creacion { get; set; }
        public DateTime Fecha_Modificacion { get; set; }
        public int Id_Creador { get; set; }
        public int Id_Modificador { get; set; }
        public int Id_Estado { get; set; }


    }
}


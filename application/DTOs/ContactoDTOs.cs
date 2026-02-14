using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace application.DTOs
{
    public class ContactoDTOs
    {
        public int Id_Contacto { get; set; }
        public int Id_Persona { get; set; }
        public int Tipo_Contacto { get; set; }
        public string Contacto { get; set; }
        public DateTime Fecha_Creacion { get; set; }
        public DateTime Fecha_Modificacion { get; set; }
        public int Id_Creador { get; set; }
        public int Id_Modificador { get; set; }
        public int Id_Estado { get; set; }

    }
}

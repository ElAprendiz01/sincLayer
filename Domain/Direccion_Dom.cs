using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Domain
{
    public class Direccion_Dom
    {
        public int? Id_Persona { get; set; }
        public string? nombre_persona { get; set; }
        public string? Apellido { get; set; }
        public int? Id_direccion { get; set; }
        public string? Ciudad { get; set; }
        public string? Barrio { get; set; }
        public string? Calle { get; set; }
        public DateTime? Fecha_Creacion { get; set; }
        public DateTime? Fecha_Modificacion { get; set; }
        public int? Id_Creador { get; set; }
        public int? Id_Modificador { get; set; }
        public int? Id_Estado { get; set; }
        public string? Estado { get; set; }
        public bool? ForzarRecuperacion { get; set; }

    }
}

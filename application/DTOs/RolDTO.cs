using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace application.DTOs
{
    public class RolDTO
    {

        public int Id_Rol { get; set; }
        public string? Nombre { get; set; }
        public DateTime Fecha_Creacion { get; set; }
        public DateTime? Fecha_Modificacion { get; set; }
        public int Id_Creador { get; set; }
        public int? Id_Modificador { get; set; }
        public int Id_Estado { get; set; }

        public bool? ForzarRecuperacion { get; set; }

    }
}

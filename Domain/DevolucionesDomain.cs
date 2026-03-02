using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Domain
{
    public class DevolucionesDomain
    {
        public int? Id_Devolucion { get; set; }
        public int? Id_Prestamo { get; set; }
        public DateTime? Fecha_Entrega { get; set; }
        public int? Id_Estado_Libro { get; set; }
        public DateTime? Fecha_Creacion { get; set; }
        public DateTime? Fecha_Modificacion { get; set; }
        public int? Id_Creador { get; set; }
        public int? Id_Modificador { get; set; }
        public int? Id_Estado { get; set; }

        public string? Usuario { get; set; }
        public string? NombreCliente { get; set; }
        public string? Libro { get; set; }
        public string? EstadoLibro { get; set; }
        public string? EstadoRegistro { get; set; }

        public bool? ForzarRecuperacion { get; set; }
    }
}

using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace application.DTOs
{
    public class Acuerdos_Pago_DTOs
    {
        public int Id_Acuerdo { get; set; }
        public int Id_Multa { get; set; }
        public decimal? Monto_Total_Acordado { get; set; }
        public int Cantidad_Cuotas { get; set; }
        public decimal? Monto_Por_Cuota { get; set; }
        public int Frecuencia_Pago { get; set; }
        public string? Frecuencia_Descripcion { get; set; }
        public DateTime Fecha_Creacion { get; set; }
        public DateTime Fecha_Modificacion { get; set; }
        public int Id_Creador { get; set; }
        public int Id_Modificador { get; set; }
        public int Id_Estado { get; set; }
        public string? Estado { get; set; }
    }
}

using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Domain
{
    public class Pagos_Domain
    {
        public int Id_Pago { get; set; }
        public int Id_Multa { get; set; }
        public int? Id_Acuerdo { get; set; }
        public decimal Monto_Pagado { get; set; }
        public int Metodo_Pago { get; set; }
        public string? Numero_Comprobante { get; set; }
        public DateTime Fecha_Pago { get; set; }
        public DateTime Fecha_Creacion { get; set; }
        public DateTime? Fecha_Modificacion { get; set; }
        public int Id_Creador { get; set; }
        public int? Id_Modificador { get; set; }
        public int Id_Estado { get; set; }

        // Propiedades adicionales (Para los Joins de los SPs)
        public string? Metodo_Pago_Nombre { get; set; }
        public string? Estado_Nombre { get; set; }
        public string? Nombre_Usuario { get; set; }
    }
}

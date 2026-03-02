using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Domain
{
    public class MultasDomain
    {
        public int? Id_Multa { get; set; }
        public int? Id_Prestamo { get; set; }
        public decimal? Monto_Multa { get; set; }
        public decimal? MontoAbono { get; set; }
        public int? Id_Motivo_Multa { get; set; }
        public bool? Pagada { get; set; }
        public DateTime? Fecha_Creacion { get; set; }
        public DateTime? Fecha_Modificacion { get; set; }
        public int? Id_Creador { get; set; }
        public int? Id_Modificador { get; set; }
        public int? Id_Estado { get; set; }
        public int? Id_Usuario { get; set; }
        public decimal? SaldoPendiente { get; set; }
        public int? Id_Usuario_Cliente { get; set; }
        public string? Nombre_Cliente { get; set; }
        public string? Libro { get; set; }
        public string? EstadoRegistro { get; set; }
        public int? CantidadMultasPendientes { get; set; }
        public decimal? TotalPendiente { get; set; }

        public bool? ForzarRecuperacion { get; set; }
    }
}

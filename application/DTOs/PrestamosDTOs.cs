using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace application.DTOs
{
    public class PrestamosDTOs
    {
        public int? Id_Prestamo          {get; set;}
        public int? Id_Usuario_Cliente   {get; set;}
        public int? Id_Libro             {get; set;}
        public string? Nombre_Cliente       {get; set;}
        public string? Libro                {get; set;}
        public DateTime? Fecha_Prestamo       {get; set;}
        public DateTime? Fecha_Vencimiento    {get; set;}
        public DateTime? Fecha_Devolucion_Real{get; set;}
        public string? Observaciones        {get; set;}
        public int? Id_Creador           {get; set;}
        public int? Id_Modificador       {get; set;}
        public string? Estado               {get; set;}
        public bool? ForzarRecuperacion   {get; set;}
        public int? Id_Estado { get; set; }
        public DateTime? Fecha_Creacion     {get; set ;}
        public DateTime? Fecha_Modificacion { get; set; }
    }
}

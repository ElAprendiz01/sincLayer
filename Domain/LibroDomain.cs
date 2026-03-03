using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Domain
{
    public class LibroDomain
    {
        public int? Id_Libro { get; set; }
        public string? Titulo { get; set; }
        public string? ISBN { get; set; }
        public int? Id_Autor { get; set; }
        public string? Nombre_Autor { get; set; }
        public int? Id_Categoria { get; set; }
        public string? Nombre_Categoria { get; set; }
        public string? Editorial { get; set; }
        public int? Año_Publicacion { get; set; }
        public int? Stock { get; set; }
        public DateTime Fecha_Creacion { get; set; }
        public DateTime? Fecha_Modificacion { get; set; }
        public int? Id_Creador { get; set; }
        public int? Id_Modificador { get; set; }
        public int? Id_Estado { get; set; }
        public string? Estado { get; set; }
        public bool? ForzarRecuperacion { get; set; }
    }
}

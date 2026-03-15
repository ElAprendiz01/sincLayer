using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Domain
{
    public class UsuarioDomain
    {
       
         
            public int? Id_Usuario { get; set; }

            public string? Usuario { get; set; }

          public string? PasswordHash { get; set; }

           public string? Rol { get; set; }
     
            public int? Id_Persona { get; set; }
            public int? Id_Creador { get; set; }
            public int? Id_Rol { get; set; }
            public int? Id_Estado { get; set; }
            public bool? ForzarRecuperacion { get; set; }
            public int? Id_Modificador { get; set; }
           public string? token { get; set; }


    }
}

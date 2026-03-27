using Domain;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace application.Interfaces
{
    public  interface ILibrosRepository
    {
        Task<IEnumerable<LibroDomain>> Listar_LibrosAsync();
        Task<IEnumerable<LibroDomain>> Listar_Libros_Por_AutorAsync(int idAutor);
        Task<IEnumerable<LibroDomain>> Listar_Libros_Por_CategoriaAsync(string nombre);
        Task NuevoLibroAsync(LibroDomain libro);
        Task EditarLibroAsync(LibroDomain libro);
        Task EliminarLibroAsync(int idLibro, int idModificador);
    }
}

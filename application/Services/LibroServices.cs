using application.DTOs;
using application.Interfaces;
using Domain;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using static application.Interfaces.ILibroRepository;

namespace application.Services
{
        public class LibrosService
        {
            private readonly ILibrosRepository _repository;

            public LibrosService(ILibrosRepository repository)
            {
                _repository = repository;
            }

            
            public async Task<IEnumerable<LibroDomain>> Listar_Libros()
            {
                var listar = await _repository.Listar_LibrosAsync();
                return listar.Select(l => new LibroDomain
                {
                    Id_Libro = l.Id_Libro,
                    Titulo = l.Titulo,
                    ISBN = l.ISBN,
                    Id_Autor = l.Id_Autor,
                    Id_Categoria = l.Id_Categoria,
                    Editorial = l.Editorial,
                    Año_Publicacion = l.Año_Publicacion,
                    Stock = l.Stock,
                    Fecha_Creacion = l.Fecha_Creacion,
                    Fecha_Modificacion = l.Fecha_Modificacion,
                    Id_Creador = l.Id_Creador,
                    Id_Modificador = l.Id_Modificador,
                    Estado = l.Estado
                });
            }

            //filtrar los libros por autor
            public async Task<IEnumerable<LibroDomain>> FiltrarLibrosPorAutor(int idAutor)
            {
                if (idAutor <= 0)
                    return Enumerable.Empty<LibroDomain>();

                var listar = await _repository.Listar_Libros_Por_AutorAsync(idAutor);
                return listar.Select(l => new LibroDomain
                {
                    Id_Libro = l.Id_Libro,
                    Titulo = l.Titulo,
                    ISBN = l.ISBN,
                    Id_Autor = l.Id_Autor,
                    Editorial = l.Editorial,
                    Año_Publicacion = l.Año_Publicacion,
                    Stock = l.Stock,
                    Fecha_Creacion = l.Fecha_Creacion,
                    Fecha_Modificacion = l.Fecha_Modificacion,
                    Id_Creador = l.Id_Creador,
                    Id_Modificador = l.Id_Modificador,
                    Estado = l.Estado
                });
            }

            // Insertar nuevo libro
            public async Task NuevoLibro(LibrosDTO olibro)
            {
                var libroDom = new LibroDomain
                {
                    Titulo = olibro.Titulo,
                    ISBN = olibro.ISBN,
                    Id_Autor = olibro.Id_Autor,
                    Id_Categoria = olibro.Id_Categoria,
                    Editorial = olibro.Editorial,
                    Año_Publicacion = olibro.Año_Publicacion,
                    Stock = olibro.Stock ?? 0,
                    Id_Creador = olibro.Id_Creador,
                    Id_Estado = olibro.Id_Estado
                };
                await _repository.NuevoLibroAsync(libroDom);
            }

            // Editar libro
            public async Task EditarLibro(LibrosDTO olibro)
            {
                var libroDom = new LibroDomain
                {
                    Id_Libro = olibro.Id_Libro ?? 0,
                    Titulo = olibro.Titulo,
                    ISBN = olibro.ISBN,
                    Id_Autor = olibro.Id_Autor,
                    Id_Categoria = olibro.Id_Categoria,
                    Editorial = olibro.Editorial,
                    Año_Publicacion = olibro.Año_Publicacion,
                    Stock = olibro.Stock ?? 0,
                    Id_Modificador = olibro.Id_Modificador,
                    Id_Estado = olibro.Id_Estado
                };
                await _repository.EditarLibroAsync(libroDom);
            }

            // Eliminar libro...
            public async Task EliminarLibro(int idLibro, int idModificador)
            {
                await _repository.EliminarLibroAsync(idLibro, idModificador);
            }
        }
}


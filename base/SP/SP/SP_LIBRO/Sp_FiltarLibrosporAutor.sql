use SYNCLAYER
go

CREATE PROCEDURE SPFiltrarLibrosPorAutor
    @Id_Autor INT
AS
BEGIN
    SET NOCOUNT ON;

    SELECT 
        l.Id_Libro,
        l.Titulo,
        l.ISBN,
        l.Id_Autor,
        a.Id_persona,
        dp.Primer_Nombre AS Nombre_Autor,
        dp.Primer_Apellido AS Apellido_Autor,
        l.Id_Categoria,
        c.Nombre AS Categoria,
        l.Editorial,
        l.Año_Publicacion,
        l.Stock,
        l.Fecha_Creacion,
        l.Fecha_Modificacion,
        l.Id_Creador,
        l.Id_Modificador,
        e.Estado AS Estado
    FROM Tbl_Libros l
    INNER JOIN Tbl_Autores a
        ON l.Id_Autor = a.Id_Autor
    INNER JOIN Tbl_Datos_Personales dp
        ON a.Id_persona = dp.Id_Persona
    INNER JOIN Cls_Catalogo c
        ON l.Id_Categoria = c.Id_Catalogo
    INNER JOIN Cls_Estado e
        ON l.Id_Estado = e.Id_Estado
    WHERE l.Id_Autor = @Id_Autor
      AND e.Estado = 'Activo'
    ORDER BY l.Id_Libro DESC;
END;
GO



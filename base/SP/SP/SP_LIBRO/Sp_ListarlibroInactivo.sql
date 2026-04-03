USE SYNCLAYER;
GO


CREATE OR ALTER PROCEDURE SPListarLibrosActivos
AS
BEGIN
    SET NOCOUNT ON;

    SELECT 
        l.Id_Libro,
        l.Titulo,
        l.ISBN,
		l.Id_Autor,
        dto.Primer_Nombre AS Nombre_Autor,
        c.Nombre AS Categoria,
        l.Editorial,
        l.Año_Publicacion,
        l.Stock,
        l.Fecha_Creacion,
        l.Fecha_Modificacion,
        l.Id_Creador,
        l.Id_Modificador,
        e.Estado
    FROM Tbl_Libros l
        INNER JOIN Tbl_Autores a ON l.Id_Autor = a.Id_Autor
        INNER JOIN Cls_Catalogo c ON l.Id_Categoria = c.Id_Catalogo
        INNER JOIN Cls_Estado e ON l.Id_Estado = e.Id_Estado
		INNER JOIN Tbl_Datos_Personales dto ON l.Id_Autor = dto.Id_Persona
    WHERE e.Estado IN ('Activo', 'Disponible', 'Disponibles', 'Activos', 'en funcion', 'Activados'
    )
    ORDER BY l.Id_Libro DESC;
END;
GO

-- ------ --------- -------
EXEC SPListarLibrosActivos;

select * from Tbl_libros
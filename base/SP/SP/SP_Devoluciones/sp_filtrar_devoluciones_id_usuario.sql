USE SYNCLAYER;
GO

CREATE OR ALTER PROCEDURE SpListarDevolucionesPorUsuario(
    @Id_Usuario_Cliente INT
)
AS
BEGIN


    SELECT 
        d.Id_Devolucion,
        d.Id_Prestamo,
        u.Usuario AS Usuario,  
        l.Titulo AS Libro,
        d.Fecha_Entrega,
        c.Nombre AS EstadoLibro,
        d.Fecha_Creacion,
        d.Fecha_Modificacion,
        d.Id_Creador,
        d.Id_Modificador,
        e.Estado AS EstadoRegistro
    FROM Tbl_Devoluciones d
    INNER JOIN Tbl_Prestamos p
        ON d.Id_Prestamo = p.Id_Prestamo
    INNER JOIN Tbl_Usuarios u
        ON p.Id_Usuario_Cliente = u.Id_Usuario
    INNER JOIN Tbl_Libros l
        ON p.Id_Libro = l.Id_Libro
    INNER JOIN Cls_Catalogo c
        ON d.Id_Estado_Libro = c.Id_Catalogo
    INNER JOIN Cls_Estado e
        ON d.Id_Estado = e.Id_Estado
    WHERE p.Id_Usuario_Cliente = @Id_Usuario_Cliente
    ORDER BY d.Id_Devolucion DESC;
END;
GO

EXEC SpListarDevolucionesPorUsuario 1;
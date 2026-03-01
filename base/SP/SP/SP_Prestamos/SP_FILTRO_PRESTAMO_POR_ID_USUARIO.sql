USE SYNCLAYER;
GO

CREATE OR ALTER PROCEDURE SpFiltrarPrestamosPorUsuario(
    @Id_Usuario_Cliente INT
)
AS
BEGIN
    SET NOCOUNT ON;

    -- Validar parámetro obligatorio
    IF @Id_Usuario_Cliente IS NULL OR @Id_Usuario_Cliente = 0
    BEGIN
        RAISERROR('El Id_Usuario_Cliente es obligatorio.', 16, 1);
        RETURN;
    END;

    SELECT 
        p.Id_Prestamo,
        p.Id_Usuario_Cliente,
        u.Usuario AS Nombre_Cliente,
        l.Titulo AS Libro,
        p.Fecha_Prestamo,
        p.Fecha_Vencimiento,
        p.Fecha_Devolucion_Real,
        p.Observaciones,
        p.Id_Creador,
        p.Id_Modificador,
        e.Estado AS Estado,
        CASE 
            WHEN p.Fecha_Devolucion_Real IS NOT NULL THEN 'Devuelto'
            WHEN GETDATE() > p.Fecha_Vencimiento AND p.Fecha_Devolucion_Real IS NULL THEN 'Vencido'
           
        END AS EstadoPrestamo
    FROM Tbl_Prestamos p
    INNER JOIN Tbl_Usuarios u
        ON p.Id_Usuario_Cliente = u.Id_Usuario
    INNER JOIN Tbl_Libros l
        ON p.Id_Libro = l.Id_Libro
    INNER JOIN Cls_Estado e
        ON p.Id_Estado = e.Id_Estado
		   WHERE e.Estado IN ('Activo', '')
    and p.Id_Usuario_Cliente = @Id_Usuario_Cliente
    ORDER BY p.Id_Prestamo DESC;
END;
GO

exec SpFiltrarPrestamosPorUsuario 3
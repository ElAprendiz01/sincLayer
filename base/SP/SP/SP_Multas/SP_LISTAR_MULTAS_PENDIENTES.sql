USE SYNCLAYER;
GO

CREATE OR ALTER PROCEDURE SpListarMultasPendientes
AS
BEGIN
    SET NOCOUNT ON;

    SELECT 
        m.Id_Multa,
        m.Id_Prestamo,
        p.Id_Usuario_Cliente,
        u.Usuario AS Nombre_Cliente,
        l.Titulo AS Libro,
        m.Monto_Multa,
        ISNULL(m.Saldo_Pendiente, m.Monto_Multa) AS SaldoPendiente,
        m.Fecha_Creacion,
        m.Fecha_Modificacion,
        m.Id_Creador,
        m.Id_Modificador,
        e.Estado AS EstadoRegistro
    FROM Tbl_Multas m
    INNER JOIN Tbl_Prestamos p
        ON m.Id_Prestamo = p.Id_Prestamo
    INNER JOIN Tbl_Usuarios u
        ON p.Id_Usuario_Cliente = u.Id_Usuario
    INNER JOIN Tbl_Libros l
        ON p.Id_Libro = l.Id_Libro
    INNER JOIN Cls_Catalogo c
        ON m.Id_Motivo_Multa = c.Id_Catalogo
    INNER JOIN Cls_Estado e
        ON m.Id_Estado = e.Id_Estado
    WHERE m.Pagada = 0 OR ISNULL(m.Saldo_Pendiente, m.Monto_Multa) > 0
	and e.Estado='Activo'
      
    ORDER BY m.Id_Multa DESC;
END;
GO

EXEC SpListarMultasPendientes;
select * from Tbl_Multas
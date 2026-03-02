USE SYNCLAYER;
GO

CREATE OR ALTER PROCEDURE SpListarUsuariosConMultasPendientes
AS
BEGIN
    SET NOCOUNT ON;

    SELECT 
        u.Id_Usuario,
        u.Usuario AS NombreCliente,
        COUNT(m.Id_Multa) AS CantidadMultasPendientes,
        SUM(ISNULL(m.Saldo_Pendiente, m.Monto_Multa)) AS TotalPendiente
    FROM Tbl_Multas m
    INNER JOIN Tbl_Prestamos p
        ON m.Id_Prestamo = p.Id_Prestamo
    INNER JOIN Tbl_Usuarios u
        ON p.Id_Usuario_Cliente = u.Id_Usuario
    INNER JOIN Cls_Estado e
        ON m.Id_Estado = e.Id_Estado
    WHERE (m.Pagada = 0 OR ISNULL(m.Saldo_Pendiente, m.Monto_Multa) > 0)
      AND e.Estado in ( 'Activo', 'Parcial')
    GROUP BY u.Id_Usuario, u.Usuario
    ORDER BY TotalPendiente DESC;
END;
GO

EXEC SpListarUsuariosConMultasPendientes;
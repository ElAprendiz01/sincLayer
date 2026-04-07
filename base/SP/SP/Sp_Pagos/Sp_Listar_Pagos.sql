use SYNCLAYER
GO

CREATE OR ALTER PROC Sp_Listar_Pagos
AS
BEGIN 	
    SET NOCOUNT ON;
    SELECT
        p.Id_Pago AS Id_Pago,
        p.Id_Multa AS Id_Multa,
        p.Id_Acuerdo AS Id_Acuerdo,
        p.Monto_Pagado AS Monto_Pagado,
        cat.Nombre AS Metodo_Pago_Nombre,
        p.Numero_Comprobante AS Numero_Comprobante,
        p.Fecha_Pago AS Fecha_Pago,
        p.Id_Creador AS Id_Usuario,
        est.Estado AS Estado_Nombre
    FROM Tbl_Pagos AS p
    INNER JOIN Cls_Catalogo AS cat ON p.Metodo_Pago = cat.Id_Catalogo
    INNER JOIN Cls_Estado AS est ON p.Id_Estado = est.Id_Estado
    WHERE p.Id_Estado = 3
    ORDER BY p.Id_Pago DESC;
END
GO
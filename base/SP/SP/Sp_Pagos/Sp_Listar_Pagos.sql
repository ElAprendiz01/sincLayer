use SYNCLAYER
GO

CREATE OR ALTER PROC Sp_Listar_Pagos
AS
BEGIN 	
    SET NOCOUNT ON;
    SELECT
        p.Id_Pago AS 'Id',
        p.Id_Multa AS 'Id Multa',
        p.Id_Acuerdo AS 'Id Acuerdo',
        p.Monto_Pagado AS 'Monto',
        cat.Nombre AS 'Metodo Pago',
        p.Numero_Comprobante AS 'Comprobante',
        p.Fecha_Pago AS 'Fecha Pago',
        p.Id_Creador AS 'Id Usuario'
    FROM Tbl_Pagos AS p
    INNER JOIN Cls_Catalogo AS cat ON p.Metodo_Pago = cat.Id_Catalogo
    WHERE p.Id_Estado = 3
    ORDER BY p.Id_Pago DESC;
END
GO
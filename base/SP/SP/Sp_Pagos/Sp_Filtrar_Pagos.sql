use SYNCLAYER
go

CREATE OR ALTER PROC Sp_Filtrar_Pagos(
    @Numero_Comprobante NVARCHAR(100) = NULL,
    @Id_Multa INT = NULL
) AS
BEGIN 	
    SET NOCOUNT ON;
    BEGIN TRY
        SELECT
            p.Id_Pago AS 'Id',
            p.Id_Multa AS 'Id Multa',
            p.Monto_Pagado AS 'Monto',
            cat.Nombre AS 'Metodo Pago',
            p.Numero_Comprobante AS 'Comprobante',
            p.Fecha_Pago AS 'Fecha Pago'
        FROM Tbl_Pagos AS p
        INNER JOIN Cls_Catalogo AS cat ON p.Metodo_Pago = cat.Id_Catalogo
        WHERE 
            (@Numero_Comprobante IS NULL OR p.Numero_Comprobante LIKE '%' + @Numero_Comprobante + '%') AND
            (@Id_Multa IS NULL OR p.Id_Multa = @Id_Multa) AND
            p.Id_Estado = 3
        ORDER BY p.Id_Pago DESC;
    END TRY
    BEGIN CATCH
        ;THROW;
    END CATCH
END
GO
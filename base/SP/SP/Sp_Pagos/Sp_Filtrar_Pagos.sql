use SYNCLAYER
go

CREATE OR ALTER PROC Sp_Filtrar_Pagos (
    @Numero_Comprobante NVARCHAR(100) = NULL,
    @Id_Multa INT = NULL
) AS
BEGIN 	
    SET NOCOUNT ON;
    SELECT
        p.Id_Pago,
        p.Id_Multa,
        p.Monto_Pagado,
        cat.Nombre AS Metodo_Pago_Nombre,
        p.Numero_Comprobante,
        p.Fecha_Pago
    FROM Tbl_Pagos AS p
    INNER JOIN Cls_Catalogo AS cat ON p.Metodo_Pago = cat.Id_Catalogo
    WHERE (p.Numero_Comprobante LIKE '%' + ISNULL(@Numero_Comprobante, '') + '%' OR @Numero_Comprobante IS NULL)
      AND (p.Id_Multa = @Id_Multa OR @Id_Multa IS NULL)
      AND p.Id_Estado = 3
    ORDER BY p.Id_Pago DESC;
END
GO
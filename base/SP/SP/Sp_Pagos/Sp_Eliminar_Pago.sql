Use SYNCLAYER
Go

CREATE OR ALTER PROC Sp_Anular_Pago (
    @Id_Pago INT,
    @Id_Modificador INT
) AS
BEGIN
    SET NOCOUNT ON;
    DECLARE @Monto_Reversar DECIMAL(10,2);
    DECLARE @Id_Multa_Asociada INT;

    BEGIN TRY
        -- Obtener datos del pago antes de anular
        SELECT @Monto_Reversar = Monto_Pagado, @Id_Multa_Asociada = Id_Multa 
        FROM Tbl_Pagos WHERE Id_Pago = @Id_Pago AND Id_Estado = 3;

        IF @Monto_Reversar IS NULL
            THROW 50003, 'El pago no existe o ya está inactivo.', 1;

        BEGIN TRANSACTION;
            -- 1. Anulación lógica del pago
            UPDATE Tbl_Pagos 
            SET Id_Estado = 4, 
                Id_Modificador = @Id_Modificador, 
                Fecha_Modificacion = GETDATE()
            WHERE Id_Pago = @Id_Pago;

            -- 2. Reversar el saldo en la multa
            UPDATE Tbl_Multas
            SET Saldo_Pendiente = Saldo_Pendiente + @Monto_Reversar,
                Pagada = 0, -- Al devolver deuda, ya no puede estar marcada como pagada
                Id_Modificador = @Id_Modificador,
                Fecha_Modificacion = GETDATE()
            WHERE Id_Multa = @Id_Multa_Asociada;

        COMMIT TRANSACTION;
        SELECT 'Pago anulado y saldo de multa restaurado' AS Mensaje;
    END TRY
    BEGIN CATCH
        IF @@TRANCOUNT > 0 ROLLBACK TRANSACTION;
        THROW;
    END CATCH
END
GO
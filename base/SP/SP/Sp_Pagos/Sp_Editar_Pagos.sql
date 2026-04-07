USE SYNCLAYER;
GO

CREATE OR ALTER PROC Sp_Editar_Pagos(
    @Id_Pago INT,
    @Monto_Pagado DECIMAL(10,2) = NULL,
    @Metodo_Pago INT = NULL,
    @Numero_Comprobante NVARCHAR(100) = NULL,
    @Id_Modificador INT
) AS
BEGIN 	
    SET NOCOUNT ON;
    SET XACT_ABORT ON;

    DECLARE @Monto_Anterior DECIMAL(10,2);
    DECLARE @Id_Multa INT;
    DECLARE @Diferencia DECIMAL(10,2);

    BEGIN TRY
        -- 1. Validar existencia y obtener valores actuales
        SELECT @Monto_Anterior = Monto_Pagado, @Id_Multa = Id_Multa 
        FROM Tbl_Pagos 
        WHERE Id_Pago = @Id_Pago AND Id_Estado = 3;

        IF @Monto_Anterior IS NULL
            THROW 50001, 'No existe el registro de pago solicitado o ya está inactivo.', 1;

        BEGIN TRANSACTION;
            IF @Monto_Pagado IS NOT NULL AND @Monto_Pagado <> @Monto_Anterior
            BEGIN
                SET @Diferencia = @Monto_Anterior - @Monto_Pagado;

                UPDATE Tbl_Multas
                SET Saldo_Pendiente = Saldo_Pendiente + @Diferencia,
                    Pagada = CASE WHEN (Saldo_Pendiente + @Diferencia) <= 0 THEN 1 ELSE 0 END,
                    Fecha_Modificacion = GETDATE(),
                    Id_Modificador = @Id_Modificador
                WHERE Id_Multa = @Id_Multa;
            END

            -- 3. Actualizar el registro del Pago
            UPDATE Tbl_Pagos 
            SET
                Monto_Pagado = COALESCE(@Monto_Pagado, Monto_Pagado),
                Metodo_Pago = COALESCE(@Metodo_Pago, Metodo_Pago),
                Numero_Comprobante = COALESCE(TRIM(@Numero_Comprobante), Numero_Comprobante),
                Id_Modificador = @Id_Modificador,
                Fecha_Modificacion = GETDATE()
            WHERE Id_Pago = @Id_Pago;

        COMMIT TRANSACTION;
        
        SELECT 'Pago editado y saldo de multa actualizado exitosamente.' AS mensaje;
    END TRY
    BEGIN CATCH
        IF @@TRANCOUNT > 0 ROLLBACK;
        ;THROW;
    END CATCH
END
GO
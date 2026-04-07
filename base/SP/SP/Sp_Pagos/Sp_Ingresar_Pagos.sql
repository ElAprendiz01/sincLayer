use SYNCLAYER
go

CREATE OR ALTER PROC Sp_Ingresar_Pagos (
    @Id_Multa INT,
    @Id_Acuerdo INT = NULL,
    @Monto_Pagado DECIMAL(10,2),
    @Metodo_Pago INT,
    @Numero_Comprobante NVARCHAR(100),
    @Id_Creador INT
) AS
BEGIN 	
    SET NOCOUNT ON;
    SET XACT_ABORT ON;
    DECLARE @Saldo_Actual DECIMAL(10,2);

    BEGIN TRY
        -- 1. Validar existencia y obtener saldo de la multa
        SELECT @Saldo_Actual = Saldo_Pendiente FROM Tbl_Multas WHERE Id_Multa = @Id_Multa;

        IF @Saldo_Actual IS NULL
            THROW 50001, 'La multa especificada no existe.', 1;
        
        IF @Monto_Pagado > @Saldo_Actual
            THROW 50002, 'El monto del pago no puede ser mayor al saldo pendiente.', 1;

        BEGIN TRANSACTION;
            -- 2. Insertar el Pago
            INSERT INTO Tbl_Pagos (Id_Multa, Id_Acuerdo, Monto_Pagado, Metodo_Pago, Numero_Comprobante, Id_Creador, Id_Estado, Fecha_Pago)
            VALUES (@Id_Multa, @Id_Acuerdo, @Monto_Pagado, @Metodo_Pago, TRIM(@Numero_Comprobante), @Id_Creador, 3, GETDATE());

            -- 3. Actualizar Saldo en Tbl_Multas y marcar como pagada si llega a cero
            UPDATE Tbl_Multas 
            SET Saldo_Pendiente = Saldo_Pendiente - @Monto_Pagado,
                Pagada = CASE WHEN (Saldo_Pendiente - @Monto_Pagado) <= 0 THEN 1 ELSE 0 END,
                Fecha_Modificacion = GETDATE(),
                Id_Modificador = @Id_Creador
            WHERE Id_Multa = @Id_Multa;

        COMMIT TRANSACTION;

        SELECT SCOPE_IDENTITY() AS Id_Generado, 'Pago registrado y saldo actualizado correctamente' AS Mensaje;
    END TRY
    BEGIN CATCH
        IF @@TRANCOUNT > 0 ROLLBACK TRANSACTION;
        THROW;
    END CATCH
END
GO
USE SYNCLAYER;
GO

CREATE OR ALTER PROCEDURE SpAbonarMulta(
    @Id_Multa INT,
    @MontoAbono DECIMAL(10,2),
    @Id_Modificador INT,
    @O_Numero INT OUTPUT,
    @O_Msg VARCHAR(255) OUTPUT
)
AS
BEGIN
    SET NOCOUNT ON;

    -- Validar existencia de la multa
    IF NOT EXISTS (SELECT 1 FROM Tbl_Multas WHERE Id_Multa = @Id_Multa)
    BEGIN
        SET @O_Numero = -1;
        SET @O_Msg = 'La multa no existe.';
        RETURN;
    END;

    -- Validar monto de abono
    IF @MontoAbono <= 0
    BEGIN
        SET @O_Numero = -1;
        SET @O_Msg = 'El monto de abono debe ser mayor a cero.';
        RETURN;
    END;

    DECLARE @SaldoPendiente DECIMAL(10,2), @NuevoSaldo DECIMAL(10,2), @NuevoEstado INT;

    SELECT @SaldoPendiente = Saldo_Pendiente
    FROM Tbl_Multas
    WHERE Id_Multa = @Id_Multa;

    IF @SaldoPendiente IS NULL
    BEGIN
        -- Inicializar saldo pendiente con el monto original
        SELECT @SaldoPendiente = Monto_Multa
        FROM Tbl_Multas
        WHERE Id_Multa = @Id_Multa;
    END;

    SET @NuevoSaldo = @SaldoPendiente - @MontoAbono;

    IF @NuevoSaldo < 0
    BEGIN
        SET @O_Numero = -1;
        SET @O_Msg = 'El abono excede el saldo pendiente.';
        RETURN;
    END;

    -- Determinar nuevo estado
    IF @NuevoSaldo = 0
    BEGIN
        SELECT TOP 1 @NuevoEstado = Id_Estado
        FROM Cls_Estado
        WHERE Estado = 'Pagada' AND Activo = 1;
    END
    ELSE
    BEGIN
        SELECT TOP 1 @NuevoEstado = Id_Estado
        FROM Cls_Estado
        WHERE Estado = 'Parcial' AND Activo = 1;
    END;

    BEGIN TRY
        BEGIN TRAN;

        UPDATE Tbl_Multas
        SET 
            Saldo_Pendiente = @NuevoSaldo,
            Pagada = CASE WHEN @NuevoSaldo = 0 THEN 1 ELSE 0 END,
            Id_Estado = @NuevoEstado,
            Fecha_Modificacion = GETDATE(),
            Id_Modificador = @Id_Modificador
        WHERE Id_Multa = @Id_Multa;

        COMMIT TRAN;

        SET @O_Numero = 200;
        SET @O_Msg = CASE 
                        WHEN @NuevoSaldo = 0 THEN 'La multa ha sido pagada en su totalidad.'
                        ELSE 'Se registró el abono. Saldo pendiente: ' + CAST(@NuevoSaldo AS VARCHAR(20))
                     END;
    END TRY
    BEGIN CATCH
        IF @@TRANCOUNT > 0 ROLLBACK TRAN;

        SET @O_Numero = ERROR_NUMBER();
        SET @O_Msg = ERROR_MESSAGE();
    END CATCH;
END;
GO

DECLARE @Num INT, @Msg VARCHAR(255);

EXEC SpAbonarMulta
    @Id_Multa = 7,
    @MontoAbono = 20.00,
    @Id_Modificador = 2,
    @O_Numero = @Num OUTPUT,
    @O_Msg = @Msg OUTPUT;

SELECT @Num AS Numero, @Msg AS Mensaje;
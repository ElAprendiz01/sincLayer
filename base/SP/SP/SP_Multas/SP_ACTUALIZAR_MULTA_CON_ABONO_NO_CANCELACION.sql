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

        -- 1. Actualizar el saldo de la multa
        UPDATE Tbl_Multas
        SET 
            Saldo_Pendiente = @NuevoSaldo,
            Pagada = CASE WHEN @NuevoSaldo = 0 THEN 1 ELSE 0 END,
            Id_Estado = @NuevoEstado,
            Fecha_Modificacion = GETDATE(),
            Id_Modificador = @Id_Modificador
        WHERE Id_Multa = @Id_Multa;

        -- 2. Buscar si hay un acuerdo de pago
        DECLARE @Id_Acuerdo_Detectado INT = NULL;
        
        SELECT TOP 1 @Id_Acuerdo_Detectado = Id_Acuerdo
        FROM Tbl_Acuerdos_Pago
        WHERE Id_Multa = @Id_Multa 
        ORDER BY Id_Acuerdo DESC;

        -- 3. Preparar método de pago
        DECLARE @IdMetodoEfectivo INT;
        SELECT TOP 1 @IdMetodoEfectivo = Id_Catalogo FROM Cls_Catalogo WHERE Nombre = 'Efectivo';

        -- 4. Registrar el pago
        INSERT INTO Tbl_Pagos (
            Id_Multa,
            Id_Acuerdo,
            Monto_Pagado,
            Metodo_Pago,
            Fecha_Pago,
            Id_Creador,
            Id_Estado
        )
        VALUES (
            @Id_Multa,
            @Id_Acuerdo_Detectado,
            @MontoAbono,
            ISNULL(@IdMetodoEfectivo, 1),
            GETDATE(),
            @Id_Modificador,
            @NuevoEstado -- El pago hereda si fue un abono (Parcial) o el pago final (Pagada)
        );

        -- Capturar el ID recién generado y actualizar el comprobante
        DECLARE @IdPagoInsertado INT = SCOPE_IDENTITY();
        DECLARE @NumeroComprobanteGenerado VARCHAR(50) = 'Pag' + CAST((4563368 + @IdPagoInsertado) AS VARCHAR(20));

        UPDATE Tbl_Pagos
        SET Numero_Comprobante = @NumeroComprobanteGenerado
        WHERE Id_Pago = @IdPagoInsertado;

        -- 5. Cerrar el acuerdo si el saldo llegó a cero
        IF @NuevoSaldo = 0 AND @Id_Acuerdo_Detectado IS NOT NULL
        BEGIN
            DECLARE @IdEstadoCompletado INT;
            
            SELECT TOP 1 @IdEstadoCompletado = Id_Estado 
            FROM Cls_Estado 
            WHERE Estado IN ('Completado', 'Pagado', 'Cancelado') AND Activo = 1;

            UPDATE Tbl_Acuerdos_Pago
            SET 
                Id_Estado = ISNULL(@IdEstadoCompletado, Id_Estado),
                Fecha_Modificacion = GETDATE(),
                Id_Modificador = @Id_Modificador
            WHERE Id_Acuerdo = @Id_Acuerdo_Detectado;
        END;

        COMMIT TRAN;

        SET @O_Numero = 200;
        SET @O_Msg = CASE 
                        WHEN @NuevoSaldo = 0 THEN 'Multa pagada. Comprobante: ' + @NumeroComprobanteGenerado
                        ELSE 'Abono registrado. Saldo: ' + CAST(@NuevoSaldo AS VARCHAR(20)) + '. Comprobante: ' + @NumeroComprobanteGenerado
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
    @Id_Multa = 2,
    @MontoAbono = 160.00,
    @Id_Modificador = 2,
    @O_Numero = @Num OUTPUT,
    @O_Msg = @Msg OUTPUT;

SELECT @Num AS Numero, @Msg AS Mensaje;

select * from Tbl_Multas

select * from Tbl_Pagos

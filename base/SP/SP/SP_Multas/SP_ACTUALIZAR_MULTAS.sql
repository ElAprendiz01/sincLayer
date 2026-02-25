USE SYNCLAYER;
GO

CREATE OR ALTER PROCEDURE SpActualizarMulta(
    @Id_Multa INT,
    @Id_Modificador INT,
    @Pagada BIT = NULL,
    @Id_Estado INT = NULL,
    @ForzarRecuperacion BIT = 0,
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

    -- Validar estado si se envió
    IF @Id_Estado IS NOT NULL
    BEGIN
        IF NOT EXISTS (
            SELECT 1
            FROM Cls_Estado
            WHERE Id_Estado = @Id_Estado
              AND Activo = 1
        )
        BEGIN
            SET @O_Numero = -1;
            SET @O_Msg = 'El estado no existe o está desactivado.';
            RETURN;
        END;

        -- Evitar asignar estados inválidos
        IF EXISTS (
            SELECT 1
            FROM Cls_Estado e
            WHERE e.Id_Estado = @Id_Estado
              AND e.Estado IN ('Eliminado','Suspendido')
        )
        BEGIN
            SET @O_Numero = -1;
            SET @O_Msg = 'No se puede asignar un estado inválido a la multa.';
            RETURN;
        END;
    END;

    -- Validar que la multa no esté eliminada, salvo recuperación forzada
    IF @ForzarRecuperacion = 0
       AND EXISTS (
            SELECT 1
            FROM Tbl_Multas m
            INNER JOIN Cls_Estado e ON m.Id_Estado = e.Id_Estado
            WHERE m.Id_Multa = @Id_Multa
              AND e.Estado IN ('Eliminado','Inactivo','Desactivado')
       )
    BEGIN
        SET @O_Numero = -1;
        SET @O_Msg = 'La multa está eliminada o inactiva. Para recuperarla use @ForzarRecuperacion = 1.';
        RETURN;
    END;

    BEGIN TRY
        BEGIN TRAN;

        UPDATE Tbl_Multas
        SET
            Pagada = COALESCE(@Pagada, Pagada),
            Id_Estado = COALESCE(@Id_Estado, Id_Estado),
            Fecha_Modificacion = GETDATE(),
            Id_Modificador = @Id_Modificador
        WHERE Id_Multa = @Id_Multa;

        COMMIT TRAN;

        SET @O_Numero = 200;
        SET @O_Msg = 'La multa se ha actualizado correctamente.';
    END TRY
    BEGIN CATCH
        IF @@TRANCOUNT > 0 ROLLBACK TRAN;

        SET @O_Numero = ERROR_NUMBER();
        SET @O_Msg = ERROR_MESSAGE();
    END CATCH;
END;
GO




DECLARE @Num INT, @Msg VARCHAR(255);

EXEC SpActualizarMulta
    @Id_Multa = 5,
    @Id_Modificador = 2,
    @Pagada = 1,              -- marcar como pagada
    @Id_Estado = 3,           -- estado "Cancelada" o "Activa"
    @O_Numero = @Num OUTPUT,
    @O_Msg = @Msg OUTPUT;

SELECT @Num AS Numero, @Msg AS Mensaje;

USE SYNCLAYER;
GO

CREATE OR ALTER PROCEDURE SpDesactivarMultaAutomatico(
    @Id_Multa INT,
    @Id_Modificador INT,
    @O_Numero INT OUTPUT,
    @O_Msg VARCHAR(255) OUTPUT
)
AS
BEGIN
    SET NOCOUNT ON;

    -- Validar parámetro obligatorio
    IF @Id_Multa IS NULL OR @Id_Multa = 0
    BEGIN
        SET @O_Numero = -1;
        SET @O_Msg = 'El Id_Multa es obligatorio.';
        RETURN;
    END;

    -- Validar que la multa exista y no esté ya desactivada/eliminada
    DECLARE @ExisteMulta INT;

    SELECT @ExisteMulta = 1
    FROM Tbl_Multas m
    INNER JOIN Cls_Estado e ON m.Id_Estado = e.Id_Estado
    WHERE m.Id_Multa = @Id_Multa
      AND e.Estado NOT IN ('Desactivado','Inactivo','Eliminado')
      AND e.Activo = 1;

    IF @ExisteMulta IS NULL
    BEGIN
        SET @O_Numero = -1;
        SET @O_Msg = 'La multa no existe o ya está desactivada/eliminada.';
        RETURN;
    END;

    -- Buscar el Id_Estado de desactivación
    DECLARE @Id_Estado INT;

    SELECT TOP 1 @Id_Estado = Id_Estado
    FROM Cls_Estado
    WHERE Estado IN ('Desactivado','Inactivo','Eliminado')
      AND Activo = 1
    ORDER BY Id_Estado;

    IF @Id_Estado IS NULL
    BEGIN
        SET @O_Numero = -1;
        SET @O_Msg = 'No se encontró un estado válido de desactivación.';
        RETURN;
    END;

    BEGIN TRY
        BEGIN TRAN;

        UPDATE Tbl_Multas
        SET 
            Id_Estado = @Id_Estado,
            Id_Modificador = @Id_Modificador,
            Fecha_Modificacion = GETDATE()
        WHERE Id_Multa = @Id_Multa;

        COMMIT TRAN;

        SET @O_Numero = 200;
        SET @O_Msg = 'Multa desactivada correctamente.';
    END TRY
    BEGIN CATCH
        IF @@TRANCOUNT > 0 ROLLBACK TRAN;

        SET @O_Numero = ERROR_NUMBER();
        SET @O_Msg = ERROR_MESSAGE();
    END CATCH;
END;
GO
DECLARE @Num INT, @Msg VARCHAR(255);

EXEC SpDesactivarMultaAutomatico
    @Id_Multa = 12,
    @Id_Modificador = 1,
    @O_Numero = @Num OUTPUT,
    @O_Msg = @Msg OUTPUT;

SELECT @Num AS Numero, @Msg AS Mensaje;

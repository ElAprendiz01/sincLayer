USE SYNCLAYER;
GO

CREATE OR ALTER PROCEDURE SpDesactivarDevolucionAutomatico(
    @Id_Devolucion INT,
    @Id_Modificador INT,
    @O_Numero INT OUTPUT,
    @O_Msg VARCHAR(255) OUTPUT
)
AS
BEGIN
    SET NOCOUNT ON;

    IF @Id_Devolucion IS NULL OR @Id_Devolucion = 0
    BEGIN
        SET @O_Numero = -1;
        SET @O_Msg = 'El Id_Devolucion es obligatorio.';
        RETURN;
    END;

    -- Validar que la devolución exista y no esté ya desactivada/eliminada
    DECLARE @ExisteDevolucion INT;

    SELECT @ExisteDevolucion = 1
    FROM Tbl_Devoluciones d
    INNER JOIN Cls_Estado e ON d.Id_Estado = e.Id_Estado
    WHERE d.Id_Devolucion = @Id_Devolucion
      AND e.Estado NOT IN ('Desactivado','Inactivo','Eliminado')
      AND e.Activo = 1;

    IF @ExisteDevolucion IS NULL
    BEGIN
        SET @O_Numero = -1;
        SET @O_Msg = 'La devolución no existe o ya está desactivada/eliminada.';
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

        UPDATE Tbl_Devoluciones
        SET 
            Id_Estado = @Id_Estado,
            Id_Modificador = @Id_Modificador,
            Fecha_Modificacion = GETDATE()
        WHERE Id_Devolucion = @Id_Devolucion;

        COMMIT TRAN;

        SET @O_Numero = 200;
        SET @O_Msg = 'Devolución desactivada correctamente.';
    END TRY
    BEGIN CATCH
        IF @@TRANCOUNT > 0 ROLLBACK TRAN;

        SET @O_Numero = ERROR_NUMBER();
        SET @O_Msg = ERROR_MESSAGE();
    END CATCH;
END;
GO

DECLARE @Num INT, @Msg VARCHAR(255);

EXEC SpDesactivarDevolucionAutomatico
    @Id_Devolucion = 5,
    @Id_Modificador = 1,
    @O_Numero = @Num OUTPUT,
    @O_Msg = @Msg OUTPUT;

SELECT @Num AS Numero, @Msg AS Mensaje;
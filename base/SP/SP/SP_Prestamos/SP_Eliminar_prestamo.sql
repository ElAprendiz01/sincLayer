USE SYNCLAYER;
GO

CREATE OR ALTER PROCEDURE SpDesactivarPrestamoAutomatico
(
    @Id_Prestamo INT,
    @Id_Modificador INT,
    @O_Numero INT OUTPUT,
    @O_Msg VARCHAR(255) OUTPUT
)
AS
BEGIN
    SET NOCOUNT ON;

    IF @Id_Prestamo IS NULL OR @Id_Prestamo = 0
    BEGIN
        SET @O_Numero = -1;
        SET @O_Msg = 'El Id_Prestamo es obligatorio.';
        RETURN;
    END;

    -- Validar que el préstamo exista y no esté ya desactivado/eliminado
    DECLARE @ExistePrestamo INT;

    SELECT @ExistePrestamo = 1
    FROM Tbl_Prestamos p
    INNER JOIN Cls_Estado e ON p.Id_Estado = e.Id_Estado
    WHERE p.Id_Prestamo = @Id_Prestamo
      AND e.Estado NOT IN ('Desactivado','Inactivo','Eliminado')
      AND e.Activo = 1;

    IF @ExistePrestamo IS NULL
    BEGIN
        SET @O_Numero = -1;
        SET @O_Msg = 'El préstamo no existe o ya está desactivado/eliminado.';
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

        UPDATE Tbl_Prestamos
        SET 
            Id_Estado = @Id_Estado,
            Id_Modificador = @Id_Modificador,
            Fecha_Modificacion = GETDATE()
        WHERE Id_Prestamo = @Id_Prestamo;

        COMMIT TRAN;

        SET @O_Numero = 200;
        SET @O_Msg = 'Préstamo desactivado correctamente.';
    END TRY
    BEGIN CATCH
        IF @@TRANCOUNT > 0 ROLLBACK TRAN;

        SET @O_Numero = ERROR_NUMBER();
        SET @O_Msg = ERROR_MESSAGE();
    END CATCH;
END;
GO


DECLARE @Num INT, @Msg VARCHAR(255);

EXEC SpDesactivarPrestamoAutomatico
    @Id_Prestamo = 3,
    @Id_Modificador = 3,
    @O_Numero = @Num OUTPUT,
    @O_Msg = @Msg OUTPUT;

SELECT @Num AS Numero, @Msg AS Mensaje;
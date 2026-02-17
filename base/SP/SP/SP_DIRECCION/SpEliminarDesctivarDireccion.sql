USE SYNCLAYER;
GO

CREATE OR ALTER PROCEDURE SpDesactivarDireccionAutomatico
(
    @Id_direccion INT,
    @Id_Modificador INT,
    @O_Numero INT OUTPUT,
    @O_Msg VARCHAR(255) OUTPUT
)
AS
BEGIN
    SET NOCOUNT ON;

    IF @Id_direccion IS NULL OR @Id_direccion = 0
    BEGIN
        SET @O_Numero = -1;
        SET @O_Msg = 'El Id_direccion es obligatorio.';
        RETURN;
    END;

    -- Buscar la dirección que aún NO esté desactivada/eliminada
    DECLARE @ExisteDireccion INT;

    SELECT @ExisteDireccion = 1
    FROM Tbl_direcciones d
    INNER JOIN Cls_Estado e ON d.Id_Estado = e.Id_Estado
    WHERE d.Id_direccion = @Id_direccion
      AND e.Estado NOT IN ('Desactivado', 'Inactivo', 'Eliminado')
      AND e.Activo = 1;

    IF @ExisteDireccion IS NULL
    BEGIN
        SET @O_Numero = -1;
        SET @O_Msg = 'La dirección no existe o ya está desactivada o eliminada.';
        RETURN;
    END;

    -- Buscar el Id_Estado de desactivación
    DECLARE @Id_Estado INT;

    SELECT TOP 1 @Id_Estado = Id_Estado
    FROM Cls_Estado
    WHERE Estado IN ('Desactivado', 'Inactivo', 'Eliminado')
      AND Activo = 1
    ORDER BY Id_Estado;

    IF @Id_Estado IS NULL
    BEGIN
        SET @O_Numero = -1;
        SET @O_Msg = 'No se encontró un estado activo de desactivación.';
        RETURN;
    END;

    BEGIN TRY
        BEGIN TRAN;

        UPDATE Tbl_direcciones
        SET 
            Id_Estado = @Id_Estado, 
            Id_Modificador = @Id_Modificador,
            Fecha_Modificacion = GETDATE()
        WHERE Id_direccion = @Id_direccion;

        COMMIT;

        SET @O_Numero = 200;
        SET @O_Msg = 'Dirección desactivada correctamente.';
    END TRY
    BEGIN CATCH
        IF @@TRANCOUNT > 0 ROLLBACK;

        SET @O_Numero = ERROR_NUMBER();
        SET @O_Msg = ERROR_MESSAGE();
    END CATCH;
END;
GO

DECLARE @Num INT, @Msg VARCHAR(255);

EXEC SpDesactivarDireccionAutomatico
    @Id_direccion = 3,
    @Id_Modificador = 1,
    @O_Numero = @Num OUTPUT,
    @O_Msg = @Msg OUTPUT;

SELECT @Num AS Numero, @Msg AS Mensaje;

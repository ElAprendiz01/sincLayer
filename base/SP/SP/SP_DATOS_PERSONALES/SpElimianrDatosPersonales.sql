USE SYNCLAYER;
GO


CREATE OR ALTER PROCEDURE Eliminar_Tbl_Datos_Personales
(
    @Id_Persona INT,
    @Id_Modificador INT,
    @O_Numero INT OUTPUT,
    @O_Msg VARCHAR(255) OUTPUT
)
AS
BEGIN
    SET NOCOUNT ON;

    IF @Id_Persona IS NULL OR @Id_Persona = 0
    BEGIN
        SET @O_Numero = -1;
        SET @O_Msg = 'El Id_Persona es obligatorio.';
        RETURN;
    END;

    -- Validar que la persona exista y aún no esté desactivada/eliminada por si el usuario es tonto jaja
    DECLARE @ExistePersona INT;

    SELECT @ExistePersona = 1
    FROM Tbl_Datos_Personales p
    INNER JOIN Cls_Estado e ON p.Id_Estado = e.Id_Estado
    WHERE p.Id_Persona = @Id_Persona
      AND e.Estado NOT IN ('Desactivado', 'desactivado', 'Desactivada', 'Inactivo', 'Inactivo', 'Eliminado')
      AND e.Activo = 1;

    IF @ExistePersona IS NULL
    BEGIN
        SET @O_Numero = -1;
        SET @O_Msg = 'La persona no existe o ya está desactivada/eliminada.';
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

        UPDATE Tbl_Datos_Personales
        SET 
            Id_Estado = @Id_Estado,
            Id_Modificador = @Id_Modificador,
            Fecha_Modificacion = GETDATE()
        WHERE Id_Persona = @Id_Persona;

        COMMIT;

        SET @O_Numero = 200;
        SET @O_Msg = 'Persona desactivada correctamente.';
    END TRY
    BEGIN CATCH
        IF @@TRANCOUNT > 0 ROLLBACK;

        SET @O_Numero = ERROR_NUMBER();
        SET @O_Msg = ERROR_MESSAGE();
    END CATCH;
END;
GO

DECLARE @Num INT, @Msg VARCHAR(255);

EXEC Eliminar_Tbl_Datos_Personales
    @Id_Persona = 2,
    @Id_Modificador = 1,
    @O_Numero = @Num OUTPUT,
    @O_Msg = @Msg OUTPUT;

SELECT @Num AS Numero, @Msg AS Mensaje;

select * from Tbl_Datos_Personales

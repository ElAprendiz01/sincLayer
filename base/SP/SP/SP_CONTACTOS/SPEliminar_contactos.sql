USE SYNCLAYER;
GO

CREATE OR ALTER PROCEDURE Eliminar_Tbl_Contacto
(
    @Id_Contacto INT,
    @Id_Modificador INT,
    @O_Numero INT OUTPUT,
    @O_Msg VARCHAR(255) OUTPUT
)
AS
BEGIN
    SET NOCOUNT ON;

    IF @Id_Contacto IS NULL OR @Id_Contacto = 0
    BEGIN
        SET @O_Numero = -1;
        SET @O_Msg = 'El Id_Contacto es obligatorio.';
        RETURN;
    END;

    DECLARE @ExisteContacto INT;

    SELECT @ExisteContacto = 1
    FROM Tbl_Contacto c
    INNER JOIN Cls_Estado e ON c.Id_Estado = e.Id_Estado
    WHERE c.Id_Contacto = @Id_Contacto
      AND e.Estado NOT IN ('Desactivado', 'Inactivo', 'Eliminado')
      AND e.Activo = 1;

    IF @ExisteContacto IS NULL
    BEGIN
        SET @O_Numero = -1;
        SET @O_Msg = 'El contacto no existe o ya está desactivado o eliminado.';
        RETURN;
    END;

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

        UPDATE Tbl_Contacto
        SET 
            Id_Estado = @Id_Estado,
            Id_Modificador = @Id_Modificador,
            Fecha_Modificacion = GETDATE()
        WHERE Id_Contacto = @Id_Contacto;

        COMMIT;

        SET @O_Numero = 200;
        SET @O_Msg = 'Contacto desactivado correctamente.';
    END TRY
    BEGIN CATCH
        IF @@TRANCOUNT > 0 ROLLBACK;
        SET @O_Numero = ERROR_NUMBER();
        SET @O_Msg = ERROR_MESSAGE();
    END CATCH;
END;
GO

DECLARE @Num INT, @Msg VARCHAR(255);

EXEC Eliminar_Tbl_Contacto
    @Id_Contacto = 1,
    @Id_Modificador = 1,
    @O_Numero = @Num OUTPUT,
    @O_Msg = @Msg OUTPUT;

SELECT @Num AS Numero, @Msg AS Mensaje;

select * from Tbl_Contacto
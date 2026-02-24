

USE SYNCLAYER
GO 
CREATE OR ALTER PROCEDURE Editar_Cls_Tipo_Catalogo
(
    @Id_Tipo_Catalogo INT,
    @Nombre NVARCHAR(50),
    @Id_Modificador INT,
    @Activo BIT,
    @O_Numero INT OUTPUT,
    @O_Msg VARCHAR(255) OUTPUT
)
AS
BEGIN
    SET NOCOUNT ON;

    -- Validar existencia
    IF NOT EXISTS (SELECT 1 FROM Cls_Tipo_Catalogo WHERE Id_Tipo_Catalogo = @Id_Tipo_Catalogo)
    BEGIN
        SET @O_Numero = -1;
        SET @O_Msg = 'El tipo de catálogo no existe';
        RETURN;
    END;

    -- Validar que no sea cadena vacía (pero permitir NULL para que COALESCE funcione)
    IF (@Nombre IS NOT NULL AND LTRIM(RTRIM(@Nombre)) = '')
    BEGIN
        SET @O_Numero = -1;
        SET @O_Msg = 'El nombre no puede ir vacío';
        RETURN;
    END;

    BEGIN TRY
        BEGIN TRAN;

        UPDATE Cls_Tipo_Catalogo
        SET Nombre = TRIM(COALESCE(@Nombre, Nombre)),
            Fecha_Modificacion = GETDATE(),
            Id_Modificador = @Id_Modificador,
            Activo = @Activo
        WHERE Id_Tipo_Catalogo = @Id_Tipo_Catalogo;

        COMMIT;

        SET @O_Numero = 200;
        SET @O_Msg = 'Se actualizó correctamente';
    END TRY
    BEGIN CATCH
        IF @@TRANCOUNT > 0 ROLLBACK;
        SET @O_Numero = ERROR_NUMBER();
        SET @O_Msg = ERROR_MESSAGE();
    END CATCH;
END;

DECLARE @Num INT, @Msg VARCHAR(255);

EXEC Editar_Cls_Tipo_Catalogo 
    @Id_Tipo_Catalogo = 3,
    @Nombre = NULL,
    @Id_Modificador = 1,
    @Activo = 1,
    @O_Numero = @Num OUTPUT,
    @O_Msg = @Msg OUTPUT;

SELECT @Num AS Numero, @Msg AS Mensaje;
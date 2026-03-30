USE SYNCLAYER
GO

CREATE OR ALTER PROCEDURE Editar_Cls_Tipo_Catalogo
(
    @Id_Tipo_Catalogo INT,
    @Nombre NVARCHAR(50),
    @Id_Modificador INT,
    @Activo BIT = 1,
    @O_Numero INT OUTPUT,
    @O_Msg VARCHAR(255) OUTPUT
)
AS
BEGIN
    SET NOCOUNT ON;
    SET XACT_ABORT ON;
    -- Validar que no sea cadena vacía (pero permitir NULL para que COALESCE funcione)
    IF (@Nombre IS NOT NULL AND LTRIM(RTRIM(@Nombre)) = '')
    BEGIN
        SET @O_Numero = -1;
        SET @O_Msg = 'El nombre no puede ir vacío';
        RETURN;
    END;

    -- Comparar con otros datos si existe el registro que se va a editar
    IF exists(Select 1 from Cls_Tipo_Catalogo where Nombre = TRIM(@Nombre) and Id_Tipo_Catalogo <> @Id_Tipo_Catalogo)
    BEGIN
        SET @O_Numero = -1;
        SET @O_Msg = 'El tipo de catalogo ya existe';
        RETURN;
    END;

    -- Validar existencia
    IF NOT EXISTS (SELECT 1 FROM Cls_Tipo_Catalogo WHERE Id_Tipo_Catalogo = @Id_Tipo_Catalogo)
    BEGIN
        SET @O_Numero = -1;
        SET @O_Msg = 'El identificador del tipo de catálogo no existe';
        RETURN;
    END;

    BEGIN TRY
        BEGIN TRANSACTION TRX_EDITAR_TIPOS_CATALOGOS;

        UPDATE Cls_Tipo_Catalogo
        SET Nombre = TRIM(COALESCE(@Nombre, Nombre)),
            Fecha_Modificacion = GETDATE(),
            Id_Modificador = @Id_Modificador,
            Activo = @Activo
        WHERE Id_Tipo_Catalogo = @Id_Tipo_Catalogo;

        COMMIT TRANSACTION TRX_EDITAR_TIPOS_CATALOGOS;

        SET @O_Numero = 200;
        SET @O_Msg = 'Se actualizó correctamente';
    END TRY
    BEGIN CATCH
        IF @@TRANCOUNT > 0 ROLLBACK TRANSACTION TRX_EDITAR_TIPOS_CATALOGOS;
        SET @O_Numero = ERROR_NUMBER();
        SET @O_Msg = ERROR_MESSAGE();
    END CATCH;
     SET NOCOUNT OFF;
    SET XACT_ABORT OFF;
END;
Go

DECLARE @Num INT, @Msg VARCHAR(255);

EXEC Editar_Cls_Tipo_Catalogo 
    @Id_Tipo_Catalogo = 1,
    @Nombre = 'Identificacion',
    @Id_Modificador = 5,
    @O_Numero = @Num OUTPUT,
    @O_Msg = @Msg OUTPUT;

SELECT @Num AS Numero, @Msg AS Mensaje;

Select * from Cls_Tipo_Catalogo
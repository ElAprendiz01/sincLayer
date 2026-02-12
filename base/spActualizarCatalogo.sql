USE SYNCLAYER
GO

CREATE OR ALTER PROCEDURE SP_ActualizarCatalogo
(
    @Id_Catalogo INT,
    @Id_Tipo_Catalogo INT = NULL,
    @Nombre NVARCHAR(80) = NULL,
    @Id_Modificador INT,
    @Activo BIT = NULL,
    @O_Numero INT OUTPUT,
    @O_Msg VARCHAR(255) OUTPUT
)
AS
BEGIN
    SET NOCOUNT ON;

    -- VALIDACIÓN: ID obligatorio
    IF @Id_Catalogo IS NULL OR @Id_Catalogo = 0
    BEGIN
        SET @O_Numero = -1;
        SET @O_Msg = 'El Id_Catalogo es obligatorio.';
        RETURN;
    END;

    -- VALIDACIÓN: catálogo debe existir
    IF NOT EXISTS (SELECT 1 FROM Cls_Catalogo WHERE Id_Catalogo = @Id_Catalogo)
    BEGIN
        SET @O_Numero = -1;
        SET @O_Msg = 'El catálogo especificado no existe.';
        RETURN;
    END;

    -- VALIDACIÓN: si se envía un tipo de catálogo, debe existir
    IF @Id_Tipo_Catalogo IS NOT NULL
       AND NOT EXISTS (SELECT 1 FROM Cls_Tipo_Catalogo WHERE Id_Tipo_Catalogo = @Id_Tipo_Catalogo)
    BEGIN
        SET @O_Numero = -1;
        SET @O_Msg = 'El tipo de catálogo especificado no existe.';
        RETURN;
    END;

    -- VALIDACIÓN: si se envía nombre, no puede ser vacío
    IF @Nombre IS NOT NULL AND LTRIM(RTRIM(@Nombre)) = ''
    BEGIN
        SET @O_Numero = -1;
        SET @O_Msg = 'El nombre no puede estar vacío.';
        RETURN;
    END;

    BEGIN TRY
        BEGIN TRAN;

        UPDATE Cls_Catalogo
        SET
            Id_Tipo_Catalogo = COALESCE(@Id_Tipo_Catalogo, Id_Tipo_Catalogo),
            Nombre = COALESCE(@Nombre, Nombre),
            Activo = COALESCE(@Activo, Activo),
            Id_Modificador = @Id_Modificador,
            Fecha_Modificacion = GETDATE()
        WHERE Id_Catalogo = @Id_Catalogo;

        COMMIT;

        SET @O_Numero = 0;
        SET @O_Msg = 'Catálogo actualizado correctamente.';
    END TRY
    BEGIN CATCH
        IF @@TRANCOUNT > 0 ROLLBACK;

        SET @O_Numero = ERROR_NUMBER();
        SET @O_Msg = ERROR_MESSAGE();
    END CATCH;
END;
GO
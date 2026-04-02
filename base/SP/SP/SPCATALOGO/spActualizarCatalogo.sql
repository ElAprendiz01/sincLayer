USE SYNCLAYER;
GO

CREATE OR ALTER PROCEDURE SP_ActualizarCatalogo(
    @Id_Catalogo INT,
    @Id_Tipo_Catalogo INT = NULL,
    @Nombre NVARCHAR(80) = NULL,
    @Id_Modificador INT,
    @O_Numero INT OUTPUT,
    @O_Msg VARCHAR(255) OUTPUT
)
AS
BEGIN
    SET NOCOUNT ON;

    -- 1. Validar que el Catálogo a editar existe
    IF NOT EXISTS (SELECT 1 FROM Cls_Catalogo WHERE Id_Catalogo = @Id_Catalogo)
    BEGIN
        SET @O_Numero = -1;
        SET @O_Msg = 'El catálogo especificado no existe.';
        RETURN;
    END;

    -- 2. Validar el Tipo de Catálogo (si se proporciona uno nuevo)
    IF @Id_Tipo_Catalogo IS NOT NULL
    BEGIN
        IF NOT EXISTS (SELECT 1 FROM Cls_Tipo_Catalogo WHERE Id_Tipo_Catalogo = @Id_Tipo_Catalogo AND Activo = 1)
        BEGIN
            SET @O_Numero = -1;
            SET @O_Msg = 'El tipo de catálogo no existe o está deshabilitado.';
            RETURN;
        END;
    END;

    -- 3. Validar Modificador
    IF @Id_Modificador IS NULL OR @Id_Modificador = 0
    BEGIN
        SET @O_Numero = -1;
        SET @O_Msg = 'El Id del modificador es obligatorio para la auditoría.';
        RETURN;
    END;

    BEGIN TRY
        BEGIN TRAN;

        UPDATE Cls_Catalogo
        SET
            Id_Tipo_Catalogo = ISNULL(@Id_Tipo_Catalogo, Id_Tipo_Catalogo),
            Nombre = ISNULL(@Nombre, Nombre),
            Activo = 1,
            Id_Modificador = @Id_Modificador,
            Fecha_Modificacion = GETDATE()
        WHERE Id_Catalogo = @Id_Catalogo;

        COMMIT TRAN;

        SET @O_Numero = 200;
        SET @O_Msg = 'Catálogo actualizado correctamente.';
    END TRY
    BEGIN CATCH
        IF @@TRANCOUNT > 0 ROLLBACK TRAN;

        SET @O_Numero = 500;
        SET @O_Msg = 'Error en BD: ' + ERROR_MESSAGE();
    END CATCH;
END;
GO

DECLARE @Num INT, @Msg VARCHAR(255);


EXEC SP_ActualizarCatalogo
    @Id_Catalogo = 14,
    @Nombre = Dañado2,
    @Id_Modificador = 8,
    @O_Numero = @Num OUTPUT,
    @O_Msg = @Msg OUTPUT;

SELECT @Num AS Numero, @Msg AS Mensaje;

select * from Cls_Catalogo

update Cls_Catalogo set activo = 1


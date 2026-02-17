USE SYNCLAYER
GO

CREATE OR ALTER PROCEDURE SP_DesactivarCatalogo
(
    @Id_Catalogo INT,
    @Id_Modificador INT,
    @O_Numero INT OUTPUT,
    @O_Msg VARCHAR(255) OUTPUT
)
AS
BEGIN
    SET NOCOUNT ON;

    
    IF @Id_Catalogo IS NULL OR @Id_Catalogo = 0
    BEGIN
        SET @O_Numero = -1;
        SET @O_Msg = 'El Id_Catalogo es obligatorio.';
        RETURN;
    END;

    -- Validación: catálogo debe existir
    IF NOT EXISTS (SELECT 1 FROM Cls_Catalogo WHERE Id_Catalogo = @Id_Catalogo)
    BEGIN
        SET @O_Numero = -1;
        SET @O_Msg = 'El catálogo no existe.';
        RETURN;
    END;

    BEGIN TRY
        BEGIN TRAN;

        UPDATE Cls_Catalogo
        SET 
            Activo = 0,
            Id_Modificador = @Id_Modificador,
            Fecha_Modificacion = GETDATE()
        WHERE Id_Catalogo = @Id_Catalogo;

        COMMIT;

        SET @O_Numero = 200;
        SET @O_Msg = 'Catálogo desactivado correctamente.';
    END TRY
    BEGIN CATCH
        IF @@TRANCOUNT > 0 ROLLBACK;

        SET @O_Numero = ERROR_NUMBER();
        SET @O_Msg = ERROR_MESSAGE();
    END CATCH;
END;
GO
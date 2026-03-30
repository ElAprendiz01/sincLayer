USE SYNCLAYER
GO

CREATE OR ALTER PROCEDURE Eliminar_Cls_Tipo_Catalogo
(
    @Id_Tipo_Catalogo INT
)
AS
BEGIN
     SET NOCOUNT ON;
    SET XACT_ABORT ON;

    BEGIN TRY
        IF (ISNULL(@Id_Tipo_Catalogo, 0) = 0 or ISNULL(@Id_Tipo_Catalogo, ' ') = ' ')
        BEGIN 
            ;THROW 50001,'El identificador no puede ser nulo',1
        RETURN;
        END
        BEGIN TRANSACTION TRX_ELIMINAR_TIPO_CATALOGO;

        UPDATE Cls_Tipo_Catalogo
        SET Activo = 0
        WHERE Id_Tipo_Catalogo = @Id_Tipo_Catalogo;

        COMMIT TRANSACTION TRX_ELIMINAR_TIPO_CATALOGO;

        PRINT 'El Cls_Tipo_Catalogo se eliminó correctamente';
    END TRY
    BEGIN CATCH
        IF @@TRANCOUNT > 0 ROLLBACK TRANSACTION TRX_ELIMINAR_TIPO_CATALOGO;

        DECLARE @ErrorMessage NVARCHAR(4000) = ERROR_MESSAGE();
        PRINT 'Error: ' + @ErrorMessage; 
    END CATCH
     SET NOCOUNT OFF;
    SET XACT_ABORT OFF;
END;
GO

exec Eliminar_Cls_Tipo_Catalogo 0

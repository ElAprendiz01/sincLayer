USE SYNCLAYER
GO

CREATE OR ALTER PROCEDURE Eliminar_Cls_Tipo_Catalogo
(
    @Id_Tipo_Catalogo INT
)
AS
BEGIN
    SET NOCOUNT ON;

    BEGIN TRY
        BEGIN TRAN;

        UPDATE Cls_Tipo_Catalogo
        SET Activo = 0
        WHERE Id_Tipo_Catalogo = @Id_Tipo_Catalogo;

        COMMIT;  

        PRINT 'El Cls_Tipo_Catalogo se eliminó correctamente';
    END TRY
    BEGIN CATCH
        IF @@TRANCOUNT > 0 ROLLBACK;

        PRINT 'El Cls_Tipo_Catalogo no se pudo eliminar';
    END CATCH
END;
GO

exec Eliminar_Cls_Tipo_Catalogo 5
select * from Cls_Tipo_Catalogo

USE SYNCLAYER;
GO

--elimianr estado
CREATE OR ALTER PROCEDURE SPeliminaEstado
(
    @Id_Estado INT
)
AS 
BEGIN  
SET NOCOUNT ON;
SET XACT_ABORT ON;

    BEGIN TRY 
        BEGIN TRANSACTION TRX_ELIMINAR_ESTADO
            update Cls_Estado
            set Activo = 0
            WHERE Id_Estado =@Id_Estado
        COMMIT TRANSACTION TRX_ELIMINAR_ESTADO
    PRINT 'Se ha Eliminado el Estado'
    END TRY 
    BEGIN CATCH 
        IF @@TRANCOUNT > 0 
        ROLLBACK TRANSACTION TRX_ELIMINAR_ESTADO
        PRINT 'ERROR: '+ @@ERROR
    END CATCH

SET NOCOUNT OFF;
SET XACT_ABORT OFF;
END 
GO
 
EXEC SPeliminaEstado 1

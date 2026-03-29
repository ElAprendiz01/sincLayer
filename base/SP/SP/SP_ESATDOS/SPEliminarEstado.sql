USE SYNCLAYER;
GO



--elimianr eatdo
CREATE OR  ALTER PROCEDURE SPeliminaEstado
(
    @Id_Estado INT
)
AS 
BEGIN  
    BEGIN TRY 
        BEGIN TRAN
            update Cls_Estado
            set Activo = 0
            WHERE Id_Estado =@Id_Estado
        COMMIT 
    PRINT 'SE EL ESTADO SE HA ELIMINADO'
    END TRY 
    BEGIN CATCH 
        PRINT 'NO SE HA PODIDO ELIMIANR '+ @@ERROR
    END CATCH
END 
GO
 
EXEC SPeliminaEstado 1

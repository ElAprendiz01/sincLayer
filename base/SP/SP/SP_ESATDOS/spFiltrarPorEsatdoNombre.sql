use SYNCLAYER
go
CREATE OR ALTER PROC SpFiltrarCls_EstadoPorNombre
(
    @Estado NVARCHAR(30)
)
AS
BEGIN
    BEGIN TRY
        SELECT Id_Estado,
               Estado,
               Fecha_Creacion,
               Fecha_Modificacion,
               Id_Creador,
               Id_Modificador,
               Activo
        FROM Cls_Estado
       WHERE Estado LIKE '%' + @Estado + '%';

    END TRY
    BEGIN CATCH
        PRINT 'No se pudo filtrar: ' + ERROR_MESSAGE();
    END CATCH
END
GO
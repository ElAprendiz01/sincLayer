use SYNCLAYER
go

CREATE OR ALTER PROC SpFiltrarCls_EstadoPorNombre
(
    @Estado NVARCHAR(30)
)
AS
BEGIN
SET NOCOUNT ON;
SET XACT_ABORT ON;
    BEGIN TRY
        if not exists(Select 1 from Cls_Estado where Estado like '%' + TRIM(@Estado) + '%')
        throw 50001,'No se encontro coincidencias',1

        SELECT Id_Estado,
               Estado,
               Fecha_Creacion,
               Fecha_Modificacion,
               Id_Creador,
               Id_Modificador,
               Activo
        FROM Cls_Estado
       WHERE Estado LIKE '%' + @Estado + '%'
       order by Id_Estado desc

    END TRY
    BEGIN CATCH
        PRINT 'No se pudo filtrar: ' + ERROR_MESSAGE();
    END CATCH
SET NOCOUNT OFF;
SET XACT_ABORT OFF;
END
GO

Exec SpListar_Cls_Estado

Exec SpFiltrarCls_EstadoPorNombre 'Consumido'
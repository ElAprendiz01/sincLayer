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
        --validacion si viene nulo o vacio
        if(ISNULL(TRIM(@Estado), ' ' )= ' ') AND ISNULL(TRIM(@Estado), NULL)= NULL
        Begin
        ;throw 50001,'Ingrese caracteres para buscar',1
        Return
        End
         --validacion si no existe el registro
        if not exists(Select 1 from Cls_Estado where Estado like '%' + TRIM(@Estado) + '%')
        Begin
        ;throw 50002,'No se encontro coincidencias',1
        Return
        End

        BEGIN TRANSACTION TRX_BUSCAR_ESTADO_NOMBRE
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
       COMMIT TRANSACTION TRX_BUSCAR_ESTADO_NOMBRE

    END TRY
    BEGIN CATCH
    IF @@TRANCOUNT > 0
    ROLLBACK TRANSACTION TRX_BUSCAR_ESTADO_NOMBRE
     --Conversion de mensaje error
        DECLARE @ErrorMessage NVARCHAR(4000) = ERROR_MESSAGE();
        PRINT 'Error: ' + @ErrorMessage;
    END CATCH
SET NOCOUNT OFF;
SET XACT_ABORT OFF;
END
GO

Exec SpListar_Cls_Estado

Exec SpFiltrarCls_EstadoPorNombre 'i'
use SYNCLAYER
go 


CREATE OR ALTER PROC Buscar_Cls_Tipo_Catalogo_Nombre(
    @Buscar VARCHAR(50)
) AS 
BEGIN
    SET NOCOUNT ON;
    SET XACT_ABORT ON;

    BEGIN TRY
        -- 1. VALIDACIÓN PREVIA Si ES VACIO O NULO
         IF (isnull(Trim(@Buscar), ' ') = ' ') or isnull(Trim(@Buscar), null) = null
        BEGIN 
            ;THROW 50001, 'ingresa datos para buscar', 1;
            RETURN;
        END
        -- 2. VALIDACIÓN PREVIA SI EN DADO CASO NO EXISTE
        IF NOT EXISTS(SELECT 1 FROM Cls_Tipo_Catalogo 
                       WHERE Nombre LIKE '%' + TRIM(@Buscar) + '%' 
                       AND Activo = 1)
        BEGIN 
            ;THROW 50001, 'No existe un nombre con esos caracteres', 1;
            RETURN;
        END

        -- 3. TRANSACCIÓN Y CONSULTA
        BEGIN TRANSACTION trx_Buscar_TipoCatalogo_Nombre;

            SELECT * FROM Cls_Tipo_Catalogo
            WHERE Nombre LIKE '%' + TRIM(@Buscar) + '%'
            AND Activo = 1;

        COMMIT TRANSACTION trx_Buscar_TipoCatalogo_Nombre;

        PRINT 'Se ha encontrado con éxito el registro';

    END TRY
    BEGIN CATCH
        -- 4. CONTROL DE FALLOS
        IF @@TRANCOUNT > 0 
            ROLLBACK TRANSACTION trx_Buscar_TipoCatalogo_Nombre;

        DECLARE @ErrorMessage NVARCHAR(4000) = ERROR_MESSAGE();
        PRINT 'Error: ' + @ErrorMessage;
    END CATCH

    -- 5. RESTABLECER CONFIGURACIÓN
    SET NOCOUNT OFF;
    SET XACT_ABORT OFF;
END;
GO

Exec Buscar_Cls_Tipo_Catalogo_Nombre 'i'


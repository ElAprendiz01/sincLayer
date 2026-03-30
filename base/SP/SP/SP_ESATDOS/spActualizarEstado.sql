USE SYNCLAYER;
GO

CREATE OR ALTER PROC SpActualizarCls_Estado (
    @Id_Estado INT,
    @Estado NVARCHAR(30),
    @Id_Modificador INT,
    @Activo BIT = 1
) AS
BEGIN
    SET NOCOUNT ON;
    SET XACT_ABORT ON;

    BEGIN TRY
        -- 1. Verificar si otro registro ya tiene ese nombre
        IF EXISTS (SELECT 1 FROM Cls_Estado WHERE Estado = @Estado AND Id_Estado <> @Id_Estado)
            THROW 50001, 'Ya existe un estado con ese nombre', 1;

        BEGIN TRANSACTION trx_actualizar_estado;
            
            UPDATE Cls_Estado
            SET 
                Estado = TRIM(COALESCE(@Estado, Estado)),
                Id_Modificador = @Id_Modificador,
                Activo = COALESCE(1, Activo),
                Fecha_Modificacion = GETDATE()
            WHERE Id_Estado = @Id_Estado;

        COMMIT TRANSACTION trx_actualizar_estado;
        
        PRINT 'Se actualizó correctamente';
    END TRY
    BEGIN CATCH
        -- 2. Solo hacer rollback si hay una transacción activa
        IF @@TRANCOUNT > 0
            ROLLBACK TRANSACTION trx_actualizar_estado;

        -- 3. Reporte de error mejorado
        DECLARE @ErrorMessage NVARCHAR(4000) = ERROR_MESSAGE();
        PRINT 'No se pudo actualizar: ' + @ErrorMessage;
    END CATCH

    SET NOCOUNT OFF;
END
GO

-- Ejecución de prueba
EXEC SpActualizarCls_Estado 16, 'Dañado', 5
Go

exec SpListar_Cls_Estado
Go
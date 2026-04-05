use SYNCLAYER
go

CREATE OR ALTER PROC Sp_Editar_Acuerdos_Pago(
    @Id_Acuerdo INT,
    @Monto_Total_Acordado DECIMAL(10,2) = NULL,
    @Cantidad_Cuotas INT = NULL,
    @Monto_Por_Cuota DECIMAL(10,2) = NULL,
    @Frecuencia_Pago INT = NULL,
    @Id_Modificador INT
) AS
BEGIN 	
    SET NOCOUNT ON;
    SET XACT_ABORT ON;

    BEGIN TRY
        -- Validar que el registro existe y no esté eliminado lógicamente
        IF NOT EXISTS (SELECT 1 FROM Tbl_Acuerdos_Pago WHERE Id_Acuerdo = @Id_Acuerdo AND Id_Estado = 3)
            THROW 50001, 'No existe el registro de acuerdo solicitado o está inactivo', 1;

        -- Validar que el modificador sea un usuario válido
        IF NOT EXISTS (SELECT 1 FROM usuarios WHERE id = @Id_Modificador)
            THROW 50001, 'El identificador del modificador no es válido', 1;

        BEGIN TRANSACTION trx_editar_acuerdos;
            
            UPDATE Tbl_Acuerdos_Pago 
            SET
                Monto_Total_Acordado = COALESCE(@Monto_Total_Acordado, Monto_Total_Acordado),
                Cantidad_Cuotas = COALESCE(@Cantidad_Cuotas, Cantidad_Cuotas),
                Monto_Por_Cuota = COALESCE(@Monto_Por_Cuota, Monto_Por_Cuota),
                Frecuencia_Pago = COALESCE(@Frecuencia_Pago, Frecuencia_Pago),
                Id_Modificador = @Id_Modificador,
                Fecha_Modificacion = GETDATE()
            WHERE Id_Acuerdo = @Id_Acuerdo;

        COMMIT TRANSACTION trx_editar_acuerdos;
        
        SELECT 'Acuerdo de pago actualizado exitosamente.' AS mensaje;

    END TRY
    BEGIN CATCH
        IF @@TRANCOUNT > 0
            ROLLBACK TRANSACTION trx_editar_acuerdos;
        ;THROW;
    END CATCH

    SET XACT_ABORT OFF;
    SET NOCOUNT OFF;
END
GO
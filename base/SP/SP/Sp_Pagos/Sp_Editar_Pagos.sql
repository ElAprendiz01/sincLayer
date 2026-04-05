use SYNCLAYER
go

CREATE OR ALTER PROC Sp_Editar_Pagos(
    @Id_Pago INT,
    @Monto_Pagado DECIMAL(10,2) = NULL,
    @Metodo_Pago INT = NULL,
    @Numero_Comprobante NVARCHAR(100) = NULL,
    @Id_Modificador INT
) AS
BEGIN 	
    SET NOCOUNT ON;
    SET XACT_ABORT ON;

    BEGIN TRY
        IF NOT EXISTS (SELECT 1 FROM Tbl_Pagos WHERE Id_Pago = @Id_Pago AND Id_Estado = 3)
            THROW 50001, 'No existe el registro de pago solicitado o ya está inactivo', 1;

        BEGIN TRANSACTION trx_editar_pagos;
            UPDATE Tbl_Pagos 
            SET
                Monto_Pagado = COALESCE(@Monto_Pagado, Monto_Pagado),
                Metodo_Pago = COALESCE(@Metodo_Pago, Metodo_Pago),
                Numero_Comprobante = COALESCE(trim(@Numero_Comprobante), Numero_Comprobante),
                Id_Modificador = @Id_Modificador,
                Fecha_Modificacion = GETDATE()
            WHERE Id_Pago = @Id_Pago;
        COMMIT TRANSACTION trx_editar_pagos;
        
        SELECT 'Pago editado exitosamente.' AS mensaje;
    END TRY
    BEGIN CATCH
        IF @@TRANCOUNT > 0 
            ROLLBACK TRANSACTION trx_editar_pagos;
        ;THROW;
    END CATCH
END
GO
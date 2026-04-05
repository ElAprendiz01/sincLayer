use SYNCLAYER
go

CREATE OR ALTER PROC Sp_Ingresar_Pagos(
    @Id_Multa INT,
    @Id_Acuerdo INT = NULL,
    @Monto_Pagado DECIMAL(10,2),
    @Metodo_Pago INT,
    @Numero_Comprobante NVARCHAR(100),
    @Id_Creador INT
) AS
BEGIN 	
    SET NOCOUNT ON;
    SET XACT_ABORT ON;

    BEGIN TRY
        -- Validar si la multa existe
        IF NOT EXISTS(SELECT 1 FROM Tbl_Multas WHERE Id_Multa = @Id_Multa)
            THROW 50001, 'No existe el identificador de la multa para registrar el pago', 1;

        BEGIN TRANSACTION trx_insertar_pagos;
            INSERT INTO Tbl_Pagos (
                Id_Multa, Id_Acuerdo, Monto_Pagado, Metodo_Pago, 
                Numero_Comprobante, Id_Creador, Id_Estado
            )
            VALUES (
                @Id_Multa, @Id_Acuerdo, @Monto_Pagado, @Metodo_Pago, 
                @Numero_Comprobante, @Id_Creador, 3 -- Estado Activo
            );
        COMMIT TRANSACTION trx_insertar_pagos;

        SELECT 'Pago registrado correctamente' AS mensaje;
    END TRY
    BEGIN CATCH
        IF @@TRANCOUNT > 0
            ROLLBACK TRANSACTION trx_insertar_pagos;
        ;THROW;
    END CATCH
END
GO
Use SYNCLAYER 
Go

CREATE OR ALTER PROCEDURE Sp_Acuerdos_Pago_Insertar
    @Id_Multa INT,
    @Monto_Total_Acordado DECIMAL(10,2),
    @Cantidad_Cuotas INT,
    @Monto_Por_Cuota DECIMAL(10,2),
    @Frecuencia_Pago INT,
    @Id_Creador INT
AS
BEGIN
    SET NOCOUNT ON;
    BEGIN TRY
        BEGIN TRANSACTION
            -- Validación: No permitir más de un acuerdo activo por multa
            IF EXISTS (SELECT 1 FROM Tbl_Acuerdos_Pago WHERE Id_Multa = @Id_Multa AND Id_Estado = 3)
            BEGIN
                RAISERROR('Ya existe un acuerdo de pago activo para esta multa.', 16, 1);
                RETURN;
            END

            INSERT INTO Tbl_Acuerdos_Pago (
                Id_Multa, Monto_Total_Acordado, Cantidad_Cuotas, 
                Monto_Por_Cuota, Frecuencia_Pago, Id_Creador, Id_Estado
            )
            VALUES (
                @Id_Multa, @Monto_Total_Acordado, @Cantidad_Cuotas, 
                @Monto_Por_Cuota, @Frecuencia_Pago, @Id_Creador, 3
            );
        COMMIT TRANSACTION
    END TRY
    BEGIN CATCH
        IF @@TRANCOUNT > 0 ROLLBACK TRANSACTION;
        DECLARE @ErrorMessage NVARCHAR(4000) = ERROR_MESSAGE();
        RAISERROR(@ErrorMessage, 16, 1);
    END CATCH
END;
Go
Use SYNCLAYER
Go

CREATE Or Alter PROCEDURE Sp_Acuerdos_Pago_Eliminar
    @Id_Acuerdo INT,
    @Id_Modificador INT
AS
BEGIN
    SET NOCOUNT ON;
    IF EXISTS (SELECT 1 FROM Tbl_Acuerdos_Pago WHERE Id_Acuerdo = @Id_Acuerdo AND Id_Estado = 3)
    BEGIN
        UPDATE Tbl_Acuerdos_Pago
        SET Id_Estado = 4,
            Id_Modificador = @Id_Modificador,
            Fecha_Modificacion = GETDATE()
        WHERE Id_Acuerdo = @Id_Acuerdo;
    END
    ELSE
    BEGIN
        RAISERROR('El acuerdo no existe o ya ha sido eliminado.', 16, 1);
    END
END;
Go
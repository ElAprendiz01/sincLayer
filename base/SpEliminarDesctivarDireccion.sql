USE SYNCLAYER
GO

CREATE OR ALTER PROCEDURE SpDesactivarEliinarDireccion
(
    @Id_direccion INT,
    @Id_Modificador INT,
	@Id_Estado int,
    @O_Numero INT OUTPUT,
    @O_Msg VARCHAR(255) OUTPUT
)
AS
BEGIN
    SET NOCOUNT ON;

   
    IF @Id_direccion IS NULL OR @Id_direccion = 0
    BEGIN
        SET @O_Numero = -1;
        SET @O_Msg = 'El Id_direccion es obligatorio.';
        RETURN;
    END;

	  IF @Id_Estado IS NULL OR @Id_Estado !=4
    BEGIN
        SET @O_Numero = -1;
        SET @O_Msg = 'El Id_Estado de eliminado debe ser 4.' 
             + CHAR(13) + CHAR(10) +
             'Verifique el valor nviado.';

        RETURN;
    END;
   
    IF NOT EXISTS (SELECT 1 FROM Tbl_direcciones WHERE Id_direccion = @Id_direccion)
    BEGIN
        SET @O_Numero = -1;
        SET @O_Msg = 'La dirección no existe.';
        RETURN;
    END;

    BEGIN TRY
        BEGIN TRAN;

        UPDATE Tbl_direcciones
        SET 
            Id_Estado = @Id_Estado, 
            Id_Modificador = @Id_Modificador,
            Fecha_Modificacion = GETDATE()
        WHERE Id_direccion = @Id_direccion;

        COMMIT;

        SET @O_Numero = 200;
        SET @O_Msg = 'Dirección desactivada correctamente.';
    END TRY
    BEGIN CATCH
        IF @@TRANCOUNT > 0 ROLLBACK;

        SET @O_Numero = ERROR_NUMBER();
        SET @O_Msg = ERROR_MESSAGE();
    END CATCH;
END;
GO

DECLARE @Num INT, @Msg VARCHAR(255);

EXEC SpDesactivarEliinarDireccion
    @Id_direccion = 1,       
    @Id_Modificador = 1,     
    @Id_Estado = 4,          
    @O_Numero = @Num OUTPUT,
    @O_Msg = @Msg OUTPUT;

SELECT @Num AS Numero, @Msg AS Mensaje;


exec spListardireccines
USE SYNCLAYER
GO


CREATE OR ALTER PROCEDURE SpActualizarDireccion(
    @Id_direccion INT,
    @Ciudad NVARCHAR(20),
    @Barrio NVARCHAR(40),
    @Calle NVARCHAR(30),
    @Id_Modificador INT,
    @Id_Estado INT,
    @O_Numero INT OUTPUT,
    @O_Msg VARCHAR(255) OUTPUT
)
AS
BEGIN
    SET NOCOUNT ON;

   
    IF NOT EXISTS (SELECT 1 FROM Tbl_direcciones WHERE Id_direccion = @Id_direccion)
    BEGIN
        SET @O_Numero = -1;
        SET @O_Msg = 'La dirección no existe.';
        RETURN;
    END;
	IF @Id_Estado IS NULL OR @Id_Estado = 4
	 BEGIN
	     SET @O_Numero = -1;
	     SET @O_Msg = 'El estado del registro indica que está eliminado o desactivado.'
	                  + CHAR(13) + CHAR(10) +
                 'Si cree que es un error, comuníquese con administración.';
		RETURN;
	END;

    IF @Id_Estado IS NULL OR @Id_Estado = 0
    BEGIN
        SET @O_Numero = -1;
        SET @O_Msg = 'El id estado es obligatorio.';
        RETURN;
    END;

    IF NOT EXISTS (SELECT 1 FROM Cls_Estado WHERE Id_Estado = @Id_Estado)
    BEGIN
        SET @O_Numero = -1;
        SET @O_Msg = 'El id estado no existe.';
        RETURN;
    END;

    BEGIN TRY
        BEGIN TRAN;

        UPDATE Tbl_direcciones
        SET
            Ciudad = TRIM(COALESCE( @Ciudad,Ciudad)),
            Barrio = TRIM(coalesce (@Barrio, Barrio)),
            Calle = TRIM(coalesce (@Calle, Calle)),
            Fecha_Modificacion = GETDATE(),
            Id_Modificador = @Id_Modificador,
            Id_Estado = coalesce(@Id_Estado, Id_Estado) --por si el usuario es peresozo y no escribe todos los aprametros jajaj y evitar que reviente por flaa de parametros 
        WHERE Id_direccion = @Id_direccion;

        COMMIT;

        SET @O_Numero = 200;
        SET @O_Msg = 'La dirección se ha actualizado correctamente.';
    END TRY
    BEGIN CATCH
        IF @@TRANCOUNT > 0 ROLLBACK;

        SET @O_Numero = ERROR_NUMBER();
        SET @O_Msg = ERROR_MESSAGE();
    END CATCH;
END;
GO

DECLARE @Num INT, @Msg VARCHAR(255);

EXEC SpActualizarDireccion
    1,
    'metrp', 
    'LasJAguitas',
    'los toros',
    1,
    3,
    @Num OUTPUT,
    @Msg OUTPUT;

SELECT @Num AS Numero, @Msg AS Mensaje;

exec spListardireccines
USE SYNCLAYER
GO


CREATE OR ALTER PROCEDURE SpActualizarDireccion(
    @Id_direccion INT,
    @Ciudad NVARCHAR(20) =null,
    @Barrio NVARCHAR(40)=null,
    @Calle NVARCHAR(30)=null,
    @Id_Modificador INT ,
    @Id_Estado INT = null,
	@ForzarRecuperacion bit = 0,
    @O_Numero INT OUTPUT,
    @O_Msg VARCHAR(255) OUTPUT
)
AS
BEGIN
    SET NOCOUNT ON;

-- Validar solo si se envió un Id_Estado para hacer uso  del coalasce
	IF @Id_Estado IS NOT NULL
	BEGIN
		IF NOT EXISTS (
			SELECT 1 
			FROM Cls_Estado 
			WHERE Id_Estado = @Id_Estado
			  AND Activo = 1
		)
		BEGIN
			SET @O_Numero = -1;
			SET @O_Msg = 'El estado no existe o está desactivado.';
			RETURN;
		END
	END
	    IF @ForzarRecuperacion = 0
        AND EXISTS (
            SELECT 1
            FROM Tbl_direcciones p
            INNER JOIN Cls_Estado e ON p.Id_Estado = e.Id_Estado
            WHERE p.Id_direccion = @Id_direccion
              AND e.Estado IN ('Eliminado', 'Desactivado', 'Inactivo', 'Suspendido')
        )
    BEGIN
        SET @O_Numero = -1;
        SET @O_Msg = 'El estado del registro indica que está eliminado o desactivado.'
                     + CHAR(13) + CHAR(10) +
                     'Si cree que es un error, comuníquese con administración.';
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
-- si ejecutan esto para una direccioneiliminada no les da jajaj
DECLARE @Num INT, @Msg VARCHAR(255);

EXEC SpActualizarDireccion
    @Id_direccion= 1,
    @Id_Modificador = 1,
    @Id_Estado = 4,            -- nuevo estado   
    @O_Numero = @Num OUTPUT,
    @O_Msg = @Msg OUTPUT;

SELECT @Num AS Numero, @Msg AS Mensaje;

select * from Tbl_direcciones

--pero con este si  simpre y cuando @ForzarRecuperacion est en 1
DECLARE @Num INT, @Msg VARCHAR(255);

EXEC SpActualizarDireccion
    @Id_direccion= 1,
    @Id_Modificador = 1,
    @Id_Estado = 3,            -- nuevo estado
    @ForzarRecuperacion = 1,   -- permite actualizar aunque esté eliminado
    @O_Numero = @Num OUTPUT,
    @O_Msg = @Msg OUTPUT;

SELECT @Num AS Numero, @Msg AS Mensaje;
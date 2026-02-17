USE SYNCLAYER
GO 

CREATE OR ALTER PROCEDURE SpInsertarDireccion(
	@Ciudad NVARCHAR(20),
	@Barrio NVARCHAR(40),
	@Calle NVARCHAR(30),
    @Id_Creador INT,
	@Id_Persona INT,
	@Id_Estado INT,
	@O_Numero INT OUTPUT,
    @O_Msg VARCHAR(255) OUTPUT
)
AS 
BEGIN 
 SET NOCOUNT ON;



    IF @Id_Persona IS NULL OR @Id_Persona = 0
    BEGIN
        SET @O_Numero = -1;
        SET @O_Msg = 'El id personaes obligatorio.';
        RETURN;
    END;
	IF NOT EXISTS (SELECT 1 FROM Tbl_Datos_Personales WHERE Id_Persona = @Id_Persona)
	BEGIN
		SET @O_Numero = -1;
		SET @O_Msg = 'El id persona no existe.';
		RETURN;
	END;

	-- VALIDACIÓN: No permitir inserción si el estado de la persona es "Eliminado", "Desactivado", este puntoe me parece mas vialeble que de
	-- que depender de un solo 1 ya que los sistemas podrian variar 

	IF EXISTS (
		SELECT 1 
		FROM Tbl_Datos_Personales p
		INNER JOIN Cls_Estado e ON p.Id_Estado = e.Id_Estado
		WHERE p.Id_Persona = @Id_Persona 
		  AND e.Estado IN ('Eliminado', 'Desactivado', 'Inactivo', 'Suspendido')
	)
	BEGIN
		SET @O_Numero = -1;
		SET @O_Msg = 'No se puede registrar la dirección: La cuenta de la persona no está vigente o ha sido eliminada.';
		RETURN;
	END;

	  IF @Id_Estado IS NULL OR @Id_Estado = 0
    BEGIN
        SET @O_Numero = -1;
        SET @O_Msg = 'El id estado obligatorio.';
        RETURN;
    END;
	IF NOT EXISTS (SELECT 1 FROM Cls_Estado WHERE Id_Estado = @Id_Estado)
	BEGIN
		SET @O_Numero = -1;
		SET @O_Msg = 'El id  estado no existe.';
		RETURN;
	END;
	BEGIN TRY 
		BEGIN TRAN 
		INSERT INTO Tbl_direcciones( 
		Ciudad,
		Barrio,
		Calle ,
		Id_Creador,
		Id_Persona,
		Id_Estado
		 )
		values (
		@Ciudad,
		@Barrio,
		@Calle ,
		@Id_Creador,
		@Id_Persona,
		@Id_Estado
		)
	commit;
	set @O_Numero=200;
	set @O_Msg = 'la direccion se ha insertado correctamente'
	end try
	BEGIN CATCH 
		  IF @@TRANCOUNT > 0 ROLLBACK;

        SET @O_Numero = ERROR_NUMBER();
        SET @O_Msg = ERROR_MESSAGE();
    END CATCH;
END;
GO



DECLARE @Num INT, @Msg VARCHAR(255);

EXEC SpInsertarDireccion 
    'Managua', 
    'LasJAguitas',
    'los toros',
    1,
    2,
    3,
    @Num OUTPUT,
    @Msg OUTPUT;

SELECT @Num AS Numero, @Msg AS Mensaje;


	

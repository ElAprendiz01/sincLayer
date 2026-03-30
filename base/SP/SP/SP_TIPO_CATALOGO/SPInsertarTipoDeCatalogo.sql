USE SYNCLAYER;
GO

CREATE OR ALTER PROC Insertar_Cls_Tipo_Catalogo
(
	 @Nombre NVARCHAR (50),
	 @Id_Creador INT,
    @O_Numero INT OUTPUT,
    @O_Msg VARCHAR(255) OUTPUT
)
AS 
BEGIN 
	SET NOCOUNT ON;
    SET XACT_ABORT ON;

    BEGIN TRY 
    --VALIDACIONES
    --SI EL NOMBRE LO INGRESA NULO
	    IF (@Nombre IS NULL OR TRIM(@Nombre) = ' ')
    BEGIN
        SET @O_Numero = -1;
        SET @O_Msg = 'El nombre del TIPO catálogo es obligatorio.';
        RETURN;
    END;
    --SI EL IDENTIFICADORM VIENE NULO
	  IF (@Id_Creador IS NULL OR @Id_Creador = 0)
    BEGIN
        SET @O_Numero = -1;
        SET @O_Msg = 'El tipo de id Creador es obligatorio.';
        RETURN;
    END;
    --SI EL NOMBRE EXISTE NO DEJA INSERTAR EL DUPLICADO
    IF EXISTS(Select 1 from Cls_Tipo_Catalogo where Nombre = trim(@Nombre))
    Begin
    Set @O_Numero = -1
    SET @O_Msg = 'Ya existe un Tipo de catalogo con ese nombre';
    RETURN;
    End

		BEGIN TRANSACTION TRX_INSERTAR_TIPO_CATALOGO
		INSERT INTO Cls_Tipo_Catalogo(Nombre, Fecha_Creacion, Id_Creador, Activo)
		VALUES (trim(@Nombre), GETDATE(), @Id_Creador, 1)
		COMMIT TRANSACTION TRX_INSERTAR_TIPO_CATALOGO
		
        SET @O_Numero = 200;
        SET @O_Msg = 'Catálogo insertado correctamente.';
    END TRY
    BEGIN CATCH
        IF @@TRANCOUNT > 0 ROLLBACK TRANSACTION TRX_INSERTAR_TIPO_CATALOGO;

        SET @O_Numero = ERROR_NUMBER();
        SET @O_Msg = ERROR_MESSAGE();
    END CATCH;

    SET NOCOUNT OFF;
    SET XACT_ABORT OFF;
END;
GO

DECLARE @Resultado_ID INT;
DECLARE @Mensaje_Respuesta VARCHAR(255);

EXEC Insertar_Cls_Tipo_Catalogo 
    @Nombre = 'Tipo de Movimiento',
    @Id_Creador = 1,                 
    @O_Numero = @Resultado_ID OUTPUT,
    @O_Msg = @Mensaje_Respuesta OUTPUT;

SELECT 
    @Resultado_ID AS Codigo_Respuesta, 
    @Mensaje_Respuesta AS Mensaje_del_Servidor;
GO
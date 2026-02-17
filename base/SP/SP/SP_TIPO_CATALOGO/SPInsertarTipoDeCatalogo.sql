USE SYNCLAYER;
GO

CREATE OR ALTER PROC Insertar_Cls_Tipo_Catalogo
(
	 @Nombre NVARCHAR,
	 @Id_Creador INT,
    @O_Numero INT OUTPUT,
    @O_Msg VARCHAR(255) OUTPUT
)
AS 
BEGIN 
	SET NOCOUNT ON;
	    IF @Nombre IS NULL OR LTRIM(RTRIM(@Nombre)) = ''
    BEGIN
        SET @O_Numero = -1;
        SET @O_Msg = 'El nombre del TIPO catálogo es obligatorio.';
        RETURN;
    END;
	  IF @Id_Creador IS NULL OR @Id_Creador = 0
    BEGIN
        SET @O_Numero = -1;
        SET @O_Msg = 'El tipo de id Creador es obligatorio.';
        RETURN;
    END;

	BEGIN TRY 
		BEGIN TRAN 
		INSERT INTO Cls_Tipo_Catalogo(Nombre, Fecha_Creacion, Id_Creador, Activo)
		VALUES (@Nombre, GETDATE(), @Id_Creador, 1)
		COMMIT 
		
        SET @O_Numero = 200;
        SET @O_Msg = 'Catálogo insertado correctamente.';
    END TRY
    BEGIN CATCH
        IF @@TRANCOUNT > 0 ROLLBACK;

        SET @O_Numero = ERROR_NUMBER();
        SET @O_Msg = ERROR_MESSAGE();
    END CATCH;
END;
GO

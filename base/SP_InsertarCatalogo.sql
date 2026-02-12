USE SYNCLAYER
GO

CREATE OR ALTER PROCEDURE SP_InsertarCatalogo
(
    @Id_Tipo_Catalogo INT,
    @Nombre NVARCHAR(80),
    @Id_Creador INT,
    @O_Numero INT OUTPUT,
    @O_Msg VARCHAR(255) OUTPUT
)
AS
BEGIN
    SET NOCOUNT ON;



    -- VALIDACIONES BÁSICAS Y NECESARIAS
    IF @Id_Tipo_Catalogo IS NULL OR @Id_Tipo_Catalogo = 0
    BEGIN
        SET @O_Numero = -1;
        SET @O_Msg = 'El tipo de catálogo es obligatorio.';
        RETURN;
    END;
	IF NOT EXISTS (SELECT 1 FROM Cls_Tipo_Catalogo WHERE Id_Tipo_Catalogo = @Id_Tipo_Catalogo)
	BEGIN
		SET @O_Numero = -1;
		SET @O_Msg = 'El tipo de catálogo no existe.';
		RETURN;
	END;

    IF @Nombre IS NULL OR LTRIM(RTRIM(@Nombre)) = ''
    BEGIN
        SET @O_Numero = -1;
        SET @O_Msg = 'El nombre del catálogo es obligatorio.';
        RETURN;
    END;
	  IF @Id_Creador IS NULL OR @Id_Creador = 0
    BEGIN
        SET @O_Numero = -1;
        SET @O_Msg = 'El tipo de id Creador es obligatorio.';
        RETURN;
    END;


    

    BEGIN TRY
        BEGIN TRAN;

        INSERT INTO Cls_Catalogo
        (
            Id_Tipo_Catalogo,
            Nombre,
            Id_Creador,
            Activo
        )
        VALUES
        (
            @Id_Tipo_Catalogo,
            @Nombre,
            @Id_Creador,
            1
        );

        COMMIT;

        SET @O_Numero = 0;
        SET @O_Msg = 'Catálogo insertado correctamente.';
    END TRY
    BEGIN CATCH
        IF @@TRANCOUNT > 0 ROLLBACK;

        SET @O_Numero = ERROR_NUMBER();
        SET @O_Msg = ERROR_MESSAGE();
    END CATCH;
END;
GO
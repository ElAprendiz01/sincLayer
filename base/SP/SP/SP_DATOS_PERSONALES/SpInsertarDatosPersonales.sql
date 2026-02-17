
USE SYNCLAYER;
GO

CREATE OR ALTER PROCEDURE Insertar_Tbl_Datos_Personales
(
    @Genero INT,
    @Primer_Nombre NVARCHAR(50),
    @Segundo_Nombre NVARCHAR(50) = NULL,
    @Primer_Apellido NVARCHAR(50),
    @Segundo_Apellido NVARCHAR(50) = NULL,
    @Fecha_Nacimiento DATE = NULL,
    @Tipo_DNI INT,
    @DNI VARCHAR(20),
    @Id_Creador INT,
    @Id_Estado INT,
    @O_Numero INT OUTPUT,
    @O_Msg VARCHAR(255) OUTPUT
)
AS
BEGIN
    SET NOCOUNT ON;

    IF @Primer_Nombre IS NULL OR LTRIM(RTRIM(@Primer_Nombre)) = ''
    BEGIN
        SET @O_Numero = -1;
        SET @O_Msg = 'El primer nombre es obligatorio.';
        RETURN;
    END

    IF @Primer_Apellido IS NULL OR LTRIM(RTRIM(@Primer_Apellido)) = ''
    BEGIN
        SET @O_Numero = -1;
        SET @O_Msg = 'El primer apellido es obligatorio.';
        RETURN;
    END

    IF @DNI IS NULL OR LTRIM(RTRIM(@DNI)) = ''
    BEGIN
        SET @O_Numero = -1;
        SET @O_Msg = 'El DNI es obligatorio.';
        RETURN;
    END
	-- importante chicos auqi la svalidaciones no van con el where sino que como son bit los cls entonces van directos 0 o 1
    IF NOT EXISTS (SELECT 1 FROM Cls_Catalogo WHERE Id_Catalogo = @Genero AND Activo = 1)
    BEGIN
        SET @O_Numero = -1;
        SET @O_Msg = 'El valor de Genero no existe o está inactivo.';
        RETURN;
    END

    IF NOT EXISTS (SELECT 1 FROM Cls_Catalogo WHERE Id_Catalogo = @Tipo_DNI AND Activo = 1)
    BEGIN
        SET @O_Numero = -1;
        SET @O_Msg = 'El valor de Tipo_DNI no existe o está inactivo.';
        RETURN;
    END


    IF NOT EXISTS (SELECT 1 FROM Cls_Estado WHERE Id_Estado = @Id_Estado AND Activo = 1)
    BEGIN
        SET @O_Numero = -1;
        SET @O_Msg = 'El estado no existe o está desactivado.';
        RETURN;
    END

    IF EXISTS (SELECT 1 FROM Tbl_Datos_Personales WHERE DNI = @DNI)
    BEGIN
        SET @O_Numero = -1;
        SET @O_Msg = 'El DNI ya existe en el sistema.';
        RETURN;
    END

    BEGIN TRY
        BEGIN TRAN;

        INSERT INTO Tbl_Datos_Personales
        (
            Genero,
            Primer_Nombre,
            Segundo_Nombre,
            Primer_Apellido,
            Segundo_Apellido,
            Fecha_Nacimiento,
            Tipo_DNI,
            DNI,
            Fecha_Creacion,
            Id_Creador,
            Id_Estado
        )
        VALUES
        (
            @Genero,
            @Primer_Nombre,
            @Segundo_Nombre,
            @Primer_Apellido,
            @Segundo_Apellido,
            @Fecha_Nacimiento,
            @Tipo_DNI,
            @DNI,
            GETDATE(),
            @Id_Creador,
            @Id_Estado
        );

        COMMIT;
        SET @O_Numero = 200;
        SET @O_Msg = 'Los datos personales se han insertado correctamente.';
    END TRY
    BEGIN CATCH
        IF @@TRANCOUNT > 0 ROLLBACK;
        SET @O_Numero = ERROR_NUMBER();
        SET @O_Msg = ERROR_MESSAGE();
    END CATCH
END;
GO

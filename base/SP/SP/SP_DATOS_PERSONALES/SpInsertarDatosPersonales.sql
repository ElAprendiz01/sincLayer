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
    @Id_Estado INT = 3,
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
	IF @DNI LIKE '%[a-z][a-z][a-z][a-z][a-z]%' -- Rechaza 5 letras seguidas si el formato es numérico
       OR @DNI NOT LIKE '%[0-9]%'               -- Rechaza si no contiene ni un solo número
    BEGIN
        SET @O_Numero = -1;
        SET @O_Msg = 'El formato del DNI/Pasaporte es inválido. Verifique que no contenga texto aleatorio.';
        RETURN;
    END

    -- Validación específica para Cédula (Si @Tipo_DNI = 12)
    IF @Tipo_DNI = 12 AND @DNI NOT LIKE '[0-9][0-9][0-9]-[0-9][0-9][0-9][0-9][0-9][0-9]-[0-9][0-9][0-9][0-9][A-Z]'
    BEGIN
        -- Si permites cédulas sin guiones, ajusta el patrón o usa REPLACE(@DNI, '-', '')
        SET @O_Numero = -1;
        SET @O_Msg = 'El formato de Cédula debe ser 000-000000-0000A.';
        RETURN;
    ENd
	IF @Fecha_Nacimiento IS NOT NULL
    BEGIN
        -- Validar que no sea del año 1925 o anterior
        IF YEAR(@Fecha_Nacimiento) <= 1925
        BEGIN
            SET @O_Numero = -1;
            SET @O_Msg = 'La fecha de nacimiento no es válida. El año debe ser mayor a 1925.';
            RETURN;
        END

        -- Validar que tenga al menos 12 años (Fecha actual menos 12 años)
        IF @Fecha_Nacimiento > DATEADD(YEAR, -12, GETDATE())
        BEGIN
            SET @O_Numero = -1;
            SET @O_Msg = 'La persona debe tener al menos 12 años de edad para ser registrada.';
            RETURN;
        END
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
go

DECLARE @O_Numero INT;
DECLARE @O_Msg VARCHAR(255);

-- 1. CASO DE ÉXITO: Registro válido
EXEC Insertar_Tbl_Datos_Personales 
    @Genero = 9,
    @Primer_Nombre = 'Juan',
    @Segundo_Nombre = 'Alberto',
    @Primer_Apellido = 'Pérez',
    @Segundo_Apellido = 'García',
    @Fecha_Nacimiento = '1995-05-15',
    @Tipo_DNI = 12, 
    @DNI = '123456789-0', 
    @Id_Creador = 1,
    @Id_Estado = 3, 
    @O_Numero = @O_Numero OUTPUT,
    @O_Msg = @O_Msg OUTPUT;

SELECT @O_Numero AS Codigo, @O_Msg AS Mensaje;

-- 2. CASO FALLIDO: Menor de 12 años
DECLARE @O_Numero INT;
DECLARE @O_Msg VARCHAR(255);

EXEC Insertar_Tbl_Datos_Personales 
    @Genero = 9,
    @Primer_Nombre = 'Luis',
    @Primer_Apellido = 'Mora',
    @Fecha_Nacimiento = '2020-01-01', -- Muy joven
    @Tipo_DNI = 12,
    @DNI = '987654321-0',
    @Id_Creador = 1,
    @Id_Estado = 3,
    @O_Numero = @O_Numero OUTPUT,
    @O_Msg = @O_Msg OUTPUT;

SELECT @O_Numero AS Codigo_Error, @O_Msg AS Mensaje_Error;

-- 3. CASO FALLIDO: DNI Duplicado
-- Ejecuta esto dos veces con el mismo DNI para ver el error
EXEC Insertar_Tbl_Datos_Personales 
    @Genero = 1,
    @Primer_Nombre = 'Ana',
    @Primer_Apellido = 'Rojas',
    @Fecha_Nacimiento = '1990-10-10',
    @Tipo_DNI = 2,
    @DNI = '123456789-0', -- Mismo que el caso 1
    @Id_Creador = 10,
    @Id_Estado = 1,
    @O_Numero = @O_Numero OUTPUT,
    @O_Msg = @O_Msg OUTPUT;

SELECT @O_Numero AS Codigo_DNI_Duplicado, @O_Msg AS Mensaje_DNI_Duplicado;

Select * from Cls_Estado



select * from Tbl_Datos_Personales
select * from Cls_Catalogo
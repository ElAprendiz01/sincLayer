USE SYNCLAYER;
GO

CREATE OR ALTER PROCEDURE Editar_Tbl_Datos_Personales
(
    @Id_Persona INT,
    @Genero INT = NULL,
    @Primer_Nombre NVARCHAR(50) = NULL,
    @Segundo_Nombre NVARCHAR(50) = NULL,
    @Primer_Apellido NVARCHAR(50) = NULL,
    @Segundo_Apellido NVARCHAR(50) = NULL,
    @Fecha_Nacimiento DATE = NULL,
    @Tipo_DNI INT = NULL,
    @DNI VARCHAR(20) = NULL,
    @Id_Modificador INT = NULL,
    @Id_Estado INT = NULL,
    @ForzarRecuperacion BIT = 0,  -- NUEVO: permite actualizar aunque esté eliminado
    @O_Numero INT OUTPUT,
    @O_Msg VARCHAR(255) OUTPUT
)
AS
BEGIN
    SET NOCOUNT ON;

    -- Validación: persona existe
    IF NOT EXISTS (SELECT 1 FROM Tbl_Datos_Personales WHERE Id_Persona = @Id_Persona)
    BEGIN
        SET @O_Numero = -1;
        SET @O_Msg = 'La persona no existe.';
        RETURN;
    END

    -- Validar catálogos solo si se pasan valores
    IF @Genero IS NOT NULL
        AND NOT EXISTS (SELECT 1 FROM Cls_Catalogo WHERE Id_Catalogo = @Genero AND Activo = 1)
    BEGIN
        SET @O_Numero = -1;
        SET @O_Msg = 'El valor de Genero no existe o está inactivo.';
        RETURN;
    END

    IF @Tipo_DNI IS NOT NULL
        AND NOT EXISTS (SELECT 1 FROM Cls_Catalogo WHERE Id_Catalogo = @Tipo_DNI AND Activo = 1)
    BEGIN
        SET @O_Numero = -1;
        SET @O_Msg = 'El valor de Tipo_DNI no existe o está inactivo.';
        RETURN;
    END

    IF @Id_Estado IS NOT NULL
        AND NOT EXISTS (SELECT 1 FROM Cls_Estado WHERE Id_Estado = @Id_Estado AND Activo = 1)
    BEGIN
        SET @O_Numero = -1;
        SET @O_Msg = 'El estado no existe o está desactivado.';
        RETURN;
    END

    -- Validar que el DNI no exista en otra persona
    IF @DNI IS NOT NULL
        AND EXISTS (SELECT 1 FROM Tbl_Datos_Personales WHERE DNI = @DNI AND Id_Persona <> @Id_Persona)
    BEGIN
        SET @O_Numero = -1;
        SET @O_Msg = 'El DNI ya existe en otra persona.';
        RETURN;
    END

    -- VALIDACIÓN DINÁMICA DE ESTADO ELIMINADO (solo si NO se fuerza la recuperación)
    IF @ForzarRecuperacion = 0
        AND EXISTS (
            SELECT 1
            FROM Tbl_Datos_Personales p
            INNER JOIN Cls_Estado e ON p.Id_Estado = e.Id_Estado
            WHERE p.Id_Persona = @Id_Persona
              AND e.Estado IN ('Eliminado', 'Desactivado', 'Inactivo', 'Suspendido')
        )
    BEGIN
        SET @O_Numero = -1;
        SET @O_Msg = 'El estado del registro indica que está eliminado o desactivado.'
                     + CHAR(13) + CHAR(10) +
                     'Si cree que es un error, comuníquese con administración.';
        RETURN;
    END;

    BEGIN TRY
        BEGIN TRAN;

        UPDATE Tbl_Datos_Personales
        SET
            Genero = COALESCE(@Genero, Genero),
            Primer_Nombre = COALESCE(TRIM(@Primer_Nombre), Primer_Nombre),
            Segundo_Nombre = COALESCE(TRIM(@Segundo_Nombre), Segundo_Nombre),
            Primer_Apellido = COALESCE(TRIM(@Primer_Apellido), Primer_Apellido),
            Segundo_Apellido = COALESCE(TRIM(@Segundo_Apellido), Segundo_Apellido),
            Fecha_Nacimiento = COALESCE(@Fecha_Nacimiento, Fecha_Nacimiento),
            Tipo_DNI = COALESCE(@Tipo_DNI, Tipo_DNI),
            DNI = COALESCE(TRIM(@DNI), DNI),
            Fecha_Modificacion = GETDATE(),
            Id_Modificador = COALESCE(@Id_Modificador, Id_Modificador),
            Id_Estado = COALESCE(@Id_Estado, Id_Estado)
        WHERE Id_Persona = @Id_Persona;

        COMMIT;

        SET @O_Numero = 200;
        SET @O_Msg = 'Los datos personales se han actualizado correctamente.';
    END TRY
    BEGIN CATCH
        IF @@TRANCOUNT > 0 ROLLBACK;
        SET @O_Numero = ERROR_NUMBER();
        SET @O_Msg = ERROR_MESSAGE();
    END CATCH
END;
GO


--nota para  recuperar los datos hay que pasar  ; @ForzarRecuperacion de 0 como esta en el sp a 1
DECLARE @Num INT, @Msg VARCHAR(255);

EXEC Editar_Tbl_Datos_Personales
    @Id_Persona = 1,
    @Id_Modificador = 1,
    @Id_Estado = 4,            -- nuevo estado
    @ForzarRecuperacion = 1,   -- permite actualizar aunque esté eliminado
    @O_Numero = @Num OUTPUT,
    @O_Msg = @Msg OUTPUT;

SELECT @Num AS Numero, @Msg AS Mensaje;


--si hacemos la prubea actualixar uno que no existe o que tiene l estado desctivadoas i no podremos 
-- tenemos que validar esto en la api que lo use solo el admin 

DECLARE @Num INT, @Msg VARCHAR(255);

EXEC Editar_Tbl_Datos_Personales
    @Id_Persona = 1,
    @Id_Modificador = 1,
    @Id_Estado = 2,            
    @O_Numero = @Num OUTPUT,
    @O_Msg = @Msg OUTPUT;

SELECT @Num AS Numero, @Msg AS Mensaje;


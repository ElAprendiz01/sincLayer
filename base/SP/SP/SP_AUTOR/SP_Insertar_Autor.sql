USE SYNCLAYER;
GO

CREATE OR ALTER PROCEDURE SpInsertarAutor(
    @Id_Persona INT,
    @Id_Creador INT,
    @Id_Estado INT,
    @O_Numero INT OUTPUT,
    @O_Msg VARCHAR(255) OUTPUT
)
AS
BEGIN
    SET NOCOUNT ON;

    -- Validar persona obligatoria
    IF @Id_Persona IS NULL OR @Id_Persona = 0
    BEGIN 
        SET @O_Numero = -1;
        SET @O_Msg = 'El id persona es obligatorio.';
        RETURN;
    END;

    -- Validar que la persona exista
    IF NOT EXISTS (SELECT 1 FROM Tbl_Datos_Personales WHERE Id_Persona = @Id_Persona)
    BEGIN
        SET @O_Numero = -1;
        SET @O_Msg = 'El id persona no existe.';
        RETURN;
    END;

    -- Validar que la persona no esté en estados inválidos
    IF EXISTS (
        SELECT 1
        FROM Tbl_Datos_Personales p
        INNER JOIN Cls_Estado e ON p.Id_Estado = e.Id_Estado
        WHERE p.Id_Persona = @Id_Persona
          AND e.Estado IN ('Eliminado', 'Desactivado', 'Inactivo', 'Suspendido')
    )
    BEGIN
        SET @O_Numero = -1;
        SET @O_Msg = 'No se puede registrar el autor: la persona no está vigente o ha sido eliminada.';
        RETURN;
    END;

    -- Validar estado obligatorio
    IF @Id_Estado IS NULL OR @Id_Estado = 0
    BEGIN
        SET @O_Numero = -1;
        SET @O_Msg = 'El id estado es obligatorio.';
        RETURN;
    END;
	-- Validar que el estado no esté en estados inválidos
	IF EXISTS (
		SELECT 1
		FROM Cls_Estado e
		WHERE e.Id_Estado = @Id_Estado
		  AND e.Estado IN ('Eliminado', 'Desactivado', 'Inactivo', 'Suspendido')
	)
	BEGIN
		SET @O_Numero = -1;
		SET @O_Msg = 'No se puede registrar el autor: el estado indicado está marcado como inválido.';
		RETURN;
	END;

    -- Validar que el estado exista y esté activo
    IF NOT EXISTS (
        SELECT 1
        FROM Cls_Estado
        WHERE Id_Estado = @Id_Estado
          AND Activo = 1
    )
    BEGIN
        SET @O_Numero = -1;
        SET @O_Msg = 'El estado no existe o está inactivo.';
        RETURN;
    END;

    BEGIN TRY
        BEGIN TRAN;

        INSERT INTO Tbl_Autores(
            Id_Persona,
            Id_Creador,
            Id_Estado,
            Fecha_Creacion
        )
        VALUES (
            @Id_Persona,
            @Id_Creador,
            @Id_Estado,
            GETDATE()
        );

        COMMIT TRAN;

        SET @O_Numero = 200;
        SET @O_Msg = 'El autor se ha insertado correctamente.';
    END TRY
    BEGIN CATCH
        IF @@TRANCOUNT > 0 ROLLBACK TRAN;

        SET @O_Numero = ERROR_NUMBER();
        SET @O_Msg = ERROR_MESSAGE();
    END CATCH;
END;
GO

DECLARE @Num INT, @Msg VARCHAR(255);

EXEC SpInsertarAutor
    @Id_Persona = 7,
    @Id_Creador = 1,
    @Id_Estado = 3,
    @O_Numero = @Num OUTPUT,
    @O_Msg = @Msg OUTPUT;

SELECT @Num AS Numero, @Msg AS Mensaje;

SELECT * FROM Tbl_Datos_Personales
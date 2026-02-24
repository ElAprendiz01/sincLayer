USE SYNCLAYER
GO

CREATE OR ALTER PROCEDURE Insertar_Tbl_Contacto(
    @Id_Persona INT,
    @Tipo_Contacto INT,
    @Contacto NVARCHAR(100),
    @Id_Creador INT,
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
        SET @O_Msg = 'El id persona es obligatorio.';
        RETURN;
    END;

    IF NOT EXISTS (SELECT 1 FROM Tbl_Datos_Personales WHERE Id_Persona = @Id_Persona)
    BEGIN
        SET @O_Numero = -1;
        SET @O_Msg = 'El id persona no existe.';
        RETURN;
    END;

    IF EXISTS (
        SELECT 1
        FROM Tbl_Datos_Personales p
        INNER JOIN Cls_Estado e ON p.Id_Estado = e.Id_Estado
        WHERE p.Id_Persona = @Id_Persona
          AND e.Estado IN ('Eliminado', 'Desactivado', 'Inactivo', 'Suspendido')
    )
    BEGIN
        SET @O_Numero = -1;
        SET @O_Msg = 'No se puede registrar el contacto: la persona no está vigente o ha sido eliminada.';
        RETURN;
    END;

    IF @Tipo_Contacto IS NULL OR @Tipo_Contacto = 0
    BEGIN
        SET @O_Numero = -1;
        SET @O_Msg = 'El tipo de contacto es obligatorio.';
        RETURN;
    END;

    IF NOT EXISTS (SELECT 1 FROM Cls_Catalogo WHERE Id_Catalogo = @Tipo_Contacto)
    BEGIN
        SET @O_Numero = -1;
        SET @O_Msg = 'El tipo de contacto no existe.';
        RETURN;
    END;

    IF @Id_Estado IS NULL OR @Id_Estado = 0
    BEGIN
        SET @O_Numero = -1;
        SET @O_Msg = 'El id estado es obligatorio.';
        RETURN;
    END;

    IF NOT EXISTS (SELECT 1 FROM Cls_Estado WHERE Id_Estado = @Id_Estado AND Activo = 1)
    BEGIN
        SET @O_Numero = -1;
        SET @O_Msg = 'El id estado no existe o está inactivo.';
        RETURN;
    END;

    BEGIN TRY
        BEGIN TRAN
        INSERT INTO Tbl_Contacto(
            Id_Persona,
            Tipo_Contacto,
            Contacto,
            Fecha_Creacion,
            Id_Creador,
            Id_Estado
        )
        VALUES(
            @Id_Persona,
            @Tipo_Contacto,
            @Contacto,
            GETDATE(),
            @Id_Creador,
            @Id_Estado
        );
        COMMIT;
        SET @O_Numero = 200;
        SET @O_Msg = 'El contacto se ha insertado correctamente.';
    END TRY
    BEGIN CATCH
        IF @@TRANCOUNT > 0 ROLLBACK;
        SET @O_Numero = ERROR_NUMBER();
        SET @O_Msg = ERROR_MESSAGE();
    END CATCH;
END;
GO

DECLARE @Num INT, @Msg VARCHAR(255);

EXEC Insertar_Tbl_Contacto
    4,       
    5,       
    'correo@gmail.com',
    1,     
    3,     
    @Num OUTPUT,
    @Msg OUTPUT;

SELECT @Num AS Numero, @Msg AS Mensaje;
select * from Tbl_Datos_Personales
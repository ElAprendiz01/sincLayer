USE SYNCLAYER
GO

CREATE OR ALTER PROCEDURE Editar_Tbl_Contacto(
    @Id_Contacto INT,
    @Tipo_Contacto INT = NULL,
    @Contacto NVARCHAR(100) = NULL,
    @Id_Modificador INT,
    @Id_Estado INT = NULL,
    @ForzarRecuperacion BIT = 0,
    @O_Numero INT OUTPUT,
    @O_Msg VARCHAR(255) OUTPUT
)
AS
BEGIN
    SET NOCOUNT ON;

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
    END;

    IF @ForzarRecuperacion = 0
       AND EXISTS (
            SELECT 1
            FROM Tbl_Contacto c
            INNER JOIN Cls_Estado e ON c.Id_Estado = e.Id_Estado
            WHERE c.Id_Contacto = @Id_Contacto
              AND e.Estado IN ('Eliminado', 'Desactivado', 'Inactivo', 'Suspendido')
       )
    BEGIN
        SET @O_Numero = -1;
        SET @O_Msg = 'El estado del registro indica que está eliminado o desactivado.'
                     + CHAR(13) + CHAR(10) +
                     'Si cree que es un error, comuníquese con administración.';
        RETURN;
    END;

    IF NOT EXISTS (SELECT 1 FROM Tbl_Contacto WHERE Id_Contacto = @Id_Contacto)
    BEGIN
        SET @O_Numero = -1;
        SET @O_Msg = 'El contacto no existe.';
        RETURN;
    END;



    IF @Tipo_Contacto IS NOT NULL
    BEGIN
        IF NOT EXISTS (SELECT 1 FROM Cls_Catalogo WHERE Id_Catalogo = @Tipo_Contacto)
        BEGIN
            SET @O_Numero = -1;
            SET @O_Msg = 'El tipo de contacto no existe.';
            RETURN;
        END;
    END;

    BEGIN TRY
        BEGIN TRAN;

        UPDATE Tbl_Contacto
        SET
            Tipo_Contacto = COALESCE(@Tipo_Contacto, Tipo_Contacto),
            Contacto = TRIM(COALESCE(@Contacto, Contacto)),
            Fecha_Modificacion = GETDATE(),
            Id_Modificador = @Id_Modificador,
            Id_Estado = COALESCE(@Id_Estado, Id_Estado)
        WHERE Id_Contacto = @Id_Contacto;

        COMMIT;

        SET @O_Numero = 200;
        SET @O_Msg = 'El contacto se ha actualizado correctamente.';
    END TRY
    BEGIN CATCH
        IF @@TRANCOUNT > 0 ROLLBACK;
        SET @O_Numero = ERROR_NUMBER();
        SET @O_Msg = ERROR_MESSAGE();
    END CATCH;
END;
GO

DECLARE @Num INT, @Msg VARCHAR(255);

EXEC Editar_Tbl_Contacto
    @Id_Contacto = 1,
    @Contacto = 'nuevo_correo@gmail.com',
    @Id_Modificador = 1,
    @Id_Estado = 3,
    @O_Numero = @Num OUTPUT,
    @O_Msg = @Msg OUTPUT;

SELECT @Num AS Numero, @Msg AS Mensaje;

DECLARE @Num2 INT, @Msg2 VARCHAR(255);

EXEC Editar_Tbl_Contacto
    @Id_Contacto = 1,
    @Contacto = 'recuperado@gmi.com',
    @Id_Modificador = 1,
    @O_Numero = @Num2 OUTPUT,
    @O_Msg = @Msg2 OUTPUT;

SELECT @Num2 AS Numero, @Msg2 AS Mensaje;

select * from Tbl_Contacto
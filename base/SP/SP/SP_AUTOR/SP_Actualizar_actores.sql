USE SYNCLAYER;
GO

CREATE OR ALTER PROCEDURE SpActualizarAutor(
    @Id_Autor INT,
    @Id_Modificador INT,
    @Id_Estado INT = NULL,
    @ForzarRecuperacion BIT = 0,
    @O_Numero INT OUTPUT,
    @O_Msg VARCHAR(255) OUTPUT
)
AS
BEGIN
    SET NOCOUNT ON;

    -- Validar existencia del autor
    IF NOT EXISTS (SELECT 1 FROM Tbl_Autores WHERE Id_Autor = @Id_Autor)
    BEGIN
        SET @O_Numero = -1;
        SET @O_Msg = 'El autor no existe.';
        RETURN;
    END;

    -- Validar estado si se envió
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
        END;

        -- Validar que el estado no sea inválido
        IF EXISTS (
            SELECT 1
            FROM Cls_Estado e
            WHERE e.Id_Estado = @Id_Estado
              AND e.Estado IN ('Eliminado','Desactivado','Inactivo','Suspendido')
        )
        BEGIN
            SET @O_Numero = -1;
            SET @O_Msg = 'No se puede asignar un estado inválido al autor.';
            RETURN;
        END;
    END;

    -- Validar que el autor no esté eliminado o inactivo, salvo recuperación forzada
    IF @ForzarRecuperacion = 0
       AND EXISTS (
            SELECT 1
            FROM Tbl_Autores a
            INNER JOIN Cls_Estado e ON a.Id_Estado = e.Id_Estado
            WHERE a.Id_Autor = @Id_Autor
              AND e.Estado IN ('Eliminado','Desactivado','Inactivo','Suspendido')
       )
    BEGIN
        SET @O_Numero = -1;
        SET @O_Msg = 'El autor está eliminado o inactivo. Para recuperarlo comuniquese  con el administrador';
        RETURN;
    END;

    BEGIN TRY
        BEGIN TRAN;

        UPDATE Tbl_Autores
        SET
            Fecha_Modificacion = GETDATE(),
            Id_Modificador = @Id_Modificador,
            Id_Estado = COALESCE(@Id_Estado, Id_Estado)
        WHERE Id_Autor = @Id_Autor;

        COMMIT TRAN;

        SET @O_Numero = 200;
        SET @O_Msg = 'El autor se ha actualizado correctamente.';
    END TRY
    BEGIN CATCH
        IF @@TRANCOUNT > 0 ROLLBACK TRAN;

        SET @O_Numero = ERROR_NUMBER();
        SET @O_Msg = ERROR_MESSAGE();
    END CATCH;
END;
GO


DECLARE @Num INT, @Msg VARCHAR(255);

EXEC SpActualizarAutor
    @Id_Autor = 1,
    @Id_Modificador = 2,
    @Id_Estado = 3,
    @O_Numero = @Num OUTPUT,
    @O_Msg = @Msg OUTPUT;

SELECT @Num AS Numero, @Msg AS Mensaje;

select * from Tbl_Autores

DECLARE @Num INT, @Msg VARCHAR(255);

EXEC SpActualizarAutor
    @Id_Autor = 1,
    @Id_Modificador = 2,
    @Id_Estado = 3,
	@ForzarRecuperacion=1,
    @O_Numero = @Num OUTPUT,
    @O_Msg = @Msg OUTPUT;

SELECT @Num AS Numero, @Msg AS Mensaje;
USE SYNCLAYER;
GO

CREATE OR ALTER PROCEDURE SpDesactivarAutorAutomatico
(
    @Id_Autor INT,
    @Id_Modificador INT,
    @O_Numero INT OUTPUT,
    @O_Msg VARCHAR(255) OUTPUT
)
AS
BEGIN
    SET NOCOUNT ON;

    IF @Id_Autor IS NULL OR @Id_Autor = 0
    BEGIN
        SET @O_Numero = -1;
        SET @O_Msg = 'El Id_Autor es obligatorio.';
        RETURN;
    END;

    -- Validar que el autor exista y no esté ya desactivado/eliminado
    DECLARE @ExisteAutor INT;

    SELECT @ExisteAutor = 1
    FROM Tbl_Autores a
    INNER JOIN Cls_Estado e ON a.Id_Estado = e.Id_Estado
    WHERE a.Id_Autor = @Id_Autor
      AND e.Estado NOT IN ('Desactivado','Inactivo','Eliminado')
      AND e.Activo = 1;

    IF @ExisteAutor IS NULL
    BEGIN
        SET @O_Numero = -1;
        SET @O_Msg = 'El autor no existe o ya está desactivado/eliminado.';
        RETURN;
    END;

    -- Buscar el Id_Estado de desactivación
    DECLARE @Id_Estado INT;

    SELECT TOP 1 @Id_Estado = Id_Estado
    FROM Cls_Estado
    WHERE Estado IN ('Desactivado','Inactivo','Eliminado')
      AND Activo = 1
    ORDER BY Id_Estado;

    IF @Id_Estado IS NULL
    BEGIN
        SET @O_Numero = -1;
        SET @O_Msg = 'No se encontró un estado válido de desactivación.';
        RETURN;
    END;

    BEGIN TRY
        BEGIN TRAN;

        UPDATE Tbl_Autores
        SET 
            Id_Estado = @Id_Estado,
            Id_Modificador = @Id_Modificador,
            Fecha_Modificacion = GETDATE()
        WHERE Id_Autor = @Id_Autor;

        COMMIT TRAN;

        SET @O_Numero = 200;
        SET @O_Msg = 'Autor desactivado correctamente.';
    END TRY
    BEGIN CATCH
        IF @@TRANCOUNT > 0 ROLLBACK TRAN;

        SET @O_Numero = ERROR_NUMBER();
        SET @O_Msg = ERROR_MESSAGE();
    END CATCH;
END;
GO

DECLARE @Num INT, @Msg VARCHAR(255);

EXEC SpDesactivarAutorAutomatico
    @Id_Autor = 1,
    @Id_Modificador = 2,
    @O_Numero = @Num OUTPUT,
    @O_Msg = @Msg OUTPUT;

SELECT @Num AS Numero, @Msg AS Mensaje;
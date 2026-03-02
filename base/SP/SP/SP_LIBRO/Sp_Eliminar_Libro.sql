USE SYNCLAYER;
GO

--- validaciones añadir, que el libro exista, 
--que no este eliminado/inactivo
--que exista un estado valido
--que Id_Modificador no sea nulo

CREATE OR ALTER PROCEDURE Eliminar_Tbl_Libros
(
    @Id_Libro INT,
    @Id_Modificador INT,
    @O_Numero INT OUTPUT,
    @O_Msg VARCHAR(255) OUTPUT
)
AS
BEGIN
    SET NOCOUNT ON;

    IF @Id_Libro IS NULL OR @Id_Libro = 0
    BEGIN
        SET @O_Numero = -1;
        SET @O_Msg = 'El Id_Libro es obligatorio.';
        RETURN;
    END;

    IF @Id_Modificador IS NULL OR @Id_Modificador = 0
    BEGIN
        SET @O_Numero = -1;
        SET @O_Msg = 'El Id_Modificador es obligatorio.';
        RETURN;
    END;

    -- Validar que el libro exista 
    DECLARE @ExisteLibro INT;

    SELECT @ExisteLibro = 1
    FROM Tbl_Libros l
    INNER JOIN Cls_Estado e ON l.Id_Estado = e.Id_Estado
    WHERE l.Id_Libro = @Id_Libro
      AND e.Estado NOT IN ('Eliminado', 'Inactivo', 'Desactivado')
      AND e.Activo = 1;

    IF @ExisteLibro IS NULL
    BEGIN
        SET @O_Numero = -1;
        SET @O_Msg = 'El libro no existe o ya está eliminado/inactivo.';
        RETURN;
    END;

    -- Buscar el Id_Estado de eliminación
    DECLARE @Id_Estado INT;

    SELECT TOP 1 @Id_Estado = Id_Estado
    FROM Cls_Estado
    WHERE Estado IN ('Eliminado', 'Inactivo', 'Desactivado')
      AND Activo = 1
    ORDER BY Id_Estado;

    IF @Id_Estado IS NULL
    BEGIN
        SET @O_Numero = -1;
        SET @O_Msg = 'No se encontró un estado válido de eliminación.';
        RETURN;
    END;

    BEGIN TRY
        BEGIN TRAN;

        UPDATE Tbl_Libros
        SET 
            Id_Estado = @Id_Estado,
            Id_Modificador = @Id_Modificador,
            Fecha_Modificacion = GETDATE()
        WHERE Id_Libro = @Id_Libro;

        COMMIT;

        SET @O_Numero = 200;
        SET @O_Msg = 'Libro eliminado correctamente.';
    END TRY
    BEGIN CATCH
        IF @@TRANCOUNT > 0 ROLLBACK;

        SET @O_Numero = ERROR_NUMBER();
        SET @O_Msg = ERROR_MESSAGE();
    END CATCH;
END;
GO
-------------
DECLARE @Num INT, @Msg VARCHAR(255);

EXEC Eliminar_Tbl_Libros
    @Id_Libro = 5,
    @Id_Modificador = 1,
    @O_Numero = @Num OUTPUT,
    @O_Msg = @Msg OUTPUT;

SELECT @Num AS Numero, @Msg AS Mensaje;


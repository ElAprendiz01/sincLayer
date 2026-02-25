USE SYNCLAYER;
GO

CREATE OR ALTER PROCEDURE SpRegistrarDevolucion(
    @Id_Prestamo INT,
    @Id_Estado_Libro INT,
    @Id_Creador INT,
    @Observaciones NVARCHAR(255) = NULL,
    @O_Numero INT OUTPUT,
    @O_Msg VARCHAR(255) OUTPUT
)
AS
BEGIN
    SET NOCOUNT ON;

    -- Validar préstamo obligatorio
    IF @Id_Prestamo IS NULL OR @Id_Prestamo = 0
    BEGIN
        SET @O_Numero = -1;
        SET @O_Msg = 'El Id_Prestamo es obligatorio.';
        RETURN;
    END;

    -- Validar que el préstamo exista y esté activo
    IF NOT EXISTS (
        SELECT 1
        FROM Tbl_Prestamos p
        INNER JOIN Cls_Estado e ON p.Id_Estado = e.Id_Estado
        WHERE p.Id_Prestamo = @Id_Prestamo
          AND e.Estado = 'Activo'
          AND e.Activo = 1
    )
    BEGIN
        SET @O_Numero = -1;
        SET @O_Msg = 'El préstamo no existe o no está activo.';
        RETURN;
    END;

    -- Validar que el préstamo no haya sido devuelto ya
    IF EXISTS (
        SELECT 1
        FROM Tbl_Prestamos
        WHERE Id_Prestamo = @Id_Prestamo
          AND Fecha_Devolucion_Real IS NOT NULL
    )
    BEGIN
        SET @O_Numero = -1;
        SET @O_Msg = 'El préstamo ya fue devuelto anteriormente.';
        RETURN;
    END;

    -- Validar estado del libro al devolver
    IF NOT EXISTS (
        SELECT 1
        FROM Cls_Catalogo
        WHERE Id_Catalogo = @Id_Estado_Libro
    )
    BEGIN
        SET @O_Numero = -1;
        SET @O_Msg = 'El estado del libro no existe.';
        RETURN;
    END;

    BEGIN TRY
        BEGIN TRAN;

        DECLARE @Id_Libro INT, @Fecha_Vencimiento DATETIME, @NombreEstadoLibro NVARCHAR(80);

        SELECT @Id_Libro = Id_Libro, @Fecha_Vencimiento = Fecha_Vencimiento
        FROM Tbl_Prestamos
        WHERE Id_Prestamo = @Id_Prestamo;

        SELECT @NombreEstadoLibro = Nombre
        FROM Cls_Catalogo
        WHERE Id_Catalogo = @Id_Estado_Libro;

        -- Insertar devolución
        INSERT INTO Tbl_Devoluciones(
            Id_Prestamo,
            Fecha_Entrega,
            Id_Estado_Libro,
            Id_Creador,
            Id_Estado
        )
        VALUES(
            @Id_Prestamo,
            GETDATE(),
            @Id_Estado_Libro,
            @Id_Creador,
            (SELECT TOP 1 Id_Estado FROM Cls_Estado WHERE Estado = 'Activo' AND Activo = 1)
        );

        -- Actualizar préstamo con fecha de devolución real
        UPDATE Tbl_Prestamos
        SET Fecha_Devolucion_Real = GETDATE(),
            Fecha_Modificacion = GETDATE(),
            Id_Modificador = @Id_Creador
        WHERE Id_Prestamo = @Id_Prestamo;

        -- Actualizar stock del libro
        UPDATE Tbl_Libros
        SET Stock = Stock + 1,
            Fecha_Modificacion = GETDATE(),
            Id_Modificador = @Id_Creador
        WHERE Id_Libro = @Id_Libro;

        -- Multa por retraso
        IF GETDATE() > @Fecha_Vencimiento
        BEGIN
            INSERT INTO Tbl_Multas(
                Id_Prestamo,
                Monto_Multa,
                Id_Motivo_Multa,
                Pagada,
                Id_Creador,
                Id_Estado
            )
            VALUES(
                @Id_Prestamo,
                50.00,
                (SELECT TOP 1 Id_Catalogo FROM Cls_Catalogo WHERE Nombre = 'Retraso'),
                0,
                @Id_Creador,
                (SELECT TOP 1 Id_Estado FROM Cls_Estado WHERE Estado = 'Activo' AND Activo = 1)
            );
        END;

        -- Multa por daño
        IF @NombreEstadoLibro = 'Dañado'
        BEGIN
            INSERT INTO Tbl_Multas(
                Id_Prestamo,
                Monto_Multa,
                Id_Motivo_Multa,
                Pagada,
                Id_Creador,
                Id_Estado
            )
            VALUES(
                @Id_Prestamo,
                200.00,
                (SELECT TOP 1 Id_Catalogo FROM Cls_Catalogo WHERE Nombre = 'Dañado'),
                0,
                @Id_Creador,
                (SELECT TOP 1 Id_Estado FROM Cls_Estado WHERE Estado = 'Activo' AND Activo = 1)
            );
        END;

        COMMIT TRAN;

        SET @O_Numero = 200;
        SET @O_Msg = 'La devolución se ha registrado correctamente.';
    END TRY
    BEGIN CATCH
        IF @@TRANCOUNT > 0 ROLLBACK TRAN;

        SET @O_Numero = ERROR_NUMBER();
        SET @O_Msg = ERROR_MESSAGE();
    END CATCH;
END;
GO

DECLARE @Num INT, @Msg VARCHAR(255);

EXEC SpRegistrarDevolucion
    @Id_Prestamo = 3,         
    @Id_Estado_Libro = 14,      
    @Id_Creador = 1,
    @Observaciones = 'con daños',
    @O_Numero = @Num OUTPUT,
    @O_Msg = @Msg OUTPUT;

SELECT @Num AS Numero, @Msg AS Mensaje;

exec SpListar_Cls_Estado


exec SpListarPrestamos

exec SpListarMultasPendientes
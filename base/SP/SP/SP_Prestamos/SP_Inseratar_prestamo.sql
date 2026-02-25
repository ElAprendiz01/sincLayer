USE SYNCLAYER;
GO

CREATE OR ALTER PROCEDURE SpInsertarPrestamo(
    @Id_Usuario_Cliente INT,
    @Id_Libro INT,
    @Fecha_Vencimiento DATETIME,
    @Observaciones NVARCHAR(255) = NULL,
    @Id_Creador INT,
    @O_Numero INT OUTPUT,
    @O_Msg VARCHAR(255) OUTPUT
)
AS
BEGIN
    SET NOCOUNT ON;

    -- Validar cliente obligatorio
    IF @Id_Usuario_Cliente IS NULL OR @Id_Usuario_Cliente = 0
    BEGIN
        SET @O_Numero = -1;
        SET @O_Msg = 'El Id_Usuario_Cliente es obligatorio.';
        RETURN;
    END;

		-- Validar que el cliente no tenga multas pendientes
	IF EXISTS (
		SELECT 1
		FROM Tbl_Multas m
		INNER JOIN Tbl_Prestamos p ON m.Id_Prestamo = p.Id_Prestamo
		WHERE p.Id_Usuario_Cliente = @Id_Usuario_Cliente
		  AND m.Pagada = 0
	)
	BEGIN
		SET @O_Numero = -1;
		SET @O_Msg = 'El cliente tiene multas pendientes y no puede realizar un nuevo préstamo.';
		RETURN;
	END;

    -- Validar libro obligatorio
    IF @Id_Libro IS NULL OR @Id_Libro = 0
    BEGIN
        SET @O_Numero = -1;
        SET @O_Msg = 'El Id_Libro es obligatorio.';
        RETURN;
    END;

    -- Validar que el cliente exista y esté activo
    IF NOT EXISTS (
        SELECT 1
        FROM Tbl_Usuarios u
        INNER JOIN Cls_Estado e ON u.Id_Estado = e.Id_Estado
        WHERE u.Id_Usuario = @Id_Usuario_Cliente
          AND e.Estado = 'Activo'
          AND e.Activo = 1
    )
    BEGIN
        SET @O_Numero = -1;
        SET @O_Msg = 'El cliente no existe o no está activo.';
        RETURN;
    END;

    -- Validar que el cliente no tenga multas pendientes
    IF EXISTS (
        SELECT 1
        FROM Tbl_Multas m
        INNER JOIN Tbl_Prestamos p ON m.Id_Prestamo = p.Id_Prestamo
        WHERE p.Id_Usuario_Cliente = @Id_Usuario_Cliente
          AND m.Pagada = 0
    )
    BEGIN
        SET @O_Numero = -1;
        SET @O_Msg = 'El cliente tiene multas pendientes y no puede realizar un nuevo préstamo.';
        RETURN;
    END;

    -- Validar que el libro exista y esté activo
    IF NOT EXISTS (
        SELECT 1
        FROM Tbl_Libros l
        INNER JOIN Cls_Estado e ON l.Id_Estado = e.Id_Estado
        WHERE l.Id_Libro = @Id_Libro
          AND e.Estado = 'Activo'
          AND e.Activo = 1
    )
    BEGIN
        SET @O_Numero = -1;
        SET @O_Msg = 'El libro no existe o no está activo.';
        RETURN;
    END;

    -- Validar stock disponible
    IF NOT EXISTS (
        SELECT 1
        FROM Tbl_Libros
        WHERE Id_Libro = @Id_Libro
          AND Stock > 0
    )
    BEGIN
        SET @O_Numero = -1;
        SET @O_Msg = 'No hay stock disponible para este libro.';
        RETURN;
    END;

    -- Validar coherencia de fechas
    IF @Fecha_Vencimiento <= GETDATE()
    BEGIN
        SET @O_Numero = -1;
        SET @O_Msg = 'La fecha de vencimiento debe ser mayor a la fecha actual.';
        RETURN;
    END;

    BEGIN TRY
        BEGIN TRAN;

        -- Insertar préstamo
        INSERT INTO Tbl_Prestamos(
            Id_Usuario_Cliente,
            Id_Libro,
            Fecha_Prestamo,
            Fecha_Vencimiento,
            Observaciones,
            Id_Creador,
            Id_Estado
        )
        VALUES(
            @Id_Usuario_Cliente,
            @Id_Libro,
            GETDATE(),
            @Fecha_Vencimiento,
            @Observaciones,
            @Id_Creador,
             (SELECT TOP 1 Id_Estado 
			 FROM Cls_Estado 
			 WHERE Estado = 'Activo' AND Activo = 1 
			 ORDER BY Id_Estado)

        );

        -- Actualizar stock del libro
        UPDATE Tbl_Libros
        SET Stock = Stock - 1,
            Fecha_Modificacion = GETDATE(),
            Id_Modificador = @Id_Creador
        WHERE Id_Libro = @Id_Libro;

        COMMIT TRAN;



        SET @O_Numero = 200;
        SET @O_Msg = 'El préstamo se ha registrado correctamente.';
    END TRY
    BEGIN CATCH
        IF @@TRANCOUNT > 0 ROLLBACK TRAN;

        SET @O_Numero = ERROR_NUMBER();
        SET @O_Msg = ERROR_MESSAGE();
    END CATCH;
END;
GO


DECLARE @Num INT, @Msg VARCHAR(255);

EXEC SpInsertarPrestamo
    @Id_Usuario_Cliente = 3,
    @Id_Libro = 5,
    @Fecha_Vencimiento = '2026/10/10',
    @Observaciones = 'Préstamo inicial',
    @Id_Creador = 1,
    @O_Numero = @Num OUTPUT,
    @O_Msg = @Msg OUTPUT;

SELECT @Num AS Numero, @Msg AS Mensaje;

exec SpListarPrestamos

select * from Tbl_Libros

select * from Tbl_Usuarios


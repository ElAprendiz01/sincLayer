USE SYNCLAYER;
GO

CREATE OR ALTER PROCEDURE SpActualizarDevolucion(
    @Id_Devolucion INT,
    @Id_Modificador INT,
    @Id_Estado INT = NULL,
    @ForzarRecuperacion BIT = 0,
    @O_Numero INT OUTPUT,
    @O_Msg VARCHAR(255) OUTPUT
)
AS
BEGIN
    SET NOCOUNT ON;

    -- Validar existencia de la devolución
    IF NOT EXISTS (SELECT 1 FROM Tbl_Devoluciones WHERE Id_Devolucion = @Id_Devolucion)
    BEGIN
        SET @O_Numero = -1;
        SET @O_Msg = 'La devolución no existe.';
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

        -- Evitar asignar estados inválidos
        IF EXISTS (
            SELECT 1
            FROM Cls_Estado e
            WHERE e.Id_Estado = @Id_Estado
              AND e.Estado IN ('Suspendido','Eliminado')
        )
        BEGIN
            SET @O_Numero = -1;
            SET @O_Msg = 'No se puede asignar un estado inválido a la devolución.';
            RETURN;
        END;
    END;

    -- Validar que la devolución no esté eliminada, salvo recuperación forzada
    IF @ForzarRecuperacion = 0
       AND EXISTS (
            SELECT 1
            FROM Tbl_Devoluciones d
            INNER JOIN Cls_Estado e ON d.Id_Estado = e.Id_Estado
            WHERE d.Id_Devolucion = @Id_Devolucion
              AND e.Estado IN ('Eliminado','Inactivo','Desactivado')
       )
    BEGIN
        SET @O_Numero = -1;
        SET @O_Msg = 'La devolución está eliminada o inactiva. Para recuperarla use @ForzarRecuperacion = 1.';
        RETURN;
    END;

    BEGIN TRY
        BEGIN TRAN;

        UPDATE Tbl_Devoluciones
        SET
            Id_Estado = COALESCE(@Id_Estado, Id_Estado),
            Fecha_Modificacion = GETDATE(),
            Id_Modificador = @Id_Modificador
        WHERE Id_Devolucion = @Id_Devolucion;

        COMMIT TRAN;

        SET @O_Numero = 200;
        SET @O_Msg = 'La devolución se ha actualizado correctamente.';
    END TRY
    BEGIN CATCH
        IF @@TRANCOUNT > 0 ROLLBACK TRAN;

        SET @O_Numero = ERROR_NUMBER();
        SET @O_Msg = ERROR_MESSAGE();
    END CATCH;
END;
GO

DECLARE @Num INT, @Msg VARCHAR(255);

EXEC SpActualizarDevolucion
    @Id_Devolucion = 4,
    @Id_Modificador = 2,
    @Id_Estado = 3,          -- nuevo estado válido
    @ForzarRecuperacion = 1, -- permite recuperar si estaba eliminado
    @O_Numero = @Num OUTPUT,
    @O_Msg = @Msg OUTPUT;

SELECT @Num AS Numero, @Msg AS Mensaje;



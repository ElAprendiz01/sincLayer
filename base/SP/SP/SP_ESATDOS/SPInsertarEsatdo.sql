USE SYNCLAYER;
GO

CREATE OR ALTER PROC SpInsertar_Cls_Estado (
    @Estado NVARCHAR(30),
    @Id_Creador INT
)
AS
BEGIN
    SET NOCOUNT ON; -- Evita mensajes de filas afectadas innecesarios
    
    BEGIN TRY
        -- 1. Validación previa
        IF EXISTS (SELECT 1 FROM Cls_Estado WHERE Estado = @Estado AND Activo = 1)
            THROW 50001, 'Ya existe un estado con ese nombre', 1;

        -- 2. Inicio de transacción
        BEGIN TRAN
            INSERT INTO Cls_Estado (Estado, Id_Creador, Fecha_Creacion)
            VALUES (@Estado, @Id_Creador, GETDATE());
        COMMIT TRAN
        
        PRINT 'El estado se insertó correctamente';
    END TRY

    BEGIN CATCH
        -- 3. Rollback seguro: Solo si hay una transacción abierta
        IF @@TRANCOUNT > 0
        BEGIN
            ROLLBACK TRAN;
        END

        -- 4. Concatenación segura: Convertir el error a VARCHAR
        DECLARE @ErrorMessage NVARCHAR(4000) = ERROR_MESSAGE();
        PRINT 'No se ha podido insertar: ' + @ErrorMessage;
        
        -- Opcional: Relanzar el error para que el Backend (.NET) sepa que falló
        -- THROW; 
    END CATCH
END
GO

exec SpInsertar_Cls_Estado 'Dañado1',5
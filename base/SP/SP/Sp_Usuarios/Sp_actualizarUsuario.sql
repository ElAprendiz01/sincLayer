CREATE OR ALTER PROCEDURE SpActualizarUsuario
(
    @Id_Usuario INT,
    @Id_Rol INT = NULL,
    @Id_Modificador INT,
    @Id_Estado INT = NULL,
    @ForzarRecuperacion BIT = 0,
    @O_Numero INT OUTPUT,
    @O_Msg NVARCHAR(255) OUTPUT
)
AS
BEGIN
    SET NOCOUNT ON;

    -- Validar existencia
    IF NOT EXISTS (SELECT 1 FROM Tbl_Usuarios WHERE Id_Usuario = @Id_Usuario)
    BEGIN
        SET @O_Numero = -1;
        SET @O_Msg = 'El usuario no existe.';
        RETURN;
    END

    -- Validar estado si se envía
    IF @Id_Estado IS NOT NULL
    BEGIN
        IF NOT EXISTS (
            SELECT 1 FROM Cls_Estado 
            WHERE Id_Estado = @Id_Estado AND Activo = 1
        )
        BEGIN
            SET @O_Numero = -1;
            SET @O_Msg = 'El estado no es válido.';
            RETURN;
        END
    END

    -- Bloquear si está eliminado
    IF @ForzarRecuperacion = 0
        AND EXISTS (
            SELECT 1
            FROM Tbl_Usuarios u
            INNER JOIN Cls_Estado e ON u.Id_Estado = e.Id_Estado
            WHERE u.Id_Usuario = @Id_Usuario
              AND e.Estado IN ('Eliminado','Inactivo','Desactivado')
        )
    BEGIN
        SET @O_Numero = -1;
        SET @O_Msg = 'El usuario está inactivo o eliminado.';
        RETURN;
    END

    BEGIN TRY
        BEGIN TRAN;

        UPDATE Tbl_Usuarios
        SET
            Id_Rol = COALESCE(@Id_Rol, Id_Rol),
            Id_Estado = COALESCE(@Id_Estado, Id_Estado),
            Fecha_Modificacion = GETDATE(),
            Id_Modificador = @Id_Modificador
        WHERE Id_Usuario = @Id_Usuario;

        COMMIT;

        SET @O_Numero = 200;
        SET @O_Msg = 'Usuario actualizado correctamente.';
    END TRY
    BEGIN CATCH
        IF @@TRANCOUNT > 0 ROLLBACK;

        SET @O_Numero = ERROR_NUMBER();
        SET @O_Msg = ERROR_MESSAGE();
    END CATCH
END
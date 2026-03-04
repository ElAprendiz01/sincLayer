USE SYNCLAYER
GO

CREATE OR ALTER PROCEDURE SpActualizarRol
(
    @Id_Rol INT,
    @Nombre NVARCHAR(50) = NULL,
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
    IF NOT EXISTS (SELECT 1 FROM Tbl_Roles WHERE Id_Rol = @Id_Rol)
    BEGIN
        SET @O_Numero = -1;
        SET @O_Msg = 'El rol no existe.';
        RETURN;
    END

    -- Validar estado si se envía
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
    END

    -- Bloquear si el rol está eliminado o inactivo
    IF @ForzarRecuperacion = 0
        AND EXISTS (
            SELECT 1
            FROM Tbl_Roles r
            INNER JOIN Cls_Estado e ON r.Id_Estado = e.Id_Estado
            WHERE r.Id_Rol = @Id_Rol
              AND e.Estado IN ('Eliminado','Desactivado','Inactivo','Suspendido')
        )
    BEGIN
        SET @O_Numero = -1;
        SET @O_Msg = 'El rol está eliminado o desactivado.'
                     + CHAR(13) + CHAR(10) +
                     'Si considera que es un error, contacte con administración.';
        RETURN;
    END

    -- Validar que no exista otro rol con el mismo nombre
    IF @Nombre IS NOT NULL
        AND EXISTS (
            SELECT 1
            FROM Tbl_Roles
            WHERE Nombre = @Nombre
              AND Id_Rol <> @Id_Rol
        )
    BEGIN
        SET @O_Numero = -1;
        SET @O_Msg = 'Ya existe otro rol con ese nombre.';
        RETURN;
    END

    BEGIN TRY
        BEGIN TRAN;

        UPDATE Tbl_Roles
        SET
            Nombre = TRIM(COALESCE(@Nombre, Nombre)),
            Id_Estado = COALESCE(@Id_Estado, Id_Estado),
            Fecha_Modificacion = GETDATE(),
            Id_Modificador = @Id_Modificador
        WHERE Id_Rol = @Id_Rol;

        COMMIT;

        SET @O_Numero = 200;
        SET @O_Msg = 'El rol se ha actualizado correctamente.';
    END TRY
    BEGIN CATCH
        IF @@TRANCOUNT > 0 ROLLBACK;

        SET @O_Numero = ERROR_NUMBER();
        SET @O_Msg = ERROR_MESSAGE();
    END CATCH
END
GO
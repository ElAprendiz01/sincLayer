CREATE OR ALTER PROCEDURE Sp_EliminarRol
(
    @Id_Rol INT,
    @Id_Modificador INT,
    @O_Numero INT OUTPUT,
    @O_Msg NVARCHAR(255) OUTPUT
)
AS
BEGIN
    UPDATE Tbl_Roles
    SET Id_Estado = (SELECT top 1 Id_Estado FROM Cls_Estado WHERE Estado in( 'Inactivo', 'Eliminado','desactivado','eliminado')),
        Fecha_Modificacion = GETDATE(),
        Id_Modificador = @Id_Modificador
    WHERE Id_Rol = @Id_Rol;

    SET @O_Numero = 200;
    SET @O_Msg = 'Rol eliminado correctamente.';
END
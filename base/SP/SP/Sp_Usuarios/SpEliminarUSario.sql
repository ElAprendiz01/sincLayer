CREATE OR ALTER PROCEDURE Sp_EliminarUsuario
(
    @Id_Usuario INT,
    @Id_Modificador INT,
    @O_Numero INT OUTPUT,
    @O_Msg NVARCHAR(255) OUTPUT
)
AS
BEGIN
    UPDATE Tbl_Usuarios
    SET Id_Estado = (SELECT top 1 Id_Estado FROM Cls_Estado WHERE Estado in ( 'Inactivo', 'Eliminado', 'Descartado','desactivado','eliminado')),
        Fecha_Modificacion = GETDATE(),
        Id_Modificador = @Id_Modificador
    WHERE Id_Usuario = @Id_Usuario;

    SET @O_Numero = 200;
    SET @O_Msg = 'Usuario eliminado correctamente.';
END
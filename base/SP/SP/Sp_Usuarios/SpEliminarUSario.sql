use SYNCLAYER;
GO

CREATE OR ALTER PROCEDURE Sp_EliminarUsuario
(
    @Id_Usuario INT,
    @Id_Modificador INT,
    @Id_Estado INT,
    @O_Numero INT OUTPUT,
    @O_Msg NVARCHAR(255) OUTPUT
)
AS
BEGIN
    UPDATE Tbl_Usuarios
    SET 
        Fecha_Modificacion = GETDATE(),
        Id_Modificador = @Id_Modificador,
        Id_Estado = @Id_Estado
    WHERE Id_Usuario = @Id_Usuario;

    SET @O_Numero = 200;
    SET @O_Msg = 'Usuario eliminado correctamente.';
END
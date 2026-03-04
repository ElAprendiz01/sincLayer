
use SYNCLAYER
go
CREATE OR ALTER PROCEDURE Sp_ObtenerUsuario
(
    @Usuario NVARCHAR(50)
)
AS
BEGIN
    SELECT 
        u.Id_Usuario,
        u.Usuario,
        u.Contraseña,
        r.Nombre AS Rol
    FROM Tbl_Usuarios u
    INNER JOIN Tbl_Roles r ON u.Id_Rol = r.Id_Rol
    WHERE u.Usuario = @Usuario
END
Use SYNCLAYER
Go

CREATE OR ALTER PROCEDURE Sp_ListarUsuarios
AS
BEGIN
    SELECT 
        u.Id_Usuario,
        u.Usuario,
        r.Nombre AS Rol,
        u.Id_Estado
    FROM Tbl_Usuarios u
    INNER JOIN Tbl_Roles r ON u.Id_Rol = r.Id_Rol
    WHERE u.Id_Estado = 3;
END

Exec Sp_ListarUsuarios
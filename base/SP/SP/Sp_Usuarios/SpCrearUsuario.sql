Use SYNCLAYER
Go


CREATE OR ALTER PROCEDURE Sp_CrearUsuario
(
    @Usuario NVARCHAR(50),
    @PasswordHash NVARCHAR(255),
    @Id_Persona INT,
    @Id_Rol INT,
    @Id_Creador INT,
    @O_Numero INT OUTPUT,
    @O_Msg NVARCHAR(255) OUTPUT
)
AS
BEGIN
    IF EXISTS (SELECT 1 FROM Tbl_Usuarios WHERE Usuario = @Usuario)
    BEGIN
        SET @O_Numero = -1;
        SET @O_Msg = 'El usuario ya existe.';
        RETURN;
    END

    INSERT INTO Tbl_Usuarios
    (
        Usuario,
        Contraseña,
        Id_Persona,
        Id_Rol,
        Id_Creador,
        Id_Estado
    )
    VALUES
    (
        @Usuario,
        @PasswordHash,
        @Id_Persona,
        @Id_Rol,
        @Id_Creador,
        (SELECT Id_Estado FROM Cls_Estado WHERE Estado = 'Activo')
    );

    SET @O_Numero = 200;
    SET @O_Msg = 'Usuario creado correctamente.';
END

select *from Tbl_Roles
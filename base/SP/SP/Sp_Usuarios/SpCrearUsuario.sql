USE SYNCLAYER;
GO

-- 1. SP PARA CREAR (Incluye Id_Persona)
CREATE OR ALTER PROCEDURE Sp_CrearUsuario(
    @Usuario NVARCHAR(50),
    @PasswordHash NVARCHAR(MAX),
    @Id_Persona INT,
    @Id_Rol INT,
    @Id_Creador INT,
    @O_Numero INT OUTPUT,
    @O_Msg NVARCHAR(255) OUTPUT
) AS
BEGIN
    SET NOCOUNT ON;
    IF EXISTS (SELECT 1 FROM Tbl_Usuarios WHERE Usuario = @Usuario)
    BEGIN
        SET @O_Numero = -1; SET @O_Msg = 'El nombre de usuario ya existe.';
        RETURN;
    END

    INSERT INTO Tbl_Usuarios (Usuario, [Contraseña], Id_Persona, Id_Rol, Id_Creador, Id_Estado, Fecha_Creacion)
    VALUES (@Usuario, @PasswordHash, @Id_Persona, @Id_Rol, @Id_Creador, 3, GETDATE());

    SET @O_Numero = 200; SET @O_Msg = 'Usuario creado correctamente.';
END;
GO

-- 2. SP PARA ACTUALIZAR
CREATE OR ALTER PROCEDURE Sp_ActualizarUsuario(
    @Id_Usuario INT,
    @Id_Rol INT = NULL,
    @Id_Modificador INT,
    @Id_Estado INT = NULL,
    @Contrasena NVARCHAR(MAX) = NULL,
    @ForzarRecuperacion BIT = 0,
    @O_Numero INT OUTPUT,
    @O_Msg NVARCHAR(255) OUTPUT
) AS
BEGIN
    SET NOCOUNT ON;
    UPDATE Tbl_Usuarios
    SET Id_Rol = COALESCE(@Id_Rol, Id_Rol),
        Id_Estado = COALESCE(@Id_Estado, Id_Estado),
        [Contraseña] = CASE WHEN @Contrasena IS NOT NULL AND @Contrasena <> '' THEN @Contrasena ELSE [Contraseña] END,
        ForzarRecuperacion = @ForzarRecuperacion,
        Fecha_Modificacion = GETDATE(),
        Id_Modificador = @Id_Modificador
    WHERE Id_Usuario = @Id_Usuario;

    SET @O_Numero = 200; SET @O_Msg = 'Actualización exitosa.';
END;
GO

SELECT Id_Rol, Nombre FROM Tbl_Roles;
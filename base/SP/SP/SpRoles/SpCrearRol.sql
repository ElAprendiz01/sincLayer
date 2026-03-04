use SYNCLAYER
go

CREATE OR ALTER PROCEDURE Sp_CrearRol
(
    @Nombre NVARCHAR(50),
    @Id_Creador INT,
    @O_Numero INT OUTPUT,
    @O_Msg NVARCHAR(255) OUTPUT
)
AS
BEGIN
    SET NOCOUNT ON;

    IF EXISTS (SELECT 1 FROM Tbl_Roles WHERE Nombre = @Nombre)
    BEGIN
        SET @O_Numero = -1;
        SET @O_Msg = 'El rol ya existe.';
        RETURN;
    END

    INSERT INTO Tbl_Roles
    (
        Nombre,
        Id_Creador,
        Id_Estado
    )
    VALUES
    (
        @Nombre,
        @Id_Creador,
        (SELECT Id_Estado FROM Cls_Estado WHERE Estado = 'Activo')
    );

    SET @O_Numero = 200;
    SET @O_Msg = 'Rol creado correctamente.';
END
USE SYNCLAYER;
GO

CREATE OR ALTER PROCEDURE SpActualizarUsuario(
    @Id_Usuario INT,
    @Id_Rol INT = NULL,
    @Id_Modificador INT,
    @Id_Estado INT = NULL,
    @Contrasena NVARCHAR(MAX) = NULL, -- El parámetro puede seguir con 'n' para evitar líos en C#
    @ForzarRecuperacion BIT = 0,
    @O_Numero INT OUTPUT,
    @O_Msg NVARCHAR(255) OUTPUT
) AS
BEGIN
    SET NOCOUNT ON;
    BEGIN TRY
        BEGIN TRAN;

        UPDATE Tbl_Usuarios
        SET
            Id_Rol = COALESCE(@Id_Rol, Id_Rol),
            Id_Estado = COALESCE(@Id_Estado, Id_Estado),
            
            -- Corregido: Apuntando a 'Contraseña' con Ñ
            [Contraseña] = CASE 
                            WHEN @Contrasena IS NOT NULL AND LTRIM(RTRIM(@Contrasena)) <> '' 
                            THEN @Contrasena 
                            ELSE [Contraseña] 
                         END,
            
            -- Esta columna funcionará tras ejecutar el ALTER TABLE de arriba
            ForzarRecuperacion = @ForzarRecuperacion,
            
            Fecha_Modificacion = GETDATE(),
            Id_Modificador = @Id_Modificador
        WHERE Id_Usuario = @Id_Usuario;

        COMMIT TRAN;

        SET @O_Numero = 200;
        SET @O_Msg = 'Infraestructura actualizada: Usuario sincronizado correctamente.';
    END TRY
    BEGIN CATCH
        IF @@TRANCOUNT > 0 ROLLBACK TRAN;

        SET @O_Numero = ERROR_NUMBER();
        SET @O_Msg = 'Error en base de datos: ' + ERROR_MESSAGE();
    END CATCH
END
GO
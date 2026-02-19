USE SYNCLAYER;
GO

CREATE OR ALTER PROCEDURE Buscar_Tbl_Datos_Personales_Fecha_Nacimiento
(
    @Buscar VARCHAR(50)
)
AS
BEGIN
    SET NOCOUNT ON;

    SELECT 
        dp.Id_Persona,
		dp.Genero,
        dp.Primer_Nombre,
        dp.Segundo_Nombre,
        dp.Primer_Apellido,
        dp.Segundo_Apellido,
        dp.Fecha_Nacimiento,
        dp.Tipo_DNI,
        dp.DNI,
        dp.Fecha_Creacion,
        dp.Fecha_Modificacion,
        dp.Id_Creador,
        dp.Id_Modificador,
        e.Estado
    FROM Tbl_Datos_Personales dp
    INNER JOIN Cls_Estado e
        ON dp.Id_Estado = e.Id_Estado
    WHERE 
        e.Estado = 'Activo'
        AND CONVERT(VARCHAR(10), dp.Fecha_Nacimiento, 23) LIKE @Buscar + '%'
    ORDER BY dp.Id_Persona DESC;
END;
GO
-- chicos con este se puee filtra r completa la fecha no solo año y mes o solo año jejeje
exec Buscar_Tbl_Datos_Personales_Fecha_Nacimiento '1902'

select * from Tbl_Datos_Personales
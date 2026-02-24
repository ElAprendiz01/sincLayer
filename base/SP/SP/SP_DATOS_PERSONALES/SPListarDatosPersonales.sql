USE SYNCLAYER;
GO

CREATE OR ALTER PROCEDURE Listar_Tbl_Datos_Personales
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
        e.Estado as Estado
    FROM Tbl_Datos_Personales dp
    INNER JOIN Cls_Estado e
        ON dp.Id_Estado = e.Id_Estado
    WHERE e.Estado in ('Activo', 'Activos')
    ORDER BY dp.Id_Persona DESC;
END;
GO

exec Listar_Tbl_Datos_Personales
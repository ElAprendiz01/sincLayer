USE SYNCLAYER;
GO

CREATE OR ALTER PROCEDURE SpFiltrarDireccionesPorPersonaActivas(
    @Id_Persona INT
)
AS
BEGIN
    SET NOCOUNT ON;

    SELECT 
        d.Id_Persona,
        dt.Primer_Nombre AS Nombre_Persona,
        dt.Primer_Apellido AS Apellido,
        d.Id_direccion,
        d.Ciudad,
        d.Barrio,
        d.Calle,
        d.Fecha_Creacion,
        d.Fecha_Modificacion,
        d.Id_Creador,
        d.Id_Modificador,
        e.Estado as Estado
    FROM Tbl_direcciones d
    INNER JOIN Tbl_Datos_Personales dt
        ON d.Id_Persona = dt.Id_Persona
    INNER JOIN Cls_Estado e
        ON d.Id_Estado = e.Id_Estado
    WHERE d.Id_Persona = @Id_Persona
      AND e.Estado = 'Activo'
    ORDER BY d.Id_direccion DESC;
END;
GO

EXEC SpFiltrarDireccionesPorPersonaActivas 1;
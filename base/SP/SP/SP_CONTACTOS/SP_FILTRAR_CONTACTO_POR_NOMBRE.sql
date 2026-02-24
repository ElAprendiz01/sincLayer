USE SYNCLAYER;
GO

CREATE OR ALTER PROCEDURE Buscar_Tbl_Contacto_Contacto
(
    @Buscar NVARCHAR(100)
)
AS
BEGIN
    SET NOCOUNT ON;

    SELECT 
        c.Id_Contacto,
        c.Id_Persona,
        dp.Primer_Nombre AS Nombre_Persona,
        dp.Primer_Apellido AS Apellido,
        c.Tipo_Contacto,
        cat.Nombre AS Tipo_Contacto_Nombre,
        c.Contacto,
        c.Fecha_Creacion,
        c.Fecha_Modificacion,
        c.Id_Creador,
        c.Id_Modificador,
        e.Estado
    FROM Tbl_Contacto c
    INNER JOIN Tbl_Datos_Personales dp
        ON c.Id_Persona = dp.Id_Persona
    INNER JOIN Cls_Catalogo cat
        ON c.Tipo_Contacto = cat.Id_Catalogo
    INNER JOIN Cls_Estado e
        ON c.Id_Estado = e.Id_Estado
    WHERE c.Contacto LIKE  @Buscar + '%'
      AND e.Estado = 'Activo'
    ORDER BY c.Id_Contacto DESC;
END;
GO

-- Ejemplo de ejecución
EXEC Buscar_Tbl_Contacto_Contacto 'correo';

select * from Tbl_Contacto
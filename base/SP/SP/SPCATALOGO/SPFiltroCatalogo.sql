USE SYNCLAYER
GO

CREATE OR ALTER PROCEDURE SP_FiltrarCatalogosPorNombre
(
    @Nombre NVARCHAR(80)
)
AS
BEGIN
    SET NOCOUNT ON;
		
    SELECT 
        c.Id_Catalogo,
        c.Id_Tipo_Catalogo,
        tc.Nombre AS Tipo_Catalogo,
        c.Nombre,
        c.Fecha_Creacion,
        c.Fecha_Modificacion,
        c.Id_Creador,
        c.Id_Modificador,
        c.Activo
    FROM Cls_Catalogo c
    INNER JOIN Cls_Tipo_Catalogo tc
        ON c.Id_Tipo_Catalogo = tc.Id_Tipo_Catalogo
    WHERE c.Nombre LIKE '%' + @Nombre + '%'
    ORDER BY c.Id_Catalogo DESC;
END;
GO
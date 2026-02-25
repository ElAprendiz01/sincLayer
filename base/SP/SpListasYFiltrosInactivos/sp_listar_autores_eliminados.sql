USE SYNCLAYER;
GO

CREATE OR ALTER PROCEDURE SpListarAutoreseliminado
AS
BEGIN
    SET NOCOUNT ON;

    SELECT 
        a.Id_Autor,
        a.Id_Persona,
        dp.Primer_Nombre AS Nombre_Persona,
        dp.Primer_Apellido AS Apellido,
        a.Fecha_Creacion,
        a.Fecha_Modificacion,
        a.Id_Creador,
        a.Id_Modificador,
        e.Estado AS Estado
    FROM Tbl_Autores a
    INNER JOIN Tbl_Datos_Personales dp
        ON a.Id_Persona = dp.Id_Persona
    INNER JOIN Cls_Estado e
        ON a.Id_Estado = e.Id_Estado
    WHERE e.Estado IN ('Eliminado', 'Desactivado','inactivo','eliminado')   -- solo autores elim
    ORDER BY a.Id_Autor DESC;
END;
GO

EXEC SpListarAutoreseliminado;
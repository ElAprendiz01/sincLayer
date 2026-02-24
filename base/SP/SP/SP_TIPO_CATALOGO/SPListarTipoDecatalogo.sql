USE SYNCLAYER;
GO


CREATE OR ALTER PROCEDURE Listar_Cls_Tipo_Catalogo
AS 
BEGIN 
	SET NOCOUNT ON;


	SELECT 
	TC.Id_Tipo_Catalogo,
	TC.Nombre,
	TC.Fecha_Creacion,
	TC.Fecha_Modificacion,
	TC.Id_Creador,
	TC.Id_Modificador,
	TC.Activo

	FROM Cls_Tipo_Catalogo AS TC
	ORDER BY Id_Tipo_Catalogo ASC
END; 
GO

EXEC Listar_Cls_Tipo_Catalogo

	


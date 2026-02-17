

USe SYNCLAYER
Go

CREATE OR ALTER PROCEDURE SpFiltrarDireccionesPorPersona(
    @Id_Persona INT
)
AS
BEGIN
    SET NOCOUNT ON;

    SELECT 
		d.Id_Persona,
	    dt.Primer_Nombre as nombre_persona,
		dt.Primer_Apellido as Apellido,
        d.Id_direccion,
        d.Ciudad,
        d.Barrio,
        d.Calle,
        d.Fecha_Creacion,
        d.Fecha_Modificacion,
        d.Id_Creador,
        d.Id_Modificador,
        d.Id_Estado
    FROM Tbl_direcciones d
	inner join Tbl_Datos_Personales dt
		on d.Id_Persona = dt.Id_Persona
    WHERE d.Id_Persona = @Id_Persona
	order by d.Id_direccion desc;
END;
GO

exec SpFiltrarDireccionesPorPersona 1

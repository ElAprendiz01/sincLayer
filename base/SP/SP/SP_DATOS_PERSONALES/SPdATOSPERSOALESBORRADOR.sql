USE SYNCLAYER;
GO






-



--Buscar Por Nombre
Create or alter Proc Buscar_Tbl_Datos_Personales_Fecha_Nacimiento
(
@Buscar Varchar(50)
)
as 
begin
select * from Tbl_Datos_Personales
where Fecha_Nacimiento like @Buscar + '%'
end

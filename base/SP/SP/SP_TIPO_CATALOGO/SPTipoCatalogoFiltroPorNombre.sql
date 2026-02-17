use SYNCLAYER
go 


Create or alter Proc Buscar_Cls_Tipo_Catalogo_Nombre
(
	@Buscar Varchar(50)
)
as 
begin
select * from Cls_Tipo_Catalogo
where Nombre like '%' + trim(@Buscar) + '%'
and Activo = 1
end
Go

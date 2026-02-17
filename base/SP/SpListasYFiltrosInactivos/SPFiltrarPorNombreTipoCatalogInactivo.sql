use SYNCLAYER
go

Create or alter  Proc Buscar_Cls_Tipo_Catalogo_Nombre_inactivo
(
@Buscar Varchar(50)
)
as 
begin
select * from Cls_Tipo_Catalogo
where Nombre like '%' + trim(@Buscar) + '%'
and Activo = 0
end
Go


exec  Buscar_Cls_Tipo_Catalogo_Nombre_inactivo 'id'
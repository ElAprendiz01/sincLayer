USE SYNCLAYER;
GO

-- Listar
Create Proc Listar_Cls_Tipo_Catalogo
As 
begin
begin try 
select * from Cls_Tipo_Catalogo
end try 
begin catch 
print 'El procedimiento no se pudo ejecutar'
end catch
end

exec Listar_Cls_Tipo_Catalogo

--Insertar Datos
create or alter Proc Insertar_Cls_Tipo_Catalogo
(
 @Nombre NVARCHAR,
 @Fecha_Creacion DATE,
 @Fecha_Modificacion DATETIME,
 @Id_Creador INT,
 @Id_Modificador INT,
 @Activo BIT 
)
as
begin
begin try 
insert into Cls_Tipo_Catalogo(Nombre,Fecha_Creacion,Fecha_Modificacion,Id_Creador,Id_Modificador,Activo)
values(@Nombre,@Fecha_Creacion,@Fecha_Modificacion,@Id_Creador,@Id_Modificador,@Activo)
print 'Se Ingreso Correctamente'
end try
begin catch
print 'El Cls_Tipo_Catalogo no se pudo ingresar'
end catch
end

--Editar Tipo de catalogo
Create Proc Editar_Cls_Tipo_Catalogo
(
 @Id_Tipo_Catalogo int,
 @Nombre NVARCHAR,
 @Fecha_Creacion DATE,
 @Fecha_Modificacion DATETIME,
 @Id_Creador INT,
 @Id_Modificador INT,
 @Activo BIT
)
as
begin
begin try 
update Cls_Tipo_Catalogo set Nombre = @Nombre, Fecha_Creacion = @Fecha_Creacion, Fecha_Modificacion = @Fecha_Modificacion, Id_Creador = @Id_Creador, Id_Modificador = @Id_Modificador
where Id_Tipo_Catalogo = @Id_Tipo_Catalogo
print 'Se Actualizo Correctamente'
end try
begin catch
print 'El Cls_Tipo_Catalogo no se pudo actualizar'
end catch
end

--Eliminar
Create proc Eliminar_Cls_Tipo_Catalogo
(
@Id_Tipo_Catalogo int
)
as
begin
begin try
delete from Cls_Tipo_Catalogo
where Id_Tipo_Catalogo = @Id_Tipo_Catalogo
print 'Se Cls_Tipo_Catalogo elimino correctamente'
end try
begin catch
print 'El Cls_Tipo_Catalogo no se pudo eliminar'
end catch
end

--Buscar Por Nombre
Create Proc Buscar_Cls_Tipo_Catalogo_Nombre
(
@Buscar Varchar(50)
)
as 
begin
select * from Cls_Tipo_Catalogo
where Nombre like @Buscar + '%'
end




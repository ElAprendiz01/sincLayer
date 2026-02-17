USE SYNCLAYER;
GO

--Listar Datos
Create Proc Listar_Tbl_Contacto
As 
begin
begin try 
select * from Tbl_Contacto
end try 
begin catch 
print 'El procedimiento no se pudo ejecutar'
end catch
end

--Insertar Datos
create or alter Proc Insertar_Tbl_Contacto
(
    @Id_Persona INT,
    @Tipo_Contacto INT, 
    @Contacto NVARCHAR,
    @Fecha_Creacion DATE,
    @Fecha_Modificacion DATETIME,
    @Id_Creador INT,
    @Id_Modificador INT,
    @Id_Estado INT
)
as
begin
begin try 
insert into Tbl_Contacto(Id_Persona,Tipo_Contacto,Contacto,Fecha_Creacion,Fecha_Modificacion,Id_Creador,Id_Modificador,Id_Estado)
values(@Id_Persona,@Tipo_Contacto,@Contacto,@Fecha_Creacion,@Fecha_Modificacion,@Id_Creador,@Id_Modificador,@Id_Estado)
print 'Contacto se Ingreso Correctamente'
end try
begin catch
print 'Los Contacto no se pudo ingresar'
end catch
end


--Editar Contacto
Create Proc Editar_Tbl_Contacto
(
    @Id_Contacto int,
    @Id_Persona INT,
    @Tipo_Contacto INT, 
    @Contacto NVARCHAR,
    @Fecha_Creacion DATE,
    @Fecha_Modificacion DATETIME,
    @Id_Creador INT,
    @Id_Modificador INT,
    @Id_Estado INT
)
as
begin
begin try 
update Tbl_Contacto set Id_Persona=@Id_Persona,Tipo_Contacto=@Tipo_Contacto,Contacto=@Contacto,Fecha_Creacion=@Fecha_Creacion,
Fecha_Modificacion=@Fecha_Modificacion,Id_Creador=@Id_Creador,Id_Modificador=@Id_Modificador,Id_Estado=@Id_Estado
where Id_Contacto = @Id_Contacto
print 'Los Contacto Se Actualizo Correctamente'
end try
begin catch
print 'Los Contacto no se pudo actualizar'
end catch
end


--Eliminar
Create proc Eliminar_Tbl_Contacto
(
@Id_Contacto int
)
as
begin
begin try
delete from Tbl_Contacto
where Id_Contacto = @Id_Contacto
print 'Contacto se elimino correctamente'
end try
begin catch
print 'Contacto no se pudo eliminar'
end catch
end


--Buscar Contacto
Create Proc Buscar_Tbl_Contacto_Contacto
(
@Buscar Varchar(50)
)
as 
begin
select * from Tbl_Contacto
where Contacto like @Buscar + '%'
end



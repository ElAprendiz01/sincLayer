USE SYNCLAYER;
GO

--Listar Tabla de Datos personales
Create or alter Proc Listar_Tbl_Datos_Personales
As 
begin
begin try 
select * from Tbl_Datos_Personales
end try 
begin catch 
print 'El procedimiento no se pudo ejecutar'
end catch
end


--Insertar Datos
create or alter Proc Insertar_Tbl_Datos_Personales
(
    @Genero INT,
    @Primer_Nombre NVARCHAR,
    @Segundo_Nombre NVARCHAR,
    @Primer_Apellido NVARCHAR,
    @Segundo_Apellido NVARCHAR,
    @Fecha_Nacimiento DATE,
    @Tipo_DNI INT,
    @DNI VARCHAR,
    @Fecha_Creacion DATE,
    @Fecha_Modificacion DATETIME,
    @Id_Creador INT,
    @Id_Modificador INT,
    @Id_Estado int
)
as
begin
begin try 
insert into Tbl_Datos_Personales(Genero,Primer_Nombre,Segundo_Nombre,Primer_Apellido,Segundo_Apellido,Fecha_Nacimiento,Tipo_DNI,DNI,Fecha_Creacion,Fecha_Modificacion,Id_Creador,Id_Modificador,Id_Estado)
values(@Genero,@Primer_Nombre,@Segundo_Nombre,@Primer_Apellido,@Segundo_Apellido,@Fecha_Nacimiento,@Tipo_DNI,
@DNI,@Fecha_Creacion,@Fecha_Modificacion,@Id_Creador,@Id_Modificador,@Id_Estado)
print 'Datos Personales se Ingreso Correctamente'
end try
begin catch
print 'Los datos personales no se pudo ingresar'
end catch
end




--Editar Tipo de catalogo
Create or alter  Proc Editar_Tbl_Datos_Personales
(
    @Id_Persona INT,
    @Genero INT,
    @Primer_Nombre NVARCHAR,
    @Segundo_Nombre NVARCHAR,
    @Primer_Apellido NVARCHAR,
    @Segundo_Apellido NVARCHAR,
    @Fecha_Nacimiento DATE,
    @Tipo_DNI INT,
    @DNI VARCHAR,
    @Fecha_Creacion DATE,
    @Fecha_Modificacion DATETIME,
    @Id_Creador INT,
    @Id_Modificador INT,
    @Id_Estado int
)
as
begin
begin try 
update Tbl_Datos_Personales set Genero = @Genero, Primer_Nombre = @Primer_Nombre, Segundo_Nombre = @Segundo_Nombre, Primer_Apellido = @Primer_Apellido, Segundo_Apellido = @Segundo_Apellido,
Fecha_Nacimiento = @Fecha_Nacimiento, Tipo_DNI=@Tipo_DNI,DNI=@DNI,Fecha_Creacion=@Fecha_Creacion,Fecha_Modificacion=@Fecha_Modificacion,Id_Creador=@Id_Creador,Id_Modificador=@Id_Modificador,Id_Estado=@Id_Estado
where Id_Persona = @Id_Persona
print 'Los datos Se Actualizo Correctamente'
end try
begin catch
print 'Los datos personales no se pudo actualizar'
end catch
end


--Eliminar
Create or alter proc Eliminar_Tbl_Datos_Personales
(
@Id_Persona int
)
as
begin
begin try
delete from Tbl_Datos_Personales
where Id_Persona = @Id_Persona
print 'Datos Personales se elimino correctamente'
end try
begin catch
print 'Datos Personales no se pudo eliminar'
end catch
end


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

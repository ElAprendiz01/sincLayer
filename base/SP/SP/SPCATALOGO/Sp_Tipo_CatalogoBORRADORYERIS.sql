USE SYNCLAYER;
GO

-- Listar



--Editar Tipo de catalogo
Create Proc Editar_Cls_Tipo_Catalogo
(
	@Id_Tipo_Catalogo int,
	@Nombre NVARCHAR,
	@Fecha_Creacion DATE,
	@Fecha_Modificacion DATETIME,
	@Id_Creador INT,
	@Id_Modificador INT,
	@Activo BIT,
	@O_Numero INT OUTPUT,
    @O_Msg VARCHAR(255) OUTPUT
)
as
begin
		if not exists(Select 1 from Cls_Tipo_Catalogo where Id_Tipo_Catalogo = @Id_Tipo_Catalogo)
		begin 
			set @O_Numero = -1
			set @O_Msg = 'El tipo de catalogo no existe';
		end

		if(@Nombre = null)
		begin 
			set @O_Numero = -1
			set @O_Msg = 'El nombre no puede ir vacio';
		end 
begin try 
		Begin transaction
			update Cls_Tipo_Catalogo set
			Nombre = TRIM(@Nombre),
			Fecha_Creacion = @Fecha_Creacion,
			Fecha_Modificacion = @Fecha_Modificacion,
			Id_Creador = @Id_Creador,
			Id_Modificador = @Id_Modificador
			where Id_Tipo_Catalogo = @Id_Tipo_Catalogo
		Commit transaction
		print 'Se Actualizo Correctamente'
end try
	begin catch
		Rollback transaction
		print 'El Cls_Tipo_Catalogo no se pudo actualizar'
	end catch
end
Go

--Eliminar
Create proc Eliminar_Cls_Tipo_Catalogo
(
@Id_Tipo_Catalogo int
)
as
begin
begin try
	Begin transaction 
 UPDATE Cls_Tipo_Catalogo
 SET Activo = 0
where Id_Tipo_Catalogo = @Id_Tipo_Catalogo
	Commit transaction
print 'Se Cls_Tipo_Catalogo elimino correctamente'
end try
begin catch
Rollback transaction
print 'El Cls_Tipo_Catalogo no se pudo eliminar' 
end catch
end
Go
--Buscar Por Nombre
Create Proc Buscar_Cls_Tipo_Catalogo_Nombre
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



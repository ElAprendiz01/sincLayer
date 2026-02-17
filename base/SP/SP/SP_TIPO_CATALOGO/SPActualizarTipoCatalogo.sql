USE SYNCLAYER
GO 
Create Proc Editar_Cls_Tipo_Catalogo
(
	@Id_Tipo_Catalogo int,
	@Nombre NVARCHAR,
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
			Nombre = TRIM(COALESCE(@Nombre, Nombre)),
			Fecha_Modificacion = GETDATE(),
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
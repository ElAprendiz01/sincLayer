USE SYNCLAYER;
GO



Create or alter proc SpActualizarCls_Estado
(
    @Id_Estado INT ,
    @Estado NVARCHAR(30),
    @Id_Modificador INT,
    @Activo BIT 
)
as
begin
    begin try
        begin tran
        update Cls_Estado
        set Estado =trim(coalesce( @Estado, Estado)),
           Id_Modificador = @Id_Modificador,
           Activo = TRIM(COALESCE(@Activo, Activo)),
           Fecha_Modificacion = GETDATE()

        where Id_Estado = @Id_Estado
        commit
        print 'Se actualizo correctamente'
    end try
    begin catch
        rollback
        print 'No se pudo actualizar' + @@error
    end catch
end
go



EXEC SpActualizarCls_Estado 1,'ka',1,0

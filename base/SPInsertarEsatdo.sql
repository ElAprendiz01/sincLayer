USE SYNCLAYER;
GO

create or alter proc SpInsertar_Cls_Estado
(
    @Estado NVARCHAR(30),
    @Id_Creador INT,
    @Activo BIT

)
as
begin
    begin try
        begin tran
        insert into Cls_Estado(Estado,Id_Creador,Activo)
        values(@Estado, @Id_Creador, 1)
        commit
		print 'El estado se inserto correctamente'
    end try
    begin catch
        rollback
        print 'No se ha podido insertar: ' + @@error
    end catch
end
go
exec SpInsertar_Cls_Estado 'N',1,1

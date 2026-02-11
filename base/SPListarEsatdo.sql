USE SYNCLAYER;
GO



--listar--

create or alter proc SpListar_Cls_Estado
as
begin
    begin try
        Select Cls.Id_Estado, Cls.Estado,Fecha_Creacion, Cls.Fecha_Modificacion, Cls.Id_Creador, Cls.Id_Modificador, Cls.Activo
      from Cls_Estado as  Cls
    end try
    begin catch
        print 'No se pudo listar por el error: ' + @@error
    end catch
end
go

exec SpListar_Cls_Estado
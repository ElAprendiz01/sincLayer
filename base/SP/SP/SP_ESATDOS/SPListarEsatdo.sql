USE SYNCLAYER;
GO

--listar--

create or alter proc SpListar_Cls_Estado
as
begin
    begin try
        Select Cls.Id_Estado,
        Cls.Estado,Fecha_Creacion,
        Cls.Fecha_Modificacion,
        Cls.Id_Creador,
        Cls.Id_Modificador,
        Cls.Activo
      from Cls_Estado as  Cls
      where Cls.Activo = 1
      order by Cls.Id_Estado desc
    end try
    begin catch
        print 'No se pudo listar por el error: ' + @@ERROR
    end catch
end
go

exec SpListar_Cls_Estado
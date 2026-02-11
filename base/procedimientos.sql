USE SYNCLAYER;
GO

--procedimientos almacenados 

--sp_InsertarEstado, sp_ActualizarEstado, sp_ListarEstados
--Cls_Estado
--insertar--
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

--SpActualizarCls_Estado


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
        set Estado = @Estado,
           Id_Modificador = @Id_Modificador,
           Activo = @Activo,
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

--elimianr eatdo
CREATE OR  ALTER PROCEDURE SPeliminaEstado
(
    @Id_Estado INT
)
AS 
BEGIN  
    BEGIN TRY 
        BEGIN TRAN
            DELETE FROM Cls_Estado
            WHERE Id_Estado =@Id_Estado
        COMMIT 
    PRINT 'SE EL ESTADO SE HA ELIMINADO'
    END TRY 
    BEGIN CATCH 
        PRINT 'NO SE HA PODIDO ELIMIANR '+ @@ERROR
    END CATCH
END 
GO
 
EXEC SPeliminaEstado 1

CREATE OR ALTER PROC SpFiltrarCls_EstadoPorNombre
(
    @Estado NVARCHAR(30)
)
AS
BEGIN
    BEGIN TRY
        SELECT Id_Estado,
               Estado,
               Fecha_Creacion,
               Fecha_Modificacion,
               Id_Creador,
               Id_Modificador,
               Activo
        FROM Cls_Estado
       WHERE Estado LIKE '%' + @Estado + '%';

    END TRY
    BEGIN CATCH
        PRINT 'No se pudo filtrar: ' + ERROR_MESSAGE();
    END CATCH
END
GO

--insertar--
create or alter proc SP_InsertarCls_Tipo_Catalogo
(
     @Nombre NVARCHAR(50) NOT NULL,
     @Fecha_Creacion DATE ,
     @Fecha_Modificacion DATETIME NOT NULL,
     @Id_Creador INT NOT NULL,
     @Id_Modificador INT NOT NULL,
     @Activo BIT NOT NULL
)
as
begin
    begin try
        begin tran
        insert into Cls_Tipo_Catalogo(Nombre, Fecha_Creacion, Fecha_Modificacion, Id_Creador, Id_Modificador, Activo)
        values(@Nombre, @Fecha_Creacion, @Fecha_Modificacion, @Id_Creador, @Id_Modificador, @Activo)
        commit
		print 'se inserto correctamente'
    end try
    begin catch
        rollback
        print 'no se pudo insertar por el error: ' + @@error
    end catch
end

--Actualizar--
go
Create or alter proc SP_ActualizarCls_Tipo_Catalogo
(
    @Id_Tipo_Catalogo INT ,
    @Nombre NVARCHAR(50) NOT NULL,
    @Fecha_Creacion DATE ,
    @Fecha_Modificacion DATETIME NOT NULL,
    @Id_Creador INT NOT NULL,
    @Id_Modificador INT NOT NULL,
    @Activo BIT NOT NULL
)
as
begin
    begin try
        begin tran
        update Cls_Tipo_Catalogo
        set Nombre = @Nombre,
            Fecha_Creacion = @Fecha_Creacion,
            Fecha_Modificacion = @Fecha_Modificacion,
            Id_Creador = @Id_Creador,
            Id_Modificador = @Id_Modificador,
            Activo = @Activo        
        where Id_Tipo_Catalogo = @Id_Tipo_Catalogo
        commit
        print 'se ha actualizado correctamente'
    end try
    begin catch
        rollback
        print 'No se pudo actualizar' + @@error
    end catch
end
go

--listar--

create proc SP_ListarCls_Tipo_Catalogo
as
begin
    begin try
        Select Cl_Tc.Id_Tipo_Catalogo, Cl_Tc.Nombre, Cl_Tc.Fecha_Creacion, Cl_Tc.Fecha_Modificacion, Cl_Tc.Id_Creador, Cl_Tc.Id_Modificador,Cl_Tc.Activo
        from Cls_Tipo_Catalogo as Cl_Tc
    end try
    begin catch
        print 'No se pudo listar por el error: ' + @@error
    end catch
end
go

--eliminar 

create or alter proc SP_EliminarCls_Tipo_Catalogo
(
@id int
)
as
begin
    begin try
        begin tran
            delete Cls_Tipo_Catalogo where Id_Tipo_Catalogo = @id
        commit
        print 'Se elimino correctamente'
    end try
    begin catch
        rollback
        print 'No se pudo eliminar'+ @@error
    end catch
end
go

------------------------------------------------------------
--insertar--
create or alter proc SP_InsertarCls_Catalogo
(
    @Nombre NVARCHAR(80) NOT NULL,
    @Fecha_Creacion DATE ,
    @Fecha_Modificacion DATETIME NOT NULL,
    @Id_Creador INT NOT NULL,
    @Id_Modificador INT NOT NULL,
    @Activo BIT NOT NULL
 )
as
begin
    begin try
        begin tran
        insert into Cls_Catalogo(Nombre, Fecha_Creacion, Fecha_Modificacion, Id_Creador, Id_Modificador, Activo)
        values(@Nombre,  @Fecha_Creacion,  @Fecha_Modificacion,  @Id_Creador,  @Id_Modificador,  @Activo)
        commit
		print 'Catalogo insertado correctamente'
    end try
    begin catch
        rollback
        print 'no se pudo insertar el catalogo por el error: ' + @@error
    end catch
end

--actualizar--
go
Create or alter proc SP_ActualizarCls_Catalogo
(
    @Id_Catalogo INT ,
    @Nombre NVARCHAR(80) NOT NULL,
    @Fecha_Creacion DATE ,
    @Fecha_Modificacion DATETIME NOT NULL,
    @Id_Creador INT NOT NULL,
    @Id_Modificador INT NOT NULL,
    @Activo BIT NOT NULL
)
as
begin
    begin try
        begin tran
        update Cls_Catalogo
        set Nombre =  @Nombre,
            Fecha_Creacion =  @Fecha_Creacion,
            Fecha_Modificacion =  @Fecha_Modificacion,
            Id_Creador =  @Id_Creador,
            Id_Modificador =  @Id_Modificador,
            Activo =  @Activo
            
        where Id_Catalogo = @Id_Catalogo
        commit
        print ' se edito correctamente'
    end try
    begin catch
        rollback
        print 'no se pudo Editar' + @@error
    end catch
end
go

--listar--

create or alter proc SpListar_Cls_Catalogo
as
begin
    begin try
        Select Cat.Id_Catalogo, Cat.Nombre, Cat.Fecha_Creacion, Cat.Fecha_Modificacion, Cat.Id_Creador, Cat.Id_Modificador, Cat.Activo
      from Cls_Catalogo as  Cat
    end try
    begin catch
        print 'No se pudo listar por el error: ' + @@error
    end catch
end
go

--eliminar 

create or alter proc SP_EliminarCls_Catalogo
(
@id int
)
as
begin
    begin try
        begin tran
            delete Cls_Catalogo where Id_Catalogo = @id
        commit
        print 'Se elimino correctamente'
    end try
    begin catch
        rollback
        print 'No se pudo eliminar'+ @@error
    end catch
end
go

-----------------------------------
--InsertarPersona, Actualizar, sp_BuscarPersonaPorDNI, sp_ListarPersonas
--insertar--
create or alter proc SP_InsertarTbl_Datos_Personales
(
    @Genero INT ,
     @Primer_Nombre NVARCHAR(50) NOT NULL,
     @Segundo_Nombre NVARCHAR(50),
     @Primer_Apellido NVARCHAR(50) NOT NULL,
     @Segundo_Apellido NVARCHAR(50),
     @Fecha_Nacimiento DATE,
     @Tipo_DNI INT ,
     @DNI VARCHAR(20) NOT NULL ,
     @Fecha_Creacion DATE ,
     @Fecha_Modificacion DATETIME NOT NULL,
     @Id_Creador INT NOT NULL,
     @Id_Modificador INT NOT NULL,
    @Id_Estado INT
 )
as
begin
    begin try
        begin tran
        insert into Tbl_Datos_Personales(Genero, Primer_Nombre, Segundo_Nombre, Primer_Apellido, Segundo_Apellido, 
        Fecha_Nacimiento, Tipo_DNI, DNI, Fecha_Creacion, Fecha_Modificacion, Id_Creador, Id_Modificador, Id_Estado)
        values(@Genero,  @Primer_Nombre, @Segundo_Nombre, @Primer_Apellido, @Segundo_Apellido, @Fecha_Nacimiento,
       @Tipo_DNI, @DNI, @Fecha_Creacion, @Id_Creador, @Id_Modificador, @Id_Estado )
        commit
		print 'Dato insertado correctamente'
    end try
    begin catch
        rollback
        print 'no se pudo insertar el Dato por el error: ' + @@error
    end catch
end

--Actualizar--
go
Create or alter proc SP_ActualizarTbl_Datos_Personales
(
    @Id_Persona INT ,
    @Genero INT ,
    @Primer_Nombre NVARCHAR(50) NOT NULL,
    @Segundo_Nombre NVARCHAR(50),
    @Primer_Apellido NVARCHAR(50) NOT NULL,
    @Segundo_Apellido NVARCHAR(50),
    @Fecha_Nacimiento DATE,
    @Tipo_DNI INT ,
    @DNI VARCHAR(20) NOT NULL ,
    @Fecha_Creacion DATE ,
    @Fecha_Modificacion DATETIME NOT NULL,
    @Id_Creador INT NOT NULL,
    @Id_Modificador INT NOT NULL,
    @Id_Estado INT 
)
as
begin
    begin try
        begin tran
        update Tbl_Datos_Personales
        set Genero =   @Genero,
         Primer_Nombre =   @Primer_Nombre,
         Segundo_Nombre =   @Segundo_Nombre,
         Primer_Apellido =   @Segundo_Apellido,
         Fecha_Nacimiento =   @Fecha_Nacimiento,
         Tipo_DNI =   @Tipo_DNI,
         DNI =   @DNI,
         Fecha_Creacion =   @Fecha_Creacion,
         Fecha_Modificacion =   @Fecha_Modificacion,
         Id_Creador =   @Id_Creador,
         Id_Modificador =   @Id_Modificador,
         Id_Estado =   @Id_Estado
        where Id_Persona = @Id_Persona
        commit
        print 'se ha actualizado correctamente'
    end try
    begin catch
        rollback
        print 'No se pudo actualizar' + @@error
    end catch
end
go

--listar--

create proc SP_ListarTbl_Datos_Personales
as
begin
    begin try
        Select  Dp.Id_Persona, Dp.Genero, Dp.Primer_Nombre, Dp.Segundo_Nombre, Dp.Primer_Apellido, Dp.Segundo_Apellido,
        Dp.Fecha_Nacimiento, Dp.Tipo_DNI, Dp.DNI, Dp.Fecha_Creacion, Dp.Fecha_Modificacion, Dp.Id_Creador, Dp.Id_Modificador
        , Dp.Id_Estado
        from Tbl_Datos_Personales as Dp
    end try
    begin catch
        print 'No se pudo listar por el error: ' + @@error
    end catch
end
go

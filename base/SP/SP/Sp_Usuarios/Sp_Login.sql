Use SYNCLAYER
Go

Create or alter proc Sp_Login_Usuario
(
 @Usuario NVARCHAR(50),
 @Contraseña NVARCHAR(255)
)
as
Begin 
	Begin Try
	if exists(Select 1 From Tbl_Usuarios
	where Usuario = @Usuario and Contraseña = @Contraseña)
	Begin
		Select * from Tbl_Usuarios 
		where Usuario = @Usuario
		PRINT 'Bienvenido'
	End
	Else
	Begin 
		print 'Credenciales invalidas'
	end
	End try

	begin catch
		print 'No se puede logear por el error' + ERROR_MESSAGE()
	end catch
End
Go

exec Sp_Login_Usuario 'yeris', '1234'

Select * from Tbl_Usuarios
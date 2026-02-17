CREATE DATABASE SYNCLAYER;
GO

USE SYNCLAYER;
GO

CREATE TABLE Cls_Estado (
    Id_Estado INT PRIMARY KEY IDENTITY(1,1),
    Estado NVARCHAR(30) NOT NULL,
    Fecha_Creacion DATE DEFAULT GETDATE(),
    Fecha_Modificacion DATETIME,
    Id_Creador INT NOT NULL,
    Id_Modificador INT ,
    Activo BIT NOT NULL
);
GO



CREATE TABLE Cls_Tipo_Catalogo (
    Id_Tipo_Catalogo INT PRIMARY KEY IDENTITY(1,1),
    Nombre NVARCHAR(50) NOT NULL,
    Fecha_Creacion DATE DEFAULT GETDATE(),
    Fecha_Modificacion DATETIME,
    Id_Creador INT NOT NULL,
    Id_Modificador INT,
    Activo BIT NOT NULL
);
GO


CREATE TABLE Cls_Catalogo (
    Id_Catalogo INT PRIMARY KEY IDENTITY(1,1),
    Id_Tipo_Catalogo INT REFERENCES Cls_Tipo_Catalogo(Id_Tipo_Catalogo),
    Nombre NVARCHAR(80) NOT NULL,
    Fecha_Creacion DATE DEFAULT GETDATE(),
    Fecha_Modificacion DATETIME,
    Id_Creador INT NOT NULL,
    Id_Modificador INT,
    Activo BIT NOT NULL
);
GO



-- Datos Personales (Para Clientes y Bibliotecarios)
CREATE TABLE Tbl_Datos_Personales (
    Id_Persona INT PRIMARY KEY IDENTITY(1,1),
    Genero INT REFERENCES Cls_Catalogo(Id_Catalogo),
    Primer_Nombre NVARCHAR(50) NOT NULL,
    Segundo_Nombre NVARCHAR(50),
    Primer_Apellido NVARCHAR(50) NOT NULL,
    Segundo_Apellido NVARCHAR(50),
    Fecha_Nacimiento DATE,
    Tipo_DNI INT REFERENCES Cls_Catalogo(Id_Catalogo),
    DNI VARCHAR(20) NOT NULL UNIQUE,
    Fecha_Creacion DATE DEFAULT GETDATE(),
    Fecha_Modificacion DATETIME ,
    Id_Creador INT NOT NULL,
    Id_Modificador INT,
    Id_Estado INT REFERENCES Cls_Estado(Id_Estado)
);
GO




CREATE TABLE Tbl_Contacto (
    Id_Contacto INT PRIMARY KEY IDENTITY(1,1),
    Id_Persona INT REFERENCES Tbl_Datos_Personales(Id_Persona),
    Tipo_Contacto INT REFERENCES Cls_Catalogo(Id_Catalogo), 
    Contacto NVARCHAR(100) NOT NULL,
    Fecha_Creacion DATE DEFAULT GETDATE(),
    Fecha_Modificacion DATETIME ,
    Id_Creador INT NOT NULL,
    Id_Modificador INT ,
    Id_Estado INT REFERENCES Cls_Estado(Id_Estado)
);
GO

--ejecutado hasta esta tabla maycol
 CREATE TABLE Tbl_direcciones(
	Id_direccion INT PRIMARY KEY IDENTITY(1,1),
	Ciudad NVARCHAR(20) NOT NULL,
	Barrio NVARCHAR(40),
	Calle NVARCHAR(30),
	Fecha_Creacion DATE DEFAULT GETDATE(),
    Fecha_Modificacion DATETIME ,
    Id_Creador INT NOT NULL,
    Id_Modificador INT ,
	Id_Persona INT REFERENCES Tbl_Datos_Personales(Id_Persona), 
	Id_Estado INT REFERENCES Cls_Estado(Id_Estado)
 );
 GO

CREATE TABLE Tbl_Roles (
    Id_Rol INT PRIMARY KEY IDENTITY(1,1),
    Nombre NVARCHAR(50) NOT NULL,
    Fecha_Creacion DATE DEFAULT GETDATE(),
    Fecha_Modificacion DATETIME ,
    Id_Creador INT NOT NULL,
    Id_Modificador INT ,
    Id_Estado INT REFERENCES Cls_Estado(Id_Estado)
);
GO

-- Usuarios
CREATE TABLE Tbl_Usuarios (
    Id_Usuario INT PRIMARY KEY IDENTITY(1,1),
    Usuario NVARCHAR(50) NOT NULL UNIQUE,
    Contraseña NVARCHAR(255) NOT NULL,
    Id_Persona INT REFERENCES Tbl_Datos_Personales(Id_Persona),
    Id_Rol INT REFERENCES Tbl_Roles(Id_Rol),
    Fecha_Creacion DATE DEFAULT GETDATE(),
    Fecha_Modificacion DATETIME ,
    Id_Creador INT NOT NULL,
    Id_Modificador INT ,
    Id_Estado INT REFERENCES Cls_Estado(Id_Estado)
);
GO




CREATE TABLE Tbl_Autores (
    Id_Autor INT PRIMARY KEY IDENTITY(1,1),
    Nombre_Completo NVARCHAR(150) NOT NULL,
    Nacionalidad INT REFERENCES Cls_Catalogo(Id_Catalogo),
    Fecha_Creacion DATE DEFAULT GETDATE(),
    Fecha_Modificacion DATETIME ,
    Id_Creador INT NOT NULL,
    Id_Modificador INT ,
    Id_Estado INT REFERENCES Cls_Estado(Id_Estado)
);
GO


CREATE TABLE Tbl_Libros (
    Id_Libro INT PRIMARY KEY IDENTITY(1,1),
    Titulo NVARCHAR(200) NOT NULL,
    ISBN NVARCHAR(20) UNIQUE,
    Id_Autor INT REFERENCES Tbl_Autores(Id_Autor),
    Id_Categoria INT REFERENCES Cls_Catalogo(Id_Catalogo),
    Editorial NVARCHAR(100),
    Año_Publicacion INT,
    Stock INT DEFAULT 0,
    Fecha_Creacion DATE DEFAULT GETDATE(),
    Fecha_Modificacion DATETIME ,
    Id_Creador INT NOT NULL,
    Id_Modificador INT ,
    Id_Estado INT REFERENCES Cls_Estado(Id_Estado)
);
GO




CREATE TABLE Tbl_Prestamos (
    Id_Prestamo INT PRIMARY KEY IDENTITY(1,1),
    Id_Usuario_Cliente INT REFERENCES Tbl_Usuarios(Id_Usuario), 
    Id_Libro INT REFERENCES Tbl_Libros(Id_Libro),
    Fecha_Prestamo DATETIME DEFAULT GETDATE(),
    Fecha_Vencimiento DATETIME NOT NULL,
    Fecha_Devolucion_Real DATETIME NULL,
    Observaciones NVARCHAR(255),
    Fecha_Creacion DATE DEFAULT GETDATE(),
    Fecha_Modificacion DATETIME,
    Id_Creador INT NOT NULL, 
    Id_Modificador INT ,
    Id_Estado INT REFERENCES Cls_Estado(Id_Estado) 
);
GO


CREATE TABLE Tbl_Multas (
    Id_Multa INT PRIMARY KEY IDENTITY(1,1),
    Id_Prestamo INT REFERENCES Tbl_Prestamos(Id_Prestamo),
    Monto_Multa DECIMAL(10,2) NOT NULL,
    Id_Motivo_Multa INT REFERENCES Cls_Catalogo(Id_Catalogo), 
    Pagada BIT DEFAULT 0,
    Fecha_Creacion DATE DEFAULT GETDATE(),
    Fecha_Modificacion DATETIME ,
    Id_Creador INT NOT NULL,
    Id_Modificador INT,
    Id_Estado INT REFERENCES Cls_Estado(Id_Estado)
);
GO



CREATE TABLE Tbl_Devoluciones (
    Id_Devolucion INT PRIMARY KEY IDENTITY(1,1),
    Id_Prestamo INT REFERENCES Tbl_Prestamos(Id_Prestamo),
    Fecha_Entrega DATETIME DEFAULT GETDATE(),
    Id_Estado_Libro INT REFERENCES Cls_Catalogo(Id_Catalogo), 
    Fecha_Creacion DATE DEFAULT GETDATE(),   
    Fecha_Modificacion DATETIME ,
    Id_Creador INT NOT NULL, 
    Id_Modificador INT,
    Id_Estado INT REFERENCES Cls_Estado(Id_Estado) 
);
GO
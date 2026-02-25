use SYNCLAYER
go
INSERT INTO Cls_Estado (Estado, Id_Creador, Activo)
VALUES 
('Activo', 1, 1),
('Inactivo', 1, 1),
('Eliminado', 1, 1),
('Desactivado', 1, 1),
('Pagada', 1, 1),
('Cancelada', 1, 1),
('Parcial', 1, 1),
('Mora', 1, 1),
('Devuelto', 1, 1);
('Dañado', 1, 1);


select * from  Cls_Estado

INSERT INTO Cls_Tipo_Catalogo (Nombre, Id_Creador, Activo)
VALUES 
('Genero', 1, 1),
('TipoDocumento', 1, 1),
('EstadoLibro', 1, 1),
('MotivoMulta', 1, 1),
('CategoriaLibro', 1, 1);


select * from Cls_Tipo_Catalogo
-- Género
INSERT INTO Cls_Catalogo (Id_Tipo_Catalogo, Nombre, Id_Creador, Activo)
VALUES 
(6, 'Masculino', 1, 1),
(6, 'Femenino', 1, 1);

-- Tipo de documento
INSERT INTO Cls_Catalogo (Id_Tipo_Catalogo, Nombre, Id_Creador, Activo)
VALUES 
(7, 'Cédula', 1, 1),
(7, 'Pasaporte', 1, 1);

-- Estado del libro
INSERT INTO Cls_Catalogo (Id_Tipo_Catalogo, Nombre, Id_Creador, Activo)
VALUES 
(8, 'Bueno', 1, 1),
(8, 'Dañado', 1, 1);

-- Motivo multa
INSERT INTO Cls_Catalogo (Id_Tipo_Catalogo, Nombre, Id_Creador, Activo)
VALUES 
(9, 'Retraso', 1, 1),
(9, 'Dañado', 1, 1);

-- Categoría libro
INSERT INTO Cls_Catalogo (Id_Tipo_Catalogo, Nombre, Id_Creador, Activo)
VALUES 
(10, 'Novela', 1, 1),
(10, 'Historia', 1, 1),
(10, 'Ciencia', 1, 1);

select * from Cls_Catalogo


INSERT INTO Tbl_Roles (Nombre, Id_Creador, Id_Estado)
VALUES 
('admin', 1, 3),
('Cliente', 1, 3);

select * from Tbl_Roles

INSERT INTO Tbl_Datos_Personales (Genero, Primer_Nombre, Segundo_Nombre, Primer_Apellido, Segundo_Apellido, Fecha_Nacimiento, Tipo_DNI, DNI, Id_Creador, Id_Estado)
VALUES
(9, 'Yeris', NULL, 'Lopez', 'Martinez', '1990-05-12', 11, '001-123456-0001', 1, 3),
(9, 'Maycol', NULL, 'Solano', 'Gomez', '1988-07-20', 11, '001-123456-0002', 1, 3),
(10, 'Rebeca', NULL, 'Artola', 'Sanchez', '1995-03-15', 11, '001-123456-0003', 1, 3),
(9, 'Carlos', 'Andres', 'Ramirez', 'Torres', '1985-11-02', 12, 'P-987654', 1, 3);


INSERT INTO Tbl_Datos_Personales (Genero, Primer_Nombre, Segundo_Nombre, Primer_Apellido, Segundo_Apellido, Fecha_Nacimiento, Tipo_DNI, DNI, Id_Creador, Id_Estado)
VALUES (9, 'Gabriel', 'José', 'García', 'Márquez', '1927-03-06', 11, 'DNI-GGM1927', 1, 3);


INSERT INTO Tbl_Datos_Personales (Genero, Primer_Nombre, Segundo_Nombre, Primer_Apellido, Segundo_Apellido, Fecha_Nacimiento, Tipo_DNI, DNI, Id_Creador, Id_Estado)
VALUES (10, 'Isabel', NULL, 'Allende', 'Llona', '1942-08-02', 11, 'DNI-IA1942', 1, 3);


INSERT INTO Tbl_Datos_Personales (Genero, Primer_Nombre, Segundo_Nombre, Primer_Apellido, Segundo_Apellido, Fecha_Nacimiento, Tipo_DNI, DNI, Id_Creador, Id_Estado)
VALUES (9, 'Mario', NULL, 'Vargas', 'Llosa', '1936-03-28', 11, 'DNI-MVL1936', 1, 3);

INSERT INTO Tbl_Datos_Personales (Genero, Primer_Nombre, Segundo_Nombre, Primer_Apellido, Segundo_Apellido, Fecha_Nacimiento, Tipo_DNI, DNI, Id_Creador, Id_Estado)
VALUES (9, 'Julio', NULL, 'Cortázar', NULL, '1914-08-26', 11, 'DNI-JC1914', 1, 3);

select * from Tbl_Datos_Personales

INSERT INTO Tbl_Autores (Id_Persona, Id_Creador, Id_Estado)
VALUES
(12, 1, 3),  
(13, 1, 3), 
(14, 1, 3), 
(15, 1, 3); 

select * from Tbl_Autores

INSERT INTO Tbl_Usuarios (Usuario, Contraseña, Id_Persona, Id_Rol, Id_Creador, Id_Estado)
VALUES
('Yeris', '1234', 8, 2, 3, 3),
('Maycol', 'admin123', 9, 2,3, 3),
('Rebeca', '1234', 10, 2, 2, 3),
('carlos', '1255', 11, 2, 1, 3);

select * from  Tbl_Usuarios


INSERT INTO Tbl_Libros (Titulo, ISBN, Id_Autor, Id_Categoria, Editorial, Año_Publicacion, Stock, Id_Creador, Id_Estado)
VALUES
('Cien años de soledad', 'ISBN-GGM-001', 2, 17, 'Editorial Sudamericana', 1967, 10, 1, 3),
('La casa de los espíritus', 'ISBN-IA-001', 3, 17, 'Editorial Plaza & Janés', 1982, 8, 1, 3),
('La ciudad y los perros', 'ISBN-MVL-001', 4, 18, 'Editorial Seix Barral', 1963, 6, 1, 3),
('Rayuela', 'ISBN-JC-001', 5, 19, 'Editorial Sudamericana', 1963, 5, 1, 3);


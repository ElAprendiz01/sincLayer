use SYNCLAYER
go

--Indices de la tabla Cls_Estado
CREATE INDEX idx_Estado_Nombre ON Cls_Estado (Estado);
CREATE INDEX idx_Id_Estado ON Cls_Estado (Id_Estado);
CREATE INDEX idx_Activo ON Cls_Estado (Activo);
CREATE INDEX idx_Fecha_Creacion ON Cls_Estado (Fecha_Creacion);
CREATE INDEX idx_Fecha_Modificacion ON Cls_Estado (Fecha_Modificacion);
--Indices de la tabla Cls_Tipo_Catalogo
CREATE INDEX idx_Id_Tipo_Catalogo ON Cls_Tipo_Catalogo (Id_Tipo_Catalogo);
CREATE INDEX idx_Cls_Tipo_Catalogo_Nombre ON Cls_Tipo_Catalogo (Nombre);
CREATE INDEX idx_Cls_Tipo_Catalogo_Fecha_Creacion ON Cls_Tipo_Catalogo (Fecha_Creacion);
CREATE INDEX idx_Cls_Tipo_Catalogo_Fecha_Modificacion ON Cls_Tipo_Catalogo (Fecha_Modificacion);
CREATE INDEX idx_Cls_Tipo_Catalogo_Activo_Activo ON Cls_Tipo_Catalogo (Activo);
--Indices de la tabla Cls_Catalogo
CREATE INDEX idx_Cls_Catalogo_Id_Tipo_Catalogo ON Cls_Catalogo (Id_Tipo_Catalogo);
CREATE INDEX idx_Cls_Catalogo_Nombre ON Cls_Catalogo (Nombre);
CREATE INDEX idx_Cls_Catalogo_Fecha_Creacion ON Cls_Catalogo (Fecha_Creacion);
CREATE INDEX idx_Cls_Catalogo_Fecha_Modificacion ON Cls_Catalogo (Fecha_Modificacion);
CREATE INDEX idx_Cls_Catalogo_Activo ON Cls_Catalogo (Activo);
--Indices de la tabla Tbl_Datos_Personales
CREATE INDEX idx_Tbl_Datos_Personales_Id_Persona ON Tbl_Datos_Personales (Id_Persona);
CREATE INDEX idx_Tbl_Datos_Personales_Genero ON Tbl_Datos_Personales (Genero);
CREATE INDEX idx_Tbl_Datos_Personales_Primer_Nombre ON Tbl_Datos_Personales (Primer_Nombre);
CREATE INDEX idx_Tbl_Datos_Personales_Primer_Apellido ON Tbl_Datos_Personales (Primer_Apellido);
CREATE INDEX idx_DatosPersonales_DNI ON Tbl_Datos_Personales (DNI);
CREATE INDEX idx_Tbl_Datos_Personales_Id_Estado ON Tbl_Datos_Personales (Id_Estado);
--Indices de la tabla Tbl_Contacto
CREATE INDEX idx_Tbl_Contacto_Id_Contacto ON Tbl_Contacto (Id_Contacto);
CREATE INDEX idx_Tbl_Contacto_Id_Persona ON Tbl_Contacto (Id_Persona);
CREATE INDEX idx_Tbl_Contacto_Tipo_Contacto ON Tbl_Contacto (Tipo_Contacto);
CREATE INDEX idx_Tbl_Contacto_Contacto ON Tbl_Contacto (Contacto);
CREATE INDEX idx_Tbl_Contacto_Id_Estado ON Tbl_Contacto (Id_Estado);
--Indices de la tabla Tbl_direcciones
CREATE INDEX idx_Tbl_direcciones_Id_direccion ON Tbl_direcciones (Id_direccion);
CREATE INDEX idx_Tbl_direcciones_Ciudad ON Tbl_direcciones (Ciudad);
CREATE INDEX idx_Tbl_direcciones_Barrio ON Tbl_direcciones (Barrio);
CREATE INDEX idx_Tbl_direcciones_Calle ON Tbl_direcciones (Calle);
CREATE INDEX idx_Tbl_direcciones_Id_Persona ON Tbl_direcciones (Id_Persona);
CREATE INDEX idx_Tbl_direcciones_Id_Estado ON Tbl_direcciones (Id_Estado);
--Indices de la tabla Tbl_Roles
CREATE INDEX idx_Tbl_Roles_Id_Rol ON Tbl_Roles (Id_Rol);
CREATE INDEX idx_Tbl_Roles_Nombre ON Tbl_Roles (Nombre);
CREATE INDEX idx_Tbl_Roles_Id_Estado ON Tbl_Roles (Id_Estado);
--Indices de la tabla Tbl_Usuarios
CREATE INDEX idx_Tbl_Usuarios_Usuario ON Tbl_Usuarios (Usuario);
CREATE INDEX idx_Usuarios_Nombre ON Tbl_Usuarios (Usuario);
CREATE INDEX idx_Usuarios_Contraseña ON Tbl_Usuarios (Contraseña);
CREATE INDEX idx_Tbl_Usuarios_Id_Persona ON Tbl_Usuarios (Id_Persona);
CREATE INDEX idx_Tbl_Usuarios_Id_Rol ON Tbl_Usuarios (Id_Rol);
CREATE INDEX idx_Tbl_Usuarios_Id_Estado ON Tbl_Usuarios (Id_Estado);
--Indices de la tabla Tbl_Autores
CREATE INDEX idx_Tbl_Autores_Id_Autor ON Tbl_Autores (Id_Autor);
CREATE INDEX idx_Tbl_Autores_Id_persona ON Tbl_Autores (Id_persona);
CREATE INDEX idx_Tbl_Autores_Id_Estado ON Tbl_Autores (Id_Estado);
--Indices de la tabla Tbl_Autores
CREATE INDEX idx_Tbl_Libros_Id_Libro ON Tbl_Libros (Id_Libro);
CREATE INDEX idx_Tbl_Libros_Titulo ON Tbl_Libros (Titulo);
CREATE INDEX idx_Libros_ISBN ON Tbl_Libros (ISBN);
CREATE INDEX idx_Tbl_Libros_Id_Autor ON Tbl_Libros (Id_Autor);
CREATE INDEX idx_Tbl_Libros_Id_Categoria ON Tbl_Libros (Id_Categoria);
CREATE INDEX idx_Tbl_Libros_Id_Estado ON Tbl_Libros (Id_Estado);
--Indices de la tabla Tbl_Libros
CREATE INDEX idx_Tbl_Libros_Titulo ON Tbl_Libros (Titulo);
CREATE INDEX idx_Tbl_Libros_ISBN ON Tbl_Libros (ISBN);
CREATE INDEX idx_Tbl_Libros_Id_Autor ON Tbl_Libros (Id_Autor);
CREATE INDEX idx_Tbl_Libros_Id_Categoria ON Tbl_Libros (Id_Categoria);
CREATE INDEX idx_Tbl_Libros_Id_Estado ON Tbl_Libros (Id_Estado);
--Indices de la tabla Tbl_Prestamos
CREATE INDEX idx_Tbl_Prestamos_Id_Usuario_Cliente ON Tbl_Prestamos (Id_Usuario_Cliente);
CREATE INDEX idx_Tbl_Prestamos_Id_Libro ON Tbl_Prestamos (Id_Libro);
CREATE INDEX idx_Tbl_Prestamos_Fecha_Vencimiento ON Tbl_Prestamos (Fecha_Vencimiento);
CREATE INDEX idx_Tbl_Prestamos_Id_Estado ON Tbl_Prestamos (Id_Estado);
--Indices de la tabla Tbl_Multas
CREATE INDEX idx_Tbl_Multas_Id_Prestamo ON Tbl_Multas (Id_Prestamo);
CREATE INDEX idx_Tbl_Multas_Pagada ON Tbl_Multas (Pagada);
CREATE INDEX idx_Tbl_Multas_Id_Estado ON Tbl_Multas (Id_Estado);
CREATE INDEX idx_Tbl_Multas_Saldo_Pendiente ON Tbl_Multas (Saldo_Pendiente);
--Indices de la tabla Tbl_Devoluciones
CREATE INDEX idx_Tbl_Devoluciones_Id_Devolucion ON Tbl_Devoluciones (Id_Devolucion);
CREATE INDEX idx_Tbl_Devoluciones_Fecha_Entrega ON Tbl_Devoluciones (Fecha_Entrega);
CREATE INDEX idx_Tbl_Devoluciones_Id_Prestamo ON Tbl_Devoluciones (Id_Prestamo);
CREATE INDEX idx_Tbl_Devoluciones_Id_Estado_Libro ON Tbl_Devoluciones (Id_Estado_Libro);
CREATE INDEX idx_Tbl_Devoluciones_Id_Estado ON Tbl_Devoluciones (Id_Estado);
--Indices de la tabla Tbl_Acuerdos_Pago
CREATE INDEX idx_Tbl_Acuerdos_Pago_Id_Pago ON Tbl_Acuerdos_Pago (Id_Acuerdo);
CREATE INDEX idx_Tbl_Acuerdos_Monto_Total_Acordado ON Tbl_Acuerdos_Pago (Monto_Total_Acordado);
CREATE INDEX idx_Tbl_Acuerdos_Cantidad_Cuotas ON Tbl_Acuerdos_Pago (Cantidad_Cuotas);
CREATE INDEX idx_Tbl_Acuerdos_Monto_Por_Cuota ON Tbl_Acuerdos_Pago (Monto_Por_Cuota);
CREATE INDEX idx_Tbl_Acuerdos_Pago_Id_Multa ON Tbl_Acuerdos_Pago (Id_Multa);
CREATE INDEX idx_Tbl_Acuerdos_Pago_Frecuencia_Pago ON Tbl_Acuerdos_Pago (Frecuencia_Pago);
CREATE INDEX idx_Tbl_Acuerdos_Pago_Id_Estado ON Tbl_Acuerdos_Pago (Id_Estado);
--Indices de la tabla Tbl_Acuerdos_Pago
CREATE INDEX idx_Tbl_Pagos_Id_Pago ON Tbl_Pagos (Id_Pago);
CREATE INDEX idx_Tbl_Pagos_Id_Multa ON Tbl_Pagos (Id_Multa);
CREATE INDEX idx_Tbl_Pagos_Id_Acuerdo ON Tbl_Pagos (Id_Acuerdo);
CREATE INDEX idx_Tbl_Pagos_Metodo_Pago ON Tbl_Pagos (Metodo_Pago);
CREATE INDEX idx_Tbl_Pagos_Numero_Comprobante ON Tbl_Pagos (Numero_Comprobante);
CREATE INDEX idx_Tbl_Pagos_Fecha_Pago ON Tbl_Pagos (Fecha_Pago);
CREATE INDEX idx_Tbl_Pagos_Id_Estado ON Tbl_Pagos (Id_Estado);
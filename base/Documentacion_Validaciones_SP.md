# Documentación de Validaciones en Stored Procedures y Estructura de la Base de Datos

## Introducción
Esta documentación proporciona un análisis completo de la base de datos de biblioteca "SYNCLAYER", incluyendo la estructura de las tablas y las validaciones implementadas en los 71 Stored Procedures (SP). Se basa en un análisis exhaustivo de todos los archivos SQL en el workspace.

## Estructura de la Base de Datos
La base de datos consta de 13 tablas principales con las siguientes estructuras, columnas, tipos de datos, restricciones y relaciones:

### Tablas y Estructuras
- **Cls_Estado** (Estados): 
  - `Id_Estado INT PK IDENTITY`
  - `Estado NVARCHAR(30) NOT NULL`
  - `Fecha_Creacion DATE DEFAULT GETDATE()`
  - `Fecha_Modificacion DATETIME`
  - `Id_Creador INT NOT NULL`
  - `Id_Modificador INT`
  - `Activo BIT NOT NULL`
  - Usado como estado para otras tablas.

- **Cls_Tipo_Catalogo** (Tipos de Catálogo):
  - `Id_Tipo_Catalogo INT PK IDENTITY`
  - `Nombre NVARCHAR(50) NOT NULL`
  - `Fecha_Creacion DATE DEFAULT GETDATE()`
  - `Fecha_Modificacion DATETIME`
  - `Id_Creador INT NOT NULL`
  - `Id_Modificador INT`
  - `Activo BIT NOT NULL`

- **Cls_Catalogo** (Catálogos):
  - `Id_Catalogo INT PK IDENTITY`
  - `Id_Tipo_Catalogo INT FK -> Cls_Tipo_Catalogo`
  - `Nombre NVARCHAR(80) NOT NULL`
  - `Fecha_Creacion DATE DEFAULT GETDATE()`
  - `Fecha_Modificacion DATETIME`
  - `Id_Creador INT NOT NULL`
  - `Id_Modificador INT`
  - `Activo BIT NOT NULL`

- **Tbl_Datos_Personales** (Datos Personales):
  - `Id_Persona INT PK IDENTITY`
  - `Genero INT FK -> Cls_Catalogo`
  - `Primer_Nombre NVARCHAR(50) NOT NULL`
  - `Segundo_Nombre NVARCHAR(50)`
  - `Primer_Apellido NVARCHAR(50) NOT NULL`
  - `Segundo_Apellido NVARCHAR(50)`
  - `Fecha_Nacimiento DATE`
  - `Tipo_DNI INT FK -> Cls_Catalogo`
  - `DNI VARCHAR(20) NOT NULL UNIQUE`
  - `Fecha_Creacion DATE DEFAULT GETDATE()`
  - `Fecha_Modificacion DATETIME`
  - `Id_Creador INT NOT NULL`
  - `Id_Modificador INT`
  - `Id_Estado INT FK -> Cls_Estado`

- **Tbl_Contacto** (Contactos):
  - `Id_Contacto INT PK IDENTITY`
  - `Id_Persona INT FK -> Tbl_Datos_Personales`
  - `Tipo_Contacto INT FK -> Cls_Catalogo`
  - `Contacto NVARCHAR(100) NOT NULL`
  - `Fecha_Creacion DATE DEFAULT GETDATE()`
  - `Fecha_Modificacion DATETIME`
  - `Id_Creador INT NOT NULL`
  - `Id_Modificador INT`
  - `Id_Estado INT FK -> Cls_Estado`

- **Tbl_direcciones** (Direcciones):
  - `Id_direccion INT PK IDENTITY`
  - `Ciudad NVARCHAR(20) NOT NULL`
  - `Barrio NVARCHAR(40)`
  - `Calle NVARCHAR(30)`
  - `Fecha_Creacion DATE DEFAULT GETDATE()`
  - `Fecha_Modificacion DATETIME`
  - `Id_Creador INT NOT NULL`
  - `Id_Modificador INT`
  - `Id_Persona INT FK -> Tbl_Datos_Personales`
  - `Id_Estado INT FK -> Cls_Estado`

- **Tbl_Roles** (Roles):
  - `Id_Rol INT PK IDENTITY`
  - `Nombre NVARCHAR(50) NOT NULL`
  - `Fecha_Creacion DATE DEFAULT GETDATE()`
  - `Fecha_Modificacion DATETIME`
  - `Id_Creador INT NOT NULL`
  - `Id_Modificador INT`
  - `Id_Estado INT FK -> Cls_Estado`

- **Tbl_Usuarios** (Usuarios):
  - `Id_Usuario INT PK IDENTITY`
  - `Usuario NVARCHAR(50) NOT NULL UNIQUE`
  - `Contraseña NVARCHAR(255) NOT NULL`
  - `Id_Persona INT FK -> Tbl_Datos_Personales`
  - `Id_Rol INT FK -> Tbl_Roles`
  - `Fecha_Creacion DATE DEFAULT GETDATE()`
  - `Fecha_Modificacion DATETIME`
  - `Id_Creador INT NOT NULL`
  - `Id_Modificador INT`
  - `Id_Estado INT FK -> Cls_Estado`

- **Tbl_Autores** (Autores):
  - `Id_Autor INT PK IDENTITY`
  - `Id_persona INT FK -> Tbl_Datos_Personales`
  - `Fecha_Creacion DATE DEFAULT GETDATE()`
  - `Fecha_Modificacion DATETIME`
  - `Id_Creador INT NOT NULL`
  - `Id_Modificador INT`
  - `Id_Estado INT FK -> Cls_Estado`

- **Tbl_Libros** (Libros):
  - `Id_Libro INT PK IDENTITY`
  - `Titulo NVARCHAR(200) NOT NULL`
  - `ISBN NVARCHAR(20) UNIQUE`
  - `Id_Autor INT FK -> Tbl_Autores`
  - `Id_Categoria INT FK -> Cls_Catalogo`
  - `Editorial NVARCHAR(100)`
  - `Año_Publicacion INT`
  - `Stock INT DEFAULT 0`
  - `Fecha_Creacion DATE DEFAULT GETDATE()`
  - `Fecha_Modificacion DATETIME`
  - `Id_Creador INT NOT NULL`
  - `Id_Modificador INT`
  - `Id_Estado INT FK -> Cls_Estado`

- **Tbl_Prestamos** (Préstamos):
  - `Id_Prestamo INT PK IDENTITY`
  - `Id_Usuario_Cliente INT FK -> Tbl_Usuarios`
  - `Id_Libro INT FK -> Tbl_Libros`
  - `Fecha_Prestamo DATETIME DEFAULT GETDATE()`
  - `Fecha_Vencimiento DATETIME NOT NULL`
  - `Fecha_Devolucion_Real DATETIME NULL`
  - `Observaciones NVARCHAR(255)`
  - `Fecha_Creacion DATE DEFAULT GETDATE()`
  - `Fecha_Modificacion DATETIME`
  - `Id_Creador INT NOT NULL`
  - `Id_Modificador INT`
  - `Id_Estado INT FK -> Cls_Estado`

- **Tbl_Multas** (Multas):
  - `Id_Multa INT PK IDENTITY`
  - `Id_Prestamo INT FK -> Tbl_Prestamos`
  - `Monto_Multa DECIMAL(10,2) NOT NULL`
  - `Id_Motivo_Multa INT FK -> Cls_Catalogo`
  - `Pagada BIT`
  - `Fecha_Creacion DATE DEFAULT GETDATE()`
  - `Fecha_Modificacion DATETIME`
  - `Id_Creador INT NOT NULL`
  - `Id_Modificador INT`
  - `Id_Estado INT FK -> Cls_Estado`
  - `Saldo_Pendiente DECIMAL(10,2) NULL`

- **Tbl_Devoluciones** (Devoluciones):
  - `Id_Devolucion INT PK IDENTITY`
  - `Id_Prestamo INT FK -> Tbl_Prestamos`
  - `Fecha_Entrega DATETIME DEFAULT GETDATE()`
  - `Id_Estado_Libro INT FK -> Cls_Catalogo`
  - `Fecha_Creacion DATE DEFAULT GETDATE()`
  - `Fecha_Modificacion DATETIME`
  - `Id_Creador INT NOT NULL`
  - `Id_Modificador INT`
  - `Id_Estado INT FK -> Cls_Estado`

### Relaciones
- La mayoría de las tablas tienen FK a `Cls_Estado` para seguimiento de estado.
- `Cls_Catalogo` se usa para clasificaciones (género, tipo de contacto, etc.).
- Jerarquía: Tipo_Catalogo -> Catalogo.
- Datos personales enlazan a usuarios, autores, contactos, direcciones.
- Libros enlazan a autores y categorías.
- Préstamos enlazan a usuarios y libros, multas a préstamos, devoluciones a préstamos.

### Restricciones
- PK en IDs, UNIQUE en Usuario e ISBN, NOT NULL en campos clave, DEFAULT en fechas y stock.

## Validaciones en Stored Procedures
Los SP están agrupados por categoría. Cada uno incluye ruta del archivo, descripción breve y lista detallada de validaciones.

### Gestión de Usuarios
- **Sp_actualizarUsuario.sql** (SP/SP/Sp_Usuarios/): Actualiza detalles de usuario. Validaciones: IF NOT EXISTS usuario; IF @Id_Estado IS NOT NULL AND NOT EXISTS estado activo; IF @ForzarRecuperacion=0 AND EXISTS usuario inactivo; TRY-CATCH.
- **SpObtenerUsuario.sql** (SP/SP/Sp_Usuarios/): Obtiene usuario por nombre. Sin validaciones.
- **SpEliminarUSario.sql** (SP/SP/Sp_Usuarios/): Desactiva usuario. Sin validaciones.
- **SpCrearUsuario.sql** (SP/SP/Sp_Usuarios/): Crea usuario. Validaciones: IF EXISTS nombre de usuario; sin TRY-CATCH.

### Gestión de Roles
- **Sp_eliminarRoles.sql** (SP/SP/SpRoles/): Desactiva rol. Sin validaciones.
- **SP_actualizarRol.sql** (SP/SP/SpRoles/): Actualiza rol. Validaciones: IF NOT EXISTS rol; IF @Id_Estado IS NOT NULL AND NOT EXISTS estado activo; IF @ForzarRecuperacion=0 AND EXISTS rol inactivo; IF @Nombre IS NOT NULL AND EXISTS nombre duplicado; TRY-CATCH.
- **SpCrearRol.sql** (SP/SP/SpRoles/): Crea rol. Validaciones: IF EXISTS nombre; sin TRY-CATCH.

### Gestión de Tipos de Catálogo
- **SPTipoCatalogoFiltroPorNombre.sql** (SP/SP/SP_TIPO_CATALOGO/): Filtra tipos de catálogo por nombre. Sin validaciones.
- **SPListarTipoDecatalogo.sql** (SP/SP/SP_TIPO_CATALOGO/): Lista tipos de catálogo. Sin validaciones.
- **SPInsertarTipoDeCatalogo.sql** (SP/SP/SP_TIPO_CATALOGO/): Inserta tipo de catálogo. Validaciones: IF @Nombre IS NULL OR vacío; IF @Id_Creador IS NULL OR =0; TRY-CATCH.
- **SPEliminarDesctivarTipoCatalogo.sql** (SP/SP/SP_TIPO_CATALOGO/): Desactiva tipo de catálogo. TRY-CATCH.
- **SPActualizarTipoCatalogo.sql** (SP/SP/SP_TIPO_CATALOGO/): Actualiza tipo de catálogo. Validaciones: IF NOT EXISTS tipo; IF @Nombre IS NOT NULL AND vacío; TRY-CATCH.

### Gestión de Datos Personales
- **SPListarDatosPersonales.sql** (SP/SP/SP_DATOS_PERSONALES/): Lista personas activas. Sin validaciones.
- **SpInsertarDatosPersonales.sql** (SP/SP/SP_DATOS_PERSONALES/): Inserta persona. Validaciones: IF @Primer_Nombre/@Primer_Apellido/@DNI IS NULL OR vacío; IF NOT EXISTS género/tipo_DNI/estado activo; IF EXISTS DNI; TRY-CATCH.
- **SPFIltraPORFEchaNacimientoDatosPersonales.sql** (SP/SP/SP_DATOS_PERSONALES/): Filtra personas por fecha de nacimiento. Sin validaciones.
- **SpElimianrDatosPersonales.sql** (SP/SP/SP_DATOS_PERSONALES/): Desactiva persona. Validaciones: IF @Id_Persona IS NULL OR =0; Verifica existe y no inactivo; Encuentra estado inactivo; TRY-CATCH.
- **SPdATOSPERSOALESBORRADOR.sql** (SP/SP/SP_DATOS_PERSONALES/): Duplicado de filtro. Sin validaciones.
- **SPActualizarDatosPersoanles.sql** (SP/SP/SP_DATOS_PERSONALES/): Actualiza persona. Validaciones: IF NOT EXISTS persona; IF @Genero/@Tipo_DNI/@Id_Estado IS NOT NULL AND NOT EXISTS activo; IF @DNI IS NOT NULL AND EXISTS en otra persona; IF @ForzarRecuperacion=0 AND EXISTS inactivo; TRY-CATCH.

### Gestión de Contactos
- **SP_FILTRAR_CONTACTO_POR_NOMBRE.sql** (SP/SP/SP_CONTACTOS/): Filtra contactos por nombre. Sin validaciones.
- **spListar_contactos.sql** (SP/SP/SP_CONTACTOS/): Lista contactos. Sin validaciones.
- **SPInsertar_contactos.sql** (SP/SP/SP_CONTACTOS/): Inserta contacto. Validaciones: IF @Id_Persona/@Tipo_Contacto/@Id_Estado IS NULL OR =0; IF NOT EXISTS persona; IF EXISTS persona inactiva; IF NOT EXISTS tipo; IF NOT EXISTS estado activo; TRY-CATCH.
- **SPEliminar_contactos.sql** (SP/SP/SP_CONTACTOS/): Desactiva contacto. Validaciones: IF @Id_Contacto IS NULL OR =0; Verifica existe y no inactivo; Encuentra estado inactivo; TRY-CATCH.
- **SpActualizar_contacto.sql** (SP/SP/SP_CONTACTOS/): Actualiza contacto. Validaciones: IF @Id_Estado IS NOT NULL AND NOT EXISTS estado activo; IF @ForzarRecuperacion=0 AND EXISTS inactivo; IF NOT EXISTS contacto; IF @Tipo_Contacto IS NOT NULL AND NOT EXISTS; TRY-CATCH.

### Gestión de Autores
- **Sp_Listar_autores.sql** (SP/SP/SP_AUTOR/): Lista autores activos. Sin validaciones.
- **SP_Insertar_Autor.sql** (SP/SP/SP_AUTOR/): Inserta autor. Validaciones: IF @Id_Persona/@Id_Estado IS NULL OR =0; IF NOT EXISTS persona; IF EXISTS persona inactiva; IF EXISTS estado inválido; IF NOT EXISTS estado activo; TRY-CATCH.
- **SP_FILTRAR_AUTOR_POR_ID_PERSONA.sql** (SP/SP/SP_AUTOR/): Filtra autores por persona. Sin validaciones.
- **SP_Eliminar_autor.sql** (SP/SP/SP_AUTOR/): Desactiva autor. Validaciones: IF @Id_Autor IS NULL OR =0; Verifica existe y no inactivo; Encuentra estado inactivo; TRY-CATCH.
- **SP_Actualizar_actores.sql** (SP/SP/SP_AUTOR/): Actualiza autor. Validaciones: IF NOT EXISTS autor; IF @Id_Estado IS NOT NULL AND NOT EXISTS estado activo; IF EXISTS estado inválido; IF @ForzarRecuperacion=0 AND EXISTS inactivo; TRY-CATCH.

### Gestión de Préstamos
- **SP_LISTAR_PRESTAMOS.sql** (SP/SP/SP_Prestamos/): Lista préstamos. Sin validaciones.
- **SP_Inseratar_prestamo.sql** (SP/SP/SP_Prestamos/): Inserta préstamo. Validaciones: IF @Id_Usuario_Cliente/@Id_Libro IS NULL OR =0; IF EXISTS multas pendientes; IF NOT EXISTS cliente/libro activo; IF NOT EXISTS stock >0; IF @Fecha_Vencimiento <= GETDATE(); TRY-CATCH.
- **SP_FILTRO_PRESTAMO_POR_ID_USUARIO.sql** (SP/SP/SP_Prestamos/): Filtra préstamos por usuario. Validaciones: IF @Id_Usuario_Cliente IS NULL OR =0 (RAISERROR).
- **SP_Eliminar_prestamo.sql** (SP/SP/SP_Prestamos/): Desactiva préstamo. Validaciones: IF @Id_Prestamo IS NULL OR =0; Verifica existe y no inactivo; Encuentra estado inactivo; TRY-CATCH.
- **SP_actualizar_prestamo.sql** (SP/SP/SP_Prestamos/): Actualiza préstamo. Validaciones: IF NOT EXISTS préstamo; IF @Id_Estado IS NOT NULL AND NOT EXISTS estado activo; IF EXISTS estado inválido; IF @ForzarRecuperacion=0 AND EXISTS inactivo; TRY-CATCH.

### Gestión de Multas
- **sp_lista_de_usuarios_con_multas_pendientes.sql** (SP/SP/SP_Multas/): Lista usuarios con multas pendientes. Sin validaciones.
- **SP_LISTAR_MULTAS_PENDIENTES.sql** (SP/SP/SP_Multas/): Lista multas pendientes. Sin validaciones.
- **SP_Eliminar_multa.sql** (SP/SP/SP_Multas/): Desactiva multa. Validaciones: IF @Id_Multa IS NULL OR =0; Verifica existe y no inactivo; Encuentra estado inactivo; TRY-CATCH.
- **SP_ACTUALIZAR_MULTA_CON_ABONO_NO_CANCELACION.sql** (SP/SP/SP_Multas/): Aplica pago de multa. Validaciones: IF NOT EXISTS multa; IF @MontoAbono <=0; Calcula saldo; IF @NuevoSaldo <0; TRY-CATCH.
- **SP_ACTUALIZAR_MULTAS.sql** (SP/SP/SP_Multas/): Actualiza multa. Validaciones: IF NOT EXISTS multa; IF @Id_Estado IS NOT NULL AND NOT EXISTS estado activo; IF EXISTS estado inválido; IF @ForzarRecuperacion=0 AND EXISTS inactivo; TRY-CATCH.

### Gestión de Direcciones
- **spListarDirecciones.sql** (SP/SP/SP_DIRECCION/): Lista direcciones activas. Sin validaciones.
- **SPisentarDirecciones.sql** (SP/SP/SP_DIRECCION/): Inserta dirección. Validaciones: IF NOT EXISTS estado activo; IF @Id_Persona IS NULL OR =0; IF NOT EXISTS persona; IF EXISTS persona inactiva; IF @Id_Estado IS NULL OR =0; IF NOT EXISTS estado; IF NOT EXISTS estado activo; TRY-CATCH.
- **spFiltrarDireccionPorIdPersona.sql** (SP/SP/SP_DIRECCION/): Filtra direcciones por persona. Sin validaciones.
- **SpEliminarDesctivarDireccion.sql** (SP/SP/SP_DIRECCION/): Desactiva dirección. Validaciones: IF @Id_direccion IS NULL OR =0; Verifica existe y no inactivo; Encuentra estado inactivo; TRY-CATCH.
- **SPActualizarDireccion.sql** (SP/SP/SP_DIRECCION/): Actualiza dirección. Validaciones: IF @Id_Estado IS NOT NULL AND NOT EXISTS estado activo; IF @ForzarRecuperacion=0 AND EXISTS inactivo; IF NOT EXISTS dirección; TRY-CATCH.

### Gestión de Libros
- **Sp_ListarlibroInactivo.sql** (SP/SP/SP_LIBRO/): Lista libros inactivos. Sin validaciones.
- **Sp_FiltarLibrosporAutor.sql** (SP/SP/SP_LIBRO/): Filtra libros por autor. Sin validaciones.
- **SP_FiltarLibroPorCategoria.sql** (SP/SP/SP_LIBRO/): Filtra libros por categoría. Sin validaciones.
- **Sp_Eliminar_Libro.sql** (SP/SP/SP_LIBRO/): Desactiva libro. Validaciones: IF @Id_Libro/@Id_Modificador IS NULL OR =0; Verifica existe y no inactivo; Encuentra estado inactivo; TRY-CATCH.
- **SP_EditarLibro.sql** (SP/SP/SP_LIBRO/): Actualiza libro. Validaciones: IF NOT EXISTS libro; IF @Titulo IS NOT NULL AND vacío; IF @ISBN IS NOT NULL AND (len=0 OR >20 OR EXISTS en otro); IF @Id_Categoria/@Id_Autor IS NOT NULL AND NOT EXISTS; IF @Id_Estado IS NOT NULL AND NOT EXISTS estado activo; IF EXISTS estado inválido; IF @ForzarRecuperacion=0 AND EXISTS inactivo; IF @Año_Publicacion IS NOT NULL AND (<1400 OR >año actual); IF @Stock IS NOT NULL AND <0; IF @Id_Modificador IS NULL; TRY-CATCH.
- **SpInsertarLibro.sql** (SP/SP/SP_LIBRO/): Inserta libro. Validaciones: IF @Id_Autor/@Id_Categoria/@Id_Estado IS NULL OR =0; IF NOT EXISTS autor; IF EXISTS autor inactivo; IF NOT EXISTS categoría; IF EXISTS estado inválido; IF NOT EXISTS estado activo; IF @Stock <0; TRY-CATCH.

### Gestión de Estados
- **SPListarEsatdo.sql** (SP/SP/SP_ESATDOS/): Lista estados. TRY-CATCH.
- **SPInsertarEsatdo.sql** (SP/SP/SP_ESATDOS/): Inserta estado. TRY-CATCH.
- **spFiltrarPorEsatdoNombre.sql** (SP/SP/SP_ESATDOS/): Filtra estados por nombre. TRY-CATCH.
- **SPEliminarEstado.sql** (SP/SP/SP_ESATDOS/): Elimina estado. TRY-CATCH.
- **spActualizarEstado.sql** (SP/SP/SP_ESATDOS/): Actualiza estado. TRY-CATCH.

### Gestión de Catálogos
- **Sp_Tipo_CatalogoBORRADORYERIS.sql** (SP/SP/SPCATALOGO/): SP mixto para tipo catálogo. Validaciones: IF NOT EXISTS tipo; IF @Nombre = NULL; TRY-CATCH.
- **SP_InsertarCatalogo.sql** (SP/SP/SPCATALOGO/): Inserta catálogo. Validaciones: IF EXISTS tipo inactivo; IF @Id_Tipo_Catalogo/@Nombre/@Id_Creador IS NULL OR =0 OR vacío; IF NOT EXISTS tipo; TRY-CATCH.
- **spListarCatalogo.sql** (SP/SP/SPCATALOGO/): Lista catálogos. Sin validaciones.
- **SPFiltroCatalogo.sql** (SP/SP/SPCATALOGO/): Filtra catálogos por nombre. Sin validaciones.
- **SPelimianarCatalogo.sql** (SP/SP/SPCATALOGO/): Desactiva catálogo. Validaciones: IF @Id_Catalogo IS NULL OR =0; IF NOT EXISTS catálogo; TRY-CATCH.
- **spActualizarCatalogo.sql** (SP/SP/SPCATALOGO/): Actualiza catálogo. Validaciones: IF EXISTS tipo inactivo; IF @Id_Catalogo IS NULL OR =0; IF @Id_Catalogo/@Id_Tipo_Catalogo IS NOT NULL AND NOT EXISTS; TRY-CATCH.

### Gestión de Devoluciones
- **SP_ELIMINAR_Devoluviones.sql** (SP/SP/SP_Devoluciones/): Desactiva devolución. Validaciones: IF @Id_Devolucion IS NULL OR =0; Verifica existe y no inactivo; Encuentra estado inactivo; TRY-CATCH.
- **SP_Actualizar_devoluciones.sql** (SP/SP/SP_Devoluciones/): Actualiza devolución. Validaciones: IF NOT EXISTS devolución; IF @Id_Estado IS NOT NULL AND NOT EXISTS estado activo; IF EXISTS estado inválido; IF @ForzarRecuperacion=0 AND EXISTS inactivo; TRY-CATCH.
- **SpInsertarDevoluciones_si_se_pasa_de_la_fecha_se_inserta_multa_automatica.sql** (SP/SP/SP_Devoluciones/): Inserta devolución con multa automática. Validaciones: IF @Id_Prestamo IS NULL OR =0; IF NOT EXISTS préstamo activo; IF EXISTS ya devuelto; IF NOT EXISTS estado_libro; Lógica de negocio: inserta multa automática por retraso/daño; TRY-CATCH.
- **sp_filtrar_devoluciones_id_usuario.sql** (SP/SP/SP_Devoluciones/): Filtra devoluciones por usuario. Sin validaciones.
- **SP_listar_devoluciones.sql** (SP/SP/SP_Devoluciones/): Lista devoluciones. Sin validaciones.

### Listas de Inactivos (Todos en SP/SpListasYFiltrosInactivos/)
- **sp_listar_autores_eliminados.sql**: Lista autores eliminados. Sin validaciones.
- **spListar_contactos_eliminados.sql**: Lista contactos eliminados. Sin validaciones.
- **spListarDirccionInactivas.sql**: Lista direcciones inactivas. Sin validaciones.
- **SPListarCatalogoInactivos.sql**: Lista catálogos inactivos. Sin validaciones.
- **SPFiltrarPorNombreTipoCatalogInactivo.sql**: Filtra tipos de catálogo inactivos. Sin validaciones.
- **ListarPersonasInactivas.sql**: Lista personas inactivas. Sin validaciones.

## Resumen de Patrones de Validación
- **Chequeos de Parámetros Nulos/Vacíos**: Comunes en SP de inserción/actualización (e.g., IF IS NULL OR LTRIM(RTRIM()) = '' OR =0). Usados para campos requeridos como IDs, nombres, DNI.
- **Chequeos de Existencia**: IF NOT EXISTS en tablas relacionadas (e.g., persona, estado, catálogo). Asegura validez de FK y estado activo.
- **Chequeos de Unicidad**: IF EXISTS para duplicados (e.g., nombre de usuario, DNI, ISBN).
- **Validaciones de Estado/Status**: IF EXISTS con estados inactivos (e.g., 'Eliminado', 'Inactivo') para prevenir operaciones en registros eliminados, a menudo con flag @ForzarRecuperacion para recuperación.
- **Validaciones de Lógica de Negocio**: Stock >0, fechas > actual, abono <= saldo, rangos de años, sin multas pendientes para préstamos.
- **Manejo de Errores**: TRY-CATCH en la mayoría de SP de inserción/actualización/eliminación, con ROLLBACK y salida de ERROR_NUMBER()/MESSAGE().
- **RAISERROR/THROW**: Raro, usado en filtros para parámetros inválidos.
- **Omisiones Comunes**: SP de lista/filtro carecen de validaciones; algunos SP de eliminación omiten chequeos de existencia.
- **Patrones en SP**: Uso consistente de COALESCE para actualizaciones opcionales, chequeos activos vía JOINs, y parámetros de salida (@O_Numero, @O_Msg) para resultados. Sin RAISERROR/THROW en la mayoría; TRY-CATCH preferido.
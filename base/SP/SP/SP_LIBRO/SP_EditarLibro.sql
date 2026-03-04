use SYNCLAYER
go 

CREATE OR ALTER PROCEDURE Editar_Tbl_Libros
(
    @Id_Libro INT,
    @Titulo NVARCHAR(200) = NULL,
    @ISBN NVARCHAR(20) = NULL,
    @Id_Autor INT = NULL,
    @Id_Categoria INT = NULL,
    @Editorial NVARCHAR(100) = NULL,
    @Año_Publicacion INT = NULL,
    @Stock INT = NULL,
    @Id_Modificador INT = NULL,
    @Id_Estado INT = NULL,
    @ForzarRecuperacion BIT = 0,
    @O_Numero INT OUTPUT,
    @O_Msg VARCHAR(255) OUTPUT
)
AS
BEGIN
    SET NOCOUNT ON;

    -- validacion de si libro exiaste
    IF NOT EXISTS (SELECT 1 FROM Tbl_Libros WHERE Id_Libro = @Id_Libro)
    BEGIN
        SET @O_Numero = -1;
        SET @O_Msg = 'El libro no existe.';
        RETURN;
    END;

    -- Validar título
    IF @Titulo IS NOT NULL AND LTRIM(RTRIM(@Titulo)) = ''
    BEGIN
        SET @O_Numero = -1;
        SET @O_Msg = 'El título no puede estar vacío.';
        RETURN;
    END;

    -- Validar ISBN
    IF @ISBN IS NOT NULL AND (LEN(@ISBN) = 0 OR LEN(@ISBN) > 20)
    BEGIN
        SET @O_Numero = -1;
        SET @O_Msg = 'El ISBN es inválido.';
        RETURN;
    END;

    IF @ISBN IS NOT NULL
       AND EXISTS (SELECT 1 FROM Tbl_Libros WHERE ISBN = @ISBN AND Id_Libro <> @Id_Libro)
    BEGIN
        SET @O_Numero = -1;
        SET @O_Msg = 'El ISBN ya existe en otro libro.';
        RETURN;
    END;

    -- Validar categoría
    IF @Id_Categoria IS NOT NULL
       AND NOT EXISTS (SELECT 1 FROM Cls_Catalogo WHERE Id_Catalogo = @Id_Categoria AND Activo = 1)
    BEGIN
        SET @O_Numero = -1;
        SET @O_Msg = 'La categoría no existe.';
        RETURN;
    END;

    -- Validar autor
    IF @Id_Autor IS NOT NULL
       AND NOT EXISTS (SELECT 1 FROM Tbl_Autores WHERE Id_Autor = @Id_Autor)
    BEGIN
        SET @O_Numero = -1;
        SET @O_Msg = 'El autor no existe.';
        RETURN;
    END;

    -- Validar estado
    IF @Id_Estado IS NOT NULL
    BEGIN
        IF NOT EXISTS (SELECT 1 FROM Cls_Estado WHERE Id_Estado = @Id_Estado AND Activo = 1)
        BEGIN
            SET @O_Numero = -1;
            SET @O_Msg = 'El estado no existe o está desactivado.';
            RETURN;
        END;

        IF EXISTS (
            SELECT 1
            FROM Cls_Estado e
            WHERE e.Id_Estado = @Id_Estado
              AND e.Estado IN ('Eliminado','Desactivado','Inactivo','Suspendido')
        )
        BEGIN
            SET @O_Numero = -1;
            SET @O_Msg = 'No se puede asignar un estado inválido al libro.';
            RETURN;
        END;
    END;

    -- Validar que el libro no esté eliminado/inactivo 
    IF @ForzarRecuperacion = 0
       AND EXISTS (
            SELECT 1
            FROM Tbl_Libros l
            INNER JOIN Cls_Estado e ON l.Id_Estado = e.Id_Estado
            WHERE l.Id_Libro = @Id_Libro
              AND e.Estado IN ('Eliminado','Desactivado','Inactivo','Suspendido')
       )
    BEGIN
        SET @O_Numero = -1;
        SET @O_Msg = 'El libro está eliminado o inactivo. Para recuperarlo comuníquese con el administrador.';
        RETURN;
    END;

    -- Validar año de publicación
    IF @Año_Publicacion IS NOT NULL AND (@Año_Publicacion < 1400 OR @Año_Publicacion > YEAR(GETDATE()))
    BEGIN
        SET @O_Numero = -1;
        SET @O_Msg = 'El año de publicación es inválido.';
        RETURN;
    END;

    -- Validar stock
    IF @Stock IS NOT NULL AND @Stock < 0
    BEGIN
        SET @O_Numero = -1;
        SET @O_Msg = 'El stock no puede ser negativo.';
        RETURN;
    END;

    -- Validar modificador
    IF @Id_Modificador IS NULL
    BEGIN
        SET @O_Numero = -1;
        SET @O_Msg = 'Especificar modificador.';
        RETURN;
    END;

    BEGIN TRY
        BEGIN TRAN;

        UPDATE Tbl_Libros
        SET
            Titulo = COALESCE(@Titulo, Titulo),
            ISBN = COALESCE(@ISBN, ISBN),
            Id_Autor = COALESCE(@Id_Autor, Id_Autor),
            Id_Categoria = COALESCE(@Id_Categoria, Id_Categoria),
            Editorial = COALESCE(@Editorial, Editorial),
            Año_Publicacion = COALESCE(@Año_Publicacion, Año_Publicacion),
            Stock = COALESCE(@Stock, Stock),
            Fecha_Modificacion = GETDATE(),
            Id_Modificador = @Id_Modificador,
            Id_Estado = COALESCE(@Id_Estado, Id_Estado)
        WHERE Id_Libro = @Id_Libro;

        COMMIT TRAN;

        SET @O_Numero = 200;
        SET @O_Msg = 'El libro se ha actualizado correctamente.';
    END TRY
    BEGIN CATCH
        IF @@TRANCOUNT > 0 ROLLBACK TRAN;

        SET @O_Numero = ERROR_NUMBER();
        SET @O_Msg = ERROR_MESSAGE();
    END CATCH;
END;
GO
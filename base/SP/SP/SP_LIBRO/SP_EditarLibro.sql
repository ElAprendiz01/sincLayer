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
    END

    -- Validar el titulo
    IF @Titulo IS NOT NULL AND LTRIM(RTRIM(@Titulo)) = ''
    BEGIN
        SET @O_Numero = -1;
        SET @O_Msg = 'El título no puede estar vacío.';
        RETURN;
    END

    --validar el isbn
    IF @ISBN IS NOT NULL AND (LEN(@ISBN) = 0 OR LEN(@ISBN) > 20)
    BEGIN
        SET @O_Numero = -1;
        SET @O_Msg = 'El ISBN es inválido.';
        RETURN;
    END

    IF @ISBN IS NOT NULL
        AND EXISTS (SELECT 1 FROM Tbl_Libros WHERE ISBN = @ISBN AND Id_Libro <> @Id_Libro)
    BEGIN
        SET @O_Numero = -1;
        SET @O_Msg = 'El ISBN ya existe en otro libro.';
        RETURN;
    END

    --validar la categoria
    IF @Id_Categoria IS NOT NULL
        AND NOT EXISTS (SELECT 1 FROM Cls_Catalogo WHERE Id_Catalogo = @Id_Categoria AND Activo = 1)
    BEGIN
        SET @O_Numero = -1;
        SET @O_Msg = 'La categoría no existe';
        RETURN;
    END

    -- Validacion de autor
    IF @Id_Autor IS NOT NULL
        AND NOT EXISTS (SELECT 1 FROM Tbl_Autores WHERE Id_Autor = @Id_Autor)
    BEGIN
        SET @O_Numero = -1;
        SET @O_Msg = 'El autor no existe.';
        RETURN;
    END

    -- Validar estado
    IF @Id_Estado IS NOT NULL
        AND NOT EXISTS (SELECT 1 FROM Cls_Estado WHERE Id_Estado = @Id_Estado AND Activo = 1)
    BEGIN
        SET @O_Numero = -1;
        SET @O_Msg = 'El estado no existe.';
        RETURN;
    END

    -- Validar el año de la publicacion
    IF @Año_Publicacion IS NOT NULL AND (@Año_Publicacion < 1400 OR @Año_Publicacion > YEAR(GETDATE()))
    BEGIN
        SET @O_Numero = -1;
        SET @O_Msg = 'El año de publicación es inválido.';
        RETURN;
    END

    -- Validar stock
    IF @Stock IS NOT NULL AND @Stock < 0
    BEGIN
        SET @O_Numero = -1;
        SET @O_Msg = 'El stock no puede ser negativo';
        RETURN;
    END

    -- Validar modificador
    IF @Id_Modificador IS NULL
    BEGIN
        SET @O_Numero = -1;
        SET @O_Msg = 'Especificar modificador';
        RETURN;
    END
    END
    GO

 
USE SYNCLAYER
GO 

CREATE OR ALTER PROCEDURE SpInsertarLibro
    @Titulo NVARCHAR(200),
    @ISBN NVARCHAR(20),
    @Id_Autor INT,
    @Id_Categoria INT,
    @Editorial NVARCHAR(100),
    @Año_Publicacion INT,
    @Stock INT,
    @Id_Creador INT,
    @Id_Estado INT,
    @O_Id_Libro INT OUTPUT,   -- agregado
    @O_Numero INT OUTPUT,
    @O_Msg VARCHAR(255) OUTPUT
AS
BEGIN
    SET NOCOUNT ON;

----------------


IF @Id_Autor IS NULL OR @Id_Autor = 0
    BEGIN
        SET @O_Numero = -1;
        SET @O_Msg = 'El Id autor es obligatorio.';
        RETURN;
    END;
    ---------------
    --para garantizar que el autor realmente exista en la tabla autores---

    IF NOT EXISTS (SELECT 1 FROM Tbl_Autores WHERE Id_Autor = @Id_Autor)
    BEGIN
        SET @O_Numero = -1;
        SET @O_Msg = 'El autor no existe.';
        RETURN;
    END;
    ------------
    --para evitar registros de libros asociados a autores que esten en estado eliminado, etc

    IF EXISTS (
		SELECT 1 
		FROM Tbl_Autores a
		INNER JOIN Cls_Estado e ON a.Id_Estado = e.Id_Estado
		WHERE a.Id_Autor = @Id_Autor 
		  AND e.Estado IN ('Eliminado', 'Desactivado', 'Inactivo', 'Suspendido')
	)
	BEGIN
		SET @O_Numero = -1;
		SET @O_Msg = 'No se puede registrar el libro porque el autor esta desactivado.';
		RETURN;
	END;
    --------

    --validar que el titulo del libro sea obligatorio
    IF @Titulo IS NULL OR LTRIM(RTRIM(@Titulo)) = ''
    BEGIN
        SET @O_Numero = -1;
        SET @O_Msg = 'El título del libro es obligatorio.';
        RETURN;
    END;

    --------
     IF @Id_Categoria IS NULL OR @Id_Categoria = 0
    BEGIN
        SET @O_Numero = -1;
        SET @O_Msg = 'La categoría es obligatoria.';
        RETURN;
    END;
    -----

     IF NOT EXISTS (SELECT 1 FROM Cls_Catalogo WHERE Id_Catalogo = @Id_Categoria)
    BEGIN
        SET @O_Numero = -1;
        SET @O_Msg = 'La categoría no existe.';
        RETURN;
    END;
    --------
    ---estado valido del libro 
    IF @Id_Estado IS NULL OR @Id_Estado = 0
    BEGIN
        SET @O_Numero = -1;
        SET @O_Msg = 'El id estado es obligatorio.';
        RETURN;
    END;
    -----
    IF NOT EXISTS (SELECT 1 FROM Cls_Estado WHERE Id_Estado = @Id_Estado)
    BEGIN
        SET @O_Numero = -1;
        SET @O_Msg = 'El estado no existe.';
        RETURN;
    END;


    -----estados no vigentes-----
    
    IF EXISTS (
        SELECT 1
        FROM Cls_Estado e
        WHERE e.Id_Estado = @Id_Estado
          AND e.Estado IN ('Eliminado', 'Desactivado', 'Inactivo', 'Suspendido')
    )
    BEGIN
        SET @O_Numero = -1;
        SET @O_Msg = 'No se puede registrar el libro: el estado no está vigente.';
        RETURN;
    END;

    BEGIN TRY
        BEGIN TRAN;

        INSERT INTO Tbl_Libros (
            Titulo,
            ISBN,
            Id_Autor,
            Id_Categoria,
            Editorial,
            Año_Publicacion,
            Stock,
            Id_Creador,
            Id_Estado
        )
        VALUES (
            @Titulo,
            @ISBN,
            @Id_Autor,
            @Id_Categoria,
            @Editorial,
            @Año_Publicacion,
            ISNULL(@Stock,0),
            @Id_Creador,
            @Id_Estado
        );

        SET @O_Id_Libro = SCOPE_IDENTITY();

        COMMIT TRAN;

        SET @O_Numero = 200;
        SET @O_Msg = 'El libro se ha insertado correctamente.';
    END TRY
    BEGIN CATCH
        IF @@TRANCOUNT > 0 ROLLBACK TRAN;

        SET @O_Numero = ERROR_NUMBER();
        SET @O_Msg = ERROR_MESSAGE();
    END CATCH;
END;
-----------
--validacion de stock que no sea negativo
IF @Stock < 0
BEGIN
    SET @O_Numero = -1;
    SET @O_Msg = 'El stock no puede ser negativo.';
    RETURN;
END;
GO

















	
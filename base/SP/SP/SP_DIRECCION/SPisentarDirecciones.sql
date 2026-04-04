USE SYNCLAYER;
GO 

CREATE OR ALTER PROCEDURE SpInsertarDireccion(
    @Ciudad NVARCHAR(20),
    @Barrio NVARCHAR(40),
    @Calle NVARCHAR(30),
    @Id_Creador INT,
    @Id_Persona INT,
    @O_Numero INT OUTPUT,
    @O_Msg VARCHAR(255) OUTPUT
)
AS 
BEGIN 
    SET NOCOUNT ON;
    
    -- Declaramos la variable interna ya que no viene como parámetro
    DECLARE @Id_Estado INT;

    -- 1. BUSQUEDA AUTOMÁTICA DEL ID_ESTADO "ACTIVO"
    SELECT TOP 1 @Id_Estado = Id_Estado 
    FROM Cls_Estado 
    WHERE (Estado LIKE 'Activo%' 
       OR Estado LIKE 'ACTIVO%' 
       OR Estado LIKE 'Activos%')
      AND Activo = 1;

    -- Validación: Si no se encuentra un estado activo en el catálogo
    IF @Id_Estado IS NULL
    BEGIN
        SET @O_Numero = -1;
        SET @O_Msg = 'Error: No existe un estado "Activo" habilitado en el catálogo.';
        RETURN;
    END

    -- 2. VALIDACIÓN: Persona obligatoria y existencia
    IF @Id_Persona IS NULL OR @Id_Persona = 0
    BEGIN
        SET @O_Numero = -1;
        SET @O_Msg = 'El id persona es obligatorio.';
        RETURN;
    END;

    IF NOT EXISTS (SELECT 1 FROM Tbl_Datos_Personales WHERE Id_Persona = @Id_Persona)
    BEGIN
        SET @O_Numero = -1;
        SET @O_Msg = 'La persona especificada no existe.';
        RETURN;
    END;

    -- 3. VALIDACIÓN DINÁMICA: No permitir si la persona está en estados restrictivos
    IF EXISTS (
        SELECT 1 
        FROM Tbl_Datos_Personales p
        INNER JOIN Cls_Estado e ON p.Id_Estado = e.Id_Estado
        WHERE p.Id_Persona = @Id_Persona 
          AND (e.Estado IN ('Eliminado', 'Desactivado', 'Inactivo', 'Suspendido') 
               OR e.Activo = 0) -- También validamos por el bit por si acaso
    )
    BEGIN
        SET @O_Numero = -1;
        SET @O_Msg = 'No se puede registrar dirección: la persona no está vigente o ha sido eliminada.';
        RETURN;
    END;

    -- 4. PROCESO DE INSERCIÓN
    BEGIN TRY 
        BEGIN TRAN; 

        INSERT INTO Tbl_direcciones ( 
            Ciudad,
            Barrio,
            Calle,
            Id_Creador,
            Id_Persona,
            Id_Estado,
            Fecha_Creacion -- Asumo que tienes este campo, si no, quítalo
        )
        VALUES (
            @Ciudad,
            @Barrio,
            @Calle,
            @Id_Creador,
            @Id_Persona,
            @Id_Estado,
            GETDATE()
        );

        COMMIT;
        SET @O_Numero = 200;
        SET @O_Msg = 'La dirección se ha insertado correctamente.';
    END TRY
    BEGIN CATCH 
        IF @@TRANCOUNT > 0 ROLLBACK;
        SET @O_Numero = ERROR_NUMBER();
        SET @O_Msg = ERROR_MESSAGE();
    END CATCH;
END;
GO



DECLARE @Num INT, @Msg VARCHAR(255);

EXEC SpInsertarDireccion 
    'Managua', 
    'LasJAguitas',
    'los toros',
    1,
    2,
    3,
    @Num OUTPUT,
    @Msg OUTPUT;

SELECT @Num AS Numero, @Msg AS Mensaje;


	


select * from Cls_Estado
use SYNCLAYER
go

CREATE OR ALTER PROC Sp_Filtrar_Acuerdos_Pago(
    @Id_Acuerdo INT = NULL,
    @Id_Multa INT = NULL
) AS
BEGIN 	
    SET NOCOUNT ON;
    BEGIN TRY
        -- Validación: Si no se envían parámetros, lanzamos error
        IF @Id_Acuerdo IS NULL or @Id_Multa IS NULL
            THROW 50001, 'Debe proporcionar un ID de Acuerdo o un ID de Multa para filtrar', 1;

        SELECT
            a.Id_Acuerdo AS 'Id',
            a.Id_Multa AS 'Id Multa',
            a.Monto_Total_Acordado AS 'Total Acordado',
            a.Cantidad_Cuotas AS 'Cuotas',
            a.Monto_Por_Cuota AS 'Monto Cuota',
            cat.Nombre AS 'Frecuencia',
            a.Fecha_Creacion AS 'Fecha Registro',
            e.Estado AS 'Estado'
        FROM Tbl_Acuerdos_Pago AS a
        INNER JOIN Cls_Catalogo AS cat ON a.Frecuencia_Pago = cat.Id_Catalogo
        INNER JOIN Cls_Estado AS e ON a.Id_Estado = e.Id_Estado
        WHERE 
            (@Id_Acuerdo IS NULL OR a.Id_Acuerdo = @Id_Acuerdo) or
            (@Id_Multa IS NULL OR a.Id_Multa = @Id_Multa) AND
            a.Id_Estado = 3
        ORDER BY a.Id_Acuerdo DESC;

    END TRY
    BEGIN CATCH
        ;THROW;
    END CATCH
END
GO
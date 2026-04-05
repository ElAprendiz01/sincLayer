use SYNCLAYER
go

CREATE OR ALTER PROC Sp_Filtrar_Acuerdos_Pago(
    @Id_Acuerdo INT = NULL,
    @Id_Multa INT = NULL
) AS
BEGIN 	
    SET NOCOUNT ON;
    BEGIN TRY
        -- VALIDACIÓN: Solo lanza error si AMBOS son nulos
        IF @Id_Acuerdo IS NULL AND @Id_Multa IS NULL
            THROW 50001, 'Debe proporcionar al menos un filtro (identificador de multa o de acuerdo)', 1;

        SELECT 
            A.Id_Acuerdo as Id_Acuerdo, 
            A.Id_Multa as Id_Multa,
            A.Monto_Total_Acordado as Monto_Total_Acordado, 
            A.Cantidad_Cuotas as Cantidad_Cuotas,
            A.Monto_Por_Cuota as Monto_Por_Cuota,
            A.Frecuencia_Pago as Frecuencia_Pago,
            C.Nombre as Frecuencia_Pago_Nombre,
            A.Fecha_Creacion as Fecha_Creacion,
            A.Fecha_Modificacion as Fecha_Modificacion,
            A.Id_Creador as Id_Creador,
            A.Id_Modificador as Id_Modificador,
            A.Id_Estado as Id_Estado,
            E.Estado as Estado
        FROM Tbl_Acuerdos_Pago A
        INNER JOIN Cls_Catalogo C ON A.Frecuencia_Pago = C.Id_Catalogo
        INNER JOIN Cls_Estado E ON A.Id_Estado = E.Id_Estado
        WHERE 
            (
                (@Id_Acuerdo IS NOT NULL AND A.Id_Acuerdo = @Id_Acuerdo) OR
                (@Id_Multa IS NOT NULL AND A.Id_Multa = @Id_Multa)
            )
            AND A.Id_Estado = 3
        ORDER BY A.Id_Acuerdo DESC;

    END TRY
    BEGIN CATCH
        ;THROW;
    END CATCH
END;
GO


exec Sp_Filtrar_Acuerdos_Pago @Id_Acuerdo = 2
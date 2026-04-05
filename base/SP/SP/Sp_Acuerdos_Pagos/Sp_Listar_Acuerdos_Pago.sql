use SYNCLAYER
go

CREATE OR ALTER PROCEDURE Sp_Acuerdos_Pago_Listar
AS
BEGIN
    SET NOCOUNT ON;
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
    WHERE A.Id_Estado = 3
END;
Go

Select * from Cls_Estado
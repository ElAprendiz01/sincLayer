BACKUP DATABASE [SYNCLAYER] 
TO DISK = 'C:\Users\Dell\OneDrive\Escritorio\syncLayer\Biblioteca\base\recuperacionbasedatos\Backup_Final.bak'
WITH 
    FORMAT,      -- Crea un nuevo conjunto de medios
    INIT,        -- Sobrescribe el archivo si ya existe
    COMPRESSION, -- Hace que el archivo sea mucho más pequeño
    STATS = 5,   -- Te avisa cada 5% de avance
    NAME = 'Respaldo_synclayer';


RESTORE VERIFYONLY 
FROM DISK = 'C:\Users\Dell\OneDrive\Escritorio\syncLayer\Biblioteca\base\recuperacionbasedatos\Backup_Final.bak';


---para actualizar el archviovo 

BACKUP DATABASE [SYNCLAYER] 
TO DISK = 'C:\Users\Dell\OneDrive\Escritorio\syncLayer\Biblioteca\base\recuperacionbasedatos\Backup_Final.bak'
WITH INIT, FORMAT, COMPRESSION, STATS = 10;
use BDM;

DELIMITER **
DROP FUNCTION IF EXISTS fn_validar_edad_usuario;
CREATE FUNCTION fn_validar_edad_usuario (fecha DATE)
RETURNS BOOLEAN
CONTAINS SQL
READS SQL DATA
NOT DETERMINISTIC
BEGIN
	DECLARE approve BOOLEAN DEFAULT TRUE;
    DECLARE edad INT;
	
    -- Calcular edad
    SET edad = TIMESTAMPDIFF(YEAR, fecha, CURDATE());
    
    -- Validar que no sea menor o igual de 12 años
    IF edad <= 12 THEN
		SET approve = FALSE;
    END IF;

	RETURN approve;
END **

DELIMITER ;

SELECT fn_validar_edad_usuario('2012-11-02'); -- 13 años, si pasa
SELECT fn_validar_edad_usuario('2012-11-03'); -- 12 años, no pasa

DELIMITER **
DROP FUNCTION IF EXISTS fn_correo_existente;
CREATE FUNCTION IF NOT EXISTS fn_correo_existente (email VARCHAR(255), id INT)
RETURNS BOOLEAN
CONTAINS SQL
READS SQL DATA
NOT DETERMINISTIC
BEGIN
	DECLARE approve BOOLEAN DEFAULT TRUE;
    
    -- Validar si no existe ya un usuario con ese correo
    IF EXISTS (SELECT 1 FROM Usuario WHERE Correo = email AND IdUsuario <> id) THEN
		SET approve = FALSE;
    END IF;
    
	RETURN approve;
END **

DELIMITER ;

SELECT fn_correo_existente('admin@gmail.com', 2);
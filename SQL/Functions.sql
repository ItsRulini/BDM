USE BDM;
use practica_6;


SELECT 
    ROUTINE_NAME, 
    ROUTINE_TYPE, 
    DEFINER,
    SECURITY_TYPE
FROM information_schema.ROUTINES 
WHERE ROUTINE_SCHEMA = 'BDM';

DELIMITER //
DROP FUNCTION IF EXISTS must_be_positive//
CREATE FUNCTION must_be_positive(x INT)
RETURNS INT
DETERMINISTIC
BEGIN
  IF x < 0 THEN
    SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'x must be non-negative';
  END IF;
  RETURN x;
END //
DELIMITER ;

select must_be_positive(-1);

DELIMITER **
CREATE 
DEFINER = 'root'@'localhost'
FUNCTION fn_myFunction()
RETURNS INT
COMMENT 'Returns an integer value'
LANGUAGE SQL
DETERMINISTIC
NO SQL
SQL SECURITY INVOKER
BEGIN
	RETURN 1;
END **

DELIMITER ;
-- Ejercicio
-- Crear una función que funcione de inicio de sesión 
-- NOTA: Se puede acceder ya sea con nombre de usuario o correo, más la contraseña

DELIMITER **
DROP FUNCTION IF EXISTS fn_login**
CREATE FUNCTION fn_Login(keyaccess VARCHAR(50), pass VARCHAR(50))
RETURNS BOOLEAN
NOT DETERMINISTIC
READS SQL DATA
BEGIN
	DECLARE validated BOOLEAN DEFAULT FALSE;
	
    IF (SELECT 1 FROM usuario WHERE (email = keyaccess or username = keyaccess) AND password = pass) THEN
		SET validated = TRUE;
    END IF;
    
    RETURN validated;
END**



SELECT 
m.IdMundial, 
m.Año, 
m.logo, 
m.Descripcion,
GROUP_CONCAT(p.Pais ORDER BY p.Pais SEPARATOR ', ') AS Sedes
FROM Sedes s
INNER JOIN Mundial m ON m.idMundial = s.idMundial
INNER JOIN Pais p ON p.idPais = s.sede
WHERE m.IdMundial = 1
GROUP BY m.IdMundial, m.año, m.descripcion, m.logo;
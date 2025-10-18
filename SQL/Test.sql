USE BDM;


DELIMITER ;
DELIMITER **
DROP PROCEDURE IF EXISTS sp_getInfoMundiales**
CREATE PROCEDURE sp_getMundiales()
BEGIN
	SELECT IdMundial, Año, logo, Descripcion
    FROM Mundial;
END**

DELIMITER ;
DELIMITER **
DROP PROCEDURE IF EXISTS sp_getMundiales**
CREATE PROCEDURE sp_getMundiales()
BEGIN
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
END**
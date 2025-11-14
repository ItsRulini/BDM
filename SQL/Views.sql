use BDM;

-- ALTER
CREATE VIEW vw_info_mundiales
AS
SELECT 
	m.IdMundial,
	m.Año,
	m.Descripcion,
	m.logo,
	m.img_mascota,
	m.nombre_mascota,
	m.campeon,
	m.subcampeon,
	m.tercer_puesto,
	m.cuarto_puesto,
	m.marcador,
	m.tiempo_extra,
	m.marcador_tiempo_extra,
	m.penalties,
	m.muerte_subita,
	m.marcador_final,
	m.balon_oro,
	m.balon_plata,
	m.balon_bronce,
	m.botin_oro,
	m.botin_plata,
	m.botin_bronce,
	m.guante_oro,
	m.max_goles,
    GROUP_CONCAT(p.IdPais SEPARATOR ', ') AS 'IDSedes',
    GROUP_CONCAT(p.Pais SEPARATOR ', ') AS 'Sedes'
FROM Mundial m
INNER JOIN Sedes s ON m.IdMundial = s.IdMundial
INNER JOIN Pais p ON s.Sede = p.IdPais
GROUP BY m.IdMundial;

-- ALTER
DROP VIEW vw_multimedia;
AS
SELECT
	mul.IdMultimedia,
	mul.Contenido
FROM Multimedia mul
LEFT JOIN Galeria_Mundial gm ON mul.IdMultimedia = gm.IdMultimedia
INNER JOIN Multimedia_Publicacion mp ON mul.IdMultimedia = mp.IdMultimedia;


SELECT * FROM vw_multimedia;



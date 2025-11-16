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

ALTER VIEW vw_posicionesMundial
AS
SELECT 
	m.IdMundial,
	pc.Pais AS campeon,
    psc.Pais AS subcampeon,
    ptp.Pais AS tercer_puesto,
    pcp.Pais AS cuarto_puesto
FROM Mundial m
LEFT JOIN Pais pc ON m.campeon = pc.idPais
LEFT JOIN Pais psc ON m.subcampeon = psc.idPais
LEFT JOIN Pais ptp ON m.tercer_puesto = ptp.idPais
LEFT JOIN Pais pcp ON m.cuarto_puesto = pcp.idPais;

-- views nuevas
-- 2. Vista para premios individuales (Balón de Oro, Plata, Bronce)
CREATE OR REPLACE VIEW vw_premios_balon AS
SELECT 
    m.IdMundial,
    m.Año,
    jo.Nombre as BalonOro,
    jo.Foto as oroImg,
    p.Pais as nacionalidadOro,
    jp.Nombre as BalonPlata,
    jp.Foto as plataImg,
    jb.Nombre as BalonBronce,
    jb.Foto as bronceImg
FROM Mundial m
LEFT JOIN Jugador jo ON m.balon_oro = jo.IdJugador
LEFT JOIN Jugador jp ON m.balon_plata = jp.IdJugador
LEFT JOIN Jugador jb ON m.balon_bronce = jb.IdJugador
INNER JOIN Pais p ON jo.Nacionalidad = p.IdPais;

-- 3. Vista para botines (Máximos goleadores)
CREATE OR REPLACE VIEW vw_premios_botin AS
SELECT 
    m.IdMundial,
    m.Año,
    jo.Nombre as BotinOro,
    jo.Foto as oroImg,
    p.Pais as nacionalidadOro,
    jp.Nombre as BotinPlata,
    jp.Foto as plataImg,
    jb.Nombre as BotinBronce,
    jb.Foto as bronceImg,
    m.max_goles as GolesMaximo
FROM Mundial m
LEFT JOIN Jugador jo ON m.botin_oro = jo.IdJugador
LEFT JOIN Jugador jp ON m.botin_plata = jp.IdJugador
LEFT JOIN Jugador jb ON m.botin_bronce = jb.IdJugador
INNER JOIN Pais p ON jo.Nacionalidad = p.IdPais;

-- 4. Vista para guantes de oro (Mejores porteros)
CREATE OR REPLACE VIEW vw_premios_guante AS
SELECT 
    m.IdMundial,
    m.Año,
    j.Nombre as GuanteOro,
    j.Foto as foto,
    p.Pais as nacionalidadOro
FROM Mundial m
LEFT JOIN Jugador j ON m.guante_oro = j.IdJugador
LEFT JOIN Pais p ON j.Nacionalidad = p.IdPais;

-- Vista de todos los premios individuales por mundial
CREATE OR REPLACE VIEW vw_premios
AS
SELECT
m.IdMundial, m.Año,
balon.BalonOro AS balon_oro, balon.oroImg AS balon_oro_foto, balon.nacionalidadOro AS balon_oro_pais,
balon.BalonPlata AS balon_plata, balon.plataImg AS balon_plata_foto,
balon.BalonBronce AS balon_bronce, balon.bronceImg AS balon_bronce_foto,
bota.BotinOro AS bota_oro, bota.oroImg AS bota_oro_foto, bota.nacionalidadOro AS bota_oro_pais,
bota.BotinPlata AS bota_plata, bota.plataImg AS bota_plata_foto,
bota.BotinBronce AS bota_bronce, bota.bronceImg AS bota_bronce_foto,
bota.GolesMaximo AS max_goles,
guante.GuanteOro AS guante_oro, guante.foto AS guante_oro_foto, guante.nacionalidadOro AS guante_oro_pais
FROM Mundial m
LEFT JOIN vw_premios_balon balon ON m.IdMundial = balon.IdMundial
LEFT JOIN vw_premios_botin bota ON m.IdMundial = bota.IdMundial
LEFT JOIN vw_premios_guante guante ON m.IdMundial = guante.IdMundial;

-- Vista de filtros
CREATE OR REPLACE VIEW vw_filtros
AS
SELECT 
	p.Pais,
    m.Año
FROM Pais p 
LEFT JOIN Sedes s ON p.IdPais = s.Sede
INNER JOIN Mundial m ON m.IdMundial = s.IdMundial
ORDER BY Año DESC;


CREATE OR REPLACE VIEW vw_info_pub
AS
SELECT 
	p.IdPublicacion,
	p.Contenido,
	p.FechaCreacion,
	p.FechaAprobacion,
	p.EstatusAprobacion,
	p.IdCreador,
	u.Nombre AS UsuarioNombre,
	u.ApellidoPaterno AS UsuarioApellido,
	p.IdMundial,
	m.Año AS MundialAño,
    v.Sedes
FROM Publicacion p
INNER JOIN Usuario u ON p.IdCreador = u.IdUsuario
INNER JOIN Mundial m ON p.IdMundial = m.IdMundial
INNER JOIN vw_info_mundiales v ON m.IdMundial = v.IdMundial;


-- OTRAS VISTAS QUE AÚN NO SE UTILIZAN -------------

-- 5. Vista de publicaciones con información completa
CREATE VIEW vw_publicaciones_completas AS
SELECT 
    p.IdPublicacion,
    p.Contenido,
    p.FechaCreacion,
    p.FechaAprobacion,
    p.EstatusAprobacion,
    u.Nombre as UsuarioNombre,
    u.ApellidoPaterno as UsuarioApellido,
    m.Año as MundialAño,
    GROUP_CONCAT(c.Nombre SEPARATOR ', ') as Categorias
FROM Publicacion p
INNER JOIN Usuario u ON p.IdCreador = u.IdUsuario
INNER JOIN Mundial m ON p.IdMundial = m.IdMundial
LEFT JOIN Publicacion_Categoria pc ON p.IdPublicacion = pc.IdPublicacion
LEFT JOIN Categoria c ON pc.IdCategoria = c.IdCategoria
GROUP BY p.IdPublicacion;

-- 6. Vista de estadísticas de publicaciones por usuario
CREATE VIEW vw_stats_usuario AS
SELECT 
    u.IdUsuario,
    u.Nombre,
    COUNT(DISTINCT p.IdPublicacion) as TotalPublicaciones,
    SUM(CASE WHEN p.EstatusAprobacion = 'Aprobada' THEN 1 ELSE 0 END) as Aprobadas,
    SUM(CASE WHEN p.EstatusAprobacion = 'Pendiente' THEN 1 ELSE 0 END) as Pendientes,
    SUM(CASE WHEN p.EstatusAprobacion = 'Rechazada' THEN 1 ELSE 0 END) as Rechazadas
FROM Usuario u
LEFT JOIN Publicacion p ON u.IdUsuario = p.IdCreador
GROUP BY u.IdUsuario;

-- 7. Vista de comentarios por publicación
CREATE VIEW vw_comentarios_publicacion AS
SELECT 
    c.IdComentario,
    c.Comentario,
    c.FechaComentario,
    u.Nombre as UsuarioNombre,
    u.ApellidoPaterno as UsuarioApellido,
    p.IdPublicacion
FROM Comentario c
INNER JOIN Usuario u ON c.IdUsuario = u.IdUsuario
INNER JOIN Publicacion p ON c.IdPublicacion = p.IdPublicacion
WHERE c.Estatus = 1;

-- 8. Vista de mundiales con conteo de publicaciones
CREATE VIEW vw_mundiales_stats AS
SELECT 
    m.IdMundial,
    m.Año,
    COUNT(p.IdPublicacion) as TotalPublicaciones,
    SUM(CASE WHEN p.EstatusAprobacion = 'Aprobada' THEN 1 ELSE 0 END) as Aprobadas
FROM Mundial m
LEFT JOIN Publicacion p ON m.IdMundial = p.IdMundial
GROUP BY m.IdMundial;






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
ALTER VIEW vw_premios_balon AS
SELECT 
    m.IdMundial,
    m.Año,
    jo.Nombre as BalonOro,
    jo.Foto as oroImg,
    jp.Nombre as BalonPlata,
    jp.Foto as plataImg,
    jb.Nombre as BalonBronce,
    jb.Foto as bronceImg
FROM Mundial m
LEFT JOIN Jugador jo ON m.balon_oro = jo.IdJugador
LEFT JOIN Jugador jp ON m.balon_plata = jp.IdJugador
LEFT JOIN Jugador jb ON m.balon_bronce = jb.IdJugador;

-- 3. Vista para botines (Máximos goleadores)
ALTER VIEW vw_premios_botin AS
SELECT 
    m.IdMundial,
    m.Año,
    jo.Nombre as BotinOro,
    jo.Foto as oroImg,
    jp.Nombre as BotinPlata,
    jp.Foto as plataImg,
    jb.Nombre as BotinBronce,
    jb.Foto as bronceImg,
    m.max_goles as GolesMaximo
FROM Mundial m
LEFT JOIN Jugador jo ON m.botin_oro = jo.IdJugador
LEFT JOIN Jugador jp ON m.botin_plata = jp.IdJugador
LEFT JOIN Jugador jb ON m.botin_bronce = jb.IdJugador;

-- 4. Vista para guantes de oro (Mejores porteros)
CREATE VIEW vw_premios_guante AS
SELECT 
    m.IdMundial,
    m.Año,
    j.Nombre as GuanteOro,
    j.Foto as foto,
    p.Pais as PaisPortero
FROM Mundial m
LEFT JOIN Jugador j ON m.guante_oro = j.IdJugador
LEFT JOIN Pais p ON j.Nacionalidad = p.IdPais;

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






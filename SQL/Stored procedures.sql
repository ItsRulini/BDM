USE BDM;


-- USUARIOS
DELIMITER **
DROP PROCEDURE IF EXISTS sp_crearUsuario**
CREATE PROCEDURE sp_crearUsuario (
    IN p_correo VARCHAR(255),
    IN p_pass VARCHAR(255),
    IN p_nombre VARCHAR(255),
    IN p_apellidoPaterno VARCHAR(255),
    IN p_apellidoMaterno VARCHAR(255),
    IN p_genero VARCHAR(50),
    IN p_nacionalidad INT,
    IN p_paisNacimiento INT,
    IN p_tipo VARCHAR(50),
    IN p_fotoPerfil LONGBLOB,
    IN p_fechaNacimiento DATE
)
BEGIN
    INSERT INTO Usuario (
        Correo, 
        Contraseña, 
        Nombre, 
        ApellidoPaterno, 
        ApellidoMaterno, 
        Genero, 
        Nacionalidad, 
        PaisNacimiento, 
        Tipo, 
        FotoPerfil, 
        FechaNacimiento
    ) VALUES (
        p_correo, 
        p_pass, 
        p_nombre, 
        p_apellidoPaterno, 
        p_apellidoMaterno, 
        p_genero,
        p_nacionalidad, 
        p_paisNacimiento, 
        p_tipo, 
        p_fotoPerfil, 
        p_fechaNacimiento
    );
END**
DELIMITER;

DELIMITER **
DROP PROCEDURE IF EXISTS sp_obtenerUsuarioPorCorreo**
CREATE PROCEDURE sp_obtenerUsuarioPorCorreo(
	IN p_correo VARCHAR(255)
)
BEGIN
    SELECT 
        u.IdUsuario,
        u.Correo,
        u.Contraseña,
        u.Nombre,
        u.ApellidoPaterno,
        u.ApellidoMaterno,
        u.Genero,
        n.Nacionalidad,
        p.Pais AS PaisNacimiento,
        u.Tipo,
        u.FotoPerfil,
        u.FechaNacimiento,
        u.PaisNacimiento AS IdPaisNacimiento,
        u.Nacionalidad AS IdNacionalidad
    FROM Usuario u
    INNER JOIN Pais p
    ON p.IdPais = u.PaisNacimiento
    INNER JOIN Pais n
    ON n.IdPais = u.Nacionalidad
    WHERE Correo = p_correo;
END**

DELIMITER ;

DELIMITER **
DROP PROCEDURE IF EXISTS sp_UsuariosRegistrados**
CREATE PROCEDURE sp_UsuariosRegistrados()
BEGIN
	SELECT COUNT(IdUsuario) AS usuarios_registrados
    FROM Usuario;
END**

-- PAISES
DELIMITER ;

DELIMITER **
DROP PROCEDURE IF EXISTS sp_obtenerPaises**
CREATE PROCEDURE sp_obtenerPaises ()
BEGIN
	SELECT IdPais, Pais, Nacionalidad FROM Pais
    ORDER BY Pais;
END**

DELIMITER ;

DELIMITER **
DROP PROCEDURE IF EXISTS sp_crearPais**
CREATE PROCEDURE sp_crearPais(
	IN p_pais VARCHAR(255),
    IN p_nacionalidad VARCHAR(255),
    OUT p_id INT
)
BEGIN
	INSERT INTO Pais (Pais, Nacionalidad)
    VALUES (p_pais, p_nacionalidad);
    
     SET p_id = LAST_INSERT_ID();
END**

-- MUNDIALES
DELIMITER ;

DELIMITER **
DROP PROCEDURE IF EXISTS sp_MundialesCreados**
CREATE PROCEDURE sp_MundialesCreados()
BEGIN
	SELECT COUNT(IdMundial) AS mundiales
    FROM Mundial;
END**



-- PUBLICACIONES
DELIMITER ;

DELIMITER **
DROP PROCEDURE IF EXISTS sp_PostsPendientes**
CREATE PROCEDURE sp_PostsPendientes()
BEGIN
	SELECT COUNT(IdPublicacion) AS posts_pendientes
    FROM Publicacion
    WHERE EstatusAprobacion = 'Pendiente';
END**

-- CATEGORIAS
DELIMITER ;
DELIMITER **
DROP PROCEDURE IF EXISTS sp_getCategorias**
CREATE PROCEDURE sp_getCategorias()
BEGIN
	SELECT 
		c.IdCategoria, 
        c.Nombre, 
		COUNT(pc.IdPublicacion) AS num_posts
    FROM Categoria c
    LEFT JOIN Publicacion_Categoria pc
    ON c.IdCategoria = pc.IdCategoria
    GROUP BY c.IdCategoria, c.Nombre;
END **

DELIMITER ;
DELIMITER **
DROP PROCEDURE IF EXISTS sp_crearCategoria**
CREATE PROCEDURE sp_crearCategoria(
	IN p_nombre VARCHAR(255),
    OUT p_id INT
)
BEGIN
	INSERT INTO Categoria (Nombre)
    VALUES (p_nombre);
    
    SET p_id = LAST_INSERT_ID();
END**

DELIMITER ;
DELIMITER **
DROP PROCEDURE IF EXISTS sp_updateCategoria**
CREATE PROCEDURE sp_updateCategoria(
	IN p_id INT,
	IN p_nombre VARCHAR(255)
)
BEGIN
	UPDATE Categoria
    SET Nombre = p_nombre
    WHERE IdCategoria = p_id;
END**

DELIMITER ;
	
-- actualizar perfil

DELIMITER $$
DROP PROCEDURE IF EXISTS sp_updateUsuario$$
CREATE PROCEDURE sp_updateUsuario(
    IN p_idUsuario INT,
    IN p_nombre VARCHAR(255),
    IN p_apellidoPaterno VARCHAR(255),
    IN p_apellidoMaterno VARCHAR(255),
    IN p_correo VARCHAR(255),
    IN p_genero ENUM('Masculino', 'Femenino', 'Otro'),
    IN p_fechaNacimiento DATE,
    IN p_nacionalidad INT,
    IN p_paisNacimiento INT,
    IN p_fotoPerfil LONGBLOB
)
BEGIN
    UPDATE Usuario
    SET
        Nombre = COALESCE(NULLIF(p_nombre, ''), Nombre),
        ApellidoPaterno = COALESCE(NULLIF(p_apellidoPaterno, ''), ApellidoPaterno),
        ApellidoMaterno = COALESCE(NULLIF(p_apellidoMaterno, ''), ApellidoMaterno),
        Correo = COALESCE(NULLIF(p_correo, ''), Correo),
        Genero = COALESCE(NULLIF(p_genero, ''), Genero),
        FechaNacimiento = COALESCE(p_fechaNacimiento, FechaNacimiento),
        Nacionalidad = COALESCE(NULLIF(p_nacionalidad, 0), Nacionalidad),
        PaisNacimiento = COALESCE(NULLIF(p_paisNacimiento, 0), PaisNacimiento),
        FotoPerfil = IF(p_fotoPerfil IS NULL, FotoPerfil, p_fotoPerfil)
    WHERE IdUsuario = p_idUsuario;
END$$
DELIMITER ;

-- actualizar contra del perfil

DELIMITER $$

-- Crear el nuevo procedimiento
DROP PROCEDURE IF EXISTS sp_updateContrasena$$
CREATE PROCEDURE sp_updateContrasena(
    IN p_idUsuario INT,
    IN p_nuevaContrasena VARCHAR(255)
)
BEGIN
    UPDATE Usuario
    SET Contraseña = p_nuevaContrasena
    WHERE IdUsuario = p_idUsuario;
END$$

DELIMITER ;

-- jugador


DELIMITER $$
DROP PROCEDURE IF EXISTS sp_crearJugador$$
CREATE PROCEDURE sp_crearJugador(
    IN p_nombre VARCHAR(255),
    IN p_nacionalidad INT,
    IN p_fechaNacimiento DATE,
    IN p_foto LONGBLOB,
    OUT p_idJugador INT
)
BEGIN
    INSERT INTO Jugador (
        Nombre, 
        Nacionalidad, 
        FechaNacimiento, 
        Foto
    ) VALUES (
        p_nombre, 
        p_nacionalidad, 
        p_fechaNacimiento, 
        p_foto
    );
    
    -- Obtenemos el ID del registro que acabamos de insertar
    -- y lo asignamos al parámetro de salida.
    SET p_idJugador = LAST_INSERT_ID();
END$$
DELIMITER ;


-- get Jugadores

DELIMITER $$
DROP PROCEDURE IF EXISTS sp_getJugadores$$
CREATE PROCEDURE sp_getJugadores()
BEGIN
    SELECT 
        j.IdJugador, 
        j.Nombre, 
        j.Foto,
        j.Nacionalidad AS IdNacionalidad, -- Devolvemos el ID
        p.Pais AS NombrePais,             -- y también el nombre del país
        p.Nacionalidad AS NombreNacionalidad, -- y el nombre de la nacionalidad
        j.FechaNacimiento
    FROM Jugador j
    INNER JOIN Pais p ON j.Nacionalidad = p.IdPais
    ORDER BY j.Nombre ASC;
END$$
DELIMITER ;


-- crear mundial y sedes

DELIMITER $$
DROP PROCEDURE IF EXISTS sp_crearMundial$$
CREATE PROCEDURE sp_crearMundial(
    IN p_año YEAR,
    IN p_descripcion TEXT,
    IN p_logo LONGBLOB,
    IN p_imgMascota LONGBLOB,
    IN p_nombreMascota VARCHAR(100),
    IN p_campeon INT,
    IN p_subcampeon INT,
    IN p_tercerPuesto INT,
    IN p_cuartoPuesto INT,
    IN p_marcador VARCHAR(10),
    IN p_tiempoExtra BOOLEAN,
    IN p_marcadorTiempoExtra VARCHAR(10),
    IN p_penalties BOOLEAN,
    IN p_muerteSubita BOOLEAN,
    IN p_marcadorFinal VARCHAR(20),
    IN p_balonOro INT,
    IN p_balonPlata INT,
    IN p_balonBronce INT,
    IN p_botinOro INT,
    IN p_botinPlata INT,
    IN p_botinBronce INT,
    IN p_guanteOro INT,
    IN p_maxGoles INT,
    OUT p_idMundial INT
)
BEGIN
    INSERT INTO Mundial (
        Año, Descripcion, logo, img_mascota, nombre_mascota,
        campeon, subcampeon, tercer_puesto, cuarto_puesto,
        marcador, tiempo_extra, marcador_tiempo_extra,
        penalties, muerte_subita, marcador_final,
        balon_oro, balon_plata, balon_bronce,
        botin_oro, botin_plata, botin_bronce,
        guante_oro, max_goles
    ) VALUES (
        p_año, p_descripcion, p_logo, p_imgMascota, p_nombreMascota,
        p_campeon, p_subcampeon, p_tercerPuesto, p_cuartoPuesto,
        p_marcador, p_tiempoExtra, p_marcadorTiempoExtra,
        p_penalties, p_muerteSubita, p_marcadorFinal,
        p_balonOro, p_balonPlata, p_balonBronce,
        p_botinOro, p_botinPlata, p_botinBronce,
        p_guanteOro, p_maxGoles
    );
    
    SET p_idMundial = LAST_INSERT_ID();
END$$
DELIMITER ;


-- sedes
DELIMITER $$
DROP PROCEDURE IF EXISTS sp_agregarSede$$
CREATE PROCEDURE sp_agregarSede(
    IN p_idMundial INT,
    IN p_idPais INT
)
BEGIN
    INSERT INTO Sedes (IdMundial, Sede)
    VALUES (p_idMundial, p_idPais);
END$$
DELIMITER ;

DELIMITER $$
DROP PROCEDURE IF EXISTS sp_insertMultimedia$$
CREATE PROCEDURE sp_insertMultimedia( 
	IN p_contenido LONGBLOB,
	OUT p_id INT 
)
BEGIN
	INSERT INTO Multimedia (Contenido)
    VALUES (p_contenido);
    
    SET p_id = LAST_INSERT_ID();
END $$

DELIMITER ;

-- Insertar la multimedia
DELIMITER $$
DROP PROCEDURE IF EXISTS sp_insertMultimediaMundial$$
CREATE PROCEDURE sp_insertMultimediaMundial( 
	IN p_multimedia LONGBLOB,
	IN p_id_mundial INT,
    OUT p_id_multimedia INT
)
BEGIN
	CALL sp_insertMultimedia(p_multimedia, p_id_multimedia);
	
	INSERT INTO Galeria_Mundial (IdMundial, IdMultimedia)
    VALUES (p_id_mundial, p_id_multimedia);
END $$
DELIMITER ;

DELIMITER $$
DROP PROCEDURE IF EXISTS sp_updateMundial$$
CREATE PROCEDURE sp_updateMundial(
    IN p_idMundial INT,
    IN p_año YEAR,
    IN p_descripcion TEXT,
    IN p_logo LONGBLOB,
    IN p_imgMascota LONGBLOB,
    IN p_nombreMascota VARCHAR(100),
    IN p_campeon INT,
    IN p_subcampeon INT,
    IN p_tercerPuesto INT,
    IN p_cuartoPuesto INT,
    IN p_marcador VARCHAR(10),
    IN p_tiempoExtra BOOLEAN,
    IN p_marcadorTiempoExtra VARCHAR(10),
    IN p_penalties BOOLEAN,
    IN p_muerteSubita BOOLEAN,
    IN p_marcadorFinal VARCHAR(20),
    IN p_balonOro INT,
    IN p_balonPlata INT,
    IN p_balonBronce INT,
    IN p_botinOro INT,
    IN p_botinPlata INT,
    IN p_botinBronce INT,
    IN p_guanteOro INT,
    IN p_maxGoles INT
)
BEGIN
    UPDATE Mundial
    SET
        Año = p_año,
        Descripcion = p_descripcion,
        logo = p_logo,
        img_mascota = p_imgMascota,
        nombre_mascota = p_nombreMascota,
        campeon = p_campeon,
        subcampeon = p_subcampeon,
        tercer_puesto = p_tercerPuesto,
        cuarto_puesto = p_cuartoPuesto,
        marcador = p_marcador,
        tiempo_extra = p_tiempoExtra,
        marcador_tiempo_extra = p_marcadorTiempoExtra,
        penalties = p_penalties,
        muerte_subita = p_muerteSubita,
        marcador_final = p_marcadorFinal,
        balon_oro = p_balonOro,
        balon_plata = p_balonPlata,
        balon_bronce = p_balonBronce,
        botin_oro = p_botinOro,
        botin_plata = p_botinPlata,
        botin_bronce = p_botinBronce,
        guante_oro = p_guanteOro,
        max_goles = p_maxGoles
    WHERE IdMundial = p_idMundial;
END$$

DELIMITER ;

DELIMITER $$
DROP PROCEDURE IF EXISTS sp_replaceSedes$$
CREATE PROCEDURE sp_replaceSedes(IN p_idMundial INT)
BEGIN
    DELETE FROM Sedes WHERE IdMundial = p_idMundial;
END$$
DELIMITER ;

DELIMITER $$
DROP PROCEDURE IF EXISTS sp_replaceGaleria$$
CREATE PROCEDURE sp_replaceGaleria(IN p_idMundial INT)
BEGIN
    DELETE FROM Galeria_Mundial WHERE IdMundial = p_idMundial;
END$$
DELIMITER ;

-- Get multimedia de mundiales
DELIMITER $$
DROP PROCEDURE IF EXISTS sp_getGaleriaMundial$$
CREATE PROCEDURE sp_getGaleriaMundial(IN p_id_mundial INT)
BEGIN
	SELECT
		m.IdMultimedia as id,
		m.Contenido as contenido
	FROM Galeria_Mundial gm
	INNER JOIN Multimedia m ON gm.IdMultimedia = m.IdMultimedia
	WHERE gm.IdMundial = p_id_mundial
	ORDER BY m.IdMultimedia ASC;
END$$
DELIMITER ;

-- get mundial por id
DELIMITER $$
DROP PROCEDURE IF EXISTS sp_getMundial$$
CREATE PROCEDURE sp_getMundial(IN p_id_mundial INT)
BEGIN
	SELECT 
        IdMundial,
        Año,
        Descripcion,
        logo,
        img_mascota,
        nombre_mascota,
        campeon,
        subcampeon,
        tercer_puesto,
        cuarto_puesto,
        marcador,
        tiempo_extra,
        marcador_tiempo_extra,
        penalties,
        muerte_subita,
        marcador_final,
        balon_oro,
        balon_plata,
        balon_bronce,
        botin_oro,
        botin_plata,
        botin_bronce,
        guante_oro,
        max_goles
    FROM vw_info_mundiales
    WHERE IdMundial = p_id_mundial;
END $$

-- get mundiales
DELIMITER $$
DROP PROCEDURE IF EXISTS sp_getMundiales$$
CREATE PROCEDURE sp_getMundiales()
BEGIN
    SELECT 
        IdMundial,
        Año,
        Descripcion,
        logo,
        img_mascota,
        nombre_mascota,
        campeon,
        subcampeon,
        tercer_puesto,
        cuarto_puesto,
        marcador,
        tiempo_extra,
        marcador_tiempo_extra,
        penalties,
        muerte_subita,
        marcador_final,
        balon_oro,
        balon_plata,
        balon_bronce,
        botin_oro,
        botin_plata,
        botin_bronce,
        guante_oro,
        max_goles
    FROM vw_info_mundiales
    ORDER BY Año DESC;
END$$
DELIMITER ;

-- get sedes de mundial
DELIMITER **
DROP PROCEDURE IF EXISTS sp_getSedes**
CREATE PROCEDURE sp_getSedes ( IN p_IdMundial INT) 
BEGIN
	SELECT 
		IDSedes,
        Sedes
	FROM vw_info_mundiales
	WHERE IdMundial = p_IdMundial;
END**
DELIMITER ;

DELIMITER **
DROP PROCEDURE IF EXISTS sp_getPosicionesMundial**
CREATE PROCEDURE sp_getPosicionesMundial ( IN p_id_mundial INT )
BEGIN
	SELECT 
    IdMundial, campeon, subcampeon, tercer_puesto, cuarto_puesto
    FROM vw_posicionesMundial
    WHERE IdMundial = p_id_mundial;
END**
DELIMITER ;

DELIMITER **
DROP PROCEDURE IF EXISTS sp_getPremiosMundial**
CREATE PROCEDURE sp_getPremiosMundial ( IN p_id_mundial INT )
BEGIN
	SELECT
		IdMundial,
		balon_oro,
		balon_oro_foto,
		balon_plata,
		balon_plata_foto,
		balon_bronce,
		balon_bronce_foto,
		bota_oro,
		bota_oro_foto,
		bota_plata,
		bota_plata_foto,
		bota_bronce,
		bota_bronce_foto,
		max_goles,
		guante_oro,
		guante_oro_foto
	FROM vw_premios
    WHERE IdMundial = p_id_mundial;
END**
DELIMITER ;
-- DROP PROCEDURE sp_getAllPremiosMundial;
DELIMITER **
DROP PROCEDURE IF EXISTS sp_getPremiosOroMundial**
CREATE PROCEDURE sp_getPremiosOroMundial ()
BEGIN
	SELECT
		IdMundial,
        Año,
		balon_oro,
		balon_oro_foto,
        balon_oro_pais,
		bota_oro,
		bota_oro_foto,
        bota_oro_pais,
		max_goles,
		guante_oro,
		guante_oro_foto,
        guante_oro_pais
	FROM vw_premios
    ORDER BY Año DESC;
END**
DELIMITER ;
-- ==========================================
-- PROCEDIMIENTOS PARA PUBLICACIONES
-- ==========================================

-- Crear publicación
DELIMITER $$
DROP PROCEDURE IF EXISTS sp_crearPublicacion$$
CREATE PROCEDURE sp_crearPublicacion(
    IN p_contenido TEXT,
    IN p_idCreador INT,
    IN p_idMundial INT,
    OUT p_idPublicacion INT
)
BEGIN
    INSERT INTO Publicacion (
        Contenido,
        IdCreador,
        IdMundial,
        EstatusAprobacion
    ) VALUES (
        p_contenido,
        p_idCreador,
        p_idMundial,
        'Pendiente'
    );
    
    SET p_idPublicacion = LAST_INSERT_ID();
END$$
DELIMITER ;

-- Obtener publicaciones del usuario
DELIMITER $$
DROP PROCEDURE IF EXISTS sp_getPublicacionesPorUsuario$$
CREATE PROCEDURE sp_getPublicacionesPorUsuario(
    IN p_idUsuario INT
)
BEGIN
    SELECT 
        p.IdPublicacion,
        p.Contenido,
        p.FechaCreacion,
        p.FechaAprobacion,
        p.EstatusAprobacion,
        p.IdCreador,
        p.IdMundial,
        m.Año AS MundialAño,
        vw.Sedes
    FROM Publicacion p
    INNER JOIN Mundial m ON p.IdMundial = m.IdMundial
    INNER JOIN vw_info_mundiales vw ON vw.IdMundial = m.IdMundial
    WHERE p.IdCreador = p_idUsuario
    ORDER BY p.FechaCreacion DESC;
END$$
DELIMITER ;

-- Obtener todas las publicaciones (para admin)
DELIMITER $$
DROP PROCEDURE IF EXISTS sp_getTodasPublicaciones$$
CREATE PROCEDURE sp_getTodasPublicaciones()
BEGIN
    SELECT 
        IdPublicacion,
        Contenido,
        FechaCreacion,
        FechaAprobacion,
        EstatusAprobacion,
        IdCreador,
        UsuarioNombre,
        UsuarioApellido,
        IdMundial,
        MundialAño,
        Sedes
    FROM vw_info_pub
    ORDER BY FechaCreacion DESC;
END$$
DELIMITER ;

-- Aprobar publicación
DELIMITER $$
DROP PROCEDURE IF EXISTS sp_aprobarPublicacion$$
CREATE PROCEDURE sp_aprobarPublicacion(
    IN p_idPublicacion INT
)
BEGIN
    UPDATE Publicacion
    SET 
        EstatusAprobacion = 'Aprobado',
        FechaAprobacion = NOW()
    WHERE IdPublicacion = p_idPublicacion;
END$$
DELIMITER ;

-- Rechazar publicación
DELIMITER $$
DROP PROCEDURE IF EXISTS sp_rechazarPublicacion$$
CREATE PROCEDURE sp_rechazarPublicacion(
    IN p_idPublicacion INT
)
BEGIN
    UPDATE Publicacion
    SET 
        EstatusAprobacion = 'Rechazado',
        FechaAprobacion = NOW()
    WHERE IdPublicacion = p_idPublicacion;
END$$
DELIMITER ;

-- Asociar categorías a publicación
DELIMITER $$
DROP PROCEDURE IF EXISTS sp_asociarCategoriaPublicacion$$
CREATE PROCEDURE sp_asociarCategoriaPublicacion(
    IN p_idPublicacion INT,
    IN p_idCategoria INT
)
BEGIN
    INSERT INTO Publicacion_Categoria (IdPublicacion, IdCategoria)
    VALUES (p_idPublicacion, p_idCategoria);
END$$
DELIMITER ;

-- Obtener categorías de una publicación
DELIMITER $$
DROP PROCEDURE IF EXISTS sp_getCategoriasPublicacion$$
CREATE PROCEDURE sp_getCategoriasPublicacion(
    IN p_idPublicacion INT
)
BEGIN
    SELECT 
        c.IdCategoria,
        c.Nombre
    FROM Categoria c
    INNER JOIN Publicacion_Categoria pc ON c.IdCategoria = pc.IdCategoria
    WHERE pc.IdPublicacion = p_idPublicacion;
END$$
DELIMITER ;

-- Guardar multimedia de publicación
DELIMITER $$
DROP PROCEDURE IF EXISTS sp_guardarMultimediaPublicacion$$
CREATE PROCEDURE sp_guardarMultimediaPublicacion(
    IN p_contenido LONGBLOB,
    IN p_idPublicacion INT,
    OUT p_idMultimedia INT
)
BEGIN
    CALL sp_insertMultimedia (p_contenido, p_idMultimedia);
    
    INSERT INTO Multimedia_Publicacion (IdMultimedia, IdPublicacion)
    VALUES (p_idMultimedia, p_idPublicacion);
END$$
DELIMITER ;

DELIMITER $$
DROP PROCEDURE IF EXISTS sp_filtros_sedes$$
CREATE PROCEDURE sp_filtros_sedes()
BEGIN
	SELECT DISTINCT Pais FROM vw_filtros
    ORDER BY Pais;
END $$
DELIMITER ;

DELIMITER $$
DROP PROCEDURE IF EXISTS sp_filtros_años$$
CREATE PROCEDURE sp_filtros_años()
BEGIN
	SELECT DISTINCT Año FROM vw_filtros
    ORDER BY Año DESC;
END $$
DELIMITER ;

DELIMITER $$
DROP PROCEDURE IF EXISTS sp_filtros_categorias$$
CREATE PROCEDURE sp_filtros_categorias()
BEGIN
	SELECT DISTINCT c.IdCategoria, c.Nombre FROM Categoria c
	JOIN Publicacion_Categoria pc ON c.IdCategoria = pc.IdCategoria
    ORDER BY c.Nombre;
END $$
DELIMITER ;

DELIMITER $$
DROP PROCEDURE IF EXISTS sp_cantidad_vistas_pub$$
CREATE PROCEDURE sp_cantidad_vistas_pub( IN p_id_pub INT)
BEGIN
	SELECT COUNT(*) AS cnt 
    FROM Vista WHERE IdPublicacion = p_id_pub;
END$$

DELIMITER ;

DELIMITER $$
DROP PROCEDURE IF EXISTS sp_insert_vista$$
CREATE PROCEDURE sp_insert_vista( 
	IN p_id_usuario INT,
    IN p_id_pub INT
)
BEGIN
	INSERT INTO Vista (IdUsuario, IdPublicacion) 
    VALUES (p_id_usuario, p_id_pub);
END$$

DELIMITER ;

DELIMITER $$
DROP PROCEDURE IF EXISTS sp_cantidad_likes_pub$$
CREATE PROCEDURE sp_cantidad_likes_pub( IN p_id_pub INT )
BEGIN
	SELECT COUNT(*) as cnt 
    FROM Reaccion WHERE IdPublicacion = p_id_pub;
END$$
DELIMITER ;


DELIMITER $$
DROP PROCEDURE IF EXISTS sp_usuarios_likearon_pub$$
CREATE PROCEDURE sp_usuarios_likearon_pub( IN p_id_pub INT )
BEGIN
	SELECT u.IdUsuario, u.Nombre, 
    u.ApellidoPaterno, u.FotoPerfil, 
    r.IdReaccion, r.FechaReaccion
	FROM Reaccion r
	JOIN Usuario u ON r.IdUsuario = u.IdUsuario
	WHERE r.IdPublicacion = p_id_pub
	ORDER BY r.IdReaccion DESC;
END$$
DELIMITER ;

DELIMITER $$
DROP PROCEDURE IF EXISTS sp_usuario_likeo$$
CREATE PROCEDURE sp_usuario_likeo( 
	IN p_id_usuario INT,
    IN p_id_pub INT
)
BEGIN
	SELECT COUNT(*) as cnt FROM Reaccion 
    WHERE IdPublicacion = p_id_pub AND IdUsuario = p_id_usuario;
END$$
DELIMITER ;

DELIMITER $$
DROP PROCEDURE IF EXISTS sp_add_like$$
CREATE PROCEDURE sp_add_like( 
	IN p_id_usuario INT,
    IN p_id_pub INT
)
BEGIN
	INSERT INTO Reaccion (IdUsuario, IdPublicacion) 
    VALUES (p_id_usuario, p_id_pub);
END$$
DELIMITER ;

DELIMITER $$
DROP PROCEDURE IF EXISTS sp_remove_like$$
CREATE PROCEDURE sp_remove_like( 
	IN p_id_usuario INT,
    IN p_id_pub INT
)
BEGIN
	DELETE FROM Reaccion 
    WHERE IdPublicacion = p_id_pub AND IdUsuario = p_id_usuario;
END$$
DELIMITER ;

DELIMITER $$
DROP PROCEDURE IF EXISTS sp_cantidad_comentarios_pub$$
CREATE PROCEDURE sp_cantidad_comentarios_pub( IN p_id_pub INT )
BEGIN
	SELECT COUNT(*) as cnt FROM Comentario 
    WHERE IdPublicacion = p_id_pub AND Estatus = 1;
END$$
DELIMITER ;

DELIMITER $$
DROP PROCEDURE IF EXISTS sp_comentarios_recientes_pub$$
CREATE PROCEDURE sp_comentarios_recientes_pub(
    IN p_id_pub INT
)
BEGIN
    SELECT 
        c.IdComentario,
        c.Comentario,
        c.FechaComentario,
        u.IdUsuario,
        u.Nombre,
        u.ApellidoPaterno,
        u.FotoPerfil
    FROM Comentario c
    JOIN Usuario u ON c.IdUsuario = u.IdUsuario
    WHERE c.IdPublicacion = p_id_pub
      AND c.Estatus = 1
    ORDER BY c.FechaComentario DESC;
END$$
DELIMITER ;

DELIMITER $$
DROP PROCEDURE IF EXISTS sp_add_comment$$
CREATE PROCEDURE sp_add_comment(
    IN p_id_pub INT,
    IN p_id_user INT,
    IN p_text TEXT
)
BEGIN
    -- Insertar comentario
    INSERT INTO Comentario (Comentario, IdUsuario, IdPublicacion)
    VALUES (p_text, p_id_user, p_id_pub);

    -- Devolver el registro insertado
    SELECT 
        c.IdComentario,
        c.Comentario,
        c.FechaComentario,
        u.IdUsuario,
        u.Nombre,
        u.ApellidoPaterno,
        u.FotoPerfil
    FROM Comentario c
    JOIN Usuario u ON c.IdUsuario = u.IdUsuario
    WHERE c.IdComentario = LAST_INSERT_ID();
END$$
DELIMITER ;

DELIMITER $$
DROP PROCEDURE IF EXISTS sp_eliminar_comentario$$
CREATE PROCEDURE sp_eliminar_comentario(
    IN p_id_comentario INT
)
BEGIN
    UPDATE Comentario
    SET Estatus = 0
    WHERE IdComentario = p_id_comentario;
END$$
DELIMITER ;

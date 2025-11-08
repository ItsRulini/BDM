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
DROP PROCEDURE IF EXISTS sp_updateUsuario;
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
    IN p_año INT,
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
    FROM Mundial
    ORDER BY Año DESC;
END$$
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
        m.Año AS MundialAño
    FROM Publicacion p
    INNER JOIN Mundial m ON p.IdMundial = m.IdMundial
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
        p.IdPublicacion,
        p.Contenido,
        p.FechaCreacion,
        p.FechaAprobacion,
        p.EstatusAprobacion,
        p.IdCreador,
        u.Nombre AS UsuarioNombre,
        u.ApellidoPaterno AS UsuarioApellido,
        p.IdMundial,
        m.Año AS MundialAño
    FROM Publicacion p
    INNER JOIN Usuario u ON p.IdCreador = u.IdUsuario
    INNER JOIN Mundial m ON p.IdMundial = m.IdMundial
    ORDER BY p.FechaCreacion DESC;
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
    INSERT INTO Multimedia (Contenido)
    VALUES (p_contenido);
    
    SET p_idMultimedia = LAST_INSERT_ID();
    
    INSERT INTO Multimedia_Publicacion (IdMultimedia, IdPublicacion)
    VALUES (p_idMultimedia, p_idPublicacion);
END$$
DELIMITER ;
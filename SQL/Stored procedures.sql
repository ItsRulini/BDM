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
    IN p_fotoPerfil BLOB,
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
	



USE BDM;


DELIMITER **
CREATE PROCEDURE sp_crearUsuario (
    IN p_correo VARCHAR(255),
    IN p_pass VARCHAR(255),
    IN p_nombre VARCHAR(255),
    IN p_apellidoPaterno VARCHAR(255),
    IN p_apellidoMaterno VARCHAR(255),
    IN p_genero VARCHAR(50),
    IN p_generoEspecifico VARCHAR(50),
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
        GeneroEspecifico, 
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
        p_generoEspecifico, 
        p_nacionalidad, 
        p_paisNacimiento, 
        p_tipo, 
        p_fotoPerfil, 
        p_fechaNacimiento
    );
END**



DELIMITER **
CREATE PROCEDURE sp_login (
	IN correo VARCHAR(255),
    IN pass VARCHAR(255)
)
BEGIN
	
    
    
END**

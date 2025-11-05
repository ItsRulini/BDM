use BDM;

-- Usuarios
DELIMITER **
DROP TRIGGER IF EXISTS tg_validar_nuevo_usuario;
CREATE TRIGGER tg_validar_nuevo_usuario
BEFORE INSERT
ON Usuario
FOR EACH ROW
BEGIN
	DECLARE edad_valida BOOLEAN;
    DECLARE correo_valido BOOLEAN;
    
	-- 1. Validar edad
    -- 12 años o menos, no pasa
    SELECT fn_validar_edad_usuario(NEW.FechaNacimiento) INTO edad_valida;
    
    IF NOT edad_valida THEN
		SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'La edad del usuario debe de ser mayor a 12 años';
    END IF;
    
    -- 2. Validar correo electrónico existente
    -- Correo existente, no pasa
    SELECT fn_correo_existente(NEW.Correo, 0) INTO correo_valido;
    
    IF NOT correo_valido THEN
		SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'Este correo ya está en uso';
    END IF;
    
    -- Ahora si insertamos
END **

DELIMITER ;

DELIMITER **
DROP TRIGGER IF EXISTS tg_validar_update_usuario;
CREATE TRIGGER tg_validar_update_usuario
BEFORE UPDATE
ON Usuario
FOR EACH ROW
BEGIN
	DECLARE edad_valida BOOLEAN;
    DECLARE correo_valido BOOLEAN;
    
	-- 1. Validar edad
    -- 12 años o menos, no pasa
    SELECT fn_validar_edad_usuario(NEW.FechaNacimiento) INTO edad_valida;
    
    IF NOT edad_valida THEN
		SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'La edad del usuario debe de ser mayor a 12 años';
    END IF;
    
    -- 2. Validar correo electrónico existente
    -- Correo existente, no pasa
    SELECT fn_correo_existente(NEW.Correo, NEW.IdUsuario) INTO correo_valido;
    
    IF NOT correo_valido THEN
		SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'Este correo ya está en uso';
    END IF;
    
	-- Ahora si actualizamos
END **

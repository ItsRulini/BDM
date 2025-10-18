USE BDM;

SELECT * FROM Usuario ORDER BY Tipo DESC;-- LIMIT 1 OFFSET 0;



SELECT * FROM Categoria;
-- UPDATE Categoria SET Nombre = 'Jugadas polémicas' WHERE IdCategoria = 2;

SELECT * FROM Mundial;

SELECT * FROM Publicacion;

SELECT * FROM Pais;

call sp_obtenerUsuarioPorCorreo('wow@gmail.com');

CALL sp_crearUsuario(
    'admin@email.com',         -- p_correo
    'Admin123.',            -- p_pass
    'Juan',                    -- p_nombre
    'Perez',                   -- p_apellidoPaterno
    'López',                   -- p_apellidoMaterno
    'Otro',               -- p_genero
    3,                         -- p_nacionalidad
    3,                         -- p_paisNacimiento
    'Administrador',                 -- p_tipo
    NULL,                      -- p_fotoPerfil (NULL para pruebas)
    '1990-01-01'               -- p_fechaNacimiento
);

update Pais set Pais = 'México' where IdPais = 1;

insert into Pais (Pais, Nacionalidad) values ('México', 'Mexicana');
insert into Pais (Pais, Nacionalidad) values ('Estados Unidos', 'Estadounidense');
insert into Pais (Pais, Nacionalidad) values ('Canadá', 'Canadiense');



INSERT INTO Pais (Pais, Nacionalidad) VALUES
-- UEFA (Europa)
('Alemania', 'Alemana'),
('Austria', 'Austriaca'),
('Bélgica', 'Belga'),
('Bosnia y Herzegovina', 'Bosnia'),
('Bulgaria', 'Búlgara'),
('Croacia', 'Croata'),
('Checoslovaquia', 'Checoslovaca'),
('Dinamarca', 'Danesa'),
('Escocia', 'Escocesa'),
('Eslovaquia', 'Eslovaca'),
('Eslovenia', 'Eslovena'),
('España', 'Española'),
('Francia', 'Francesa'),
('Gales', 'Galesa'),
('Grecia', 'Griega'),
('Hungría', 'Húngara'),
('Inglaterra', 'Inglesa'),
('Irlanda', 'Irlandesa'),
('Irlanda del Norte', 'Norirlandesa'),
('Islandia', 'Islandesa'),
('Italia', 'Italiana'),
('Noruega', 'Noruega'),
('Países Bajos', 'Neerlandesa'),
('Polonia', 'Polaca'),
('Portugal', 'Portuguesa'),
('República Checa', 'Checa'),
('República Democrática Alemana', 'Germano-oriental'),
('Rumania', 'Rumana'),
('Rusia', 'Rusa'),
('Serbia', 'Serbia'),
('Serbia y Montenegro', 'Serbomontenegrina'),
('Suecia', 'Sueca'),
('Suiza', 'Suiza'),
('Turquía', 'Turca'),
('Ucrania', 'Ucraniana'),
('Unión Soviética', 'Soviética'),
('Yugoslavia', 'Yugoslava'),

-- CONMEBOL (Sudamérica)
('Argentina', 'Argentina'),
('Bolivia', 'Boliviana'),
('Brasil', 'Brasileña'),
('Chile', 'Chilena'),
('Colombia', 'Colombiana'),
('Ecuador', 'Ecuatoriana'),
('Paraguay', 'Paraguaya'),
('Perú', 'Peruana'),
('Uruguay', 'Uruguaya'),

-- CONCACAF (Norte, Centroamérica y Caribe)
-- ('Canadá', 'Canadiense'),
('Costa Rica', 'Costarricense'),
('Cuba', 'Cubana'),
('El Salvador', 'Salvadoreña'),
-- ('Estados Unidos', 'Estadounidense'),
('Haití', 'Haitiana'),
('Honduras', 'Hondureña'),
('Jamaica', 'Jamaicana'),
-- ('México', 'Mexicana'),
('Panamá', 'Panameña'),
('Trinidad y Tobago', 'Trinitense'),

-- CAF (África)
('Angola', 'Angoleña'),
('Argelia', 'Argelina'),
('Camerún', 'Camerunesa'),
('Congo', 'Congoleña'),
('Costa de Marfil', 'Marfileña'),
('Egipto', 'Egipcia'),
('Ghana', 'Ghanesa'),
('Marruecos', 'Marroquí'),
('Nigeria', 'Nigeriana'),
('Senegal', 'Senegalesa'),
('Sudáfrica', 'Sudafricana'),
('Togo', 'Togolesa'),
('Túnez', 'Tunecina'),

-- AFC (Asia)
('Arabia Saudita', 'Saudí'),
('Australia', 'Australiana'), -- (También participó representando a OFC)
('Catar', 'Catarí'),
('China', 'China'),
('Corea del Sur', 'Surcoreana'),
('Emiratos Árabes Unidos', 'Emiratí'),
('Indias Orientales Neerlandesas', 'Neerlando-indonesa'), -- (Hoy Indonesia)
('Indonesia', 'Indonesa'),
('Irán', 'Iraní'),
('Irak', 'Iraquí'),
('Israel', 'Israelí'), -- (Participó representando a AFC y UEFA)
('Japón', 'Japonesa'),
('Jordania', 'Jordana'), -- (Debutante 2026)
('Kuwait', 'Kuwaití'),
('Uzbekistán', 'Uzbeka'), -- (Debutante 2026)

-- OFC (Oceanía)
('Nueva Zelanda', 'Neozelandesa');

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
	u.FechaNacimiento
FROM Usuario u
INNER JOIN Pais p
ON p.IdPais = u.PaisNacimiento
INNER JOIN Pais n
ON n.IdPais = u.Nacionalidad
WHERE Correo = 'admin@email.com';

call sp_obtenerPaises();
call sp_MundialesCreados();
call sp_PostsPendientes();
call sp_UsuariosRegistrados();
call sp_getCategorias();

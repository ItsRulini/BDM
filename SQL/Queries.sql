USE BDM;

SELECT * FROM Usuario;

SELECT * FROM Categoria;

SELECT * FROM Mundial;

SELECT * FROM Publicacion;

SELECT * FROM Pais;



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
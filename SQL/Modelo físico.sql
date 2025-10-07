CREATE DATABASE BDM;

USE BDM;

CREATE TABLE Pais(
  IdPais INT PRIMARY KEY AUTO_INCREMENT,
  Pais VARCHAR(255),
  Nacionalidad VARCHAR(255)
);

ALTER TABLE Pais
CHANGE COLUMN Nombre Pais VARCHAR(255),
CHANGE COLUMN Gentilicio Nacionalidad VARCHAR(255);

CREATE TABLE Usuario (
  IdUsuario INT PRIMARY KEY AUTO_INCREMENT,
  Correo VARCHAR(255) BINARY UNIQUE NOT NULL,
  Contraseña VARCHAR(255) BINARY NOT NULL,
  Nombre VARCHAR(255),
  ApellidoPaterno VARCHAR(255),
  ApellidoMaterno VARCHAR(255),
  Genero ENUM('Masculino', 'Femenino', 'Otro'),
  Nacionalidad INT,
  PaisNacimiento INT,
  Tipo ENUM('Usuario', 'Administrador'),
  FotoPerfil LONGBLOB,
  FechaNacimiento DATE,
  FechaRegistro TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (Nacionalidad) REFERENCES Pais(IdPais),
  FOREIGN KEY (PaisNacimiento) REFERENCES Pais(IdPais)
);

ALTER TABLE Usuario
DROP COLUMN GeneroEspecifico;

ALTER TABLE Usuario
MODIFY Correo VARCHAR(255) BINARY UNIQUE NOT NULL,
MODIFY Contraseña VARCHAR(255) BINARY NOT NULL;

alter table usuario
drop column FechaNacimiento;

alter table usuario
add FechaNacimiento DATE 
AFTER FotoPerfil;

CREATE TABLE Jugador (
  IdJugador INT PRIMARY KEY AUTO_INCREMENT,
  Nombre VARCHAR(255) NOT NULL,
  Foto LONGBLOB,
  Nacionalidad INT,
  FechaNacimiento DATE,
  FOREIGN KEY (Nacionalidad) REFERENCES Pais(IdPais)
);


CREATE TABLE Mundial (
  IdMundial INT PRIMARY KEY AUTO_INCREMENT,
  Año YEAR,
  Descripcion TEXT,
  logo LONGBLOB,
  img_mascota LONGBLOB,
  nombre_mascota VARCHAR(100),

  -- Países (posiciones finales)
  campeon INT,
  subcampeon INT,
  tercer_puesto INT,
  cuarto_puesto INT,

  -- Resultados
  marcador VARCHAR(10),
  tiempo_extra BOOLEAN DEFAULT FALSE,
  marcador_tiempo_extra VARCHAR(10),
  penalties BOOLEAN DEFAULT FALSE,
  muerte_subita BOOLEAN DEFAULT FALSE,
  marcador_final VARCHAR(20),

  -- Premios individuales (referencias a Jugador)
  balon_oro INT,
  balon_plata INT,
  balon_bronce INT,
  botin_oro INT,
  botin_plata INT,
  botin_bronce INT,
  guante_oro INT,

  -- Claves foráneas
  FOREIGN KEY (campeon) REFERENCES Pais(IdPais),
  FOREIGN KEY (subcampeon) REFERENCES Pais(IdPais),
  FOREIGN KEY (tercer_puesto) REFERENCES Pais(IdPais),
  FOREIGN KEY (cuarto_puesto) REFERENCES Pais(IdPais),
  FOREIGN KEY (balon_oro) REFERENCES Jugador(IdJugador),
  FOREIGN KEY (balon_plata) REFERENCES Jugador(IdJugador),
  FOREIGN KEY (balon_bronce) REFERENCES Jugador(IdJugador),
  FOREIGN KEY (botin_oro) REFERENCES Jugador(IdJugador),
  FOREIGN KEY (botin_plata) REFERENCES Jugador(IdJugador),
  FOREIGN KEY (botin_bronce) REFERENCES Jugador(IdJugador),
  FOREIGN KEY (guante_oro) REFERENCES Jugador(IdJugador)
);

-- use bdm;
ALTER TABLE Mundial
MODIFY COLUMN Año YEAR;

alter table mundial
modify column descripcion text;

ALTER TABLE Mundial
-- Campos relacionados al resultado final
ADD logo LONGBLOB,
ADD img_mascota LONGBLOB,
ADD nombre_mascota VARCHAR(100),
ADD campeon INT,
ADD subcampeon INT,
ADD tercer_puesto INT,
ADD cuarto_puesto INT,
ADD marcador VARCHAR(10),
ADD tiempo_extra BOOLEAN DEFAULT FALSE,
ADD marcador_tiempo_extra VARCHAR(10),
ADD penalties BOOLEAN DEFAULT FALSE,
ADD muerte_subita BOOLEAN DEFAULT FALSE,
ADD marcador_final VARCHAR(20),

-- Premios individuales (referencias a Jugador)
ADD balon_oro INT,
ADD balon_plata INT,
ADD balon_bronce INT,
ADD botin_oro INT,
ADD botin_plata INT,
ADD botin_bronce INT,
ADD guante_oro INT,

-- Claves foráneas hacia Pais (posiciones)
ADD CONSTRAINT fk_campeon FOREIGN KEY (campeon) REFERENCES Pais(IdPais),
ADD CONSTRAINT fk_subcampeon FOREIGN KEY (subcampeon) REFERENCES Pais(IdPais),
ADD CONSTRAINT fk_tercer_puesto FOREIGN KEY (tercer_puesto) REFERENCES Pais(IdPais),
ADD CONSTRAINT fk_cuarto_puesto FOREIGN KEY (cuarto_puesto) REFERENCES Pais(IdPais),

-- Claves foráneas hacia Jugador (premios)
ADD CONSTRAINT fk_balon_oro FOREIGN KEY (balon_oro) REFERENCES Jugador(IdJugador),
ADD CONSTRAINT fk_balon_plata FOREIGN KEY (balon_plata) REFERENCES Jugador(IdJugador),
ADD CONSTRAINT fk_balon_bronce FOREIGN KEY (balon_bronce) REFERENCES Jugador(IdJugador),
ADD CONSTRAINT fk_botin_oro FOREIGN KEY (botin_oro) REFERENCES Jugador(IdJugador),
ADD CONSTRAINT fk_botin_plata FOREIGN KEY (botin_plata) REFERENCES Jugador(IdJugador),
ADD CONSTRAINT fk_botin_bronce FOREIGN KEY (botin_bronce) REFERENCES Jugador(IdJugador),
ADD CONSTRAINT fk_guante_oro FOREIGN KEY (guante_oro) REFERENCES Jugador(IdJugador);






CREATE TABLE Sedes (
	IdMundial INT,
    Sede INT, -- ID del país
    PRIMARY KEY (IdMundial, Sede),
    FOREIGN KEY (IdMundial) REFERENCES Mundial(IdMundial),
    FOREIGN KEY (Sede) REFERENCES Pais(IdPais)
);

CREATE TABLE Galeria_Mundial (
	IdMultimedia INT,
    IdMundial INT,
    PRIMARY KEY (IdMultimedia, IdMundial),
    FOREIGN KEY (IdMultimedia) REFERENCES Multimedia(IdMultimedia),
    FOREIGN KEY (IdMundial) REFERENCES Mundial(IdMundial)
);

RENAME TABLE Mundial_Multimedia TO Galeria_Mundial;


CREATE TABLE Publicacion (
  IdPublicacion INT PRIMARY KEY AUTO_INCREMENT,
  Contenido TEXT,
  FechaCreacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FechaAprobacion TIMESTAMP,
  EstatusAprobacion ENUM('Aprobado', 'Rechazado', 'Pendiente') DEFAULT 'Pendiente',
  IdCreador INT,
  IdMundial INT,
  FOREIGN KEY (IdCreador) REFERENCES Usuario(IdUsuario),
  FOREIGN KEY (IdMundial) REFERENCES Mundial(IdMundial)
);


-- drop table Comentario;
-- drop table Reaccion;
-- drop table Vista;
-- drop table Interaccion;

CREATE TABLE Comentario (
  IdComentario INT PRIMARY KEY AUTO_INCREMENT,
  Comentario TEXT,
  Estatus BOOLEAN DEFAULT TRUE,
  FechaComentario TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  IdUsuario INT,
  IdPublicacion INT,
  FOREIGN KEY (IdUsuario) REFERENCES Usuario(IdUsuario),
  FOREIGN KEY (IdPublicacion) REFERENCES Publicacion(IdPublicacion)
);

CREATE TABLE Reaccion (
  IdReaccion INT PRIMARY KEY AUTO_INCREMENT,
  IdUsuario INT,
  IdPublicacion INT,
  FOREIGN KEY (IdUsuario) REFERENCES Usuario(IdUsuario),
  FOREIGN KEY (IdPublicacion) REFERENCES Publicacion(IdPublicacion)
);

ALTER TABLE Reaccion
MODIFY Reaccion BOOLEAN DEFAULT TRUE;

-- Por el momento se podrá hacer con solo usuarios registrador
-- (en dado caso de que el profe diga lo contrario quitar el IdUsuario
CREATE TABLE Vista (
  IdVista INT PRIMARY KEY AUTO_INCREMENT,
  IdUsuario INT,
  IdPublicacion INT,
  FOREIGN KEY (IdUsuario) REFERENCES Usuario(IdUsuario),
  FOREIGN KEY (IdPublicacion) REFERENCES Publicacion(IdPublicacion)
);

alter table vista
add IdUsuario INT AFTER IdVista,
add constraint foreign key (IdUsuario) REFERENCES Usuario(IdUsuario);


CREATE TABLE Categoria (
	IdCategoria INT PRIMARY KEY AUTO_INCREMENT,
    Nombre VARCHAR(255)
);

CREATE TABLE Publicacion_Categoria(
	IdPublicacion INT,
    IdCategoria INT,
    PRIMARY KEY(IdPublicacion, IdCategoria),
    FOREIGN KEY (IdPublicacion) REFERENCES Publicacion(IdPublicacion),
    FOREIGN KEY (IdCategoria) REFERENCES Categoria(IdCategoria)
);

CREATE TABLE Multimedia (
	IdMultimedia INT PRIMARY KEY AUTO_INCREMENT,
    Contenido LONGBLOB
);

CREATE TABLE Multimedia_Publicacion (
	IdMultimedia INT,
    IdPublicacion INT,
    PRIMARY KEY(IdMultimedia, IdPublicacion),
    FOREIGN KEY (IdMultimedia) REFERENCES Multimedia(IdMultimedia),
    FOREIGN KEY (IdPublicacion) REFERENCES Publicacion(IdPublicacion)
);





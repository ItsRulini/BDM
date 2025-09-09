CREATE DATABASE BDM;

USE BDM;

CREATE TABLE Usuario (
  IdUsuario INT PRIMARY KEY AUTO_INCREMENT,
  Correo VARCHAR(255) BINARY UNIQUE NOT NULL,
  Contraseña VARCHAR(255) BINARY NOT NULL,
  Nombre VARCHAR(255),
  ApellidoPaterno VARCHAR(255),
  ApellidoMaterno VARCHAR(255),
  Genero ENUM('Masculino', 'Femenino', 'Otro'),
  GeneroEspecifico VARCHAR(255),
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
MODIFY Correo VARCHAR(255) BINARY UNIQUE NOT NULL,
MODIFY Contraseña VARCHAR(255) BINARY NOT NULL;

alter table usuario
drop column FechaNacimiento;

alter table usuario
add FechaNacimiento DATE 
AFTER FotoPerfil;

CREATE TABLE Pais(
  IdPais INT PRIMARY KEY AUTO_INCREMENT,
  Nombre VARCHAR(255),
  Gentilicio VARCHAR(255)
);

CREATE TABLE Mundial(
  IdMundial INT PRIMARY KEY AUTO_INCREMENT,
  Año YEAR,
  Descripcion VARCHAR(255)
);
-- use bdm;
ALTER TABLE Mundial
MODIFY COLUMN Año YEAR;


CREATE TABLE Seleccion (
  IdSeleccion INT PRIMARY KEY,
  Nombre VARCHAR(255),
  FOREIGN KEY (IdSeleccion) REFERENCES Pais(IdPais)
);

CREATE TABLE Mundial_Seleccion (
	IdMundial INT,
    IdSeleccion INT,
    PRIMARY KEY (IdMundial, IdSeleccion),
    FOREIGN KEY (IdMundial) REFERENCES Mundial(IdMundial),
    FOREIGN KEY (IdSeleccion) REFERENCES Seleccion(IdSeleccion)
);

CREATE TABLE Sedes (
	IdMundial INT,
    Sede INT, -- ID del país
    PRIMARY KEY (IdMundial, Sede),
    FOREIGN KEY (IdMundial) REFERENCES Mundial(IdMundial),
    FOREIGN KEY (Sede) REFERENCES Pais(IdPais)
);

CREATE TABLE Mundial_Multimedia (
	IdMultimedia INT,
    IdMundial INT,
    PRIMARY KEY (IdMultimedia, IdMundial),
    FOREIGN KEY (IdMultimedia) REFERENCES Multimedia(IdMultimedia),
    FOREIGN KEY (IdMundial) REFERENCES Mundial(IdMundial)
);

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

CREATE TABLE Interaccion (
  IdInteraccion INT PRIMARY KEY AUTO_INCREMENT,
  FechaInteraccion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  IdUsuario INT,
  IdPublicacion INT,
  FOREIGN KEY (IdUsuario) REFERENCES Usuario(IdUsuario),
  FOREIGN KEY (IdPublicacion) REFERENCES Publicacion(IdPublicacion)
);

ALTER TABLE Interaccion
ADD IdPublicacion INT,
ADD FOREIGN KEY (IdPublicacion) REFERENCES Publicacion(IdPublicacion);

CREATE TABLE Comentario (
  IdComentario INT PRIMARY KEY,
  Comentario TEXT,
  Estatus BOOLEAN DEFAULT TRUE,
  FOREIGN KEY (IdComentario) REFERENCES Interaccion(IdInteraccion)
);

CREATE TABLE Reaccion (
  IdReaccion INT PRIMARY KEY,
  Reaccion BOOLEAN DEFAULT TRUE,
  FOREIGN KEY (IdReaccion) REFERENCES Interaccion(IdInteraccion)
);

ALTER TABLE Reaccion
MODIFY Reaccion BOOLEAN DEFAULT TRUE;

CREATE TABLE Vista (
  IdVista INT PRIMARY KEY,
  FOREIGN KEY (IdVista) REFERENCES Interaccion(IdInteraccion)
);

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





<?php

class Usuario {
    private int $idUsuario;
    private string $correo;
    private string $contraseña;
    private string $nombre;
    private string $apellidoPaterno;
    private string $apellidoMaterno;
    private string $genero;
    private int $nacionalidad;
    private int $paisNacimiento;
    private string $tipo;
    private $fotoPerfil;
    private $fechaNacimiento;
    private $fechaRegistro;

    public function __construct() {
        // Empty constructor
    }

    public function __destruct() {
        // Empty destructor
    }

    // Getters
    public function getIdUsuario(): int { return $this->idUsuario; }
    public function getCorreo(): string { return $this->correo; }
    public function getContraseña(): string { return $this->contraseña; }
    public function getNombre(): string { return $this->nombre; }
    public function getApellidoPaterno(): string { return $this->apellidoPaterno; }
    public function getApellidoMaterno(): string { return $this->apellidoMaterno; }
    public function getGenero(): string { return $this->genero; }
    public function getNacionalidad(): int { return $this->nacionalidad; }
    public function getPaisNacimiento(): int { return $this->paisNacimiento; }
    public function getTipo(): string { return $this->tipo; }
    public function getFotoPerfil() { return $this->fotoPerfil; }
    public function getFechaNacimiento() { return $this->fechaNacimiento; }
    public function getFechaRegistro() { return $this->fechaRegistro; }

    // Setters
    public function setIdUsuario(int $idUsuario): void { $this->idUsuario = $idUsuario; }
    public function setCorreo(string $correo): void { $this->correo = $correo; }
    public function setContraseña(string $contraseña): void { $this->contraseña = $contraseña; }
    public function setNombre(string $nombre): void { $this->nombre = $nombre; }
    public function setApellidoPaterno(string $apellidoPaterno): void { $this->apellidoPaterno = $apellidoPaterno; }
    public function setApellidoMaterno(string $apellidoMaterno): void { $this->apellidoMaterno = $apellidoMaterno; }
    public function setGenero(string $genero): void { $this->genero = $genero; }
    public function setNacionalidad(int $nacionalidad): void { $this->nacionalidad = $nacionalidad; }
    public function setPaisNacimiento(int $paisNacimiento): void { $this->paisNacimiento = $paisNacimiento; }
    public function setTipo(string $tipo): void { $this->tipo = $tipo; }
    public function setFotoPerfil($fotoPerfil): void { $this->fotoPerfil = $fotoPerfil; }
    public function setFechaNacimiento($fechaNacimiento): void { $this->fechaNacimiento = $fechaNacimiento; }
    public function setFechaRegistro($fechaRegistro): void { $this->fechaRegistro = $fechaRegistro; }
}
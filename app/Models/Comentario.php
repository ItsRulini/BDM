<?php

class Comentario {
    private int $idComentario;
    private string $comentario;
    private bool $estatus;
    private string $fechaComentario; // TIMESTAMP se maneja como string
    private int $idUsuario;
    private int $idPublicacion;

    public function __construct() {
        // Empty constructor
    }

    public function __destruct() {
        // Empty destructor
    }

    // Getters
    public function getIdComentario(): int { return $this->idComentario; }
    public function getComentario(): string { return $this->comentario; }
    public function getEstatus(): bool { return $this->estatus; }
    public function getFechaComentario(): string { return $this->fechaComentario; }
    public function getIdUsuario(): int { return $this->idUsuario; }
    public function getIdPublicacion(): int { return $this->idPublicacion; }

    // Setters
    public function setIdComentario(int $idComentario): void { $this->idComentario = $idComentario; }
    public function setComentario(string $comentario): void { $this->comentario = $comentario; }
    public function setEstatus(bool $estatus): void { $this->estatus = $estatus; }
    public function setFechaComentario(string $fechaComentario): void { $this->fechaComentario = $fechaComentario; }
    public function setIdUsuario(int $idUsuario): void { $this->idUsuario = $idUsuario; }
    public function setIdPublicacion(int $idPublicacion): void { $this->idPublicacion = $idPublicacion; }
}
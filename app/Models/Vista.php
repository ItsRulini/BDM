<?php

class Vista {
    private int $idVista;
    private int $idUsuario;
    private int $idPublicacion;

    public function __construct() {
        // Empty constructor
    }

    public function __destruct() {
        // Empty destructor
    }

    // Getters
    public function getIdVista(): int { return $this->idVista; }
    public function getIdUsuario(): int { return $this->idUsuario; }
    public function getIdPublicacion(): int { return $this->idPublicacion; }

    // Setters
    public function setIdVista(int $idVista): void { $this->idVista = $idVista; }
    public function setIdUsuario(int $idUsuario): void { $this->idUsuario = $idUsuario; }
    public function setIdPublicacion(int $idPublicacion): void { $this->idPublicacion = $idPublicacion; }
}
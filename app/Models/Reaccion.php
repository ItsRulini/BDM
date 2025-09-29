<?php

class Reaccion {
    private int $idReaccion;
    private int $idUsuario;
    private int $idPublicacion;

    public function __construct() {
        // Empty constructor
    }

    public function __destruct() {
        // Empty destructor
    }

    // Getters
    public function getIdReaccion(): int { return $this->idReaccion; }
    public function getIdUsuario(): int { return $this->idUsuario; }
    public function getIdPublicacion(): int { return $this->idPublicacion; }

    // Setters
    public function setIdReaccion(int $idReaccion): void { $this->idReaccion = $idReaccion; }
    public function setIdUsuario(int $idUsuario): void { $this->idUsuario = $idUsuario; }
    public function setIdPublicacion(int $idPublicacion): void { $this->idPublicacion = $idPublicacion; }
}
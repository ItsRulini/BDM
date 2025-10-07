<?php

class Mundial {
    private int $idMundial;
    private int $año; // YEAR se maneja como un entero en PHP
    private string $descripcion;

    public function __construct() {
        // Empty constructor
    }

    public function __destruct() {
        // Empty destructor
    }

    // Getters
    public function getIdMundial(): int { return $this->idMundial; }
    public function getAño(): int { return $this->año; }
    public function getDescripcion(): string { return $this->descripcion; }

    // Setters
    public function setIdMundial(int $idMundial): void { $this->idMundial = $idMundial; }
    public function setAño(int $año): void { $this->año = $año; }
    public function setDescripcion(string $descripcion): void { $this->descripcion = $descripcion; }
}
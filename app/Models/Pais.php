<?php

class Pais {
    private int $idPais;
    private string $pais;
    private string $nacionalidad;

    public function __construct() {
        // Empty constructor
    }

    public function __destruct() {
        // Empty destructor
    }

    // Getters
    public function getIdPais(): int { return $this->idPais; }
    public function getPais(): string { return $this->pais; }
    public function getNacionalidad(): string { return $this->nacionalidad; }

    // Setters
    public function setIdPais(int $idPais): void { $this->idPais = $idPais; }
    public function setPais(string $pais): void { $this->pais = $pais; }
    public function setNacionalidad(string $nacionalidad): void { $this->nacionalidad = $nacionalidad; }
}
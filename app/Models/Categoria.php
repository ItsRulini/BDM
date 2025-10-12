<?php

class Categoria {
    private int $idCategoria;
    private string $nombre;

    public function __construct() {
        // Empty constructor
    }

    public function __destruct() {
        // Empty destructor
    }

    // Getters
    public function getIdCategoria(): int { return $this->idCategoria; }
    public function getNombre(): string { return $this->nombre; }

    // Setters
    public function setIdCategoria(int $idCategoria): void { $this->idCategoria = $idCategoria; }
    public function setNombre(string $nombre): void { $this->nombre = $nombre; }
}
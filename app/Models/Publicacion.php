<?php

class Publicacion {
    private int $idPublicacion;
    private string $contenido;
    private string $fechaCreacion; // TIMESTAMP se maneja como string
    private ?string $fechaAprobacion; // Nullable
    private string $estatusAprobacion;
    private int $idCreador;
    private int $idMundial;

    public function __construct() {
        // Empty constructor
    }

    public function __destruct() {
        // Empty destructor
    }

    // Getters
    public function getIdPublicacion(): int { return $this->idPublicacion; }
    public function getContenido(): string { return $this->contenido; }
    public function getFechaCreacion(): string { return $this->fechaCreacion; }
    public function getFechaAprobacion(): ?string { return $this->fechaAprobacion; }
    public function getEstatusAprobacion(): string { return $this->estatusAprobacion; }
    public function getIdCreador(): int { return $this->idCreador; }
    public function getIdMundial(): int { return $this->idMundial; }

    // Setters
    public function setIdPublicacion(int $idPublicacion): void { $this->idPublicacion = $idPublicacion; }
    public function setContenido(string $contenido): void { $this->contenido = $contenido; }
    public function setFechaCreacion(string $fechaCreacion): void { $this->fechaCreacion = $fechaCreacion; }
    public function setFechaAprobacion(?string $fechaAprobacion): void { $this->fechaAprobacion = $fechaAprobacion; }
    public function setEstatusAprobacion(string $estatusAprobacion): void { $this->estatusAprobacion = $estatusAprobacion; }
    public function setIdCreador(int $idCreador): void { $this->idCreador = $idCreador; }
    public function setIdMundial(int $idMundial): void { $this->idMundial = $idMundial; }
}
<?php

class Mundial {
    // --- Atributos ---
    private int $idMundial;
    private int $año; // YEAR se maneja como entero
    private string $descripcion;

    // Multimedia y mascota
    private ?string $logo;            // LONGBLOB → string binario
    private ?string $imgMascota;      // LONGBLOB → string binario
    private ?string $nombreMascota;

    // Países (llaves foráneas)
    private ?int $campeon;
    private ?int $subcampeon;
    private ?int $tercerPuesto;
    private ?int $cuartoPuesto;

    // Resultados
    private ?string $marcador;
    private bool $tiempoExtra;
    private ?string $marcadorTiempoExtra;
    private bool $penalties;
    private bool $muerteSubita;
    private ?string $marcadorFinal;

    // Premios individuales (llaves foráneas a Jugador)
    private ?int $balonOro;
    private ?int $balonPlata;
    private ?int $balonBronce;
    private ?int $botinOro;
    private ?int $botinPlata;
    private ?int $botinBronce;
    private ?int $guanteOro;

    // Goles del botín de oro
    private ?int $maxGoles;

    // --- Constructor ---
    public function __construct() {
        $this->tiempoExtra = false;
        $this->penalties = false;
        $this->muerteSubita = false;
    }

    public function __destruct() {}

    // --- Getters ---
    public function getIdMundial(): int { return $this->idMundial; }
    public function getAño(): int { return $this->año; }
    public function getDescripcion(): string { return $this->descripcion; }

    public function getLogo(): ?string { return $this->logo; }
    public function getImgMascota(): ?string { return $this->imgMascota; }
    public function getNombreMascota(): ?string { return $this->nombreMascota; }

    public function getCampeon(): ?int { return $this->campeon; }
    public function getSubcampeon(): ?int { return $this->subcampeon; }
    public function getTercerPuesto(): ?int { return $this->tercerPuesto; }
    public function getCuartoPuesto(): ?int { return $this->cuartoPuesto; }

    public function getMarcador(): ?string { return $this->marcador; }
    public function getTiempoExtra(): bool { return $this->tiempoExtra; }
    public function getMarcadorTiempoExtra(): ?string { return $this->marcadorTiempoExtra; }
    public function getPenalties(): bool { return $this->penalties; }
    public function getMuerteSubita(): bool { return $this->muerteSubita; }
    public function getMarcadorFinal(): ?string { return $this->marcadorFinal; }

    public function getBalonOro(): ?int { return $this->balonOro; }
    public function getBalonPlata(): ?int { return $this->balonPlata; }
    public function getBalonBronce(): ?int { return $this->balonBronce; }
    public function getBotinOro(): ?int { return $this->botinOro; }
    public function getBotinPlata(): ?int { return $this->botinPlata; }
    public function getBotinBronce(): ?int { return $this->botinBronce; }
    public function getGuanteOro(): ?int { return $this->guanteOro; }

    public function getMaxGoles(): ?int { return $this->maxGoles; }

    // --- Setters ---
    public function setIdMundial(int $idMundial): void { $this->idMundial = $idMundial; }
    public function setAño(int $año): void { $this->año = $año; }
    public function setDescripcion(string $descripcion): void { $this->descripcion = $descripcion; }

    public function setLogo(?string $logo): void { $this->logo = $logo; }
    public function setImgMascota(?string $imgMascota): void { $this->imgMascota = $imgMascota; }
    public function setNombreMascota(?string $nombreMascota): void { $this->nombreMascota = $nombreMascota; }

    public function setCampeon(?int $campeon): void { $this->campeon = $campeon; }
    public function setSubcampeon(?int $subcampeon): void { $this->subcampeon = $subcampeon; }
    public function setTercerPuesto(?int $tercerPuesto): void { $this->tercerPuesto = $tercerPuesto; }
    public function setCuartoPuesto(?int $cuartoPuesto): void { $this->cuartoPuesto = $cuartoPuesto; }

    public function setMarcador(?string $marcador): void { $this->marcador = $marcador; }
    public function setTiempoExtra(bool $tiempoExtra): void { $this->tiempoExtra = $tiempoExtra; }
    public function setMarcadorTiempoExtra(?string $marcadorTiempoExtra): void { $this->marcadorTiempoExtra = $marcadorTiempoExtra; }
    public function setPenalties(bool $penalties): void { $this->penalties = $penalties; }
    public function setMuerteSubita(bool $muerteSubita): void { $this->muerteSubita = $muerteSubita; }
    public function setMarcadorFinal(?string $marcadorFinal): void { $this->marcadorFinal = $marcadorFinal; }

    public function setBalonOro(?int $balonOro): void { $this->balonOro = $balonOro; }
    public function setBalonPlata(?int $balonPlata): void { $this->balonPlata = $balonPlata; }
    public function setBalonBronce(?int $balonBronce): void { $this->balonBronce = $balonBronce; }
    public function setBotinOro(?int $botinOro): void { $this->botinOro = $botinOro; }
    public function setBotinPlata(?int $botinPlata): void { $this->botinPlata = $botinPlata; }
    public function setBotinBronce(?int $botinBronce): void { $this->botinBronce = $botinBronce; }
    public function setGuanteOro(?int $guanteOro): void { $this->guanteOro = $guanteOro; }

    public function setMaxGoles(?int $maxGoles): void { $this->maxGoles = $maxGoles; }
}

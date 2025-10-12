<?php

class Jugador {
    private int $idJugador;
    private string $nombre;
    private ?string $foto; // LONGBLOB -> representado como string binario o base64
    private int $nacionalidad;
    private ?string $fechaNacimiento; // DATE -> string (YYYY-MM-DD)

    public function __construct() {}
    public function __destruct() {}

    // Getters
    public function getIdJugador(): int {
        return $this->idJugador;
    }

    public function getNombre(): string {
        return $this->nombre;
    }

    public function getFoto(): ?string {
        return $this->foto;
    }

    public function getNacionalidad(): int {
        return $this->nacionalidad;
    }

    public function getFechaNacimiento(): ?string {
        return $this->fechaNacimiento;
    }

    // Setters
    public function setIdJugador(int $idJugador): void {
        $this->idJugador = $idJugador;
    }

    public function setNombre(string $nombre): void {
        $this->nombre = $nombre;
    }

    public function setFoto(?string $foto): void {
        $this->foto = $foto;
    }

    public function setNacionalidad(int $nacionalidad): void {
        $this->nacionalidad = $nacionalidad;
    }

    public function setFechaNacimiento(?string $fechaNacimiento): void {
        $this->fechaNacimiento = $fechaNacimiento;
    }
}

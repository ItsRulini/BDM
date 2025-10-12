<?php
include_once '../Models/Jugador.php';

class JugadorDAO {
    private $conn;

    public function __construct($conn) {
        $this->conn = $conn;
    }
}
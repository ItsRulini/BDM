<?php
include_once '../Models/Publicacion.php';

class PublicacionDAO {
    private $conn;

    public function __construct($conn) {
        $this->conn = $conn;
    }
}
<?php
include_once '../Models/Comentario.php';

class ComentarioDAO {
    private $conn;

    public function __construct($conn) {
        $this->conn = $conn;
    }
}
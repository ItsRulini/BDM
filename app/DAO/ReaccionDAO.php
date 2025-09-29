<?php
include_once '../Models/Reaccion.php';

class ReaccionDAO {
    private $conn;

    public function __construct($conn) {
        $this->conn = $conn;
    }
}
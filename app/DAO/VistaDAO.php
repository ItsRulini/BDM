<?php
include_once '../Models/Vista.php';

class VistaDAO {
    private $conn;

    public function __construct($conn) {
        $this->conn = $conn;
    }
}
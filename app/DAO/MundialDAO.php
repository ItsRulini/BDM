<?php
include_once '../Models/Mundial.php';

class MundialDAO {
    private $conn;

    public function __construct($conn) {
        $this->conn = $conn;
    }
}
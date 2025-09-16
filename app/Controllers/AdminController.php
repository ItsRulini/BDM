<?php
class AdminController {
    public function index() {
        // Lógica para la vista del panel de administración
        require_once '../Views/Users/Admin/admin.html';
    }
    public function crearMundial() {
        // Lógica para la gestión del Mundial
        require_once '../Views/Users/Admin/mundialAdmin.html';
    }
    public function editarMundial($id) {
        require_once '../Views/Users/Admin/mundialAdmin.html';
    }
    public function perfilAdmin() {
        // Lógica para la gestión del Mundial
        require_once '../Views/Users/Admin/perfilAdmin.html';
    }

    // Otros métodos relacionados con la administración pueden ir aquí
}
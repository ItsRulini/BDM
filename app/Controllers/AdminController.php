<?php
include_once '../Utils/AuthGuard.php';
class AdminController {

    public function __construct() {
        /* 
        Se asegura que el usuario sea admin en cada acción
        de este controlador
        */
        AuthGuard::requireAdmin();
    }
    public function index() {
        // Lógica para la vista del panel de administración
        require_once '../Views/Users/Admin/admin.html';
    }
    public function crearMundial() {
        // Lógica para la gestión del Mundial
        require_once '../Views/Users/Admin/mundialAdmin.php';
    }
    public function editarMundial($id) {
        $idMundial = $id;
        require_once '../Views/Users/Admin/mundialAdmin.php';
    }
    public function perfil() {
        // Lógica para la gestión del Mundial
        require_once '../Views/Users/Admin/perfilAdmin.html';
    }
    public function posts() {
        // Lógica para la gestión de posts
        require_once '../Views/Users/Admin/postsAdmin.html';
    }
}
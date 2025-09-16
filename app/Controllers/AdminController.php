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
        // El parámetro $id se recibe desde la ruta o el request
        // Ejemplo: Si usas un router, el $id se pasa al llamar a este método
        // Puedes acceder directamente a $id aquí
        // Ejemplo de uso:
        // $datosMundial = ModeloMundial::obtenerPorId($id);
        //echo "Editando mundial con ID: " . htmlspecialchars($id);
        require_once '../Views/Users/Admin/mundialAdmin.html';
    }


    public function perfilAdmin() {
        // Lógica para la gestión del Mundial
        require_once '../Views/Users/Admin/perfilAdmin.html';
    }

    // Otros métodos relacionados con la administración pueden ir aquí
}
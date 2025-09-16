<?php
include_once '../Connection/conn.php';

include '../DAO/UsuarioDAO.php';

class ApiController {
    public function getPosts() {
        // Aquí puedes implementar la lógica para obtener los posts desde la base de datos
        // Por simplicidad, devolveremos un array estático de ejemplo
        // $dao = new PublicacionDAO

        // Devolver los posts en formato JSON
        header('Content-Type: application/json');
        //echo json_encode($posts);
    }
}
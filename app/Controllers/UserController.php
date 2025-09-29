<?php
include_once '../Utils/AuthGuard.php';
class UserController{

    public function __construct() {
        /* 
        Se asegura que el usuario sea usuario en cada acción
        de este controlador
        */
        AuthGuard::requireUser();
    }
    public function perfil(){
        require_once '../Views/Users/User/perfil.php';
    }
}
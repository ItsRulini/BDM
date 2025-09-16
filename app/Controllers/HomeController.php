<?php

class HomeController {
    public function index() {
        // Aquí puedes cargar la vista principal o hacer cualquier otra lógica necesaria
        require '../Views/index.html';
    }
    public function posts() {
        // Aquí puedes cargar la vista de publicaciones o hacer cualquier otra lógica necesaria
        require '../Views/posts.html';
    }
    
    public function registro() {
        // Aquí puedes cargar la vista de registro o hacer cualquier otra lógica necesaria
        require '../Views/registro.html';
    }
    public function login() {
        // Aquí puedes cargar la vista de login o hacer cualquier otra lógica necesaria
        require '../Views/login.html';
    }

    public function mundial($id) {
        
        require '../Views/mundial.html';
    }
}
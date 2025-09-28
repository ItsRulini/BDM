<?php

class ErrorController {
    /**
     * Muestra la página de error 404 (No Encontrado).
     */
    public function notFound() {
        // Importante: Envía el código de respuesta HTTP 404
        http_response_code(404);
        
        // Carga tu vista de error
        require_once '../Views/Errors/404.html';
    }
}
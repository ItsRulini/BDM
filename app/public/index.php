<?php

// Leer parámetros de la URL

$defaultController = 'home';
$defaultAction = 'index';

$controller = $_GET['controller'] ?? $defaultController;
$action = $_GET['action'] ?? $defaultAction;

// Cargar el controlador correspondiente
$controllerName = ucfirst($controller) . 'Controller';
$controllerFile = '../Controllers/' . $controllerName . '.php';

if (!file_exists($controllerFile)) {
    // Archivo del controlador no encontrado
    http_response_code(404);
    echo "Error 404: Archivo del controlador no encontrado.";
    exit;
}

require_once $controllerFile;

if (!class_exists($controllerName)) {
    // Clase del controlador no encontrada
    http_response_code(500);
    echo "Clase $controllerName no definida en $controllerFile.";
    exit;
}

// Instanciar el controlador
$controller = new $controllerName();

if (!method_exists($controller, $action)) {
    // Acción no encontrada
    http_response_code(404);
    echo "Error 404: Acción no encontrada en $controllerName.";
    exit;
}

// Llamar a la acción del controlador
$controller->$action();
//call_user_func(array($controller, $action));
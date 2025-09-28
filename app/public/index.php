<?php

/**
 * Función centralizada para manejar errores 404.
 */
function showError404() {
    // Incluimos y usamos el ErrorController para mostrar la página 404.
    require_once '../Controllers/ErrorController.php';
    $errorController = new ErrorController();
    $errorController->notFound();
    exit(); // Detenemos la ejecución del script.
}

// --- Tu código existente ---
$defaultController = 'home';
$defaultAction = 'index';

$controller = $_GET['controller'] ?? $defaultController;
$action = $_GET['action'] ?? $defaultAction;

$controllerName = ucfirst($controller) . 'Controller';
$controllerFile = '../Controllers/' . $controllerName . '.php';

// Si el archivo del controlador no existe, muestra el error 404.
if (!file_exists($controllerFile)) {
    showError404();
}

require_once $controllerFile;

// Si la clase del controlador no se encuentra en el archivo, muestra el error 404.
if (!class_exists($controllerName)) {
    showError404();
}

$controllerInstance = new $controllerName();

// Si el método (acción) no existe en el controlador, muestra el error 404.
if (!method_exists($controllerInstance, $action)) {
    showError404();
}

// --- El resto de tu código para llamar a la acción ---
if (isset($_GET['id'])) {
    $controllerInstance->$action($_GET['id']);
} else {
    $controllerInstance->$action();
}
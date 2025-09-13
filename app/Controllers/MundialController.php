<?php

class MundialController {

    /**
     * Esta función (acción 'ver') se ejecuta cuando la URL pide ver un mundial.
     * Recibe el ID del mundial desde la URL.
     */
    public function ver($id) {
        $vistaACargar = ''; // Variable para guardar el nombre del archivo

        // Usamos un 'switch' para decidir qué archivo cargar según el ID
        switch ($id) {
            case 1:
                // Para el ID=1 (Qatar 2022), carga este archivo
                $vistaACargar = '../Views/Mundial/qatar2022.html';
                break;
            
            case 2:
                // Cuando crees la página para Rusia 2018 (ID=2), la pondrás aquí
                // $vistaACargar = '../Views/Mundial/rusia2018.html';
                break;

            // Puedes añadir más 'case' para los demás IDs...

            default:
                // Si el ID no coincide con ninguno, carga una página de error o la genérica
                $vistaACargar = '../Views/Mundial/ver.php';
                break;
        }

        // Finalmente, carga el archivo que decidimos
        if (file_exists($vistaACargar)) {
            require_once $vistaACargar;
        } else {
            // Esto se mostrará si el archivo (ej. qatar2022.html) no existe en la carpeta
            echo "Error: El archivo de la vista no fue encontrado.";
        }
    }
}
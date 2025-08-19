<?php

require_once 'Connection/conn.php';
require_once 'Models/Usuario.php';
require_once 'DAO/UsuarioDAO.php';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $usuario = new Usuario();

    $usuario->setCorreo($_POST['correo']);
    $usuario->setContraseña($_POST['contraseña']);
    $usuario->setNombre($_POST['nombres']);
    $usuario->setApellidoPaterno($_POST['paterno']);
    $usuario->setApellidoMaterno($_POST['materno']);
    $usuario->setGenero($_POST['genero']);
    $usuario->setGeneroEspecifico($_POST['generoEspecifico']);
    $usuario->setNacionalidad((int)$_POST['nacionalidad']);
    $usuario->setPaisNacimiento((int)$_POST['paisNacimiento']);
    $usuario->setTipo($_POST['tipo']);
    //$usuario->setFotoPerfil($_FILES['fotoPerfil']['name']);

    // 🔹 Guardar el contenido binario de la foto
    if (isset($_FILES['fotoPerfil']) && $_FILES['fotoPerfil']['error'] === UPLOAD_ERR_OK) {
        $fotoBinaria = file_get_contents($_FILES['fotoPerfil']['tmp_name']);
        $usuario->setFotoPerfil($fotoBinaria);
    } else {
        $usuario->setFotoPerfil(null); // o manejar error si la foto es obligatoria
    }

    $usuario->setFechaNacimiento($_POST['nacimiento']);
    //$usuario->setFechaRegistro(date('Y-m-d H:i:s'));
    $usuarioDAO = new UsuarioDAO($conn);

    $result = $usuarioDAO->createUsuario($usuario);

    if ($result) {
        echo "Usuario creado con éxito. ID: " . $result->getIdUsuario();
    } else {
        echo "Error al crear el usuario.";
    }
} else {
    echo "Método no permitido. Use POST para enviar datos.";
}

<?php

require_once 'Connection/conn.php';
require_once 'Models/Usuario.php';
require_once 'DAO/UsuarioDAO.php';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $usuario = new Usuario();

    $usuario->setCorreo($_POST['correo']);
    $usuario->setContraseña($_POST['contraseña']);
    $usuario->setNombre($_POST['nombre']);
    $usuario->setApellidoPaterno($_POST['apellidoPaterno']);
    $usuario->setApellidoMaterno($_POST['apellidoMaterno']);
    $usuario->setGenero($_POST['genero']);
    $usuario->setGeneroEspecifico($_POST['generoEspecifico']);
    $usuario->setNacionalidad((int)$_POST['nacionalidad']);
    $usuario->setPaisNacimiento((int)$_POST['paisNacimiento']);
    $usuario->setTipo($_POST['tipo']);
    $usuario->setFotoPerfil($_FILES['fotoPerfil']['name']);
    $usuario->setFechaNacimiento($_POST['fechaNacimiento']);
    $usuario->setFechaRegistro(date('Y-m-d H:i:s'));
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

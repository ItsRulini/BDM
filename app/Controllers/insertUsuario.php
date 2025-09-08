<?php

require_once '../Connection/conn.php';
require_once '../Models/Usuario.php';
require_once '../DAO/UsuarioDAO.php';
header('Content-Type: application/json');

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    
    $data = json_decode(file_get_contents("php://input"), true);

    $usuario = new Usuario();

    $usuario->setCorreo($data['correo'] ?? '');
    $usuario->setContraseña($data['contrasena'] ?? '');
    $usuario->setNombre($data['nombres'] ?? '');
    $usuario->setApellidoPaterno($data['paterno'] ?? '');
    $usuario->setApellidoMaterno($data['materno'] ?? '');
    $usuario->setGenero($data['genero'] ?? '');
    $usuario->setGeneroEspecifico($data['generoEspecifico'] ?? '');
    $usuario->setNacionalidad(isset($data['nacionalidad']) ? (int)$data['nacionalidad'] : null);
    $usuario->setPaisNacimiento(isset($data['paisNacimiento']) ? (int)$data['paisNacimiento'] : null);
    $usuario->setTipo($data['tipo'] ?? '');

    // Foto de perfil: espera base64 en $data['fotoPerfil']
    if (!empty($data['fotoPerfil'])) {
        $fotoBinaria = base64_decode($data['fotoPerfil']);
        $usuario->setFotoPerfil($fotoBinaria);
    } else {
        $usuario->setFotoPerfil(null);
    }

    $usuario->setFechaNacimiento($data['nacimiento'] ?? null);
    
    $usuarioDAO = new UsuarioDAO($conn);

    //Administador se inserta por defecto
    $usuario->setTipo('Usuario'); // Establecer el tipo de usuario
    $result = $usuarioDAO->createUsuario($usuario);

    if ($result) {
        echo json_encode([
            'success' => true,
            'message' => 'Usuario creado con éxito',
            'data' => [
                'id' => $result->getIdUsuario(),
                'correo' => $result->getCorreo(),
                'nombre' => $result->getNombre()
            ]
        ]);
        
    } else {
        echo json_encode([
            'success' => false,
            'message' => 'Error al crear el usuario'
        ]);
        //throw new Exception("No se pudo crear el usuario");
    }
} else {
    echo json_encode([
        'success' => false,
        'message' => 'Método no permitido'
    ]);
}

<?php
include_once '../Connection/conn.php';
include_once '../Models/Usuario.php';
include_once '../DAO/UsuarioDAO.php';
include_once '../Utils/Auth.php';

header('Content-Type: application/json');

class ApiController {

    // @POST /api/registrarUsuario
    public function registrarUsuario() {
        if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
            echo json_encode([
                'success' => false,
                'message' => 'Método no permitido'
            ]);
            return;
        }

        $data = json_decode(file_get_contents("php://input"), true);

        $usuario = new Usuario();
        $usuario->setCorreo($data['correo'] ?? '');
        $usuario->setContraseña($data['contrasena'] ?? '');
        $usuario->setNombre($data['nombres'] ?? '');
        $usuario->setApellidoPaterno($data['paterno'] ?? '');
        $usuario->setApellidoMaterno($data['materno'] ?? '');
        $usuario->setGenero($data['genero'] ?? '');
        $usuario->setNacionalidad(isset($data['nacionalidad']) ? (int)$data['nacionalidad'] : null);
        $usuario->setPaisNacimiento(isset($data['paisNacimiento']) ? (int)$data['paisNacimiento'] : null);
        $usuario->setTipo('Usuario'); // por defecto

        if (!empty($data['fotoPerfil'])) {
            $fotoBinaria = base64_decode($data['fotoPerfil']);
            $usuario->setFotoPerfil($fotoBinaria);
        } else {
            $usuario->setFotoPerfil(null);
        }

        $usuario->setFechaNacimiento($data['nacimiento'] ?? null);

        $usuarioDAO = new UsuarioDAO($GLOBALS['conn']);
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
        }
    }

    // @POST /api/login
    public function login() {
        Auth::startSession();

        // Si ya hay sesión activa, devolverla
        if (Auth::check()) {
            echo json_encode([
                'success' => true,
                'message' => 'Sesión ya iniciada',
                'data' => Auth::user()
            ]);
            return;
        }

        // Solo permitir login por POST
        if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
            echo json_encode([
                'success' => false,
                'message' => 'Método no permitido'
            ]);
            return;
        }

        // Datos enviados
        $data = json_decode(file_get_contents("php://input"), true);
        $correo = $data['correo'] ?? '';
        $contrasena = $data['contrasena'] ?? '';

        if (empty($correo) || empty($contrasena)) {
            echo json_encode([
                'success' => false,
                'message' => 'Correo y contraseña requeridos'
            ]);
            return;
        }

        // Buscar usuario en DB
        $usuarioDAO = new UsuarioDAO($GLOBALS['conn']);
        $usuario = $usuarioDAO->getUsuarioPorCorreo($correo); 
        // ⚠️ Necesitas implementar findByCorreo($correo) en tu DAO

        if (!$usuario) {
            echo json_encode([
                'success' => false,
                'message' => 'Usuario no encontrado'
            ]);
            return;
        }

        // Verificar contraseña
        if ($usuario->getContraseña() !== $contrasena) {
            echo json_encode([
                'success' => false,
                'message' => 'Contraseña incorrecta'
            ]);
            return;
        }

        // Crear sesión
        Auth::login($usuario);

        echo json_encode([
            'success' => true,
            'message' => 'Inicio de sesión exitoso',
            'data' => Auth::user()
        ]);
    }


}
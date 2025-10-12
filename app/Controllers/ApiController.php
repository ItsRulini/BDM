<?php
// includes

// mandatories
include_once '../Connection/conn.php';
include_once '../Utils/Auth.php';

// models
include_once '../Models/Usuario.php';

// dao
include_once '../DAO/UsuarioDAO.php';
include_once '../DAO/PaisDAO.php';
include_once '../DAO/MundialDAO.php';
include_once '../DAO/CategoriaDAO.php';

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
        $userData = $usuarioDAO->getUsuarioPorCorreo($correo);

        if (!$userData || !isset($userData['usuario'])) {
            echo json_encode([
                'success' => false,
                'message' => 'Usuario no encontrado'
            ]);
            return;
        }

        // Verificar contraseña
        if ($userData['usuario']->getContraseña() !== $contrasena) {
            echo json_encode([
                'success' => false,
                'message' => 'Contraseña incorrecta'
            ]);
            return;
        }

        // Crear sesión
        Auth::login($userData['usuario']);

        echo json_encode([
            'success' => true,
            'message' => 'Inicio de sesión exitoso',
            'data' => Auth::user()
        ]);
    }

    // @POST /api/logout
    public function logout() {
        Auth::logout();

        header("Location: index.php?controller=home&action=login");
        exit();
    }

    // @GET /api/getCurrentUser
    public function getCurrentUser() {
        // Solo permitir obetener por GET
        if ($_SERVER['REQUEST_METHOD'] !== 'GET') {
            echo json_encode([
                'success' => false,
                'message' => 'Método no permitido'
            ]);
            return;
        }

        if (!Auth::check()) {
            echo json_encode([
                'success' => false,
                'message' => 'No hay sesión activa'
            ]);
            return;
        }

        try {
            $user = Auth::user();

            $usuarioDAO = new UsuarioDAO($GLOBALS['conn']);
            $fullUser = $usuarioDAO->getUsuarioPorCorreo($user['correo']);
            
            if (!$fullUser) {
                throw new Exception("No se pudo obtener la información del usuario desde la base de datos.");
            }

            $fotoPerfil = $fullUser['usuario']->getFotoPerfil();
            if ($fotoPerfil !== null) {
                $fotoPerfilBase64 = base64_encode($fotoPerfil);
                $user['fotoPerfil'] = $fotoPerfilBase64;
            } else {
                $user['fotoPerfil'] = null;
            }

            $fullUser['usuario'] = $fullUser['usuario']->toArray();

            echo json_encode([
                'success' => true,
                'data' => $fullUser
            ]);
        } catch (Exception $e) {
            http_response_code(500); // Error interno del servidor
            echo json_encode([
                'success' => false,
                'message' => 'Error del servidor: ' . $e->getMessage()
            ]);
        }
    }

    // @GET /api/getPaises
    public function getPaises() {
        // Solo permitir obetener por GET
        if ($_SERVER['REQUEST_METHOD'] !== 'GET') {
            echo json_encode([
                'success' => false,
                'message' => 'Método no permitido'
            ]);
            return;
        }

        try {
            $paisDAO = new PaisDAO($GLOBALS['conn']);
            $paises = $paisDAO->getPaises(); // Esto devuelve un array de objetos Pais

            if ($paises === null) {
                throw new Exception("No se pudieron obtener los países desde la base de datos.");
            }

            // Convertir el array de objetos a un array asociativo para el JSON
            $paisesArray = array_map(function($pais) {
                return [
                    'id' => $pais->getIdPais(),
                    'nombre' => $pais->getPais(),
                    'nacionalidad' => $pais->getNacionalidad()
                ];
            }, $paises);

            echo json_encode([
                'success' => true,
                'data' => $paisesArray
            ]);

        } catch (Exception $e) {
            http_response_code(500); // Error interno del servidor
            echo json_encode([
                'success' => false,
                'message' => 'Error del servidor: ' . $e->getMessage()
            ]);
        }
    }

    // @GET /api/getCategorias
    public function getCategorias() {
        // Solo permitir obetener por GET
        if ($_SERVER['REQUEST_METHOD'] !== 'GET') {
            echo json_encode([
                'success' => false,
                'message' => 'Método no permitido'
            ]);
            return;
        }

        try {
            $categoriaDAO = new CategoriaDAO($GLOBALS['conn']);
            $categorias = $categoriaDAO->getCategorias(); // Esto devuelve un array de objetos Pais

            if ($categorias === null) {
                throw new Exception("No se pudieron obtener las categorias desde la base de datos.");
            }

            // Convertir el array de objetos a un array asociativo para el JSON
            $categoriasArray = array_map(function($item) {
                
                $categoria = $item['categoria'];
                $numPosts = $item['num_posts'];
                return [
                    'id' => $categoria->getIdCategoria(),
                    'nombre' => $categoria->getNombre(),
                    'num_posts' => $numPosts
                ];
            }, $categorias);

            echo json_encode([
                'success' => true,
                'data' => $categoriasArray
            ]);

        } catch (Exception $e) {
            http_response_code(500); // Error interno del servidor
            echo json_encode([
                'success' => false,
                'message' => 'Error del servidor: ' . $e->getMessage()
            ]);
        }
    }

    // @POST /api/crearCategoria
    public function crearCategoria() {

        // Solo permitir obetener por GET
        if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
            echo json_encode([
                'success' => false,
                'message' => 'Método no permitido'
            ]);
            return;
        }

        try {

            $data = json_decode(file_get_contents("php://input"), true);

            $categoria = new Categoria();
            $categoria->setNombre($data['name'] ?? '');

            $categoriaDAO = new CategoriaDAO($GLOBALS['conn']);
            $result = $categoriaDAO->crearCategoria($categoria); // Esto devuelve un id del objeto creado

            if ($result === null) {
                throw new Exception("No se pudo crear la categoría.");
            }

            echo json_encode([
                'success' => true,
                'id' => $result,
                'message' => 'Categoría creada correctamente'
            ]);
            
        } catch(Exception $e) {
            http_response_code(500); // Error interno del servidor
            echo json_encode([
                'success' => false,
                'message' => 'Error del servidor: ' . $e->getMessage()
            ]);
        }
    }

    // @PUT /api/updateCategoria
    public function updateCategoria() {

        // Solo permitir obetener por PUT
        if ($_SERVER['REQUEST_METHOD'] !== 'PUT') {
            echo json_encode([
                'success' => false,
                'message' => 'Método no permitido'
            ]);
            return;
        }

        try {

            $data = json_decode(file_get_contents("php://input"), true);

            $categoria = new Categoria();
            $categoria->setIdCategoria($data['id'] ?? null);
            $categoria->setNombre($data['name'] ?? '');

            $categoriaDAO = new CategoriaDAO($GLOBALS['conn']);
            $result = $categoriaDAO->updateCategoria($categoria); // Esto devuelve un id del objeto creado

            if ($result === null) {
                throw new Exception("No se pudo actualizar la categoría.");
            }

            echo json_encode([
                'success' => true,
                'message' => 'Categoría actualizada correctamente'
            ]);
            
        } catch(Exception $e) {
            http_response_code(500); // Error interno del servidor
            echo json_encode([
                'success' => false,
                'message' => 'Error del servidor: ' . $e->getMessage()
            ]);
        }
    }

    // @POST /api/crearPais
    public function crearPais() {

        // Solo permitir obetener por GET
        if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
            echo json_encode([
                'success' => false,
                'message' => 'Método no permitido'
            ]);
            return;
        }

        try {

            $data = json_decode(file_get_contents("php://input"), true);

            $pais = new Pais();
            $pais->setPais($data['name'] ?? '');
            $pais->setNacionalidad($data['nationality'] ?? '');

            $paisDAO = new PaisDAO($GLOBALS['conn']);
            $result = $paisDAO->crearPais($pais); // Esto devuelve un id del pais creado

            if ($result === null) {
                throw new Exception("No se pudo crear el país.");
            }

            echo json_encode([
                'success' => true,
                'id' => $result,
                'message' => 'Pais creado correctamente'
            ]);
            
        } catch(Exception $e) {
            http_response_code(500); // Error interno del servidor
            echo json_encode([
                'success' => false,
                'message' => 'Error del servidor: ' . $e->getMessage()
            ]);
        }
    }



    // @GET /api/getEstadisticasAdmin
    public function getEstadisticasAdmin () {
        // Solo permitir obetener por GET
        if ($_SERVER['REQUEST_METHOD'] !== 'GET') {
            echo json_encode([
                'success' => false,
                'message' => 'Método no permitido'
            ]);
            return;
        }

        try {
            $mundialDAO = new MundialDAO($GLOBALS['conn']);
            $statistics = $mundialDAO->getStatistics(); // Esto devuelve un array de estadisticas

            if ($statistics === null) {
                throw new Exception("No se pudieron obtener las estadisticas desde la base de datos.");
            }

            $statisticsArray = [
                'mundiales' => $statistics[0],
                'posts' => $statistics[1],
                'usuarios' => $statistics[2]
            ];

            echo json_encode([
                'success' => true,
                'data' => $statisticsArray
            ]);
            
        } catch(Exception $e) {
            http_response_code(500); // Error interno del servidor
            echo json_encode([
                'success' => false,
                'message' => 'Error del servidor: ' . $e->getMessage()
            ]);
        }

    }

    // @GET /api/getMundiales
    public function getMundiales () {
        // Solo permitir obetener por GET
        if ($_SERVER['REQUEST_METHOD'] !== 'GET') {
            echo json_encode([
                'success' => false,
                'message' => 'Método no permitido'
            ]);
            return;
        }

        try {

            $mundialDAO = new MundialDAO($GLOBALS['conn']);
            $mundiales = $mundialDAO->getMundiales();

            if ($mundiales === null) {
                throw new Exception("No se pudieron obtener las estadisticas desde la base de datos.");
            }

            // Convertir el array de objetos a un array asociativo para el JSON
            $mundialesArray = array_map(function($mundial) {
                $nombreMundial = $mundial->getAño();
                return [
                    

                    'id' => $mundial->getIdMundial(),
                    'nombre' => $mundial->get(),
                    'nacionalidad' => $mundial->getNacionalidad()
                ];
            }, $mundiales);

            echo json_encode([
                'success' => true,
                'data' => $mundialesArray
            ]);

        } catch (Exception $e) {
            http_response_code(500); // Error interno del servidor
            echo json_encode([
                'success' => false,
                'message' => 'Error del servidor: ' . $e->getMessage()
            ]);
        }

    }

}
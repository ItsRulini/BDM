<?php
// includes

// mandatories
include_once '../Connection/conn.php';
include_once '../Utils/Auth.php';

// models
include_once '../Models/Usuario.php';
include_once '../Models/Jugador.php';
include_once '../Models/Publicacion.php';

// dao
include_once '../DAO/UsuarioDAO.php';
include_once '../DAO/PaisDAO.php';
include_once '../DAO/MundialDAO.php';
include_once '../DAO/CategoriaDAO.php';
include_once '../DAO/JugadorDAO.php';
include_once '../DAO/PublicacionDAO.php';


error_reporting(E_ALL & ~E_WARNING & ~E_NOTICE);
ini_set('display_errors', 0);

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

        try {
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
                    'message' => $result ?: 'Error al crear el usuario'
                ]);
            }
        } catch(Exception $e) {
            // Aquí llega el mensaje del trigger
            echo json_encode([
                'success' => false,
                'message' => $e->getMessage()
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

            // 1. Guardamos la foto binaria en una variable ANTES de llamar a toArray()
            $fotoPerfilBinaria = $fullUser['usuario']->getFotoPerfil();

            // 2. Dejamos que tu código convierta el objeto a array como ya lo hacía
            $fullUser['usuario'] = $fullUser['usuario']->toArray();

            // 3. Si había una foto, SOBREESCRIBIMOS el dato binario con su versión en texto (Base64)
            if ($fotoPerfilBinaria !== null) {
            $fullUser['usuario']['fotoPerfil'] = 'data:image/jpeg;base64,' . base64_encode($fotoPerfilBinaria);
            }


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


    // @POST /api/updateUser
    public function updateUser() {
        if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
            echo json_encode(['success' => false, 'message' => 'Método no permitido']);
            return;
        }

        if (!Auth::check()) {
            echo json_encode(['success' => false, 'message' => 'Acceso no autorizado']);
            return;
        }

        try {
            $data = json_decode(file_get_contents("php://input"), true);
            $sessionUser = Auth::user();
            $idUsuario = $sessionUser['id'];

            $usuario = new Usuario();
            $usuario->setIdUsuario($idUsuario);
            $usuario->setNombre($data['nombre'] ?? '');
            $usuario->setApellidoPaterno($data['apellidoPaterno'] ?? '');
            $usuario->setApellidoMaterno($data['apellidoMaterno'] ?? '');
            $usuario->setCorreo($data['correo'] ?? '');
            $usuario->setGenero($data['genero'] ?? '');
            $usuario->setFechaNacimiento($data['fechaNacimiento'] ?? null);
            $usuario->setNacionalidad((int)($data['nacionalidad'] ?? 0));
            $usuario->setPaisNacimiento((int)($data['paisNacimiento'] ?? 0));

            // Manejar la foto de perfil
            if (!empty($data['fotoPerfil'])) {
                $fotoBinaria = base64_decode($data['fotoPerfil']);
                $usuario->setFotoPerfil($fotoBinaria);
            } else {
                $usuario->setFotoPerfil(null);
            }

            $usuarioDAO = new UsuarioDAO($GLOBALS['conn']);

            $result = $usuarioDAO->updateUsuario($usuario);

            if ($result) {
                // Actualizar datos de sesión si cambió el correo
                if ($data['correo'] !== $sessionUser['correo']) {
                    $updatedUser = $usuarioDAO->getUsuarioPorCorreo($data['correo']);
                    if ($updatedUser) {
                        Auth::login($updatedUser['usuario']);
                    }
                }
                
                echo json_encode(['success' => true, 'message' => 'Perfil actualizado con éxito']);
            } else {
                echo json_encode(['success' => false, 'message' => 'Error al actualizar el perfil']);
            }
            
        } catch (Exception $e) {
            error_log("Error en updateUser: " . $e->getMessage());
            echo json_encode(['success' => false, 'message' => $e->getMessage()]);
        }
    }

    // @POST /api/updatePassword
    public function updatePassword() {
        if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
            echo json_encode(['success' => false, 'message' => 'Método no permitido']);
            return;
        }

        if (!Auth::check()) {
            echo json_encode(['success' => false, 'message' => 'Acceso no autorizado']);
            return;
        }

        try {
            $data = json_decode(file_get_contents("php://input"), true);
            $sessionUser = Auth::user();
            $idUsuario = $sessionUser['id'];

            // Validaciones
            if (empty($data['currentPassword']) || empty($data['newPassword'])) {
                echo json_encode(['success' => false, 'message' => 'Todos los campos son obligatorios']);
                return;
            }

            // Verificar contraseña actual
            $usuarioDAO = new UsuarioDAO($GLOBALS['conn']);
            $userData = $usuarioDAO->getUsuarioPorCorreo($sessionUser['correo']);
            
            if (!$userData || $userData['usuario']->getContraseña() !== $data['currentPassword']) {
                echo json_encode(['success' => false, 'message' => 'La contraseña actual es incorrecta']);
                return;
            }

            // Actualizar contraseña
            $result = $usuarioDAO->updateContrasena($idUsuario, $data['newPassword']);

            if ($result) {
                echo json_encode(['success' => true, 'message' => 'Contraseña actualizada exitosamente']);
            } else {
                echo json_encode(['success' => false, 'message' => 'Error al actualizar la contraseña']);
            }
            
        } catch (Exception $e) {
            error_log("Error en updatePassword: " . $e->getMessage());
            echo json_encode(['success' => false, 'message' => 'Error del servidor: ' . $e->getMessage()]);
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

    // @GET /api/getMundial
    public function getMundial ($id) {
        if ($_SERVER['REQUEST_METHOD' !== 'GET']) {
            echo json_encode([
                'success' => false,
                'message' => 'Método no permitido'
            ]);
            return;
        }

        try {
            $mundialDAO = new MundialDAO($GLOBALS['conn']);
            $mundial = $mundialDAO->getMundialPorId($id);

            if ($mundial === null) {
                throw new Exception("No se pudo obtener el mundial desde la base de datos.");
            }

            $sedes = $mundialDAO->getIdSedesMundial($id);

            if ($sedes === null) {
                throw new Exception("No se pudieron obtener las sedes del mundial desde la base de datos.");
            }

            // Convertir 'sedes' (cadena separada por comas) a un array limpio
            $sedesArray = [];
            if (is_string($sedes)) {
                $sedesArray = array_values(array_filter(
                    array_map('trim', 
                    explode(',', $sedes)), 
                    function($v) { return $v !== ''; }));
            }

            echo json_encode([
                'success' => true,
                'data' => $mundial->toArray(),
                'sedes' => $sedesArray,
                'message' => 'Mundial obtenido correctamente'
            ]);
            
        } catch(Exception $e) {
            http_response_code(500); // Error interno del servidor
            echo json_encode([
                'success' => false,
                'message' => 'Error del servidor: ' . $e->getMessage()
            ]);
        }

    }

    // @GET /api/getPosicionesMundial
    public function getPosicionesMundial ($id) {
        if ($_SERVER['REQUEST_METHOD'] !== 'GET') {
            echo json_encode([
                'success' => false,
                'message' => 'Método no permitido'
            ]);
            return;
        }

        try {
            $mundialDAO = new MundialDAO($GLOBALS['conn']);
            $posiciones = $mundialDAO->getPosicionesMundial($id);

            if ($posiciones === null) {
                throw new Exception("No se pudieron obtener las posiciones del mundial desde la base de datos.");
            }

            echo json_encode([
                'success' => true,
                'data' => $posiciones,
                'message' => 'Posiciones obtenidas correctamente'
            ]);
            
        } catch(Exception $e) {
            http_response_code(500); // Error interno del servidor
            echo json_encode([
                'success' => false,
                'message' => 'Error del servidor: ' . $e->getMessage()
            ]);
        }
    }

    // @GET /api/getPremiosMundial
    public function getPremiosMundial ($id) {
        if ($_SERVER['REQUEST_METHOD'] !== 'GET') {
            echo json_encode([
                'success' => false,
                'message' => 'Método no permitido'
            ]);
            return;
        }

        try {
            $mundialDAO = new MundialDAO($GLOBALS['conn']);
            $premios = $mundialDAO->getPremiosMundial($id);

            if ($premios === null) {
                throw new Exception("No se pudieron obtener los premios del mundial desde la base de datos.");
            }

            echo json_encode([
                'success' => true,
                'data' => $premios,
                'message' => 'Premios obtenidos correctamente'
            ]);
            
        } catch(Exception $e) {
            http_response_code(500); // Error interno del servidor
            echo json_encode([
                'success' => false,
                'message' => 'Error del servidor: ' . $e->getMessage()
            ]);
        }
    }

    // @GET /api/getAllPremios
    public function getAllPremios () {
        if ($_SERVER['REQUEST_METHOD'] !== 'GET') {
            echo json_encode([
                'success' => false,
                'message' => 'Método no permitido'
            ]);
            return;
        }

        try {
            $mundialDAO = new MundialDAO($GLOBALS['conn']);
            $premios = $mundialDAO->getAllPremiosMundial();

            if ($premios === null) {
                throw new Exception("No se pudieron obtener los premios del mundial desde la base de datos.");
            }

            echo json_encode([
                'success' => true,
                'data' => $premios,
                'message' => 'Premios obtenidos correctamente'
            ]);
            
        } catch(Exception $e) {
            http_response_code(500); // Error interno del servidor
            echo json_encode([
                'success' => false,
                'message' => 'Error del servidor: ' . $e->getMessage()
            ]);
        }
    }

    // @GET /api/getMundialDashboard
    public function getInfoMundial ($id) {
        if ($_SERVER['REQUEST_METHOD'] !== 'GET') {
            echo json_encode([
                'success' => false,
                'message' => 'Método no permitido'
            ]);
            return;
        }

        try {
            $mundialDAO = new MundialDAO($GLOBALS['conn']);
            
            // 1. Obtener el objeto principal del Mundial
            // Asumimos que la vista vw_info_mundiales ya devuelve los NOMBRES (ej. "Argentina", "Messi")
            // en lugar de solo los IDs.
            $mundial = $mundialDAO->getMundialPorId($id);

            if ($mundial === null) {
                throw new Exception("No se pudo obtener el mundial desde la base de datos.");
            }

            // 2. Obtener las sedes (como ya hacías)
            $sedesString = $mundialDAO->getSedesMundial($id); // Asumimos que esto devuelve "País1, País2"

            // 3. Obtener la galería de multimedia (¡NUEVO!)
            $multimedia = $mundialDAO->getMultimediaMundial($id);

            // 4. Construir el JSON anidado que espera mundial.js
            
            // Convertir logo y mascota a Base64
            $logoBase64 = $mundial->getLogo() ? 'data:image/png;base64,' . base64_encode($mundial->getLogo()) : null;
            $mascotaBase64 = $mundial->getImgMascota() ? 'data:image/png;base64,' . base64_encode($mundial->getImgMascota()) : null;

            $datosOrganizados = [
                'id' => $mundial->getIdMundial(),
                'año' => $mundial->getAño(),
                'sedes' => $sedesString,
                'nombre' => $sedesString . ' ' . $mundial->getAño(),
                'logo' => $logoBase64,
                'descripcion' => $mundial->getDescripcion(),
                
                // Objeto de Mascota
                'mascota' => [
                    'nombre' => $mundial->getNombreMascota(),
                    'imagen' => $mascotaBase64
                ],
                
                // Galería de Multimedia
                'multimedia' => $multimedia, // Esto ya viene en el formato correcto [ {id, url, type, size}, ... ]

                // Objeto de Posiciones
                'posiciones' => [
                    'campeon'     => ['nombre' => $mundial->getCampeon()],
                    'subcampeon'  => ['nombre' => $mundial->getSubcampeon()],
                    'tercerPuesto' => ['nombre' => $mundial->getTercerPuesto()],
                    'cuartoPuesto' => ['nombre' => $mundial->getCuartoPuesto()]
                ],

                // Objeto de Resultado de la Final
                'resultado' => [
                    'equipo1' => $mundial->getCampeon(),
                    'equipo2' => $mundial->getSubcampeon(),
                    'goles1' => $mundial->getMarcador() ? explode('-', $mundial->getMarcador())[0] : '0',
                    'goles2' => $mundial->getMarcador() ? explode('-', $mundial->getMarcador())[1] : '0',
                    'tiempoExtra' => $mundial->getTiempoExtra(),
                    'marcadorTiempoExtra' => $mundial->getMarcadorTiempoExtra(),
                    'penalties' => $mundial->getPenalties(),
                    'muerteSubita' => $mundial->getMuerteSubita(),
                    'marcadorFinal' => $mundial->getMarcadorFinal()
                ],

                // Objeto de Premios
                'premios' => [
                    'balones' => [
                        'oro'    => ['nombre' => $mundial->getBalonOro(), 'foto' => null], // Asumimos que getBalonOro() devuelve el NOMBRE
                        'plata'  => ['nombre' => $mundial->getBalonPlata(), 'foto' => null],
                        'bronce' => ['nombre' => $mundial->getBalonBronce(), 'foto' => null]
                    ],
                    'botines' => [
                        'oro'    => ['nombre' => $mundial->getBotinOro(), 'info' => $mundial->getMaxGoles() . ' goles'],
                        'plata'  => ['nombre' => $mundial->getBotinPlata(), 'info' => null],
                        'bronce' => ['nombre' => $mundial->getBotinBronce(), 'info' => null]
                    ],
                    'guanteOro' => ['nombre' => $mundial->getGuanteOro(), 'foto' => null]
                ]
            ];

            echo json_encode([
                'success' => true,
                'data' => $datosOrganizados, // ¡Enviamos los datos organizados!
                'message' => 'Mundial obtenido correctamente'
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
    public function getMundiales() {
        // Evitar cualquier salida antes del JSON
        if (ob_get_level()) {
            ob_clean();
        }
        
        header('Content-Type: application/json');
        
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
                throw new Exception("Error al obtener los mundiales");
            }

            if (empty($mundiales)) {
                echo json_encode([
                    'success' => true,
                    'data' => [],
                    'message' => 'No hay mundiales registrados'
                ]);
                return;
            }

            // Convertir mundiales a array
            $mundialesArray = array_map(function($mundial) {
                // Obtener sedes
                $sedes = '';

                try {
                    $mundialDAO = new MundialDAO($GLOBALS['conn']);
                    $sedesMundial = $mundialDAO->getSedesMundial($mundial->getIdMundial());
                    
                    if ($sedesMundial !== null) {
                        $sedes = $nombre = $sedesMundial;
                    }

                } catch (Exception $e) {
                   error_log("Error al obtener sedes: " . $e->getMessage());
                }

                return [
                    'id' => $mundial->getIdMundial(),
                    'year' => $mundial->getAño(),
                    'name' => $nombre . ' ' . $mundial->getAño(),
                    'description' => $mundial->getDescripcion() ?: 'Sin descripción',
                    'image' => $mundial->getLogo() ? 'data:image/jpeg;base64,' . base64_encode($mundial->getLogo()) : 'assets/default-mundial.png',
                    'sedes' => $sedes,
                    'mascota' => $mundial->getNombreMascota()
                ];
            }, $mundiales);

            echo json_encode([
                'success' => true,
                'data' => $mundialesArray
            ], JSON_UNESCAPED_UNICODE);

        } catch (Exception $e) {
            error_log("Error en getMundiales API: " . $e->getMessage());
            http_response_code(500);
            echo json_encode([
                'success' => false,
                'message' => 'Error del servidor: ' . $e->getMessage()
            ]);
        }
    }

    // @GET /api/getMultimediaMundial
    public function getMultimediaMundial() {
        header('Content-Type: application/json');
        
        if ($_SERVER['REQUEST_METHOD'] !== 'GET') {
            echo json_encode(['success' => false, 'message' => 'Método no permitido']);
            return;
        }

        try {
            $idMundial = isset($_GET['id']) ? (int)$_GET['id'] : 0;
            
            if ($idMundial <= 0) {
                echo json_encode(['success' => false, 'message' => 'ID de mundial inválido']);
                return;
            }

            $mundialDAO = new MundialDAO($GLOBALS['conn']);
            $multimedia = $mundialDAO->getMultimediaMundial($idMundial);

            if ($multimedia !== null) {
                echo json_encode([
                    'success' => true,
                    'data' => $multimedia
                ]);
            } else {
                echo json_encode([
                    'success' => true,
                    'data' => [],
                    'message' => 'No se encontró multimedia para este mundial'
                ]);
            }

        } catch (Exception $e) {
            error_log("Error en getMultimediaMundial: " . $e->getMessage());
            echo json_encode([
                'success' => false,
                'message' => $e->getMessage()
            ]);
        }
    }

    // @POST /api/crearJugador
    public function crearJugador() {
        if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
            echo json_encode(['success' => false, 'message' => 'Método no permitido']);
            return;
        }

        try {
            // Leemos el JSON que nos enviará el nuevo JavaScript
            $data = json_decode(file_get_contents("php://input"), true);

            // --- Lógica para formatear la fecha ---
            $fechaNacimientoInput = $data['fechaNacimiento'] ?? null;
            $fechaNacimiento = null;
            if ($fechaNacimientoInput) {
                $date = DateTime::createFromFormat('Y-m-d', $fechaNacimientoInput);
                if ($date === false) { $date = DateTime::createFromFormat('d/m/Y', $fechaNacimientoInput); }
                if ($date !== false) { $fechaNacimiento = $date->format('Y-m-d'); }
            }
            // --- Fin de la lógica de fecha ---

            if (empty($data['nombre']) || empty($data['nacionalidad']) || empty($fechaNacimiento)) {
                throw new Exception("Nombre, nacionalidad y fecha son obligatorios y válidos.");
            }

            $jugador = new Jugador();
            $jugador->setNombre($data['nombre']);
            $jugador->setNacionalidad((int)$data['nacionalidad']);
            $jugador->setFechaNacimiento($fechaNacimiento);

            // Decodificamos la imagen que viene en Base64 desde el JavaScript
            if (!empty($data['foto'])) {
                // Quitamos el prefijo 'data:image/...;base64,'
                $base64Image = explode(',', $data['foto'])[1];
                $fotoBinaria = base64_decode($base64Image);
                $jugador->setFoto($fotoBinaria);
            } else {
                $jugador->setFoto(null);
            }

            $jugadorDAO = new JugadorDAO($GLOBALS['conn']);
            $result = $jugadorDAO->crearJugador($jugador);

            if ($result === null) {
                throw new Exception("No se pudo crear el jugador.");
            }

            echo json_encode([
                'success' => true,
                'id' => $result,
                'message' => 'Jugador creado correctamente'
            ]);
        
        } catch(Exception $e) {
            http_response_code(500);
            echo json_encode(['success' => false, 'message' => 'Error: ' . $e->getMessage()]);
        }
    }

    // @GET /api/getJugadores
    public function getJugadores() {
        // Solo permitir obetener por GET
        if ($_SERVER['REQUEST_METHOD'] !== 'GET') {
            echo json_encode([
                'success' => false,
                'message' => 'Método no permitido'
            ]);
            return;
        }

        try {
            $jugadorDAO = new JugadorDAO($GLOBALS['conn']);
            $jugadores = $jugadorDAO->getJugadores(); // Esto devuelve un array de objetos Jugador

            if ($jugadores === null) {
                throw new Exception("No se pudieron obtener los jugadores desde la base de datos.");
            }

            // Convertir el array de objetos a un array asociativo para el JSON
            $jugadoresArray = array_map(function($jugador) {
                return [
                    'id' => $jugador->getIdJugador(),
                    'nombre' => $jugador->getNombre(),
                    'foto' => $jugador->getFoto() ? 'data:image/jpeg;base64,' . base64_encode($jugador->getFoto()) : null,
                    'nacionalidad' => $jugador->getNacionalidad(),
                    'fechaNacimiento' => $jugador->getFechaNacimiento()
                ];
            }, $jugadores);

            echo json_encode([
                'success' => true,
                'data' => $jugadoresArray
            ]);

        } catch (Exception $e) {
            http_response_code(500); // Error interno del servidor
            echo json_encode([
                'success' => false,
                'message' => 'Error del servidor: ' . $e->getMessage()
            ]);
        }
    }



    // @POST /api/crearMundial
    public function crearMundial() {
        if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
            echo json_encode(['success' => false, 'message' => 'Método no permitido']);
            return;
        }

        if (!Auth::check()) {
            echo json_encode(['success' => false, 'message' => 'No autorizado']);
            return;
        }

        try {
            $data = json_decode(file_get_contents("php://input"), true);

            $mundial = new Mundial();
            $mundial->setAño((int)$data['year']);
            $mundial->setDescripcion($data['descripcion']);
            $mundial->setNombreMascota($data['nombreMascota'] ?? null);
            $mundial->setCampeon($data['campeon'] ? (int)$data['campeon'] : null);
            $mundial->setSubcampeon($data['subcampeon'] ? (int)$data['subcampeon'] : null);
            $mundial->setTercerPuesto($data['tercerPuesto'] ? (int)$data['tercerPuesto'] : null);
            $mundial->setCuartoPuesto($data['cuartoPuesto'] ? (int)$data['cuartoPuesto'] : null);
            $mundial->setMarcador($data['marcador'] ?? null);
            $mundial->setTiempoExtra($data['tiempoExtra'] ?? false);
            $mundial->setMarcadorTiempoExtra($data['marcadorTiempoExtra'] ?? null);
            $mundial->setPenalties($data['penalties'] ?? false);
            $mundial->setMuerteSubita($data['muerteSubita'] ?? false);
            $mundial->setMarcadorFinal($data['marcadorFinal'] ?? null);
            $mundial->setBalonOro($data['balonOro'] ? (int)$data['balonOro'] : null);
            $mundial->setBalonPlata($data['balonPlata'] ? (int)$data['balonPlata'] : null);
            $mundial->setBalonBronce($data['balonBronce'] ? (int)$data['balonBronce'] : null);
            $mundial->setBotinOro($data['botinOro'] ? (int)$data['botinOro'] : null);
            $mundial->setBotinPlata($data['botinPlata'] ? (int)$data['botinPlata'] : null);
            $mundial->setBotinBronce($data['botinBronce'] ? (int)$data['botinBronce'] : null);
            $mundial->setGuanteOro($data['guanteOro'] ? (int)$data['guanteOro'] : null);
            $mundial->setMaxGoles($data['golesMaximoGoleador'] ? (int)$data['golesMaximoGoleador'] : null);

            // Procesar logo
            if (!empty($data['logo'])) {
                $logoBinario = base64_decode($data['logo']);
                $mundial->setLogo($logoBinario);
            }

            // Procesar imagen mascota
            if (!empty($data['imgMascota'])) {
                $mascotaBinaria = base64_decode($data['imgMascota']);
                $mundial->setImgMascota($mascotaBinaria);
            }

            $sedes = json_decode($data['sedes'], true) ?? [];

            $mundialDAO = new MundialDAO($GLOBALS['conn']);
            $idMundial = $mundialDAO->crearMundial($mundial, $sedes);

            if ($idMundial) {
                // Procesar multimedia (imágenes y videos)
                if (!empty($data['multimedia']) && is_array($data['multimedia'])) {
                    $archivosMultimedia = [];
                    
                    foreach ($data['multimedia'] as $archivoBase64) {
                        if (!empty($archivoBase64)) {
                            $archivoBinario = base64_decode($archivoBase64);
                            $archivosMultimedia[] = $archivoBinario;
                        }
                    }

                    if (!empty($archivosMultimedia)) {
                        $resultMultimedia = $mundialDAO->insertarMultimedia($idMundial, $archivosMultimedia);
                        
                        if (!$resultMultimedia) {
                            error_log("Advertencia: Mundial creado pero hubo error al insertar multimedia");
                        }
                    }
                }

                echo json_encode([
                    'success' => true,
                    'message' => 'Mundial creado exitosamente',
                    'id' => $idMundial
                ]);
            } else {
                echo json_encode(['success' => false, 'message' => 'Error al crear el mundial']);
            }

        } catch (Exception $e) {
            error_log("Error en crearMundial: " . $e->getMessage());
            echo json_encode(['success' => false, 'message' => $e->getMessage()]);
        }
    }

    // @PUT /api/updateMundial
    public function actualizarMundial() {
        if ($_SERVER['REQUEST_METHOD'] !== 'PUT') {
            echo json_encode(['success' => false, 'message' => 'Método no permitido']);
            return;
        }

        if (!Auth::check()) {
            echo json_encode(['success' => false, 'message' => 'No autorizado']);
            return;
        }

        try {
            $data = json_decode(file_get_contents("php://input"), true);

            if (!$data) {
                echo json_encode([
                    'success' => false,
                    'message' => 'Datos inválidos o vacíos.'
                ]);
                return;
            }

            $mundial = new Mundial();
            $mundial->setIdMundial((int)$data['id']);
            $mundial->setAño((int)$data['year']);
            $mundial->setDescripcion($data['descripcion']);
            $mundial->setNombreMascota($data['nombreMascota'] ?? null);
            $mundial->setCampeon($data['campeon'] ? (int)$data['campeon'] : null);
            $mundial->setSubcampeon($data['subcampeon'] ? (int)$data['subcampeon'] : null);
            $mundial->setTercerPuesto($data['tercerPuesto'] ? (int)$data['tercerPuesto'] : null);
            $mundial->setCuartoPuesto($data['cuartoPuesto'] ? (int)$data['cuartoPuesto'] : null);
            $mundial->setMarcador($data['marcador'] ?? null);
            $mundial->setTiempoExtra($data['tiempoExtra'] ?? false);
            $mundial->setMarcadorTiempoExtra($data['marcadorTiempoExtra'] ?? null);
            $mundial->setPenalties($data['penalties'] ?? false);
            $mundial->setMuerteSubita($data['muerteSubita'] ?? false);
            $mundial->setMarcadorFinal($data['marcadorFinal'] ?? null);
            $mundial->setBalonOro($data['balonOro'] ? (int)$data['balonOro'] : null);
            $mundial->setBalonPlata($data['balonPlata'] ? (int)$data['balonPlata'] : null);
            $mundial->setBalonBronce($data['balonBronce'] ? (int)$data['balonBronce'] : null);
            $mundial->setBotinOro($data['botinOro'] ? (int)$data['botinOro'] : null);
            $mundial->setBotinPlata($data['botinPlata'] ? (int)$data['botinPlata'] : null);
            $mundial->setBotinBronce($data['botinBronce'] ? (int)$data['botinBronce'] : null);
            $mundial->setGuanteOro($data['guanteOro'] ? (int)$data['guanteOro'] : null);
            $mundial->setMaxGoles($data['golesMaximoGoleador'] ? (int)$data['golesMaximoGoleador'] : null);

            // Procesar logo
            if (!empty($data['logo'])) {
                $logoBinario = base64_decode($data['logo']);
                $mundial->setLogo($logoBinario);
            }

            // Procesar imagen mascota
            if (!empty($data['imgMascota'])) {
                $mascotaBinaria = base64_decode($data['imgMascota']);
                $mundial->setImgMascota($mascotaBinaria);
            }

            $sedes = json_decode($data['sedes'], true) ?? [];

            // Procesar multimedia (imágenes y videos)
            $archivosMultimedia = [];
            if (!empty($data['multimedia']) && is_array($data['multimedia'])) {
                foreach ($data['multimedia'] as $archivoBase64) {
                    if (!empty($archivoBase64)) {
                        $archivoBinario = base64_decode($archivoBase64);
                        $archivosMultimedia[] = $archivoBinario;
                    }
                }
            }

            $mundialDAO = new MundialDAO($GLOBALS['conn']);
            $resultado = $mundialDAO->updateMundial($mundial, $sedes, $archivosMultimedia);

            if (!$resultado) {
                throw new Exception('No se pudo actualizar el mundial.');
            }

            echo json_encode([
                'success' => true,
                'message' => 'Mundial actualizado exitosamente'
            ]);

        } catch (Exception $e) {
            error_log("Error en actualizarMundial: " . $e->getMessage());
            echo json_encode(['success' => false, 'message' => $e->getMessage()]);
        }
    }

    // @POST /api/crearPublicacion
    public function crearPublicacion() {

        if (ob_get_level()) {
            ob_clean();
        }
        
        if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
            echo json_encode(['success' => false, 'message' => 'Método no permitido']);
            return;
        }

        if (!Auth::check()) {
            echo json_encode(['success' => false, 'message' => 'No autorizado']);
            return;
        }

        try {
            $data = json_decode(file_get_contents("php://input"), true);
            
            // ⭐ VALIDAR QUE SE RECIBIÓ DATA
            if (!$data) {
                throw new Exception('No se recibieron datos válidos');
            }
            
            $sessionUser = Auth::user();

            $publicacion = new Publicacion();
            $publicacion->setContenido($data['contenido'] ?? '');
            $publicacion->setIdCreador($sessionUser['id']);
            $publicacion->setIdMundial((int)($data['idMundial'] ?? 0));

            // ⭐ VALIDAR DATOS OBLIGATORIOS
            if (empty($data['contenido'])) {
                throw new Exception('El contenido es obligatorio');
            }
            
            if (empty($data['idMundial'])) {
                throw new Exception('Debes seleccionar un mundial');
            }

            $categorias = $data['categorias'] ?? [];
            
            // ⭐ VALIDAR CATEGORÍAS
            if (empty($categorias) || !is_array($categorias)) {
                throw new Exception('Debes seleccionar al menos una categoría');
            }
            
            // Procesar multimedia
            $multimedia = [];
            if (isset($data['multimedia']) && is_array($data['multimedia'])) {
                foreach ($data['multimedia'] as $media) {
                    if (!empty($media)) {
                        // ⭐ VALIDAR QUE SEA BASE64 VÁLIDO
                        $decoded = base64_decode($media, true);
                        if ($decoded !== false) {
                            $multimedia[] = $decoded;
                        }
                    }
                }
            }

            $publicacionDAO = new PublicacionDAO($GLOBALS['conn']);
            $result = $publicacionDAO->crearPublicacion($publicacion, $categorias, $multimedia);

            if ($result) {
                echo json_encode([
                    'success' => true,
                    'message' => 'Publicación enviada para revisión',
                    'id' => $result
                ]);
            } else {
                echo json_encode(['success' => false, 'message' => 'Error al crear publicación']);
            }

        } catch (Exception $e) {
            error_log("Error en crearPublicacion: " . $e->getMessage());
            echo json_encode([
                'success' => false, 
                'message' => 'Error: ' . $e->getMessage()
            ]);
        }
    }

    // @GET /api/getPublicacionesUsuario
    public function getPublicacionesUsuario() {
        // ⭐ LIMPIAR CUALQUIER OUTPUT PREVIO
        if (ob_get_level()) {
            ob_clean();
        }
        
        if ($_SERVER['REQUEST_METHOD'] !== 'GET') {
            echo json_encode(['success' => false, 'message' => 'Método no permitido']);
            return;
        }

        if (!Auth::check()) {
            echo json_encode(['success' => false, 'message' => 'No autorizado']);
            return;
        }

        try {
            $sessionUser = Auth::user();
        
            $publicacionDAO = new PublicacionDAO($GLOBALS['conn']);
            $publicaciones = $publicacionDAO->getPublicacionesPorUsuario($sessionUser['id']);

            if ($publicaciones === null) {
                throw new Exception("Error al obtener publicaciones");
            }

            // Formatear respuesta
            $publicacionesArray = array_map(function($item) use ($publicacionDAO) { // ⭐ Added use ($publicacionDAO)
                $pub = $item['publicacion'];
                $idPublicacion = $pub->getIdPublicacion(); // ⭐ Get ID

                // ⭐ NUEVO: Obtener multimedia
                $multimedia = $publicacionDAO->getMultimediaPublicacion($idPublicacion);
                $multimediaArray = array_map(function($media) {
                    // Detectar tipo MIME
                    $finfo = new finfo(FILEINFO_MIME_TYPE);
                    $mimeType = $finfo->buffer($media['contenido']);
                    $base64 = base64_encode($media['contenido']);
                    return [
                        'id' => $media['id'],
                        'src' => "data:$mimeType;base64,$base64",
                        'type' => $mimeType
                    ];
                }, $multimedia);
                
                // ⭐ NUEVO: Obtener categorías
                $categorias = $publicacionDAO->getCategoriasPublicacion($idPublicacion);

                return [
                    'id' => $idPublicacion,
                    'contenido' => $pub->getContenido(),
                    'fechaCreacion' => $pub->getFechaCreacion(),
                    'estatus' => $pub->getEstatusAprobacion(),
                    'mundialAño' => $item['mundialAño'],
                    'multimedia' => $multimediaArray, // ⭐ NUEVO
                    'categorias' => $categorias // ⭐ NUEVO
                ];
            }, $publicaciones);

            echo json_encode([
                'success' => true,
                'data' => $publicacionesArray
            ]);

        } catch (Exception $e) {
            error_log("Error en getPublicacionesUsuario: " . $e->getMessage());
            echo json_encode([
                'success' => false, 
                'message' => 'Error: ' . $e->getMessage()
            ]);
        }
    }

    // ⭐
    // ⭐ NUEVA FUNCIÓN AÑADIDA
    // ⭐
    // @GET /api/getPublicacionesAprobadas (para publico)
    public function getPublicacionesAprobadas() {
        if (ob_get_level()) {
            ob_clean();
        }
        
        if ($_SERVER['REQUEST_METHOD'] !== 'GET') {
            echo json_encode(['success' => false, 'message' => 'Método no permitido']);
            return;
        }

        try {
            $publicacionDAO = new PublicacionDAO($GLOBALS['conn']);
            // Reutilizamos la función de admin, ya que obtiene todo
            $publicaciones = $publicacionDAO->getTodasPublicaciones(); 

            if ($publicaciones === null) {
                throw new Exception("Error al obtener publicaciones");
            }

            $publicacionesAprobadas = [];

            // Formatear respuesta con multimedia y categorías
            foreach ($publicaciones as $item) {
                
                // ⭐ FILTRAR SOLO APROBADAS
                if ($item['publicacion']->getEstatusAprobacion() !== 'approved') {
                    continue;
                }
                
                $pub = $item['publicacion'];
                $idPublicacion = $pub->getIdPublicacion();
                
                // Obtener multimedia
                $multimedia = $publicacionDAO->getMultimediaPublicacion($idPublicacion);
                $multimediaArray = array_map(function($media) {
                    // Detectar tipo MIME
                    $finfo = new finfo(FILEINFO_MIME_TYPE);
                    $mimeType = $finfo->buffer($media['contenido']);
                    $base64 = base64_encode($media['contenido']);
                    return [
                        'id' => $media['id'],
                        'src' => "data:$mimeType;base64,$base64",
                        'type' => $mimeType // e.g., 'image/jpeg' or 'video/mp4'
                    ];
                }, $multimedia);
                
                // Obtener categorías
                $categorias = $publicacionDAO->getCategoriasPublicacion($idPublicacion);
                
                $publicacionesAprobadas[] = [
                    'id' => $idPublicacion,
                    'contenido' => $pub->getContenido(),
                    'fechaCreacion' => $pub->getFechaCreacion(),
                    'estatus' => $pub->getEstatusAprobacion(),
                    'mundialAño' => $item['mundialAño'],
                    'autorNombre' => $item['autorNombre'],
                    'idCreador' => $pub->getIdCreador(),
                    'multimedia' => $multimediaArray,
                    'categorias' => $categorias,
                    'views' => 0, // Mocked for now
                    'likes' => 0, // Mocked for now
                    'comments' => 0 // Mocked for now
                ];
            }

            echo json_encode([
                'success' => true,
                'data' => $publicacionesAprobadas
            ]);

        } catch (Exception $e) {
            error_log("Error en getPublicacionesAprobadas: " . $e->getMessage());
            echo json_encode([
                'success' => false, 
                'message' => 'Error: ' . $e->getMessage()
            ]);
        }
    }


    // @GET /api/getTodasPublicaciones (para admin)
    public function getTodasPublicaciones() {
        if (ob_get_level()) {
            ob_clean();
        }
        
        if ($_SERVER['REQUEST_METHOD'] !== 'GET') {
            echo json_encode(['success' => false, 'message' => 'Método no permitido']);
            return;
        }

        if (!Auth::check()) {
            echo json_encode(['success' => false, 'message' => 'No autorizado']);
            return;
        }

        try {
            $publicacionDAO = new PublicacionDAO($GLOBALS['conn']);
            $publicaciones = $publicacionDAO->getTodasPublicaciones();

            if ($publicaciones === null) {
                throw new Exception("Error al obtener publicaciones");
            }

            // Formatear respuesta con multimedia y categorías
            $publicacionesArray = array_map(function($item) use ($publicacionDAO) {
                $pub = $item['publicacion'];
                $idPublicacion = $pub->getIdPublicacion(); // ⭐ Get ID
                
                // Obtener multimedia
                $multimedia = $publicacionDAO->getMultimediaPublicacion($idPublicacion);
                $multimediaArray = array_map(function($media) {
                    // ⭐ Detectar tipo MIME
                    $finfo = new finfo(FILEINFO_MIME_TYPE);
                    $mimeType = $finfo->buffer($media['contenido']);
                    $base64 = base64_encode($media['contenido']);
                    return [
                        'id' => $media['id'],
                        'src' => "data:$mimeType;base64,$base64",
                        'type' => $mimeType
                    ];
                }, $multimedia);
                
                // Obtener categorías
                $categorias = $publicacionDAO->getCategoriasPublicacion($idPublicacion);
                
                return [
                    'id' => $idPublicacion,
                    'contenido' => $pub->getContenido(),
                    'fechaCreacion' => $pub->getFechaCreacion(),
                    'estatus' => $pub->getEstatusAprobacion(),
                    'mundialAño' => $item['mundialAño'],
                    'autorNombre' => $item['autorNombre'],
                    'idCreador' => $pub->getIdCreador(),
                    'multimedia' => $multimediaArray,
                    'categorias' => $categorias,
                    'views' => 0, // Mocked
                    'likes' => 0, // Mocked
                    'comments' => 0 // Mocked
                ];
            }, $publicaciones);

            echo json_encode([
                'success' => true,
                'data' => $publicacionesArray
            ]);

        } catch (Exception $e) {
            error_log("Error en getTodasPublicaciones: " . $e->getMessage());
            echo json_encode([
                'success' => false, 
                'message' => 'Error: ' . $e->getMessage()
            ]);
        }
    }

    // @POST /api/aprobarPublicacion
    public function aprobarPublicacion() {
        if (ob_get_level()) {
            ob_clean();
        }
        
        if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
            echo json_encode(['success' => false, 'message' => 'Método no permitido']);
            return;
        }

        if (!Auth::check()) {
            echo json_encode(['success' => false, 'message' => 'No autorizado']);
            return;
        }

        try {
            $data = json_decode(file_get_contents("php://input"), true);
            
            if (!isset($data['idPublicacion'])) {
                throw new Exception('ID de publicación requerido');
            }
            
            $publicacionDAO = new PublicacionDAO($GLOBALS['conn']);
            $result = $publicacionDAO->aprobarPublicacion((int)$data['idPublicacion']);

            if ($result) {
                echo json_encode([
                    'success' => true,
                    'message' => 'Publicación aprobada exitosamente'
                ]);
            } else {
                echo json_encode(['success' => false, 'message' => 'Error al aprobar la publicación']);
            }

        } catch (Exception $e) {
            error_log("Error en aprobarPublicacion: " . $e->getMessage());
            echo json_encode([
                'success' => false, 
                'message' => 'Error: ' . $e->getMessage()
            ]);
        }
    }

    // @POST /api/rechazarPublicacion
    public function rechazarPublicacion() {
        if (ob_get_level()) {
            ob_clean();
        }
        
        if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
            echo json_encode(['success' => false, 'message' => 'Método no permitido']);
            return;
        }

        if (!Auth::check()) {
            echo json_encode(['success' => false, 'message' => 'No autorizado']);
            return;
        }

        try {
            $data = json_decode(file_get_contents("php://input"), true);
            
            if (!isset($data['idPublicacion'])) {
                throw new Exception('ID de publicación requerido');
            }
            
            $publicacionDAO = new PublicacionDAO($GLOBALS['conn']);
            $result = $publicacionDAO->rechazarPublicacion((int)$data['idPublicacion']);

            if ($result) {
                echo json_encode([
                    'success' => true,
                    'message' => 'Publicación rechazada exitosamente'
                ]);
            } else {
                echo json_encode(['success' => false, 'message' => 'Error al rechazar la publicación']);
            }

        } catch (Exception $e) {
            error_log("Error en rechazarPublicacion: " . $e->getMessage());
            echo json_encode([
                'success' => false, 
                'message' => 'Error: ' . $e->getMessage()
            ]);
        }
    }


    

}
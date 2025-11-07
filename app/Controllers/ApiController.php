<?php
// includes

// mandatories
include_once '../Connection/conn.php';
include_once '../Utils/Auth.php';

// models
include_once '../Models/Usuario.php';
include_once '../Models/Jugador.php'; //nuevo
include_once '../Models/Publicacion.php';

// dao
include_once '../DAO/UsuarioDAO.php';
include_once '../DAO/PaisDAO.php';
include_once '../DAO/MundialDAO.php';
include_once '../DAO/CategoriaDAO.php';
include_once '../DAO/JugadorDAO.php'; //nuevo
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
            $sedesQuery = "SELECT p.Pais FROM Sedes s 
                          INNER JOIN Pais p ON s.Sede = p.IdPais 
                          WHERE s.IdMundial = ?";
            $stmt = mysqli_prepare($GLOBALS['conn'], $sedesQuery);
            $mundialId = $mundial->getIdMundial(); // Guardar en variable primero
            mysqli_stmt_bind_param($stmt, 'i', $mundialId); // Pasar la variable
            mysqli_stmt_execute($stmt);
            $result = mysqli_stmt_get_result($stmt);
            
            $sedes = [];
            while ($row = mysqli_fetch_assoc($result)) {
                $sedes[] = $row['Pais'];
            }
            mysqli_stmt_close($stmt);

            // Construir nombre del mundial
            $nombre = '';
            if (!empty($sedes)) {
                if (count($sedes) === 1) {
                    $nombre = $sedes[0] . ' ' . $mundial->getAño();
                } else {
                    $nombre = implode(' y ', $sedes) . ' ' . $mundial->getAño();
                }
            } else {
                $nombre = 'Mundial ' . $mundial->getAño();
            }

            return [
                'id' => $mundial->getIdMundial(),
                'year' => $mundial->getAño(),
                'name' => $nombre,
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
            $result = $mundialDAO->crearMundial($mundial, $sedes);

            if ($result) {
                echo json_encode([
                    'success' => true,
                    'message' => 'Mundial creado exitosamente',
                    'id' => $result
                ]);
            } else {
                echo json_encode(['success' => false, 'message' => 'Error al crear el mundial']);
            }

        } catch (Exception $e) {
            error_log("Error en crearMundial: " . $e->getMessage());
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
            $publicacionesArray = array_map(function($item) {
                $pub = $item['publicacion'];
                return [
                    'id' => $pub->getIdPublicacion(),
                    'contenido' => $pub->getContenido(),
                    'fechaCreacion' => $pub->getFechaCreacion(),
                    'estatus' => $pub->getEstatusAprobacion(),
                    'mundial' => $item['mundialAño']
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
            
            // Obtener multimedia
            $multimedia = $publicacionDAO->getMultimediaPublicacion($pub->getIdPublicacion());
            $multimediaArray = array_map(function($media) {
                return [
                    'id' => $media['id'],
                    'contenido' => base64_encode($media['contenido'])
                ];
            }, $multimedia);
            
            // Obtener categorías
            $categorias = $publicacionDAO->getCategoriasPublicacion($pub->getIdPublicacion());
            
            return [
                'id' => $pub->getIdPublicacion(),
                'contenido' => $pub->getContenido(),
                'fechaCreacion' => $pub->getFechaCreacion(),
                'estatus' => $pub->getEstatusAprobacion(),
                'mundialAño' => $item['mundialAño'],
                'autorNombre' => $item['autorNombre'],
                'idCreador' => $pub->getIdCreador(),
                'multimedia' => $multimediaArray,
                'categorias' => $categorias,
                'views' => 0,
                'likes' => 0,
                'comments' => 0
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
<?php
include_once '../Models/Mundial.php';

class MundialDAO {
    private $conn;

    public function __construct($conn) {
        $this->conn = $conn;
    }

    public function getMundialesCreados (): ?int {
        try {
            $query = "CALL sp_MundialesCreados()";
            $stmt = mysqli_prepare($this->conn, $query);
            mysqli_stmt_execute($stmt);
            $result = mysqli_stmt_get_result($stmt);

            if ($result && mysqli_num_rows($result) > 0) {
                $row = mysqli_fetch_assoc($result);
                $mundiales = $row['mundiales'];
                return $mundiales;
            }

        } catch (mysqli_sql_exception $e) {
            echo "Error: " . $e->getMessage();
            return null;
        }
        return null;
    }

    public function getPostsPendientes (): ?int {
        try {
            $query = "CALL sp_PostsPendientes()";
            $stmt = mysqli_prepare($this->conn, $query);
            mysqli_stmt_execute($stmt);
            $result = mysqli_stmt_get_result($stmt);

            if ($result && mysqli_num_rows($result) > 0) {
                $row = mysqli_fetch_assoc($result);
                $pendientes = $row['posts_pendientes'];
                return $pendientes;
            }

        } catch (mysqli_sql_exception $e) {
            echo "Error: " . $e->getMessage();
            return null;
        }
        return null;
    }

    public function getUsuariosRegistrados (): ?int {
        try {
            $query = "CALL sp_UsuariosRegistrados()";
            $stmt = mysqli_prepare($this->conn, $query);
            mysqli_stmt_execute($stmt);
            $result = mysqli_stmt_get_result($stmt);

            if ($result && mysqli_num_rows($result) > 0) {
                $row = mysqli_fetch_assoc($result);
                $usuarios = $row['usuarios_registrados'];
                return $usuarios;
            }

        } catch (mysqli_sql_exception $e) {
            echo "Error: " . $e->getMessage();
            return null;
        }
        return null;
    }

    public function getStatistics(): ?array {
        try {
            
            // Inicializar array vacío
            $statistics = [];

            // Append de objetos al array
            $statistics[] = $this->getMundialesCreados();
            $statistics[] = $this->getPostsPendientes();
            $statistics[] = $this->getUsuariosRegistrados();

            return $statistics;

        } catch (Exception $e) {
            echo "Error: " . $e->getMessage();
            return null;
        }
    }

    public function getMundiales(): ?array {
        try {
            $query = "CALL sp_getMundiales()";
            $stmt = mysqli_prepare($this->conn, $query);

            if (!$stmt) {
                error_log("Error preparando getMundiales: " . mysqli_error($this->conn));
                return [];
            }

            if (!mysqli_stmt_execute($stmt)) {
                error_log("Error ejecutando getMundiales: " . mysqli_stmt_error($stmt));
                mysqli_stmt_close($stmt);
                return [];
            }

            $result = mysqli_stmt_get_result($stmt);
            $mundiales = [];

            if ($result) {
                while ($row = mysqli_fetch_assoc($result)) {
                    $mundial = new Mundial();
                    $mundial->setIdMundial($row['IdMundial']);
                    $mundial->setAño($row['Año']);
                    $mundial->setDescripcion($row['Descripcion']);
                    $mundial->setLogo($row['logo']);
                    $mundial->setImgMascota($row['img_mascota']);
                    $mundial->setNombreMascota($row['nombre_mascota']);
                    $mundial->setCampeon($row['campeon']);
                    $mundial->setSubcampeon($row['subcampeon']);
                    $mundial->setTercerPuesto($row['tercer_puesto']);
                    $mundial->setCuartoPuesto($row['cuarto_puesto']);
                    $mundial->setMarcador($row['marcador']);
                    $mundial->setTiempoExtra($row['tiempo_extra']);
                    $mundial->setMarcadorTiempoExtra($row['marcador_tiempo_extra']);
                    $mundial->setPenalties($row['penalties']);
                    $mundial->setMuerteSubita($row['muerte_subita']);
                    $mundial->setMarcadorFinal($row['marcador_final']);
                    $mundial->setBalonOro($row['balon_oro']);
                    $mundial->setBalonPlata($row['balon_plata']);
                    $mundial->setBalonBronce($row['balon_bronce']);
                    $mundial->setBotinOro($row['botin_oro']);
                    $mundial->setBotinPlata($row['botin_plata']);
                    $mundial->setBotinBronce($row['botin_bronce']);
                    $mundial->setGuanteOro($row['guante_oro']);
                    $mundial->setMaxGoles($row['max_goles']);

                    $mundiales[] = $mundial;
                }
                mysqli_free_result($result);
            }

            mysqli_stmt_close($stmt);
            mysqli_next_result($this->conn);
            
            return $mundiales;

        } catch (Exception $e) {
            error_log("Error en MundialDAO::getMundiales(): " . $e->getMessage());
            return [];
        }
    }

    public function getSedesMundial(int $idMundial): ?string {
        try {
            $query = "CALL sp_getSedes(?)";
            $stmt = mysqli_prepare($this->conn, $query);
            mysqli_stmt_bind_param($stmt, 'i', $idMundial);
            mysqli_stmt_execute($stmt);
            $result = mysqli_stmt_get_result($stmt);
            
            $sedes = null;
            if ($result && mysqli_num_rows($result) > 0) {
                $row = mysqli_fetch_assoc($result);
                $sedes = $row['Sedes'];
            }

            mysqli_stmt_close($stmt);
            mysqli_next_result($this->conn);

            return $sedes;
        } catch (Exception $e) {
            error_log("Error en MundialDAO::getSedesMundial: " . $e->getMessage());
            return null;
        }
    }


    public function crearMundial(Mundial $mundial, array $sedes): ?int {
        try {
            $query = "CALL sp_crearMundial(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, @idMundial)";
            $stmt = mysqli_prepare($this->conn, $query);

            if (!$stmt) {
                throw new Exception("Error al preparar la consulta: " . mysqli_error($this->conn));
            }

            $año = $mundial->getAño();
            $descripcion = $mundial->getDescripcion();
            $logo = $mundial->getLogo();
            $imgMascota = $mundial->getImgMascota();
            $nombreMascota = $mundial->getNombreMascota();
            $campeon = $mundial->getCampeon();
            $subcampeon = $mundial->getSubcampeon();
            $tercerPuesto = $mundial->getTercerPuesto();
            $cuartoPuesto = $mundial->getCuartoPuesto();
            $marcador = $mundial->getMarcador();
            $tiempoExtra = $mundial->getTiempoExtra() ? 1 : 0;
            $marcadorTiempoExtra = $mundial->getMarcadorTiempoExtra();
            $penalties = $mundial->getPenalties() ? 1 : 0;
            $muerteSubita = $mundial->getMuerteSubita() ? 1 : 0;
            $marcadorFinal = $mundial->getMarcadorFinal();
            $balonOro = $mundial->getBalonOro();
            $balonPlata = $mundial->getBalonPlata();
            $balonBronce = $mundial->getBalonBronce();
            $botinOro = $mundial->getBotinOro();
            $botinPlata = $mundial->getBotinPlata();
            $botinBronce = $mundial->getBotinBronce();
            $guanteOro = $mundial->getGuanteOro();
            $maxGoles = $mundial->getMaxGoles();
            
            $nullLogo = NULL;
            $nullMascota = NULL;

            mysqli_stmt_bind_param(
                $stmt,
                'isbbsiiiisisiisiiiiiiii',

                $año, $descripcion, $nullLogo, $nullMascota, $nombreMascota,
                $campeon, $subcampeon, $tercerPuesto, $cuartoPuesto,
                $marcador, $tiempoExtra, $marcadorTiempoExtra,
                $penalties, $muerteSubita, $marcadorFinal,
                $balonOro, $balonPlata, $balonBronce,
                $botinOro, $botinPlata, $botinBronce,
                $guanteOro, $maxGoles
            );

            // Enviar BLOBs si existen
            if ($logo !== null && strlen($logo) > 0) {
                mysqli_stmt_send_long_data($stmt, 2, $logo);
            }
            if ($imgMascota !== null && strlen($imgMascota) > 0) {
                mysqli_stmt_send_long_data($stmt, 3, $imgMascota);
            }

            if (!mysqli_stmt_execute($stmt)) {
                throw new Exception("Error al ejecutar: " . mysqli_stmt_error($stmt));
            }

            mysqli_stmt_close($stmt);

            // Obtener el ID generado
            $result = mysqli_query($this->conn, "SELECT @idMundial as id");
            $row = mysqli_fetch_assoc($result);
            $idMundial = (int)$row['id'];

            // Insertar sedes
            foreach ($sedes as $sedeId) {
                $querySede = "CALL sp_agregarSede(?, ?)";
                $stmtSede = mysqli_prepare($this->conn, $querySede);
                mysqli_stmt_bind_param($stmtSede, 'ii', $idMundial, $sedeId);
                mysqli_stmt_execute($stmtSede);
                mysqli_stmt_close($stmtSede);
                mysqli_next_result($this->conn);
            }

            return $idMundial;

        } catch (Exception $e) {
            error_log("Error en MundialDAO::crearMundial: " . $e->getMessage());
            return null;
        }
    }
    
}
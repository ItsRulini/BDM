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
                throw new Exception("Error al preparar la consulta: " . mysqli_error($this->conn));
            }

            mysqli_stmt_execute($stmt);
            $result = mysqli_stmt_get_result($stmt);

            $mundiales = [];

            if ($result) {
                // Itera sobre cada fila del resultado
                while ($row = mysqli_fetch_assoc($result)) {
                    $mundial = new Mundial();
                    $mundial->setIdMundial($row['IdMundial']);
                    $mundial->setAño($row['Año']);
                    $mundial->setLogo($row['logo']);
                    $mundial->setDescripcion($row['Descripcion']);

                    $mundiales[] = $mundial; // Agrega el objeto al array
                }
            }

            mysqli_stmt_close($stmt);
            return $mundiales; // Devuelve el array de mundiales

        } catch (mysqli_sql_exception $e) {
            error_log("Error en MundialDAO::getMundiales(): " . $e->getMessage());
            return null;
        }
    }
    
}
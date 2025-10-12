<?php
include_once '../Models/Pais.php';

class PaisDAO {
    private $conn;

    public function __construct($conn) {
        $this->conn = $conn;
    }

    public function getPaises(): ?array {

        try {
            $query = "CALL sp_obtenerPaises()";
            $stmt = mysqli_prepare($this->conn, $query);

            if (!$stmt) {
                throw new Exception("Error al preparar la consulta: " . mysqli_error($this->conn));
            }

            mysqli_stmt_execute($stmt);
            $result = mysqli_stmt_get_result($stmt);

            $paises = [];

            if ($result) {
                // Itera sobre cada fila del resultado
                while ($row = mysqli_fetch_assoc($result)) {
                    $pais = new Pais();
                    $pais->setIdPais($row['IdPais']);
                    $pais->setPais($row['Pais']);
                    $pais->setNacionalidad($row['Nacionalidad']);
                    $paises[] = $pais; // Agrega el objeto al array
                }
            }

            mysqli_stmt_close($stmt);
            return $paises; // Devuelve el array de países

        } catch (mysqli_sql_exception $e) {
            error_log("Error en PaisDAO::getPaises(): " . $e->getMessage());
            return null;
        }
    }

    public function crearPais(Pais $pais): ?int {
        try {
            // Preparar el CALL con variable de salida
            $query = "CALL sp_crearPais(?, ?, @p_id)";
            $stmt = mysqli_prepare($this->conn, $query);

            $nombre = $pais->getPais();
            $nacionalidad = $pais->getNacionalidad();

            if (!$stmt) {
                throw new Exception("Error al preparar la consulta: " . mysqli_error($this->conn));
            }

            // Vincular parámetros de entrada
            mysqli_stmt_bind_param($stmt, 'ss', $nombre, $nacionalidad);

            // Ejecutar el procedimiento
            if (!mysqli_stmt_execute($stmt)) {
                throw new Exception("Error al ejecutar el procedimiento: " . mysqli_stmt_error($stmt));
            }

            // Cerrar el statement antes de hacer la siguiente consulta
            mysqli_stmt_close($stmt);

            // Obtener el valor del parámetro de salida
            $result = $this->conn->query("SELECT @p_id AS id");
            if ($row = $result->fetch_assoc()) {
                $pais->setIdPais($row['id']);
                return $pais->getIdPais();
            }

            return null;
        } catch (Exception $e) {
            echo "Error: " . $e->getMessage();
            return null;
        }
    }


}